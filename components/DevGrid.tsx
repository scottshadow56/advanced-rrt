
import React from 'react';
import type { Vector, Premise } from '../types';

interface DevGridProps {
    nodes: string[];
    coordinates: Map<string, Vector>;
    lastPremise: Premise | null;
    oldestNode: string | null;
}

const DevGrid: React.FC<DevGridProps> = ({ nodes, coordinates, lastPremise, oldestNode }) => {
    if (nodes.length === 0) {
        return null;
    }

    // 1. Calculate grid bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const coord of coordinates.values()) {
        minX = Math.min(minX, coord[0]);
        maxX = Math.max(maxX, coord[0]);
        minY = Math.min(minY, coord[1]);
        maxY = Math.max(maxY, coord[1]);
    }
    
    const gridWidth = maxX - minX + 1;
    const gridHeight = maxY - minY + 1;

    // 2. Create grid data structure
    const grid: (string | null)[][] = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));

    // 3. Populate grid with nodes
    for (const node of nodes) {
        const coord = coordinates.get(node);
        if (coord) {
            const [x, y] = coord;
            // Invert Y for rendering (0,0 at top-left)
            const row = maxY - y;
            const col = x - minX;
            if (row >= 0 && row < gridHeight && col >= 0 && col < gridWidth) {
                grid[row][col] = node;
            }
        }
    }
    
    return (
        <div className="mt-8 p-4 bg-slate-900/70 border-2 border-dashed border-cyan-400 rounded-lg font-space-mono">
            <h3 className="text-center text-cyan-400 font-bold mb-2">DEV MODE: World State</h3>
            {oldestNode && <p className="text-center text-sm text-red-400 mb-2">Removed: {oldestNode}</p>}
            <div 
                className="grid bg-slate-800 p-2 gap-1"
                style={{
                    gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
                }}
            >
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => {
                        let cellStyle = 'flex items-center justify-center aspect-square text-xs sm:text-sm border border-slate-700 rounded-sm transition-colors duration-300 ';
                        const isNewItem = lastPremise && cell === lastPremise.itemA;
                        const isRef = lastPremise && cell === lastPremise.itemB;

                        if (isNewItem) {
                            cellStyle += 'bg-yellow-400 text-slate-900 font-bold animate-pop-in';
                        } else if (isRef) {
                            cellStyle += 'bg-purple-500 text-white font-bold';
                        } else if (cell) {
                             cellStyle += 'bg-slate-600 text-slate-100';
                        } else {
                            cellStyle += 'bg-transparent';
                        }
                        
                        return (
                            <div key={`${rowIndex}-${colIndex}`} className={cellStyle}>
                                {cell}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default DevGrid;
