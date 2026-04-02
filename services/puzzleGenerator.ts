
import type { Premise, Conclusion, Vector, Analogy, Challenge, Settings } from '../types';

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
const SPATIAL_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "North of", vector: [0, 1] }, { name: "South of", vector: [0, -1] },
    { name: "East of", vector: [1, 0] }, { name: "West of", vector: [-1, 0] },
    { name: "North-East of", vector: [1, 1] }, { name: "South-East of", vector: [1, -1] },
    { name: "North-West of", vector: [-1, 1] }, { name: "South-West of", vector: [-1, -1] },
];

const VERTICAL_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "Above", vector: [0, 1] }, { name: "Below", vector: [0, -1] },
];

const COMPARISON_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "Greater than", vector: [1, 0] }, { name: "Less than", vector: [-1, 0] },
];

const TEMPORAL_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "After", vector: [1, 0] }, { name: "Before", vector: [-1, 0] },
];

const DISTINCTION_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "the Same as", vector: [0, 0] }, { name: "the Opposite of", vector: [1, 0] },
];

const SPATIAL_TEMPORAL_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
    const spatial = [
        ["North", [0, 1]], ["South", [0, -1]],
        ["East", [1, 0]], ["West", [-1, 0]],
        ["North-East", [1, 1]], ["South-East", [1, -1]],
        ["North-West", [-1, 1]], ["South-West", [-1, -1]]
    ];
    const temporal = [
        ["After", [1]], ["Before", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [tName, tVec] of temporal) {
            res.push({ name: `${sName} and ${tName}`, vector: [(sVec as number[])[0], (sVec as number[])[1], (tVec as number[])[0]] });
        }
    }
    return res;
})();

const SPATIAL_VERTICAL_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
    const spatial = [
        ["North", [0, 1]], ["South", [0, -1]],
        ["East", [1, 0]], ["West", [-1, 0]],
        ["North-East", [1, 1]], ["South-East", [1, -1]],
        ["North-West", [-1, 1]], ["South-West", [-1, -1]]
    ];
    const vertical = [
        ["Above", [1]], ["Below", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [vName, vVec] of vertical) {
            res.push({ name: `${sName} and ${vName}`, vector: [(sVec as number[])[0], (sVec as number[])[1], (vVec as number[])[0]] });
        }
    }
    return res;
})();

const SPATIAL_TEMPORAL_VERTICAL_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
    const spatial = [
        ["North", [0, 1]], ["South", [0, -1]],
        ["East", [1, 0]], ["West", [-1, 0]],
        ["North-East", [1, 1]], ["South-East", [1, -1]],
        ["North-West", [-1, 1]], ["South-West", [-1, -1]]
    ];
    const temporal = [
        ["After", [1]], ["Before", [-1]]
    ];
    const vertical = [
        ["Above", [1]], ["Below", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [tName, tVec] of temporal) {
            for (const [vName, vVec] of vertical) {
                res.push({ 
                    name: `${sName} and ${vName} and ${tName}`, 
                    vector: [(sVec as number[])[0], (sVec as number[])[1], (tVec as number[])[0], (vVec as number[])[0]] 
                });
            }
        }
    }
    return res;
})();

const SPATIAL_TEMPORAL_VERTICAL_SIZE_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
    const spatial = [
        ["North", [0, 1]], ["South", [0, -1]],
        ["East", [1, 0]], ["West", [-1, 0]],
        ["North-East", [1, 1]], ["South-East", [1, -1]],
        ["North-West", [-1, 1]], ["South-West", [-1, -1]]
    ];
    const temporal = [
        ["After", [1]], ["Before", [-1]]
    ];
    const vertical = [
        ["Above", [1]], ["Below", [-1]]
    ];
    const size = [
        ["Bigger than", [1]], ["Smaller than", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [tName, tVec] of temporal) {
            for (const [vName, vVec] of vertical) {
                for (const [szName, szVec] of size) {
                    res.push({ 
                        name: `${sName} and ${vName} and ${tName} and ${szName}`, 
                        vector: [(sVec as number[])[0], (sVec as number[])[1], (tVec as number[])[0], (vVec as number[])[0], (szVec as number[])[0]] 
                    });
                }
            }
        }
    }
    return res;
})();

const SPATIAL_TEMPORAL_VERTICAL_SIZE_HIERARCHY_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
    const spatial = [
        ["North", [0, 1]], ["South", [0, -1]],
        ["East", [1, 0]], ["West", [-1, 0]],
        ["North-East", [1, 1]], ["South-East", [1, -1]],
        ["North-West", [-1, 1]], ["South-West", [-1, -1]]
    ];
    const temporal = [
        ["After", [1]], ["Before", [-1]]
    ];
    const vertical = [
        ["Above", [1]], ["Below", [-1]]
    ];
    const size = [
        ["Bigger than", [1]], ["Smaller than", [-1]]
    ];
    const hierarchy = [
        ["Hierarchically Above", [1]], ["Hierarchically Below", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [tName, tVec] of temporal) {
            for (const [vName, vVec] of vertical) {
                for (const [szName, szVec] of size) {
                    for (const [hName, hVec] of hierarchy) {
                        res.push({ 
                            name: `${sName} and ${vName} and ${tName} and ${szName} and ${hName}`, 
                            vector: [(sVec as number[])[0], (sVec as number[])[1], (tVec as number[])[0], (vVec as number[])[0], (szVec as number[])[0], (hVec as number[])[0]] 
                        });
                    }
                }
            }
        }
    }
    return res;
})();

function getDirectionsForMode(mode: Settings['relationMode']): { name: string, vector: Vector }[] {
    switch (mode) {
        case 'vertical': return VERTICAL_DIRECTIONS;
        case 'comparison': return COMPARISON_DIRECTIONS;
        case 'temporal': return TEMPORAL_DIRECTIONS;
        case 'distinction': return DISTINCTION_DIRECTIONS;
        case 'spatial_temporal': return SPATIAL_TEMPORAL_DIRECTIONS;
        case 'spatial_vertical': return SPATIAL_VERTICAL_DIRECTIONS;
        case 'spatial_temporal_vertical': return SPATIAL_TEMPORAL_VERTICAL_DIRECTIONS;
        case 'spatial_temporal_vertical_size': return SPATIAL_TEMPORAL_VERTICAL_SIZE_DIRECTIONS;
        case 'spatial_temporal_vertical_size_hierarchy': return SPATIAL_TEMPORAL_VERTICAL_SIZE_HIERARCHY_DIRECTIONS;
        case 'spatial':
        default: return SPATIAL_DIRECTIONS;
    }
}

function generateStimulus(type: Settings['stimuliType'], length: number): string {
    if (type === 'voronoi') {
        // For voronoi, we just need a unique ID. We'll generate a random string of numbers/letters.
        return 'voronoi-' + Math.random().toString(36).substring(2, 9);
    }
    
    let word = '';
    const startWithVowel = Math.random() < 0.5;
    for (let i = 0; i < length; i++) {
        if ((i % 2 === 0 && !startWithVowel) || (i % 2 !== 0 && startWithVowel)) {
            word += CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
        } else {
            word += VOWELS[Math.floor(Math.random() * VOWELS.length)];
        }
    }
    return word;
}

function shuffle<T,>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getDirectionFromVector(vec: Vector, mode: Settings['relationMode']): string | null {
    const directions = getDirectionsForMode(mode);
    for (const dir of directions) {
        if (dir.vector.length === vec.length && dir.vector.every((v, i) => v === vec[i])) {
            return dir.name;
        }
    }
    return null;
}

function areItemsSameAsPremise(itemA: string, itemB: string, premise: Premise | null): boolean {
    if (!premise) return false;
    const items = [itemA, itemB].sort();
    const premiseItems = [premise.itemA, premise.itemB].sort();
    return items[0] === premiseItems[0] && items[1] === premiseItems[1];
}

function getShortestPath(itemA: string, itemB: string, premises: Premise[]): Premise[] | null {
    const adj: Map<string, { to: string, premise: Premise }[]> = new Map();
    for (const p of premises) {
        if (!adj.has(p.itemA)) adj.set(p.itemA, []);
        if (!adj.has(p.itemB)) adj.set(p.itemB, []);
        adj.get(p.itemA)!.push({ to: p.itemB, premise: p });
        adj.get(p.itemB)!.push({ to: p.itemA, premise: p });
    }

    const queue: { node: string, path: Premise[] }[] = [{ node: itemA, path: [] }];
    const visited = new Set([itemA]);

    while (queue.length > 0) {
        const { node, path } = queue.shift()!;
        if (node === itemB) return path;

        const neighbors = adj.get(node) || [];
        for (const { to, premise } of neighbors) {
            if (!visited.has(to)) {
                visited.add(to);
                queue.push({ node: to, path: [...path, premise] });
            }
        }
    }
    return null;
}

function getExplanation(itemA: string, itemB: string, premises: Premise[], isTrue: boolean, actualDirection: string | null, statedDirection: string): string {
    const path = getShortestPath(itemA, itemB, premises);
    if (!path) return "No direct logical connection found.";

    let explanation = "Reasoning chain: ";
    let currentItem = itemA;
    
    for (const p of path) {
        if (p.itemA === currentItem) {
            explanation += `${p.itemA} is ${p.direction} ${p.itemB}. `;
            currentItem = p.itemB;
        } else {
            // We need to invert the direction
            // For simplicity, we just state the premise as is
            explanation += `${p.itemA} is ${p.direction} ${p.itemB}. `;
            currentItem = p.itemA;
        }
    }

    if (isTrue) {
        explanation += `Therefore, ${itemA} is indeed ${statedDirection} ${itemB}.`;
    } else {
        explanation += `Therefore, ${itemA} is actually ${actualDirection || 'not in that relationship'} ${itemB}, not ${statedDirection}.`;
    }
    return explanation;
}

type DimensionState = 'truthy' | 'tricky' | 'falsy';

function pickDimensionState(): DimensionState {
    const rand = Math.random();
    if (rand < 0.6) return 'truthy';
    if (rand < 0.9) return 'tricky';
    return 'falsy';
}

function getDimensionValue(actualValue: number, state: DimensionState): number {
    switch (state) {
        case 'truthy': return actualValue;
        case 'tricky': return -actualValue;
        case 'falsy': return -actualValue; // For binary, tricky and falsy are same. For spatial, we handle differently.
        default: return actualValue;
    }
}

function generateTrueConclusion(itemA: string, itemB: string, actualDirection: string): Conclusion {
    return { itemA, direction: actualDirection, itemB };
}

function generateSophisticatedFalseConclusion(itemA: string, itemB: string, vec: Vector, actualDirection: string, mode: Settings['relationMode'], directions: { name: string, vector: Vector }[]): Conclusion {
    const multiDimModes: Settings['relationMode'][] = [
        'spatial_temporal', 'spatial_vertical', 'spatial_temporal_vertical', 
        'spatial_temporal_vertical_size', 'spatial_temporal_vertical_size_hierarchy'
    ];

    if (multiDimModes.includes(mode)) {
        // Sophisticated: Spatial is correct, but other dimensions have interference
        let attempts = 0;
        while (attempts < 20) {
            const falseVec = [...vec];
            let changed = false;
            
            // Indices 2+ are extra dimensions
            for (let i = 2; i < falseVec.length; i++) {
                const state = pickDimensionState();
                if (state !== 'truthy') {
                    falseVec[i] = getDimensionValue(vec[i], state);
                    changed = true;
                }
            }
            
            // Force at least one change if none occurred
            if (!changed && falseVec.length > 2) {
                const idx = Math.floor(Math.random() * (falseVec.length - 2)) + 2;
                falseVec[idx] = -vec[idx];
                changed = true;
            }
            
            if (changed) {
                const falseDirName = getDirectionFromVector(falseVec, mode);
                if (falseDirName && falseDirName !== actualDirection) {
                    return { itemA, direction: falseDirName, itemB };
                }
            }
            attempts++;
        }
    }

    // Fallback for single dim or if multi-dim logic failed: use opposite or random different
    const oppositeVec = vec.map(v => -v);
    const oppositeDir = getDirectionFromVector(oppositeVec, mode);
    if (oppositeDir && oppositeDir !== actualDirection) {
        return { itemA, direction: oppositeDir, itemB };
    }
    
    const allDirs = directions.map(d => d.name).filter(d => d !== actualDirection);
    return { itemA, direction: shuffle(allDirs)[0] || directions[0].name, itemB };
}

function generateObviousFalseConclusion(itemA: string, itemB: string, vec: Vector, actualDirection: string, mode: Settings['relationMode'], directions: { name: string, vector: Vector }[]): Conclusion {
    const allDirs = directions.map(d => d.name);
    
    if (mode === 'spatial' || mode.startsWith('spatial_')) {
        // Obvious: Spatial part is wrong (indices 0 and 1)
        const obviousDirs = directions.filter(d => {
            return d.vector[0] !== vec[0] || d.vector[1] !== vec[1];
        }).map(d => d.name);
        
        if (obviousDirs.length > 0) {
            return { itemA, direction: shuffle(obviousDirs)[0], itemB };
        }
    }
    
    // For non-spatial or fallback: pick something that is not the actual and not the opposite
    const oppositeVec = vec.map(v => -v);
    const oppositeDir = getDirectionFromVector(oppositeVec, mode);
    const randomDirs = allDirs.filter(d => d !== actualDirection && d !== oppositeDir);
    
    return { itemA, direction: shuffle(randomDirs.length > 0 ? randomDirs : allDirs.filter(d => d !== actualDirection))[0] || allDirs[0], itemB };
}

function createConclusion(nodes: string[], coordinates: Map<string, Vector>, premises: Premise[], lastPremise: Premise | null = null, targetIsTrueProb: number = 0.5, mode: Settings['relationMode'] = 'spatial', interferenceRatio: number = 2): { statement: Conclusion, isTrue: boolean, difficulty: number, explanation: string } {
    let statement: Conclusion | undefined;
    let isTrue: boolean = false;
    let actualDirection: string | null = null;
    const directions = getDirectionsForMode(mode);

    let attempts = 0;
    while (attempts < 100) {
        const shuffledNodes = shuffle(nodes);
        const itemA = shuffledNodes[0];
        // If the first two items are the same as the last premise, pick the third item instead (if available)
        // to avoid "looping" for this specific check.
        const itemB = (areItemsSameAsPremise(itemA, shuffledNodes[1], lastPremise) && nodes.length > 2)
            ? shuffledNodes[2]
            : shuffledNodes[1];
        
        const path = getShortestPath(itemA, itemB, premises);
        if (!path) {
            attempts++;
            continue;
        }

        const coordA = coordinates.get(itemA)!;
        const coordB = coordinates.get(itemB)!;
        const vec: Vector = coordA.map((v, i) => v - coordB[i]);
        actualDirection = getDirectionFromVector(vec, mode);
        
        if (!actualDirection) {
            attempts++;
            continue;
        }

        const rand = Math.random();
        let type: 'true' | 'sophisticated' | 'obvious';
        
        if (rand < targetIsTrueProb) {
            statement = generateTrueConclusion(itemA, itemB, actualDirection);
            isTrue = true;
            type = 'true';
        } else {
            // False: Weight between Sophisticated and Obvious using interferenceRatio
            const sophisticatedProb = (interferenceRatio / 5) * 0.9;
            if (Math.random() < sophisticatedProb) {
                statement = generateSophisticatedFalseConclusion(itemA, itemB, vec, actualDirection, mode, directions);
                type = 'sophisticated';
            } else {
                statement = generateObviousFalseConclusion(itemA, itemB, vec, actualDirection, mode, directions);
                type = 'obvious';
            }
            isTrue = false;
        }

        if (nodes.length <= 2) break;
        break;
    }
    
    // Fallback if loop failed to find a valid statement
    if (!statement) {
        // Try to find ANY connected pair that doesn't use the same items as the last premise
        let found = false;
        const shuffledA = shuffle(nodes);
        for (const a of shuffledA) {
            const shuffledB = shuffle(nodes);
            for (const b of shuffledB) {
                if (a === b) continue;
                
                // Check if this pair is the same as the last premise
                if (areItemsSameAsPremise(a, b, lastPremise) && nodes.length > 2) continue;

                const path = getShortestPath(a, b, premises);
                if (path) {
                    const vec = coordinates.get(a)!.map((v, i) => v - coordinates.get(b)![i]);
                    actualDirection = getDirectionFromVector(vec, mode);
                    if (actualDirection) {
                        statement = { itemA: a, direction: actualDirection, itemB: b };
                        isTrue = true;
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
        }
        
        // Absolute fallback (should not happen in normal play)
        if (!statement) {
            const [itemA, itemB] = nodes.slice(0, 2);
            const vec = coordinates.get(itemA)!.map((v, i) => v - coordinates.get(itemB)![i]);
            actualDirection = getDirectionFromVector(vec, mode) || directions[0].name;
            statement = { itemA, direction: actualDirection, itemB };
            isTrue = true;
        }
    }
    
    const path = getShortestPath(statement.itemA, statement.itemB, premises);
    const difficulty = path ? path.length : 1;
    const explanation = getExplanation(statement.itemA, statement.itemB, premises, isTrue, actualDirection, statement.direction);

    return { statement, isTrue, difficulty, explanation };
}

function generateTrueAnalogy(nodes: string[], coordinates: Map<string, Vector>, lastPremise: Premise | null, premises: Premise[]): Analogy | null {
    const vectors: Map<string, [string, string][]> = new Map();
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i === j) continue;
            const itemA = nodes[i];
            const itemB = nodes[j];
            const coordA = coordinates.get(itemA)!;
            const coordB = coordinates.get(itemB)!;
            const vec: Vector = coordA.map((v, i) => v - coordB[i]);
            const vecKey = vec.toString();
            if (!vectors.has(vecKey)) vectors.set(vecKey, []);
            vectors.get(vecKey)!.push([itemA, itemB]);
        }
    }
    
    const validPairs = Array.from(vectors.values()).filter(v => v.length >= 2);
    if (validPairs.length === 0) return null;

    let attempts = 0;
    while (attempts < 50) {
        const pairSet = shuffle(validPairs)[0];
        const [[itemA1, itemB1], [itemA2, itemB2]] = shuffle(pairSet).slice(0, 2);
        const analogy = { itemA1, itemB1, itemA2, itemB2 };
        
        // Check connectivity for both pairs
        if (getShortestPath(itemA1, itemB1, premises) && getShortestPath(itemA2, itemB2, premises)) {
            return analogy;
        }
        attempts++;
    }
    return null;
}

function generateSophisticatedFalseAnalogy(nodes: string[], coordinates: Map<string, Vector>, lastPremise: Premise | null, premises: Premise[]): Analogy | null {
    // Sophisticated: Spatial part matches, but extra dimensions differ
    let attempts = 0;
    while (attempts < 100) {
        const [itemA1, itemB1, itemA2, itemB2] = shuffle(nodes).slice(0, 4);
        
        // Check connectivity
        if (!getShortestPath(itemA1, itemB1, premises) || !getShortestPath(itemA2, itemB2, premises)) {
            attempts++;
            continue;
        }

        const coordA1 = coordinates.get(itemA1)!;
        const coordB1 = coordinates.get(itemB1)!;
        const coordA2 = coordinates.get(itemA2)!;
        const coordB2 = coordinates.get(itemB2)!;
        const vec1 = coordA1.map((v, i) => v - coordB1[i]);
        const vec2 = coordA2.map((v, i) => v - coordB2[i]);

        // Check if spatial part (indices 0, 1) matches but overall vector doesn't
        if (vec1.length > 2 && vec1[0] === vec2[0] && vec1[1] === vec2[1]) {
            if (vec1.some((v, i) => v !== vec2[i])) {
                return { itemA1, itemB1, itemA2, itemB2 };
            }
        }
        attempts++;
    }
    return null;
}

function generateObviousFalseAnalogy(nodes: string[], coordinates: Map<string, Vector>, lastPremise: Premise | null, premises: Premise[]): Analogy {
    let attempts = 0;
    while (attempts < 100) {
        const [itemA1, itemB1, itemA2, itemB2] = shuffle(nodes).slice(0, 4);

        // Check connectivity
        if (!getShortestPath(itemA1, itemB1, premises) || !getShortestPath(itemA2, itemB2, premises)) {
            attempts++;
            continue;
        }

        const coordA1 = coordinates.get(itemA1)!;
        const coordB1 = coordinates.get(itemB1)!;
        const coordA2 = coordinates.get(itemA2)!;
        const coordB2 = coordinates.get(itemB2)!;
        const vec1 = coordA1.map((v, i) => v - coordB1[i]);
        const vec2 = coordA2.map((v, i) => v - coordB2[i]);

        // Obvious: Spatial part is different
        if (vec1[0] !== vec2[0] || vec1[1] !== vec2[1]) {
            return { itemA1, itemB1, itemA2, itemB2 };
        }
        attempts++;
    }
    // Absolute fallback
    const [itemA1, itemB1, itemA2, itemB2] = nodes.slice(0, 4);
    return { itemA1, itemB1, itemA2, itemB2 };
}

function createAnalogy(nodes: string[], coordinates: Map<string, Vector>, premises: Premise[], lastPremise: Premise | null = null, targetIsTrueProb: number = 0.5, interferenceRatio: number = 2): { statement: Analogy, isTrue: boolean, difficulty: number, explanation: string } {
    let statement: Analogy | null = null;
    let isTrue: boolean = false;

    const rand = Math.random();
    if (rand < targetIsTrueProb) {
        statement = generateTrueAnalogy(nodes, coordinates, lastPremise, premises);
        if (statement) {
            isTrue = true;
        } else {
            // If we wanted a true one but couldn't find it, try to find a false one but keep the target probability logic
            // In practice, we should almost always find a true one if nodes >= 4
            statement = generateSophisticatedFalseAnalogy(nodes, coordinates, lastPremise, premises) || generateObviousFalseAnalogy(nodes, coordinates, lastPremise, premises);
            isTrue = false;
        }
    } else {
        // False: Weight between Sophisticated and Obvious using interferenceRatio
        const sophisticatedProb = (interferenceRatio / 5) * 0.9;
        if (Math.random() < sophisticatedProb) {
            statement = generateSophisticatedFalseAnalogy(nodes, coordinates, lastPremise, premises);
        }
        
        if (!statement) {
            statement = generateObviousFalseAnalogy(nodes, coordinates, lastPremise, premises);
        }
        isTrue = false;
    }

    const path1 = getShortestPath(statement.itemA1, statement.itemB1, premises);
    const path2 = getShortestPath(statement.itemA2, statement.itemB2, premises);
    const difficulty = (path1?.length || 1) + (path2?.length || 1);
    const explanation = isTrue 
        ? `The relationship between ${statement.itemA1} and ${statement.itemB1} is identical to the relationship between ${statement.itemA2} and ${statement.itemB2}.`
        : `The relationship between ${statement.itemA1} and ${statement.itemB1} is different from the relationship between ${statement.itemA2} and ${statement.itemB2}.`;

    return { statement, isTrue, difficulty, explanation };
}

const getChallenge = (
    nodes: string[], 
    coordinates: Map<string, Vector>, 
    premises: Premise[],
    challengeType: Settings['challengeType'], 
    lastPremise: Premise | null = null,
    targetIsTrueProb: number = 0.5,
    relationMode: Settings['relationMode'] = 'spatial',
    interferenceRatio: number = 2
 ): Challenge => {
    
    let useAnalogy = false;
    if (challengeType === 'analogies') {
        useAnalogy = true;
    } else if (challengeType === 'mixed') {
        useAnalogy = Math.random() < 0.5;
    }

    if (useAnalogy && nodes.length >= 4) {
        const { statement, isTrue, difficulty, explanation } = createAnalogy(nodes, coordinates, premises, lastPremise, targetIsTrueProb, interferenceRatio);
        return { type: 'analogy', statement, isTrue, difficulty, explanation };
    } else {
        const { statement, isTrue, difficulty, explanation } = createConclusion(nodes, coordinates, premises, lastPremise, targetIsTrueProb, relationMode, interferenceRatio);
        return { type: 'conclusion', statement, isTrue, difficulty, explanation };
    }
};


export const generateInitialPuzzle = (
    numNodes: number = 5, 
    challengeType: Settings['challengeType'] = 'mixed', 
    wordLength: number = 3, 
    targetIsTrueProb: number = 0.5,
    relationMode: Settings['relationMode'] = 'spatial',
    stimuliType: Settings['stimuliType'] = 'words',
    interferenceRatio: number = 2
): { premises: Premise[], challenge: Challenge, coordinates: Map<string, Vector>, nodes: string[] } => {
    const words = new Set<string>();
    while (words.size < numNodes) {
        words.add(generateStimulus(stimuliType, wordLength));
    }
    const puzzleNodes = Array.from(words);
    
    const coordinates: Map<string, Vector> = new Map();
    const premises: Premise[] = [];
    const directions = getDirectionsForMode(relationMode);
    
    const firstDir = directions[0].vector;
    const initialCoord = new Array(firstDir.length).fill(0);
    coordinates.set(puzzleNodes[0], initialCoord);
    const placedNodes = new Set([puzzleNodes[0]]);
    const unplacedNodes = puzzleNodes.slice(1);

    while (unplacedNodes.length > 0) {
        const nodeToPlace = unplacedNodes.shift()!;
        const referenceNode = shuffle(Array.from(placedNodes))[0];
        const refCoords = coordinates.get(referenceNode)!;
        let newCoords: Vector, direction: string;
        let attempts = 0;
        do {
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            direction = randomDir.name;
            newCoords = refCoords.map((v, i) => v + randomDir.vector[i]);
            attempts++;
            // If we're stuck (especially in 1D modes), try a different reference node
            if (attempts > 20) {
                const altRef = shuffle(Array.from(placedNodes))[0];
                const altCoords = coordinates.get(altRef)!;
                const altDir = directions[Math.floor(Math.random() * directions.length)];
                direction = altDir.name;
                newCoords = altCoords.map((v, i) => v + altDir.vector[i]);
            }
        } while (Array.from(coordinates.values()).some(c => c.length === newCoords.length && c.every((v, i) => v === newCoords[i])));
        coordinates.set(nodeToPlace, newCoords);
        placedNodes.add(nodeToPlace);
        premises.push({ itemA: nodeToPlace, direction, itemB: referenceNode });
    }

    const lastInitialPremise = premises.length > 0 ? premises[premises.length - 1] : null;
    const challenge = getChallenge(puzzleNodes, coordinates, premises, challengeType, lastInitialPremise, targetIsTrueProb, relationMode, interferenceRatio);
    return { premises, challenge, coordinates, nodes: puzzleNodes };
};

export const advancePuzzle = (
    currentNodes: string[], 
    currentCoords: Map<string, Vector>, 
    currentPremises: Premise[],
    challengeType: Settings['challengeType'] = 'mixed', 
    wordLength: number = 3, 
    targetIsTrueProb: number = 0.5,
    relationMode: Settings['relationMode'] = 'spatial',
    stimuliType: Settings['stimuliType'] = 'words',
    interferenceRatio: number = 2
) => {
    const nodes = [...currentNodes];
    const coordinates = new Map(currentCoords);
    const directions = getDirectionsForMode(relationMode);

    const oldestNode = nodes.shift()!;
    // We keep the coordinates for ghost nodes to maintain logical connections
    // coordinates.delete(oldestNode); 

    let newNode: string;
    do {
        newNode = generateStimulus(stimuliType, wordLength);
    } while (nodes.includes(newNode) || newNode === oldestNode);

    const referenceNode = shuffle(nodes)[0];
    const refCoords = coordinates.get(referenceNode)!;
    let newCoords: Vector, direction: string;
    let attempts = 0;
    do {
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        direction = randomDir.name;
        newCoords = refCoords.map((v, i) => v + randomDir.vector[i]);
        attempts++;
        if (attempts > 20) {
            const altRef = shuffle(nodes)[0];
            const altCoords = coordinates.get(altRef)!;
            const altDir = directions[Math.floor(Math.random() * directions.length)];
            direction = altDir.name;
            newCoords = altCoords.map((v, i) => v + altDir.vector[i]);
        }
    } while (Array.from(coordinates.values()).some(c => c.length === newCoords.length && c.every((v, i) => v === newCoords[i])));

    const newPremise: Premise = { itemA: newNode, direction, itemB: referenceNode };
    nodes.push(newNode);
    coordinates.set(newNode, newCoords);

    // We keep all premises to maintain logical connections through "ghost" nodes
    const updatedPremises = [...currentPremises, newPremise];

    const newChallenge = getChallenge(nodes, coordinates, updatedPremises, challengeType, newPremise, targetIsTrueProb, relationMode, interferenceRatio);

    return { newPremise, newChallenge, updatedNodes: nodes, updatedCoordinates: coordinates, updatedPremises, oldestNode };
};
