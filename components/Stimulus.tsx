
import React from 'react';
import VoronoiStimulus from './VoronoiStimulus';

interface StimulusProps {
    id: string;
    size?: number;
    className?: string;
    complexity?: number;
}

const Stimulus: React.FC<StimulusProps> = ({ id, size = 60, className = "", complexity = 12 }) => {
    const isVoronoi = id.startsWith('voronoi-');

    if (isVoronoi) {
        return <VoronoiStimulus seed={id} size={size} className={className} complexity={complexity} />;
    }

    return (
        <span className={`font-space-mono font-bold text-cyan-400 uppercase tracking-widest ${className}`}>
            {id}
        </span>
    );
};

export default Stimulus;
