
import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface VoronoiStimulusProps {
    seed: string;
    size?: number;
    className?: string;
    complexity?: number;
}

const VoronoiStimulus: React.FC<VoronoiStimulusProps> = ({ seed, size = 60, className = "", complexity = 12 }) => {
    const points = useMemo(() => {
        // Use the seed to generate a deterministic set of points
        const rng = seedToRng(seed);
        const numPoints = Math.max(3, complexity);
        return Array.from({ length: numPoints }, () => [
            rng() * size,
            rng() * size
        ] as [number, number]);
    }, [seed, size, complexity]);

    const cells = useMemo(() => {
        const voronoi = d3.Delaunay.from(points).voronoi([0, 0, size, size]);
        return points.map((_, i) => voronoi.renderCell(i));
    }, [points, size]);

    const colors = useMemo(() => {
        const rng = seedToRng(seed + "-colors");
        return points.map(() => {
            const h = rng() * 360;
            const s = 40 + rng() * 40;
            const l = 30 + rng() * 40;
            return `hsl(${h}, ${s}%, ${l}%)`;
        });
    }, [seed, points.length]);

    return (
        <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`} 
            className={`rounded-md overflow-hidden border border-slate-600 shadow-inner ${className}`}
        >
            {cells.map((path, i) => (
                <path 
                    key={i} 
                    d={path} 
                    fill={colors[i]} 
                    stroke="#1e293b" 
                    strokeWidth="0.5" 
                />
            ))}
        </svg>
    );
};

// Simple seedable RNG
function seedToRng(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return function() {
        h = Math.imul(1597334677, h);
        h = h >>> 24 | h << 8;
        return (h >>> 0) / 4294967296;
    };
}

export default VoronoiStimulus;
