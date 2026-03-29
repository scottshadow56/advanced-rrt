
import type { Vector, Settings } from '../types';

export class RelationalEngine {
    public dirMap: Map<string, Vector>;
    private graph: Map<string, { neighbor: string; vector: Vector }[]>;

    constructor(mode: Settings['relationMode'] = 'spatial') {
        this.dirMap = this.getDirMap(mode);
        this.graph = new Map();
    }

    private getDirMap(mode: Settings['relationMode']): Map<string, Vector> {
        switch (mode) {
            case 'vertical':
                return new Map([
                    ["Above", [0, 1]], ["Below", [0, -1]]
                ]);
            case 'comparison':
                return new Map([
                    ["Greater than", [1, 0]], ["Less than", [-1, 0]]
                ]);
            case 'temporal':
                return new Map([
                    ["After", [1, 0]], ["Before", [-1, 0]]
                ]);
            case 'distinction':
                return new Map([
                    ["the Same as", [0, 0]], ["the Opposite of", [1, 0]]
                ]);
            case 'spatial':
            default:
                return new Map([
                    ["North of", [0, 1]], ["South of", [0, -1]],
                    ["East of", [1, 0]], ["West of", [-1, 0]],
                    ["North-East of", [1, 1]], ["South-East of", [1, -1]],
                    ["North-West of", [-1, 1]], ["South-West of", [-1, -1]]
                ]);
        }
    }
    
    public getAllDirections(): string[] {
        return Array.from(this.dirMap.keys());
    }

    public addRelation(itemA: string, direction: string, itemB: string): void {
        const vector = this.dirMap.get(direction);
        if (!vector) return;

        const inverseVector: Vector = [-vector[0], -vector[1]];

        if (!this.graph.has(itemB)) this.graph.set(itemB, []);
        if (!this.graph.has(itemA)) this.graph.set(itemA, []);

        this.graph.get(itemB)!.push({ neighbor: itemA, vector });
        this.graph.get(itemA)!.push({ neighbor: itemB, vector: inverseVector });
    }

    public getRelativeVector(start: string, end: string): Vector | null {
        if (!this.graph.has(start) || !this.graph.has(end)) {
            return null;
        }

        const queue: { node: string; vector: Vector }[] = [{ node: start, vector: [0, 0] }];
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
                    const newVec: Vector = [currVec[0] + vecOffset[0], currVec[1] + vecOffset[1]];
                    queue.push({ node: neighbor, vector: newVec });
                }
            }
        }
        return null;
    }
}
