
import React from 'react';
import { HomeIcon, StarIcon } from './Icons';
import type { GameOverReason } from '../types';

interface GameOverScreenProps {
    score: number;
    onGoToMenu: () => void;
    reason: GameOverReason;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onGoToMenu, reason }) => {
    const messages = {
        time: { title: "Time's Up!", color: "text-red-500" },
        rounds: { title: "Puzzle Complete!", color: "text-green-400" },
        quit: { title: "Game Quit", color: "text-yellow-400" },
    };
    
    const { title, color } = messages[reason];

    return (
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col items-center animate-fade-in">
            <h1 className={`text-5xl font-bold ${color}`}>{title}</h1>
            <p className="mt-4 text-xl text-slate-300">Your final score is:</p>
            <div className="my-6 flex items-center gap-3 text-6xl font-bold text-yellow-400">
                <StarIcon className="w-14 h-14" />
                <span>{score}</span>
            </div>
            <button
                onClick={onGoToMenu}
                className="mt-6 flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg hover:bg-indigo-500 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
                <HomeIcon className="w-6 h-6" />
                Main Menu
            </button>
        </div>
    );
};

export default GameOverScreen;
