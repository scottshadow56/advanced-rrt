
export type Vector = number[];
export type GameState = 'idle' | 'playing' | 'gameOver' | 'settings' | 'history';
export type GameOverReason = 'time' | 'rounds' | 'quit';

export interface Settings {
    initialPremises: number;
    voronoiComplexity: number;
    totalRounds: number;
    challengeType: 'conclusions' | 'analogies' | 'mixed';
    wordLength: number;
    devMode: boolean;
    stimuliType: 'words' | 'voronoi';
    relationMode: 'spatial' | 'vertical' | 'comparison' | 'temporal' | 'distinction' | 'spatial_temporal' | 'spatial_vertical' | 'spatial_temporal_vertical' | 'spatial_temporal_vertical_size' | 'spatial_temporal_vertical_size_hierarchy';
    minimalVertical: boolean;
    minimalTemporal: boolean;
    minimalSize: boolean;
    minimalHierarchy: boolean;
}

export interface HistoryEntry {
    id: string;
    timestamp: number;
    score: number;
    correctAnswers: number;
    totalRounds: number;
    settings: Settings;
    duration: number; // in milliseconds
}

export interface Premise {
    itemA: string;
    direction: string;
    itemB: string;
}

export interface Conclusion {
    itemA: string;
    direction: string;
    itemB: string;
}

export interface Analogy {
    itemA1: string;
    itemB1: string;
    itemA2: string;
    itemB2: string;
}

export type Challenge = {
    type: 'conclusion';
    statement: Conclusion;
    isTrue: boolean;
} | {
    type: 'analogy';
    statement: Analogy;
    isTrue: boolean;
};
