
import React, { useState, useEffect, useCallback } from 'react';
import { RelationalEngine } from './services/relationalEngine';
import type { GameState, Premise, Vector, GameOverReason, Challenge, Settings } from './types';
import { generateInitialPuzzle, advancePuzzle } from './services/puzzleGenerator';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import SettingsScreen from './components/SettingsScreen';
import HistoryScreen from './components/HistoryScreen';
import { useSound } from './hooks/useSound';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentRound, setCurrentRound] = useState(1);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [gameOverReason, setGameOverReason] = useState<GameOverReason>('time');
    const [isMemorizing, setIsMemorizing] = useState(false);
    const [isShowingLegend, setIsShowingLegend] = useState(false);
    const [memorizationTimeLeft, setMemorizationTimeLeft] = useState(30);
    const [gameBias, setGameBias] = useState(0.5);
    const [nextShiftRound, setNextShiftRound] = useState(1);
    const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);

    const { playCorrect, playIncorrect, playHighPitch, playLowPitch } = useSound();

    const [settings, setSettings] = useState<Settings>({
        initialPremises: 3,
        voronoiComplexity: 12,
        totalRounds: 10,
        challengeType: 'mixed',
        wordLength: 3,
        stimuliType: 'words',
        relationMode: 'spatial',
        minimalVertical: false,
        minimalTemporal: false,
        minimalSize: false,
        minimalHierarchy: false,
        interferenceRatio: 2,
    });
    
    const [engine, setEngine] = useState(() => new RelationalEngine('spatial'));
    const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
    const [puzzleState, setPuzzleState] = useState<{ nodes: string[]; coordinates: Map<string, Vector> } | null>(null);
    const [lastPremise, setLastPremise] = useState<Premise | null>(null);
    const [initialPremises, setInitialPremises] = useState<Premise[] | null>(null);
    const [premises, setPremises] = useState<Premise[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [oldestNode, setOldestNode] = useState<string | null>(null);
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const [recentPairs, setRecentPairs] = useState<string[][]>([]);

    const saveGameToHistory = useCallback((finalScore: number, finalCorrect: number, rounds: number) => {
        const duration = gameStartTime ? Date.now() - gameStartTime : 0;
        const entry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            score: finalScore,
            correctAnswers: finalCorrect,
            totalRounds: rounds,
            settings: { ...settings },
            duration
        };

        const existing = localStorage.getItem('relational_reasoning_history');
        const history = existing ? JSON.parse(existing) : [];
        history.push(entry);
        localStorage.setItem('relational_reasoning_history', JSON.stringify(history));
    }, [settings, gameStartTime]);

    useEffect(() => {
        if (gameState !== 'playing' || feedback || isMemorizing) return;
        if (timeLeft <= 0) {
            setGameOverReason('time');
            setGameState('gameOver');
            saveGameToHistory(score, correctAnswers, currentRound);
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, feedback, isMemorizing, score, correctAnswers, currentRound, saveGameToHistory]);

    const handleContinueFromLegend = useCallback(() => {
        setIsShowingLegend(false);
        setIsMemorizing(true);
        setMemorizationTimeLeft(30);
    }, []);

    const handleContinueFromMemorization = useCallback(() => {
        if (!puzzleState) return;

        const nextStep = advancePuzzle(puzzleState.nodes, puzzleState.coordinates, premises, settings.challengeType, settings.wordLength, gameBias, settings.relationMode, settings.stimuliType, settings.interferenceRatio, recentPairs);
        
        const newEngine = new RelationalEngine(settings.relationMode);
        const allNodes = nextStep.updatedNodes;
        const allCoords = nextStep.updatedCoordinates;
        for (const node1 of allNodes) {
            for (const node2 of allNodes) {
                if (node1 === node2) continue;
                const coord1 = allCoords.get(node1)!;
                const coord2 = allCoords.get(node2)!;
                const vec: Vector = coord1.map((v, i) => v - coord2[i]);
                for (const [dir, dirVec] of newEngine.dirMap.entries()) {
                    if (vec.length === dirVec.length && vec.every((v, i) => v === dirVec[i])) {
                         newEngine.addRelation(node1, dir, node2);
                    }
                }
            }
        }
        
        setEngine(newEngine);
        setPuzzleState({ nodes: nextStep.updatedNodes, coordinates: nextStep.updatedCoordinates });
        setPremises(nextStep.updatedPremises);
        setCurrentChallenge(nextStep.newChallenge);
        setLastPremise(nextStep.newPremise);
        setInitialPremises(null);
        setIsMemorizing(false);
        setOldestNode(nextStep.oldestNode);
    }, [puzzleState, premises, settings.challengeType, settings.wordLength, gameBias, settings.relationMode, settings.stimuliType]);

    useEffect(() => {
        if (gameState !== 'playing' || !isMemorizing) return;

        if (memorizationTimeLeft <= 0) {
            handleContinueFromMemorization();
            return;
        }

        const timer = setInterval(() => {
            setMemorizationTimeLeft(t => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, isMemorizing, memorizationTimeLeft, handleContinueFromMemorization]);

    const handleStart = useCallback(() => {
        const initialRound = 1;
        const biases = [0.5, 0.25, 0.75];
        const bias = biases[Math.floor(Math.random() * biases.length)];
        const trialsUntilNextShift = Math.floor(Math.random() * 6) + 5; // 5-10
        
        setGameBias(bias);
        setNextShiftRound(initialRound + trialsUntilNextShift);
        setAnswerHistory([]);
        
        const initialPuzzle = generateInitialPuzzle(settings.initialPremises, settings.challengeType, settings.wordLength, bias, settings.relationMode, settings.stimuliType, settings.interferenceRatio);
        
        // Initialize recent pairs with initial premises
        const initialRecentPairs = initialPuzzle.premises.map(p => [p.itemA, p.itemB].sort());
        setRecentPairs(initialRecentPairs.slice(-8));

        const newEngine = new RelationalEngine(settings.relationMode);
        initialPuzzle.premises.forEach(p => newEngine.addRelation(p.itemA, p.direction, p.itemB));

        setEngine(newEngine);
        setPuzzleState({ nodes: initialPuzzle.nodes, coordinates: initialPuzzle.coordinates });
        setPremises(initialPuzzle.premises);
        setCurrentChallenge(null);
        setLastPremise(null); 
        setInitialPremises(initialPuzzle.premises);
        setTimeLeft(30);
        setScore(0);
        setCorrectAnswers(0);
        setCurrentRound(1);
        setGameState('playing');
        setFeedback(null);
        
        const hasMinimal = settings.minimalVertical || settings.minimalTemporal || settings.minimalSize || settings.minimalHierarchy;
        if (hasMinimal) {
            setIsShowingLegend(true);
            setIsMemorizing(false);
        } else {
            setIsShowingLegend(false);
            setIsMemorizing(true);
            setMemorizationTimeLeft(30);
        }
        
        setOldestNode(null);
        setGameStartTime(Date.now());
        setRecentPairs([]);
    }, [settings]);

    const handleAnswer = useCallback((userAnswer: boolean) => {
        if (!currentChallenge || !puzzleState) return;

        const isActuallyTrue = currentChallenge.isTrue;
        const wasCorrect = userAnswer === isActuallyTrue;
        setFeedback(wasCorrect ? 'correct' : 'incorrect');

        const newHistory = [...answerHistory, isActuallyTrue].slice(-4);
        setAnswerHistory(newHistory);

        if (wasCorrect) {
            playCorrect();
            setScore(s => s + 10);
            setCorrectAnswers(c => c + 1);
            setTimeLeft(t => Math.min(30, t + 10));
        } else {
            playIncorrect();
            setTimeLeft(t => Math.max(0, t - 10));
        }
        
        setTimeout(() => {
            if (wasCorrect && currentRound >= settings.totalRounds) {
                setGameOverReason('rounds');
                setGameState('gameOver');
                saveGameToHistory(score + 10, correctAnswers + 1, currentRound);
                return;
            }
            
            // Update recent pairs queue with the challenge just verified and the last premise shown
            const verifiedPair = currentChallenge.type === 'conclusion'
                ? [currentChallenge.statement.itemA, currentChallenge.statement.itemB].sort()
                : [currentChallenge.statement.itemA1, currentChallenge.statement.itemB1].sort();
            
            const lastPremisePair = lastPremise ? [lastPremise.itemA, lastPremise.itemB].sort() : null;
            
            let updatedRecentPairs: string[][] = [];
            setRecentPairs(prev => {
                let next = [...prev];
                
                const updateQueue = (pair: string[]) => {
                    const pairStr = JSON.stringify(pair);
                    // Remove if exists to move to top
                    next = next.filter(p => JSON.stringify(p) !== pairStr);
                    next.push(pair);
                };

                updateQueue(verifiedPair);
                if (lastPremisePair) {
                    updateQueue(lastPremisePair);
                }
                
                updatedRecentPairs = next.slice(-8);
                return updatedRecentPairs;
            });

            // Dynamic base bias: shifts randomly every 5-10 rounds
            const nextRoundNum = currentRound + 1;
            let baseBias = gameBias;

            if (nextRoundNum >= nextShiftRound) {
                const biases = [0.5, 0.25, 0.75];
                const otherBiases = biases.filter(b => b !== gameBias);
                baseBias = otherBiases[Math.floor(Math.random() * otherBiases.length)];
                
                const trialsUntilNextShift = Math.floor(Math.random() * 6) + 5;
                setNextShiftRound(nextRoundNum + trialsUntilNextShift);
            }

            const nextBias = newHistory.length === 4 && newHistory.every(v => v === newHistory[0]) 
                ? (newHistory[0] ? 0 : 1) 
                : baseBias;

            setGameBias(nextBias);

            // Use the updatedRecentPairs for the next generation
            const nextStep = advancePuzzle(puzzleState.nodes, puzzleState.coordinates, premises, settings.challengeType, settings.wordLength, nextBias, settings.relationMode, settings.stimuliType, settings.interferenceRatio, updatedRecentPairs);
            const newEngine = new RelationalEngine(settings.relationMode);
            const allNodes = nextStep.updatedNodes;
            const allCoords = nextStep.updatedCoordinates;
            
            for (const node1 of allNodes) {
                for (const node2 of allNodes) {
                    if (node1 === node2) continue;
                    const coord1 = allCoords.get(node1)!;
                    const coord2 = allCoords.get(node2)!;
                    const vec: Vector = coord1.map((v, i) => v - coord2[i]);
                    for (const [dir, dirVec] of engine.dirMap.entries()) {
                        if (vec.length === dirVec.length && vec.every((v, i) => v === dirVec[i])) {
                             newEngine.addRelation(node1, dir, node2);
                        }
                    }
                }
            }

            setEngine(newEngine);
            setPuzzleState({ nodes: nextStep.updatedNodes, coordinates: nextStep.updatedCoordinates });
            setPremises(nextStep.updatedPremises);
            setCurrentChallenge(nextStep.newChallenge);
            setLastPremise(nextStep.newPremise);
            
            if (wasCorrect) setCurrentRound(r => r + 1);
            setFeedback(null);
            setOldestNode(nextStep.oldestNode);
        }, 800); 

    }, [currentChallenge, puzzleState, premises, engine, currentRound, settings, gameBias, nextShiftRound, score, correctAnswers, timeLeft, saveGameToHistory, recentPairs]);
    
    const handleQuit = () => {
        setGameOverReason('quit');
        setGameState('gameOver');
        saveGameToHistory(score, correctAnswers, currentRound);
    };

    const handleGoToMenu = () => setGameState('idle');
    const handleSaveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
        setGameState('idle');
    };

    const renderContent = () => {
        switch (gameState) {
            case 'settings':
                return <SettingsScreen currentSettings={settings} onSave={handleSaveSettings} />;
            case 'history':
                return <HistoryScreen onBack={() => setGameState('idle')} />;
            case 'playing':
                return <GameScreen
                    score={score}
                    timeLeft={timeLeft}
                    challenge={currentChallenge}
                    onAnswer={handleAnswer}
                    feedback={feedback}
                    lastPremise={lastPremise}
                    initialPremises={initialPremises}
                    onQuit={handleQuit}
                    currentRound={currentRound}
                    totalRounds={settings.totalRounds}
                    isMemorizing={isMemorizing}
                    onContinue={handleContinueFromMemorization}
                    puzzleState={puzzleState}
                    oldestNode={oldestNode}
                    memorizationTimeLeft={memorizationTimeLeft}
                    voronoiComplexity={settings.voronoiComplexity}
                    playHighPitch={playHighPitch}
                    playLowPitch={playLowPitch}
                    minimalVertical={settings.minimalVertical}
                    minimalTemporal={settings.minimalTemporal}
                    minimalSize={settings.minimalSize}
                    minimalHierarchy={settings.minimalHierarchy}
                    isShowingLegend={isShowingLegend}
                    onContinueFromLegend={handleContinueFromLegend}
                />;
            case 'gameOver':
                return <GameOverScreen score={score} onGoToMenu={handleGoToMenu} reason={gameOverReason} />;
            case 'idle':
            default:
                return <StartScreen 
                    onStart={handleStart} 
                    onShowSettings={() => setGameState('settings')} 
                    onShowHistory={() => setGameState('history')}
                />;
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
