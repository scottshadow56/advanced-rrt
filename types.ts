
export type Vector = [number, number];
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
    relationMode: 'spatial' | 'vertical' | 'comparison' | 'temporal' | 'distinction';
}

export interface HistoryEntry {
    id: string;
    timestamp: number;
    score: number;
    correctAnswers: number;
    totalRounds: number;
    settings: Settings;
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
