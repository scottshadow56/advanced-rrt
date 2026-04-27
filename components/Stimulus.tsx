
import React from 'react';
import VoronoiStimulus from './VoronoiStimulus';
import type { Vector } from '../types';

interface StimulusProps {
    id: string;
    size?: number;
    className?: string;
    complexity?: number;
    vector?: Vector;
}

const Stimulus: React.FC<StimulusProps> = ({ id, size = 60, className = "", complexity = 12, vector }) => {
    const isVoronoi = id.startsWith('voronoi-');

    if (isVoronoi) {
        return (
            <div className={`inline-block transition-all duration-300 ${className}`} style={{ color: '#94a3b8' }}>
                <VoronoiStimulus seed={id} size={size} complexity={complexity} />
            </div>
        );
    }

    return (
        <span 
            className={`font-space-mono font-bold uppercase tracking-widest transition-all duration-300 inline-block ${className}`}
            style={{ color: '#94a3b8' }}
        >
            {id}
        </span>
    );
};

export default Stimulus;
