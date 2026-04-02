
import React from 'react';
import VoronoiStimulus from './VoronoiStimulus';

interface StimulusProps {
    id: string;
    size?: number;
    className?: string;
    complexity?: number;
    // 6D properties (relative to a reference)
    spatial?: string;
    vertical?: 'above' | 'below' | null;
    temporal?: 'past' | 'future' | null;
    magnitude?: 'bigger' | 'smaller' | null;
    hierarchy?: 'above' | 'below' | null;
}

const Stimulus: React.FC<StimulusProps> = ({ id, size = 60, className = "", complexity = 12, spatial, vertical, temporal, magnitude, hierarchy }) => {
    const isVoronoi = id.startsWith('voronoi-');

    if (isVoronoi) {
        return <VoronoiStimulus seed={id} size={size} className={className} complexity={complexity} />;
    }

    // Apply 6D visual decorators
    const styles: React.CSSProperties = {};
    
    // Temporal (Color)
    if (temporal === 'past') {
        styles.color = '#FF0000'; // Red
    } else if (temporal === 'future') {
        styles.color = '#00FF00'; // Green
    } else {
        styles.color = '#22d3ee'; // Default cyan-400
    }

    // Vertical (Underline Color)
    if (vertical === 'above') {
        styles.textDecoration = 'underline';
        styles.textDecorationColor = '#FFFFFF'; // Light
    } else if (vertical === 'below') {
        styles.textDecoration = 'underline';
        styles.textDecorationColor = '#334155'; // Dark (slate-700)
    }

    // Magnitude (Saturation/Alpha)
    if (magnitude === 'bigger') {
        styles.filter = 'saturate(200%)';
        styles.opacity = 1;
    } else if (magnitude === 'smaller') {
        styles.filter = 'saturate(50%)';
        styles.opacity = 0.6;
    }

    // Hierarchy (Pitch/Audio is handled by the game logic, but maybe a subtle border?)
    let hierarchyClass = "";
    if (hierarchy === 'above') {
        hierarchyClass = "border-t-2 border-yellow-400";
    } else if (hierarchy === 'below') {
        hierarchyClass = "border-b-2 border-slate-500";
    }

    return (
        <span 
            className={`font-space-mono font-bold uppercase tracking-widest transition-all duration-300 ${hierarchyClass} ${className}`}
            style={styles}
        >
            {spatial ? spatial : id}
        </span>
    );
};

export default Stimulus;
