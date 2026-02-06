
import React, { useState, useEffect, useCallback } from 'react';
import { RelationalEngine } from './services/relationalEngine';
import type { GameState, Premise, Vector, GameOverReason, Challenge, Settings } from './types';
import { generateInitialPuzzle, advancePuzzle } from './services/puzzleGenerator';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import SettingsScreen from './components/SettingsScreen';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentRound, setCurrentRound] = useState(1);
    const [gameOverReason, setGameOverReason] = useState<GameOverReason>('time');
    const [isMemorizing, setIsMemorizing] = useState(false);
    const [memorizationTimeLeft, setMemorizationTimeLeft] = useState(30);

    const [settings, setSettings] = useState<Settings>({
        initialPremises: 5,
        initialTime: 30,
        totalRounds: 10,
        challengeType: 'mixed',
        wordLength: 3,
        devMode: false,
    });
    
    const [engine, setEngine] = useState(() => new RelationalEngine());
    const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
    const [puzzleState, setPuzzleState] = useState<{ nodes: string[]; coordinates: Map<string, Vector> } | null>(null);
    const [lastPremise, setLastPremise] = useState<Premise | null>(null);
    const [initialPremises, setInitialPremises] = useState<Premise[] | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [oldestNode, setOldestNode] = useState<string | null>(null);

    useEffect(() => {
        if (gameState !== 'playing' || feedback || isMemorizing) return;
        if (timeLeft <= 0) {
            setGameOverReason('time');
            setGameState('gameOver');
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [gameState, timeLeft, feedback, isMemorizing]);

    const handleContinueFromMemorization = useCallback(() => {
        if (!puzzleState) return;

        const nextStep = advancePuzzle(puzzleState.nodes, puzzleState.coordinates, settings.challengeType, settings.wordLength);
        
        const newEngine = new RelationalEngine();
        const allNodes = nextStep.updatedNodes;
        const allCoords = nextStep.updatedCoordinates;
        for (const node1 of allNodes) {
            for (const node2 of allNodes) {
                if (node1 === node2) continue;
                const coord1 = allCoords.get(node1)!;
                const coord2 = allCoords.get(node2)!;
                const vec: Vector = [coord1[0] - coord2[0], coord1[1] - coord2[1]];
                for (const [dir, dirVec] of newEngine.dirMap.entries()) {
                    if (vec[0] === dirVec[0] && vec[1] === dirVec[1]) {
                         newEngine.addRelation(node1, dir, node2);
                    }
                }
            }
        }
        
        setEngine(newEngine);
        setPuzzleState({ nodes: nextStep.updatedNodes, coordinates: nextStep.updatedCoordinates });
        setCurrentChallenge(nextStep.newChallenge);
        setLastPremise(nextStep.newPremise);
        setInitialPremises(null);
        setIsMemorizing(false);
        setOldestNode(nextStep.oldestNode);
    }, [puzzleState, settings.challengeType, settings.wordLength]);

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
        const initialPuzzle = generateInitialPuzzle(settings.initialPremises, settings.challengeType, settings.wordLength);
        const newEngine = new RelationalEngine();
        initialPuzzle.premises.forEach(p => newEngine.addRelation(p.itemA, p.direction, p.itemB));

        setEngine(newEngine);
        setPuzzleState({ nodes: initialPuzzle.nodes, coordinates: initialPuzzle.coordinates });
        setCurrentChallenge(null);
        setLastPremise(null); 
        setInitialPremises(initialPuzzle.premises);
        setTimeLeft(settings.initialTime);
        setScore(0);
        setCurrentRound(1);
        setGameState('playing');
        setFeedback(null);
        setIsMemorizing(true);
        setOldestNode(null);
        setMemorizationTimeLeft(30);
    }, [settings]);

    const handleAnswer = useCallback((userAnswer: boolean) => {
        if (!currentChallenge || !puzzleState) return;

        let isActuallyTrue: boolean;
        if (currentChallenge.type === 'conclusion') {
            const { itemA, itemB, direction } = currentChallenge.statement;
            const vector = engine.getRelativeVector(itemB, itemA);
            const expectedVector = engine.dirMap.get(direction);
            isActuallyTrue = !!(vector && expectedVector && vector[0] === expectedVector[0] && vector[1] === expectedVector[1]);
        } else {
            const { itemA1, itemB1, itemA2, itemB2 } = currentChallenge.statement;
            const vector1 = engine.getRelativeVector(itemB1, itemA1);
            const vector2 = engine.getRelativeVector(itemB2, itemA2);
            isActuallyTrue = !!(vector1 && vector2 && vector1[0] === vector2[0] && vector1[1] === vector2[1]);
        }
        
        const wasCorrect = userAnswer === isActuallyTrue;
        setFeedback(wasCorrect ? 'correct' : 'incorrect');

        if (wasCorrect) {
            setScore(s => s + 10);
            setTimeLeft(t => Math.min(settings.initialTime, t + 10));
        } else {
            setTimeLeft(t => Math.max(0, t - 10));
        }
        
        setTimeout(() => {
            if (wasCorrect && currentRound >= settings.totalRounds) {
                setGameOverReason('rounds');
                setGameState('gameOver');
                return;
            }

            const nextStep = advancePuzzle(puzzleState.nodes, puzzleState.coordinates, settings.challengeType, settings.wordLength);
            const newEngine = new RelationalEngine();
            const allNodes = nextStep.updatedNodes;
            const allCoords = nextStep.updatedCoordinates;
            
            for (const node1 of allNodes) {
                for (const node2 of allNodes) {
                    if (node1 === node2) continue;
                    const coord1 = allCoords.get(node1)!;
                    const coord2 = allCoords.get(node2)!;
                    const vec: Vector = [coord1[0] - coord2[0], coord1[1] - coord2[1]];
                    for (const [dir, dirVec] of engine.dirMap.entries()) {
                        if (vec[0] === dirVec[0] && vec[1] === dirVec[1]) {
                             newEngine.addRelation(node1, dir, node2);
                        }
                    }
                }
            }

            setEngine(newEngine);
            setPuzzleState({ nodes: nextStep.updatedNodes, coordinates: nextStep.updatedCoordinates });
            setCurrentChallenge(nextStep.newChallenge);
            setLastPremise(nextStep.newPremise);
            if (wasCorrect) setCurrentRound(r => r + 1);
            setFeedback(null);
            setOldestNode(nextStep.oldestNode);
        }, 800);

    }, [currentChallenge, puzzleState, engine, currentRound, settings]);
    
    const handleQuit = () => {
        setGameOverReason('quit');
        setGameState('gameOver');
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
                    devMode={settings.devMode}
                    puzzleState={puzzleState}
                    oldestNode={oldestNode}
                    memorizationTimeLeft={memorizationTimeLeft}
                />;
            case 'gameOver':
                return <GameOverScreen score={score} onGoToMenu={handleGoToMenu} reason={gameOverReason} />;
            case 'idle':
            default:
                return <StartScreen onStart={handleStart} onShowSettings={() => setGameState('settings')} />;
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
