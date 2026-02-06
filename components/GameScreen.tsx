
import React from 'react';
import type { Premise, Challenge, Vector } from '../types';
import { TimerIcon, CheckIcon, XIcon, StarIcon, LogOutIcon, PlayIcon } from './Icons';
import DevGrid from './DevGrid';

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
}

const GameScreen: React.FC<GameScreenProps> = ({ score, timeLeft, challenge, onAnswer, feedback, lastPremise, initialPremises, onQuit, currentRound, totalRounds, isMemorizing, onContinue, devMode, puzzleState, oldestNode, memorizationTimeLeft }) => {
    const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 20 ? 'text-yellow-400' : 'text-cyan-400';
    const memorizationTimerColor = memorizationTimeLeft <= 10 ? 'text-red-500' : memorizationTimeLeft <= 20 ? 'text-yellow-400' : 'text-cyan-400';

    const renderChallenge = () => {
        if (!challenge) return null;

        if (challenge.type === 'conclusion') {
            const { itemA, direction, itemB } = challenge.statement;
            return (
                <div className="mt-2 text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600">
                    Is <span className="text-yellow-400">{itemA}</span> <span className="text-purple-400">{direction}</span> of <span className="text-yellow-400">{itemB}</span>?
                </div>
            );
        }

        if (challenge.type === 'analogy') {
            const { itemA1, itemB1, itemA2, itemB2 } = challenge.statement;
            return (
                <div className="mt-2 text-xl sm:text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600">
                    Is the relation of <span className="text-yellow-400">{itemA1}</span> to <span className="text-yellow-400">{itemB1}</span>
                    <br />
                    the same as <span className="text-yellow-400">{itemA2}</span> to <span className="text-yellow-400">{itemB2}</span>?
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full animate-fade-in relative">
            <button onClick={onQuit} className="absolute top-4 left-4 text-slate-500 hover:text-red-500 transition-colors" aria-label="Quit Game">
                <LogOutIcon className="w-6 h-6" />
            </button>
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2 text-2xl font-bold">
                    <StarIcon className="w-6 h-6 text-yellow-400" />
                    <span>{score}</span>
                </div>
                 <div className="font-bold text-slate-400">
                    {isMemorizing ? 'Memorize!' : <>Round {currentRound} <span className="text-xs">/ {totalRounds}</span></>}
                </div>
                <div className={`flex items-center gap-2 text-2xl font-bold ${isMemorizing ? memorizationTimerColor : timerColor}`}>
                    <TimerIcon className="w-6 h-6" />
                    <span>{isMemorizing ? memorizationTimeLeft : timeLeft}</span>
                </div>
            </div>

            <div className="mt-6 text-center">
                {isMemorizing && initialPremises ? (
                    <>
                        <h2 className="text-slate-400 text-lg">Memorize the starting map:</h2>
                        <div className="mt-2 space-y-2 text-xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg animate-pop-in">
                           {initialPremises.map((p, i) => (
                               <p key={`${p.itemA}-${p.itemB}-${i}`}>
                                   <span className="text-yellow-400">{p.itemA}</span> is <span className="text-purple-400">{p.direction}</span> of <span className="text-yellow-400">{p.itemB}</span>
                               </p>
                           ))}
                        </div>
                    </>
                ) : lastPremise && (
                     <>
                        <h2 className="text-slate-400 text-lg">The map has changed:</h2>
                        <div key={`${lastPremise.itemA}-${lastPremise.itemB}`} className="mt-2 text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg animate-pop-in">
                            <span className="text-yellow-400">{lastPremise.itemA}</span> is <span className="text-purple-400">{lastPremise.direction}</span> of <span className="text-yellow-400">{lastPremise.itemB}</span>
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
                        <PlayIcon className="w-6 h-6" />
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
                            <CheckIcon className="w-7 h-7" /> TRUE
                        </button>
                        <button 
                            onClick={() => onAnswer(false)}
                            disabled={!!feedback}
                            className="flex items-center justify-center gap-3 text-2xl font-bold py-4 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            <XIcon className="w-7 h-7" /> FALSE
                        </button>
                    </div>
                </>
            )}
            
            {feedback && (
                 <div className={`absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex items-center justify-center rounded-lg animate-pop-in`}>
                     {feedback === 'correct' ? <CheckIcon className="w-32 h-32 text-green-400"/> : <XIcon className="w-32 h-32 text-red-400"/> }
                 </div>
            )}

            {devMode && puzzleState && !isMemorizing && (
                <DevGrid
                    nodes={puzzleState.nodes}
                    coordinates={puzzleState.coordinates}
                    lastPremise={lastPremise}
                    oldestNode={oldestNode}
                />
            )}
        </div>
    );
};

export default GameScreen;
