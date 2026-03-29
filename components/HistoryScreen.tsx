
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BarChart2, History, TrendingUp, Clock } from 'lucide-react';
import type { HistoryEntry, Settings } from '../types';

const formatDuration = (ms: number) => {
    if (!ms) return '0s';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(' ');
};

interface HistoryScreenProps {
    onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
    const history: HistoryEntry[] = useMemo(() => {
        const saved = localStorage.getItem('relational_reasoning_history');
        return saved ? JSON.parse(saved) : [];
    }, []);

    const [filter, setFilter] = useState<{
        relationMode: Settings['relationMode'] | 'all';
        stimuliType: Settings['stimuliType'] | 'all';
        challengeType: Settings['challengeType'] | 'all';
    }>({
        relationMode: 'all',
        stimuliType: 'all',
        challengeType: 'all',
    });

    const filteredHistory = useMemo(() => {
        return history.filter(entry => {
            if (entry.score === 0) return false;
            if (filter.relationMode !== 'all' && entry.settings.relationMode !== filter.relationMode) return false;
            if (filter.stimuliType !== 'all' && entry.settings.stimuliType !== filter.stimuliType) return false;
            if (filter.challengeType !== 'all' && entry.settings.challengeType !== filter.challengeType) return false;
            return true;
        }).sort((a, b) => a.timestamp - b.timestamp);
    }, [history, filter]);

    const chartData = useMemo(() => {
        return filteredHistory.map(entry => ({
            date: new Date(entry.timestamp).toLocaleDateString(),
            score: entry.score,
            accuracy: Math.round((entry.correctAnswers / entry.totalRounds) * 100),
            rounds: entry.totalRounds,
            relationMode: entry.settings.relationMode,
            challengeType: entry.settings.challengeType,
        }));
    }, [filteredHistory]);

    const modeColors: Record<string, string> = {
        spatial: '#22d3ee', // cyan
        vertical: '#f472b6', // pink
        comparison: '#fbbf24', // amber
        temporal: '#a78bfa', // violet
        distinction: '#4ade80', // green
    };

    const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (!cx || !cy) return null;

        const color = modeColors[payload.relationMode] || '#94a3b8';

        if (payload.challengeType === 'conclusions') {
            return <circle cx={cx} cy={cy} r={6} fill={color} stroke="#0f172a" strokeWidth={2} />;
        } else if (payload.challengeType === 'analogies') {
            return <rect x={cx - 5} y={cy - 5} width={10} height={10} fill={color} stroke="#0f172a" strokeWidth={2} />;
        } else {
            // mixed - diamond
            return <path d={`M${cx},${cy-7} L${cx+7},${cy} L${cx},${cy+7} L${cx-7},${cy} Z`} fill={color} stroke="#0f172a" strokeWidth={2} />;
        }
    };

    const stats = useMemo(() => {
        if (filteredHistory.length === 0) return null;
        const totalScore = filteredHistory.reduce((acc, curr) => acc + curr.score, 0);
        const totalCorrect = filteredHistory.reduce((acc, curr) => acc + curr.correctAnswers, 0);
        const totalRounds = filteredHistory.reduce((acc, curr) => acc + curr.totalRounds, 0);
        
        const now = Date.now();
        const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
        const dailyPlayTime = history
            .filter(entry => entry.timestamp > twentyFourHoursAgo)
            .reduce((acc, curr) => acc + (curr.duration || 0), 0);

        return {
            avgScore: Math.round(totalScore / filteredHistory.length),
            avgAccuracy: Math.round((totalCorrect / totalRounds) * 100),
            totalGames: filteredHistory.length,
            dailyPlayTime: formatDuration(dailyPlayTime),
        };
    }, [filteredHistory, history]);

    if (history.length === 0) {
        return (
            <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center animate-fade-in">
                <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-300 mb-2">No History Yet</h2>
                <p className="text-slate-500 mb-6">Play some games to see your progress!</p>
                <button 
                    onClick={onBack}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Performance History
                </h2>
                <div className="w-6" /> {/* Spacer */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avg Score</p>
                    <p className="text-2xl font-bold text-cyan-400">{stats?.avgScore || 0}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avg Accuracy</p>
                    <p className="text-2xl font-bold text-green-400">{stats?.avgAccuracy || 0}%</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Games</p>
                    <p className="text-2xl font-bold text-purple-400">{stats?.totalGames || 0}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> 24h Play Time
                    </p>
                    <p className="text-2xl font-bold text-orange-400">{stats?.dailyPlayTime || '0s'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <select 
                    value={filter.relationMode}
                    onChange={(e) => setFilter(f => ({ ...f, relationMode: e.target.value as any }))}
                    className="bg-slate-700 text-slate-200 p-2 rounded border border-slate-600 text-sm"
                >
                    <option value="all">All Relation Modes</option>
                    <option value="spatial">Spatial</option>
                    <option value="vertical">Vertical</option>
                    <option value="comparison">Comparison</option>
                    <option value="temporal">Temporal</option>
                    <option value="distinction">Distinction</option>
                </select>
                <select 
                    value={filter.stimuliType}
                    onChange={(e) => setFilter(f => ({ ...f, stimuliType: e.target.value as any }))}
                    className="bg-slate-700 text-slate-200 p-2 rounded border border-slate-600 text-sm"
                >
                    <option value="all">All Stimuli</option>
                    <option value="words">Words</option>
                    <option value="voronoi">Voronoi</option>
                </select>
                <select 
                    value={filter.challengeType}
                    onChange={(e) => setFilter(f => ({ ...f, challengeType: e.target.value as any }))}
                    className="bg-slate-700 text-slate-200 p-2 rounded border border-slate-600 text-sm"
                >
                    <option value="all">All Challenges</option>
                    <option value="conclusions">Conclusions</option>
                    <option value="analogies">Analogies</option>
                    <option value="mixed">Mixed</option>
                </select>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-[#22d3ee]" /> Spatial
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-[#f472b6]" /> Vertical
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-[#fbbf24]" /> Comparison
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-[#a78bfa]" /> Temporal
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full bg-[#4ade80]" /> Distinction
                    </div>
                </div>
                <div className="w-full h-px bg-slate-700/50 my-1" />
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full border border-slate-400" /> Conclusion
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 border border-slate-400" /> Analogy
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rotate-45 border border-slate-400" /> Mixed
                    </div>
                </div>
            </div>

            {chartData.length > 0 ? (
                <div className="space-y-8">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 h-[300px]">
                        <h3 className="text-slate-400 text-sm font-bold mb-4 flex items-center gap-2">
                            <BarChart2 className="w-4 h-4" /> Score Progression
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#475569" 
                                    strokeWidth={1} 
                                    dot={<CustomDot />} 
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    No data matches the selected filters.
                </div>
            )}
        </div>
    );
};

export default HistoryScreen;
