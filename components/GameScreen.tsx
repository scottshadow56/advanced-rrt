
import React, { useEffect } from 'react';
import type { Premise, Challenge, Vector } from '../types';
import { Timer, Check, X, Star, LogOut, Play } from 'lucide-react';
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
    puzzleState: { nodes: string[]; coordinates: Map<string, Vector> } | null;
    oldestNode: string | null;
    memorizationTimeLeft: number;
    voronoiComplexity: number;
    playHighPitch: () => void;
    playLowPitch: () => void;
    minimalVertical: boolean;
    minimalTemporal: boolean;
    minimalRelevance: boolean;
    minimalHierarchy: boolean;
    isShowingLegend: boolean;
    onContinueFromLegend: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ score, timeLeft, challenge, onAnswer, feedback, lastPremise, initialPremises, onQuit, currentRound, totalRounds, isMemorizing, onContinue, puzzleState, oldestNode, memorizationTimeLeft, voronoiComplexity, playHighPitch, playLowPitch, minimalVertical, minimalTemporal, minimalRelevance, minimalHierarchy, isShowingLegend, onContinueFromLegend }) => {
    const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 20 ? 'text-yellow-400' : 'text-cyan-400';
    const memorizationTimerColor = memorizationTimeLeft <= 10 ? 'text-red-500' : memorizationTimeLeft <= 20 ? 'text-yellow-400' : 'text-cyan-400';

    useEffect(() => {
        const checkAndPlaySound = (direction: string) => {
            if (direction.includes('Hierarchically Above') || direction.includes('the Opposite of')) {
                playHighPitch();
            } else if (direction.includes('Hierarchically Below')) {
                playLowPitch();
            }
        };

        if (isMemorizing && initialPremises) {
            initialPremises.forEach(p => checkAndPlaySound(p.direction));
        } else if (lastPremise) {
            checkAndPlaySound(lastPremise.direction);
        }

        if (challenge && challenge.type === 'conclusion') {
            checkAndPlaySound(challenge.statement.direction);
        }
    }, [isMemorizing, initialPremises, lastPremise, challenge, playHighPitch, playLowPitch]);

    const renderDirection = (direction: string, idA?: string, idB?: string) => {
        if (!puzzleState || !idA || !idB) return <span className="text-purple-400 font-medium">{direction}</span>;
        
        const coords = puzzleState.coordinates;
        const cA = coords.get(idA);
        const cB = coords.get(idB);
        if (!cA || !cB) return <span className="text-purple-400 font-medium">{direction}</span>;

        // Relative vector A -> B
        const vec = cA.map((v, i) => Math.sign(v - cB[i]));

        // Determine dimension values
        const vertical: 'above' | 'below' | null = vec[2] === 1 ? 'above' : vec[2] === -1 ? 'below' : null;
        const temporal: 'after' | 'before' | null = vec[3] === 1 ? 'after' : vec[3] === -1 ? 'before' : null;
        const relevance: 'more' | 'less' | null = vec[4] === 1 ? 'more' : vec[4] === -1 ? 'less' : null;
        const hierarchy: 'above' | 'below' | 'neutral' | null = vec[5] === 1 ? 'above' : vec[5] === -1 ? 'below' : (vec.every(v => v === 0) ? 'neutral' : null);

        // Spatial reconstruction
        const ns = vec[1] === 1 ? 'North' : vec[1] === -1 ? 'South' : '';
        const ew = vec[0] === 1 ? 'East' : vec[0] === -1 ? 'West' : '';
        let spatial = ns && ew ? `${ns}-${ew}` : ns || ew;

        // PRIORITY TEXT LOGIC:
        // Identify which dimension will be the "primary" text anchor
        const primaryLabel = spatial || 
                            (vertical ? (vertical === 'above' ? 'Above' : 'Below') : null) ||
                            (temporal ? (temporal === 'after' ? 'After' : 'Before') : null) ||
                            (relevance ? (relevance === 'more' ? 'More' : 'Less') : null) ||
                            (hierarchy ? (hierarchy === 'neutral' ? 'Same' : (hierarchy === 'above' ? 'H-Above' : 'H-Below')) : null);

        const textParts: string[] = [];
        if (primaryLabel) textParts.push(primaryLabel);

        // Only append other labels if they are NOT minimal AND not already the primary label
        const addIfNotPrimary = (val: string | null, isMinimal: boolean) => {
            if (val && !isMinimal && val !== primaryLabel) {
                textParts.push(val);
            }
        };

        addIfNotPrimary(vertical ? (vertical === 'above' ? 'Above' : 'Below') : null, minimalVertical);
        addIfNotPrimary(temporal ? (temporal === 'after' ? 'After' : 'Before') : null, minimalTemporal);
        addIfNotPrimary(relevance ? (relevance === 'more' ? 'More' : 'Less') : null, minimalRelevance);
        addIfNotPrimary(hierarchy ? (hierarchy === 'neutral' ? 'Same' : (hierarchy === 'above' ? 'H-Above' : 'H-Below')) : null, minimalHierarchy);

        // Final content displayed in the UI box
        let finalContent = textParts.join(' & ');
        if (!finalContent) finalContent = direction; // Absolute fallback

        // Style logic based on dimensions
        let textStyle = "text-slate-100";
        let lineStyle = "underline decoration-2 underline-offset-4";
        let shadowStyle = "";

        // Vertical - Brightness & Shadow
        if (vertical === 'above') {
            textStyle = "text-white";
            shadowStyle = "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]";
        } else if (vertical === 'below') {
            textStyle = "text-slate-500 hover:text-slate-400";
        }

        // Temporal - Line Color
        if (temporal === 'after') {
            if (!vertical) textStyle = "text-green-400";
            lineStyle += vertical === 'above' ? " decoration-green-300" : vertical === 'below' ? " decoration-green-800" : " decoration-green-400";
        } else if (temporal === 'before') {
            if (!vertical) textStyle = "text-red-400";
            lineStyle += vertical === 'above' ? " decoration-red-300" : vertical === 'below' ? " decoration-red-800" : " decoration-red-400";
        } else if (vertical) {
            lineStyle += vertical === 'above' ? " decoration-white" : " decoration-slate-500";
        } else {
            lineStyle = ""; 
        }

        // Relevance - Scale & Weight
        let relevanceStyle = "";
        if (relevance === 'more') {
            relevanceStyle = "px-1 italic font-bold scale-105 origin-center";
        } else if (relevance === 'less') {
            relevanceStyle = "text-sm underline-offset-2 opacity-80 font-light scale-95 origin-center";
        }

        // Hierarchy - Underline Style
        let hierarchyStyle = "";
        if (hierarchy === 'above') {
            hierarchyStyle = "decoration-dashed underline underline-offset-8";
        } else if (hierarchy === 'below') {
            hierarchyStyle = "decoration-dotted underline font-light underline-offset-8";
        } else if (hierarchy === 'neutral') {
            hierarchyStyle = "decoration-solid underline opacity-50 underline-offset-8 text-slate-400";
        }

        return (
            <span className={`${textStyle} ${lineStyle} ${shadowStyle} ${relevanceStyle} ${hierarchyStyle} transition-all duration-300 inline-flex items-center justify-center min-w-[1rem] transition-all`}>
                {finalContent}
            </span>
        );
    };

    const renderChallenge = () => {
        if (!challenge) return null;

        if (challenge.type === 'conclusion') {
            const { itemA, direction, itemB } = challenge.statement;
            return (
                <div className="mt-2 text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600 flex flex-wrap items-center justify-center gap-4 leading-relaxed">
                    Is <Stimulus id={itemA} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(itemA)} /> {renderDirection(direction, itemA, itemB)} <Stimulus id={itemB} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(itemB)} />?
                </div>
            );
        }

        if (challenge.type === 'analogy') {
            const { itemA1, itemB1, itemA2, itemB2 } = challenge.statement;
            return (
                <div className="mt-2 text-xl sm:text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        Is the relation of <Stimulus id={itemA1} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(itemA1)} /> to <Stimulus id={itemB1} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(itemB1)} />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-slate-400">
                        the same as the relation of
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        <Stimulus id={itemA2} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(itemA2)} /> to <Stimulus id={itemB2} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(itemB2)} />?
                    </div>
                </div>
            );
        }
        return null;
    };
    
    const renderLegend = () => {
        const legendItems = [];
        if (minimalVertical) {
            legendItems.push({ label: 'Above', style: "text-white underline decoration-white decoration-2 underline-offset-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" });
            legendItems.push({ label: 'Below', style: "text-slate-500 underline decoration-slate-500 decoration-2 underline-offset-4" });
        }
        if (minimalTemporal) {
            legendItems.push({ label: 'After', style: "text-green-400 underline decoration-green-400 decoration-2 underline-offset-4" });
            legendItems.push({ label: 'Before', style: "text-red-400 underline decoration-red-400 decoration-2 underline-offset-4" });
        }
        if (minimalRelevance) {
            legendItems.push({ label: 'More Relevant', style: "font-black tracking-tight text-slate-100" });
            legendItems.push({ label: 'Less Relevant', style: "blur-[0.6px] font-thin text-slate-100" });
        }
        if (minimalHierarchy) {
            legendItems.push({ label: 'H. Above', style: "border-b-2 border-dashed border-yellow-400/50 pb-0.5 text-slate-100" });
            legendItems.push({ label: 'H. Below', style: "border-b-2 border-dotted border-slate-600 pb-0.5 text-slate-100 font-light" });
        }

        return (
            <div className="mt-6 text-center animate-fade-in">
                <h2 className="text-slate-400 text-lg mb-4 font-bold uppercase tracking-widest">Visual Legend</h2>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {legendItems.map((item, i) => (
                        <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-3 aspect-square">
                            <span className={`${item.style} text-xl font-space-mono`}>Item</span>
                            <span className="text-xs text-slate-500 font-bold uppercase">{item.label}</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onContinueFromLegend}
                    className="mt-8 w-full flex items-center justify-center gap-3 text-xl font-bold py-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all transform hover:scale-105"
                >
                    <Play className="w-6 h-6" />
                    Got it, Start Memorizing
                </button>
            </div>
        );
    };
    
    return (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 w-full animate-fade-in relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                    <button onClick={onQuit} className="text-slate-500 hover:text-red-500 transition-colors" aria-label="Quit Game">
                        <LogOut className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        <Star className="w-6 h-6 text-yellow-400" />
                        <span>{score}</span>
                    </div>
                </div>
                 <div className="font-bold text-slate-400">
                    {isShowingLegend ? 'Legend' : isMemorizing ? 'Memorize!' : <>Round {currentRound} <span className="text-xs">/ {totalRounds}</span></>}
                </div>
                <div className={`flex items-center gap-2 text-2xl font-bold ${isShowingLegend ? 'text-cyan-400' : isMemorizing ? memorizationTimerColor : timerColor}`}>
                    <Timer className="w-6 h-6" />
                    <span>{isShowingLegend ? '-' : isMemorizing ? memorizationTimeLeft : timeLeft}</span>
                </div>
            </div>

            {isShowingLegend ? renderLegend() : (
                <>
                    <div className="mt-6 text-center">
                        {isMemorizing && initialPremises ? (
                    <>
                        <h2 className="text-slate-400 text-lg">Memorize the starting map:</h2>
                        <div className="mt-2 space-y-4 text-xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg animate-pop-in leading-relaxed">
                           {initialPremises.map((p, i) => (
                               <div key={`${p.itemA}-${p.itemB}-${i}`} className="flex flex-wrap items-center justify-center gap-4">
                                   <Stimulus id={p.itemA} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(p.itemA)} /> {renderDirection(p.direction, p.itemA, p.itemB)} <Stimulus id={p.itemB} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(p.itemB)} />
                               </div>
                           ))}
                        </div>
                    </>
                ) : lastPremise && (
                     <>
                        <h2 className="text-slate-400 text-lg">The map has changed:</h2>
                        <div key={`${lastPremise.itemA}-${lastPremise.itemB}`} className="mt-2 text-2xl font-space-mono text-slate-100 p-4 bg-slate-900/50 rounded-lg animate-pop-in flex flex-wrap items-center justify-center gap-4 leading-relaxed">
                            <Stimulus id={lastPremise.itemA} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(lastPremise.itemA)} /> {renderDirection(lastPremise.direction, lastPremise.itemA, lastPremise.itemB)} <Stimulus id={lastPremise.itemB} complexity={voronoiComplexity} vector={puzzleState?.coordinates.get(lastPremise.itemB)} />
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
        </>
    )}
    
    {feedback && (
        <div className={`absolute inset-0 bg-slate-800/95 backdrop-blur-md flex flex-col items-center justify-center rounded-lg animate-pop-in p-8 text-center`}>
            {feedback === 'correct' ? (
                <Check className="w-32 h-32 text-green-400 mb-4"/>
            ) : (
                <>
                    <X className="w-24 h-24 text-red-400 mb-6"/>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Incorrect</h3>
                    </div>
                </>
            )}
        </div>
    )}
        </div>
    );
};

export default GameScreen;
