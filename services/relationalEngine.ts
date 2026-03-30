
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
            case 'spatial_temporal': {
                const map = new Map<string, Vector>();
                const spatial: [string, number[]][] = [
                    ["North", [0, 1]], ["South", [0, -1]],
                    ["East", [1, 0]], ["West", [-1, 0]],
                    ["North-East", [1, 1]], ["South-East", [1, -1]],
                    ["North-West", [-1, 1]], ["South-West", [-1, -1]]
                ];
                const temporal: [string, number[]][] = [
                    ["After", [1]], ["Before", [-1]]
                ];
                for (const [sName, sVec] of spatial) {
                    for (const [tName, tVec] of temporal) {
                        map.set(`${sName} and ${tName}`, [sVec[0], sVec[1], tVec[0]]);
                    }
                }
                return map;
            }
            case 'spatial_vertical': {
                const map = new Map<string, Vector>();
                const spatial: [string, number[]][] = [
                    ["North", [0, 1]], ["South", [0, -1]],
                    ["East", [1, 0]], ["West", [-1, 0]],
                    ["North-East", [1, 1]], ["South-East", [1, -1]],
                    ["North-West", [-1, 1]], ["South-West", [-1, -1]]
                ];
                const vertical: [string, number[]][] = [
                    ["Above", [1]], ["Below", [-1]]
                ];
                for (const [sName, sVec] of spatial) {
                    for (const [vName, vVec] of vertical) {
                        map.set(`${sName} and ${vName}`, [sVec[0], sVec[1], vVec[0]]);
                    }
                }
                return map;
            }
            case 'spatial_temporal_vertical': {
                const map = new Map<string, Vector>();
                const spatial: [string, number[]][] = [
                    ["North", [0, 1]], ["South", [0, -1]],
                    ["East", [1, 0]], ["West", [-1, 0]],
                    ["North-East", [1, 1]], ["South-East", [1, -1]],
                    ["North-West", [-1, 1]], ["South-West", [-1, -1]]
                ];
                const temporal: [string, number[]][] = [
                    ["After", [1]], ["Before", [-1]]
                ];
                const vertical: [string, number[]][] = [
                    ["Above", [1]], ["Below", [-1]]
                ];
                for (const [sName, sVec] of spatial) {
                    for (const [tName, tVec] of temporal) {
                        for (const [vName, vVec] of vertical) {
                            map.set(`${sName} and ${vName} and ${tName}`, [sVec[0], sVec[1], tVec[0], vVec[0]]);
                        }
                    }
                }
                return map;
            }
            case 'spatial_temporal_vertical_size': {
                const map = new Map<string, Vector>();
                const spatial: [string, number[]][] = [
                    ["North", [0, 1]], ["South", [0, -1]],
                    ["East", [1, 0]], ["West", [-1, 0]],
                    ["North-East", [1, 1]], ["South-East", [1, -1]],
                    ["North-West", [-1, 1]], ["South-West", [-1, -1]]
                ];
                const temporal: [string, number[]][] = [
                    ["After", [1]], ["Before", [-1]]
                ];
                const vertical: [string, number[]][] = [
                    ["Above", [1]], ["Below", [-1]]
                ];
                const size: [string, number[]][] = [
                    ["Bigger than", [1]], ["Smaller than", [-1]]
                ];
                for (const [sName, sVec] of spatial) {
                    for (const [tName, tVec] of temporal) {
                        for (const [vName, vVec] of vertical) {
                            for (const [szName, szVec] of size) {
                                map.set(`${sName} and ${vName} and ${tName} and ${szName}`, [sVec[0], sVec[1], tVec[0], vVec[0], szVec[0]]);
                            }
                        }
                    }
                }
                return map;
            }
            case 'spatial_temporal_vertical_size_hierarchy': {
                const map = new Map<string, Vector>();
                const spatial: [string, number[]][] = [
                    ["North", [0, 1]], ["South", [0, -1]],
                    ["East", [1, 0]], ["West", [-1, 0]],
                    ["North-East", [1, 1]], ["South-East", [1, -1]],
                    ["North-West", [-1, 1]], ["South-West", [-1, -1]]
                ];
                const temporal: [string, number[]][] = [
                    ["After", [1]], ["Before", [-1]]
                ];
                const vertical: [string, number[]][] = [
                    ["Above", [1]], ["Below", [-1]]
                ];
                const size: [string, number[]][] = [
                    ["Bigger than", [1]], ["Smaller than", [-1]]
                ];
                const hierarchy: [string, number[]][] = [
                    ["Hierarchically Above", [1]], ["Hierarchically Below", [-1]]
                ];
                for (const [sName, sVec] of spatial) {
                    for (const [tName, tVec] of temporal) {
                        for (const [vName, vVec] of vertical) {
                            for (const [szName, szVec] of size) {
                                for (const [hName, hVec] of hierarchy) {
                                    map.set(`${sName} and ${vName} and ${tName} and ${szName} and ${hName}`, [sVec[0], sVec[1], tVec[0], vVec[0], szVec[0], hVec[0]]);
                                }
                            }
                        }
                    }
                }
                return map;
            }
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

        const firstVec = this.graph.get(start)?.[0]?.vector || [0, 0];
        const initialVec = new Array(firstVec.length).fill(0);

        const queue: { node: string; vector: Vector }[] = [{ node: start, vector: initialVec }];
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
                    const newVec: Vector = currVec.map((v, i) => v + vecOffset[i]);
                    queue.push({ node: neighbor, vector: newVec });
                }
            }
        }
        return null;
    }
}
