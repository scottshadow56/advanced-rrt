
import React from 'react';
import type { Premise, Challenge, Vector } from '../types';
import { Timer, Check, X, Star, LogOut, Play } from 'lucide-react';
import DevGrid from './DevGrid';
import Stimulus from './Stimulus';

interface GameScreenProps {
    score: number;
    timeLeft: number;
    challenge: Challenge | null;
    onAnswer: (isTrue: boolean) => void;
    feedback: 'correct' | 'incorrect' | null;
    lastPremise: Premise | null;
    initialPremises: Premise[] | null;
    onQuit: () => void;
    currentRound: number;
    totalRounds: number;
    isMemorizing: boolean;
    onContinue: () => void;
    devMode: boolean;
    puzzleState: { nodes: string[]; coordinates: Map<string, Vector> } | null;
    oldestNode: string | null;
    memorizationTimeLeft: number;
    voronoiComplexity: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ score, timeLeft, challenge, onAnswer, feedback, lastPremise, initialPremises, onQuit, currentRound, totalRounds, isMemorizing, onContinue, devMode, puzzleState, oldestNode, memorizationTimeLeft, voronoiComplexity }) => {
    const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 20 ? 'text-yellow-400' : 'text-cyan-400';
    const memorizationTimerColor = memorizationTimeLeft <= 10 ? 'text-red-500' : memorizationTimeLeft <= 20 ? 'text-yellow-400' : 'text-cyan-400';

    const renderChallenge = () => {
        if (!challenge) return null;

        if (challenge.type === 'conclusion') {
            const { itemA, direction, itemB } = challenge.statement;
            return (
                <div className="mt-2 text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600 flex flex-wrap items-center justify-center gap-2">
                    Is <Stimulus id={itemA} complexity={voronoiComplexity} /> <span className="text-purple-400">{direction}</span> <Stimulus id={itemB} complexity={voronoiComplexity} />?
                </div>
            );
        }

        if (challenge.type === 'analogy') {
            const { itemA1, itemB1, itemA2, itemB2 } = challenge.statement;
            return (
                <div className="mt-2 text-xl sm:text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        Is the relation of <Stimulus id={itemA1} complexity={voronoiComplexity} /> to <Stimulus id={itemB1} complexity={voronoiComplexity} />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                        the same as <Stimulus id={itemA2} complexity={voronoiComplexity} /> to <Stimulus id={itemB2} complexity={voronoiComplexity} />?
                    </div>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full animate-fade-in relative">
            <button onClick={onQuit} className="absolute top-4 left-4 text-slate-500 hover:text-red-500 transition-colors" aria-label="Quit Game">
                <LogOut className="w-6 h-6" />
            </button>
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2 text-2xl font-bold">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <span>{score}</span>
                </div>
                 <div className="font-bold text-slate-400">
                    {isMemorizing ? 'Memorize!' : <>Round {currentRound} <span className="text-xs">/ {totalRounds}</span></>}
                </div>
                <div className={`flex items-center gap-2 text-2xl font-bold ${isMemorizing ? memorizationTimerColor : timerColor}`}>
                    <Timer className="w-6 h-6" />
                    <span>{isMemorizing ? memorizationTimeLeft : timeLeft}</span>
                </div>
            </div>

            <div className="mt-6 text-center">
                {isMemorizing && initialPremises ? (
                    <>
                        <h2 className="text-slate-400 text-lg">Memorize the starting map:</h2>
                        <div className="mt-2 space-y-2 text-xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg animate-pop-in">
                           {initialPremises.map((p, i) => (
                               <div key={`${p.itemA}-${p.itemB}-${i}`} className="flex flex-wrap items-center justify-center gap-2">
                                   <Stimulus id={p.itemA} complexity={voronoiComplexity} /> is <span className="text-purple-400">{p.direction}</span> <Stimulus id={p.itemB} complexity={voronoiComplexity} />
                               </div>
                           ))}
                        </div>
                    </>
                ) : lastPremise && (
                     <>
                        <h2 className="text-slate-400 text-lg">The map has changed:</h2>
                        <div key={`${lastPremise.itemA}-${lastPremise.itemB}`} className="mt-2 text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg animate-pop-in flex flex-wrap items-center justify-center gap-2">
                            <Stimulus id={lastPremise.itemA} complexity={voronoiComplexity} /> is <span className="text-purple-400">{lastPremise.direction}</span> <Stimulus id={lastPremise.itemB} complexity={voronoiComplexity} />
                        </div>
                     </>
                )}
            </div>

            {isMemorizing ? (
                <div className="mt-8">
                    <button
                        onClick={onContinue}
                        className="w-full flex items-center justify-center gap-3 text-xl font-bold py-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all transform hover:scale-105"
                    >
                        <Play className="w-6 h-6" />
                        Start Round 1
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 text-center">
                        <h2 className="text-slate-400 text-lg">Based on the current map...</h2>
                        {renderChallenge()}
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => onAnswer(true)} 
                            disabled={!!feedback}
                            className="flex items-center justify-center gap-3 text-2xl font-bold py-4 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            <Check className="w-7 h-7" /> TRUE
                        </button>
                        <button 
                            onClick={() => onAnswer(false)}
                            disabled={!!feedback}
                            className="flex items-center justify-center gap-3 text-2xl font-bold py-4 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            <X className="w-7 h-7" /> FALSE
                        </button>
                    </div>
                </>
            )}
            
            {feedback && (
                 <div className={`absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex items-center justify-center rounded-lg animate-pop-in`}>
                     {feedback === 'correct' ? <Check className="w-32 h-32 text-green-400"/> : <X className="w-32 h-32 text-red-400"/> }
                 </div>
            )}

            {devMode && puzzleState && !isMemorizing && (
                <DevGrid
                    nodes={puzzleState.nodes}
                    coordinates={puzzleState.coordinates}
                    lastPremise={lastPremise}
                    oldestNode={oldestNode}
                    voronoiComplexity={voronoiComplexity}
                />
            )}
        </div>
    );
};

export default GameScreen;
