
import type { Vector } from '../types';

export class RelationalEngine {
    public dirMap: Map<string, Vector>;
    private graph: Map<string, { neighbor: string; vector: Vector }[]>;

    constructor(mode: string = 'spatial') {
        // Basic spatial directions
        this.dirMap = new Map([
            ["North", [0, 1]], ["South", [0, -1]],
            ["East", [1, 0]], ["West", [-1, 0]],
            ["North-East", [1, 1]], ["South-East", [1, -1]],
            ["North-West", [-1, 1]], ["South-West", [-1, -1]]
        ]);

        // Add extra dimensions based on mode
        if (mode.includes('temporal')) {
            this.dirMap.set("Earlier", [0, 0, 1]);
            this.dirMap.set("Later", [0, 0, -1]);
        }
        if (mode.includes('vertical')) {
            this.dirMap.set("Above", [0, 0, 0, 1]);
            this.dirMap.set("Below", [0, 0, 0, -1]);
        }
        if (mode.includes('size')) {
            this.dirMap.set("Larger", [0, 0, 0, 0, 1]);
            this.dirMap.set("Smaller", [0, 0, 0, 0, -1]);
        }
        if (mode.includes('hierarchy')) {
            this.dirMap.set("Superior", [0, 0, 0, 0, 0, 1]);
            this.dirMap.set("Inferior", [0, 0, 0, 0, 0, -1]);
        }

        this.graph = new Map();
    }
    
    public getAllDirections(): string[] {
        return Array.from(this.dirMap.keys());
    }

    public addRelation(itemA: string, direction: string, itemB: string): void {
        const vector = this.dirMap.get(direction);
        if (!vector) return;

        const inverseVector: Vector = vector.map(v => -v);

        if (!this.graph.has(itemB)) this.graph.set(itemB, []);
        if (!this.graph.has(itemA)) this.graph.set(itemA, []);

        this.graph.get(itemB)!.push({ neighbor: itemA, vector });
        this.graph.get(itemA)!.push({ neighbor: itemB, vector: inverseVector });
    }

    public getRelativeVector(start: string, end: string): Vector | null {
        if (!this.graph.has(start) || !this.graph.has(end)) {
            return null;
        }

        // BFS to find path and sum vectors
        const queue: { node: string; vector: Vector }[] = [{ node: start, vector: [] }];
        const visited = new Set<string>();
        visited.add(start);

        while (queue.length > 0) {
            const { node: currNode, vector: currVec } = queue.shift()!;

            if (currNode === end) {
                return currVec;
            }

            const neighbors = this.graph.get(currNode) || [];
            for (const { neighbor, vector: vecOffset } of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    
                    // Initialize or pad vectors to match lengths
                    const maxLen = Math.max(currVec.length, vecOffset.length);
                    const newVec: Vector = [];
                    for (let i = 0; i < maxLen; i++) {
                        newVec[i] = (currVec[i] || 0) + (vecOffset[i] || 0);
                    }
                    
                    queue.push({ node: neighbor, vector: newVec });
                }
            }
        }
        return null;
    }
}
