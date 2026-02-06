
import React, { useState } from 'react';
import { CheckIcon, SettingsIcon } from './Icons';
import type { Settings } from '../types';

interface SettingsScreenProps {
    currentSettings: Settings;
    onSave: (newSettings: Settings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentSettings, onSave }) => {
    const [settings, setSettings] = useState<Settings>(currentSettings);

    const handleSave = () => {
        onSave(settings);
    };

    const challengeTypeOptions: Settings['challengeType'][] = ['conclusions', 'analogies', 'mixed'];

    return (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center flex items-center justify-center gap-2">
                <SettingsIcon className="w-6 h-6" />
                Game Settings
            </h2>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="initialPremises" className="flex justify-between items-center text-lg text-slate-300">
                        <span>Starting Items</span>
                        <span className="font-bold text-cyan-400">{settings.initialPremises}</span>
                    </label>
                    <input
                        id="initialPremises"
                        type="range"
                        min="3"
                        max="8"
                        step="1"
                        value={settings.initialPremises}
                        onChange={(e) => setSettings(s => ({ ...s, initialPremises: Number(e.target.value) }))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="initialTime" className="flex justify-between items-center text-lg text-slate-300">
                        <span>Starting Time (seconds)</span>
                        <span className="font-bold text-cyan-400">{settings.initialTime}</span>
                    </label>
                    <input
                        id="initialTime"
                        type="range"
                        min="15"
                        max="60"
                        step="5"
                        value={settings.initialTime}
                        onChange={(e) => setSettings(s => ({ ...s, initialTime: Number(e.target.value) }))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="totalRounds" className="flex justify-between items-center text-lg text-slate-300">
                        <span>Total Rounds</span>
                        <span className="font-bold text-cyan-400">{settings.totalRounds}</span>
                    </label>
                    <input
                        id="totalRounds"
                        type="range"
                        min="5"
                        max="25"
                        step="1"
                        value={settings.totalRounds}
                        onChange={(e) => setSettings(s => ({ ...s, totalRounds: Number(e.target.value) }))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="wordLength" className="flex justify-between items-center text-lg text-slate-300">
                        <span>Word Length</span>
                        <span className="font-bold text-cyan-400">{settings.wordLength}</span>
                    </label>
                    <input
                        id="wordLength"
                        type="range"
                        min="3"
                        max="5"
                        step="1"
                        value={settings.wordLength}
                        onChange={(e) => setSettings(s => ({ ...s, wordLength: Number(e.target.value) }))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                 <div>
                    <label className="block text-lg text-slate-300 mb-2">Challenge Type</label>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-700 p-1">
                        {challengeTypeOptions.map(type => (
                            <button
                                key={type}
                                onClick={() => setSettings(s => ({ ...s, challengeType: type }))}
                                className={`px-2 py-2 text-sm font-bold rounded-md transition-colors capitalize ${
                                    settings.challengeType === type 
                                    ? 'bg-indigo-500 text-white' 
                                    : 'bg-transparent text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {type === 'conclusions' ? 'Conclusion' : type}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="flex justify-between items-center text-lg text-slate-300">
                        <span>Developer Mode</span>
                        <button
                            onClick={() => setSettings(s => ({ ...s, devMode: !s.devMode }))}
                            aria-pressed={settings.devMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                                settings.devMode ? 'bg-indigo-500' : 'bg-slate-700'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.devMode ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                    </label>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-lg font-bold rounded-md hover:bg-green-500 transition-colors duration-200"
            >
                <CheckIcon className="w-5 h-5" />
                Save & Back
            </button>
        </div>
    );
};

export default SettingsScreen;
