
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

    // Apply 6D visual decorators based on vector [x, y, z, t, m, h]
    const styles: React.CSSProperties = {};
    let hierarchyClass = "";
    let scaleClass = "";

    if (vector && vector.length >= 6) {
        // Vertical (z - index 2): Lighter/Darker
        if (vector[2] === 1) {
            styles.color = '#FFFFFF'; // Lighter
            styles.textShadow = '0 0 8px rgba(255,255,255,0.6)';
        } else if (vector[2] === -1) {
            styles.color = '#475569'; // Darker (slate-600)
        } else {
            styles.color = '#94a3b8'; // Default slate-400
        }

        // Temporal (t - index 3): Green/Red
        if (vector[3] === 1) {
            styles.color = '#4ade80'; // Green-400
        } else if (vector[3] === -1) {
            styles.color = '#f87171'; // Red-400
        }

        // Magnitude (m - index 4): Vivid/Bigger vs Dull/Smaller
        if (vector[4] === 1) {
            styles.filter = 'saturate(200%) brightness(1.2)';
            scaleClass = "scale-110";
        } else if (vector[4] === -1) {
            styles.filter = 'saturate(50%) brightness(0.8)';
            scaleClass = "scale-90 opacity-70";
        }

        // Hierarchy (h - index 5): High/Low Pitch (Visual cue: Border style)
        if (vector[5] === 1) {
            hierarchyClass = "border-b-2 border-dashed border-indigo-400 pb-0.5";
        } else if (vector[5] === -1) {
            hierarchyClass = "border-b-2 border-dotted border-slate-500 pb-0.5";
        }
    } else {
        styles.color = '#94a3b8'; // Default
    }

    if (isVoronoi) {
        return (
            <div className={`inline-block transition-all duration-300 ${scaleClass} ${hierarchyClass} ${className}`} style={styles}>
                <VoronoiStimulus seed={id} size={size} complexity={complexity} />
            </div>
        );
    }

    return (
        <span 
            className={`font-space-mono font-bold uppercase tracking-widest transition-all duration-300 inline-block ${scaleClass} ${hierarchyClass} ${className}`}
            style={styles}
        >
            {id}
        </span>
    );
};

export default Stimulus;
