
import React, { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import type { Vector } from '../types';

interface VoronoiMapProps {
    nodes: string[];
    coordinates: Map<string, Vector>;
    width?: number;
    height?: number;
    highlightNode?: string | null;
}

const VoronoiMap: React.FC<VoronoiMapProps> = ({ nodes, coordinates, width = 400, height = 400, highlightNode }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const points = useMemo(() => {
        // Find min/max to normalize
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        coordinates.forEach(coord => {
            minX = Math.min(minX, coord[0]);
            maxX = Math.max(maxX, coord[0]);
            minY = Math.min(minY, coord[1]);
            maxY = Math.max(maxY, coord[1]);
        });

        const padding = 50;
        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;

        return nodes.map((node, i) => {
            const coord = coordinates.get(node)!;
            // Add jitter
            const jitterX = (Math.random() - 0.5) * 0.2;
            const jitterY = (Math.random() - 0.5) * 0.2;
            
            const x = padding + ((coord[0] + jitterX - minX) / rangeX) * (width - 2 * padding);
            const y = padding + ((coord[1] + jitterY - minY) / rangeY) * (height - 2 * padding);
            return { x, y, node };
        });
    }, [nodes, coordinates, width, height]);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const delaunay = Delaunay.from(points.map(p => [p.x, p.y]));
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        const g = svg.append("g");

        // Draw cells
        points.forEach((p, i) => {
            const path = voronoi.renderCell(i);
            const isHighlighted = p.node === highlightNode;

            g.append("path")
                .attr("d", path)
                .attr("fill", isHighlighted ? "#4f46e5" : "#1e293b")
                .attr("stroke", isHighlighted ? "#818cf8" : "#334155")
                .attr("stroke-width", isHighlighted ? 3 : 1)
                .attr("opacity", 0.8)
                .attr("class", "transition-all duration-300");

            // Add text
            g.append("text")
                .attr("x", p.x)
                .attr("y", p.y)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("fill", isHighlighted ? "#ffffff" : "#94a3b8")
                .attr("font-family", "Space Mono, monospace")
                .attr("font-weight", isHighlighted ? "bold" : "normal")
                .attr("font-size", isHighlighted ? "14px" : "12px")
                .text(p.node);
        });

    }, [points, width, height, highlightNode]);

    return (
        <div className="flex justify-center items-center bg-slate-900/30 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="max-w-full h-auto"
            />
        </div>
    );
};

export default VoronoiMap;
