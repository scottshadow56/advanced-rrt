
import React from 'react';
import { BrainCircuitIcon, PlayIcon, SettingsIcon } from './Icons';

interface StartScreenProps {
    onStart: () => void;
    onShowSettings: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowSettings }) => (
    <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col items-center animate-fade-in">
        <BrainCircuitIcon className="w-16 h-16 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mt-4">Relational Reasoning</h1>
        <p className="mt-4 text-lg text-slate-400 max-w-md">
            A timed puzzle to test your spatial deduction skills. Keep the map in your head and answer as fast as you can.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <button
                onClick={onStart}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg hover:bg-indigo-500 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
                <PlayIcon className="w-6 h-6" />
                Start Game
            </button>
            <button
                onClick={onShowSettings}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-slate-200 text-lg font-semibold rounded-lg hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
            >
                <SettingsIcon className="w-5 h-5" />
                Settings
            </button>
        </div>
    </div>
);
export default StartScreen;
