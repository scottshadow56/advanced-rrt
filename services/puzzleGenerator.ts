
import type { Premise, Conclusion, Vector, Analogy, Challenge, Settings } from '../types';

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
const SPATIAL_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "North of", vector: [0, 1, 0, 0, 0, 0] }, { name: "South of", vector: [0, -1, 0, 0, 0, 0] },
    { name: "East of", vector: [1, 0, 0, 0, 0, 0] }, { name: "West of", vector: [-1, 0, 0, 0, 0, 0] },
    { name: "North-East of", vector: [1, 1, 0, 0, 0, 0] }, { name: "South-East of", vector: [1, -1, 0, 0, 0, 0] },
    { name: "North-West of", vector: [-1, 1, 0, 0, 0, 0] }, { name: "South-West of", vector: [-1, -1, 0, 0, 0, 0] },
];

const VERTICAL_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "Above", vector: [0, 0, 1, 0, 0, 0] }, { name: "Below", vector: [0, 0, -1, 0, 0, 0] },
];

const COMPARISON_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "Greater than", vector: [0, 0, 0, 0, 1, 0] }, { name: "Less than", vector: [0, 0, 0, 0, -1, 0] },
];

const TEMPORAL_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "After", vector: [0, 0, 0, 1, 0, 0] }, { name: "Before", vector: [0, 0, 0, -1, 0, 0] },
];

const DISTINCTION_DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "the Same as", vector: [0, 0, 0, 0, 0, 0] }, { name: "the Opposite of", vector: [0, 0, 0, 0, 0, 1] },
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
            res.push({ 
                name: `${sName} and ${tName}`, 
                vector: [(sVec as number[])[0], (sVec as number[])[1], 0, (tVec as number[])[0], 0, 0] 
            });
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
            res.push({ 
                name: `${sName} and ${vName}`, 
                vector: [(sVec as number[])[0], (sVec as number[])[1], (vVec as number[])[0], 0, 0, 0] 
            });
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
                    vector: [(sVec as number[])[0], (sVec as number[])[1], (vVec as number[])[0], (tVec as number[])[0], 0, 0] 
                });
            }
        }
    }
    return res;
})();

const SPATIAL_TEMPORAL_VERTICAL_RELEVANCE_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
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
    const relevance = [
        ["More relevant than", [1]], ["Less relevant than", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [tName, tVec] of temporal) {
            for (const [vName, vVec] of vertical) {
                for (const [relName, relVec] of relevance) {
                    res.push({ 
                        name: `${sName} and ${vName} and ${tName} and ${relName}`, 
                        vector: [(sVec as number[])[0], (sVec as number[])[1], (vVec as number[])[0], (tVec as number[])[0], (relVec as number[])[0], 0] 
                    });
                }
            }
        }
    }
    return res;
})();

const SPATIAL_TEMPORAL_VERTICAL_RELEVANCE_HIERARCHY_DIRECTIONS: { name: string, vector: Vector }[] = (() => {
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
    const relevance = [
        ["More relevant than", [1]], ["Less relevant than", [-1]]
    ];
    const hierarchy = [
        ["Hierarchically Above", [1]], ["Hierarchically Below", [-1]]
    ];
    const res: { name: string, vector: Vector }[] = [];
    for (const [sName, sVec] of spatial) {
        for (const [tName, tVec] of temporal) {
            for (const [vName, vVec] of vertical) {
                for (const [relName, relVec] of relevance) {
                    for (const [hName, hVec] of hierarchy) {
                        res.push({ 
                            name: `${sName} and ${vName} and ${tName} and ${relName} and ${hName}`, 
                            vector: [(sVec as number[])[0], (sVec as number[])[1], (vVec as number[])[0], (tVec as number[])[0], (relVec as number[])[0], (hVec as number[])[0]] 
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
        case 'spatial_temporal_vertical_relevance': return SPATIAL_TEMPORAL_VERTICAL_RELEVANCE_DIRECTIONS;
        case 'spatial_temporal_vertical_relevance_hierarchy': return SPATIAL_TEMPORAL_VERTICAL_RELEVANCE_HIERARCHY_DIRECTIONS;
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
    if (directions.length === 0) return null;
    const targetLen = directions[0].vector.length;
    const normalizedVec = vec.slice(0, targetLen).map(v => Math.sign(v));
    
    for (const dir of directions) {
        if (dir.vector.length === normalizedVec.length && dir.vector.every((v, i) => v === normalizedVec[i])) {
            return dir.name;
        }
    }
    return null;
}

function areItemsSameAsPremise(itemA: string, itemB: string, premise: Premise | null): boolean {
    if (!premise) return false;
    const items = [itemA, itemB].sort();
    const premiseItems = [premise.itemA, premise.itemB].sort();
    console.log(items, premiseItems);
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

function createConclusion(nodes: string[], coordinates: Map<string, Vector>, premises: Premise[], lastPremise: Premise | null = null, targetIsTrueProb: number = 0.5, mode: Settings['relationMode'] = 'spatial', interferenceRatio: number = 2, recentPairs: string[][] = [], activePreference: number = 0.9, offset: number = 3): { statement: Conclusion, isTrue: boolean, difficulty: number, explanation: string, highlightNodes: string[] } {
    // 1. Decide if it will be true or false (target 50%)
    const isTrue = Math.random() < targetIsTrueProb;

    // 2. Select items: Newest vs Oldest relative to offset
    const newestIdx = nodes.length - 1;
    // User definition: oldest item index = lastIndex - (n - 1)
    const oldestIdxInWindow = Math.max(0, newestIdx - (offset - 1));
    
    let itemA = nodes[newestIdx];
    let itemB = nodes[oldestIdxInWindow];

    // Fallback if needed
    if (!itemA || !itemB || itemA === itemB) {
        const shuffled = shuffle(Array.from(new Set(premises.flatMap(p => [p.itemA, p.itemB]))));
        itemA = shuffled[0] || nodes[nodes.length - 1];
        itemB = shuffled[1] || nodes[Math.max(0, nodes.length - 2)];
    }

    // 3. Matrix Operation: coordA - coordB
    const coordA = coordinates.get(itemA)!;
    const coordB = coordinates.get(itemB)!;
    const actualVec: Vector = coordA.map((v, i) => v - coordB[i]);
    const actualDirection = getDirectionFromVector(actualVec, mode) || "the same location";

    // 4. Scramble if false
    let presentedDirection = actualDirection;
    if (!isTrue) {
        const directions = getDirectionsForMode(mode);
        const targetLen = directions[0].vector.length;
        const normalizedActual = actualVec.slice(0, targetLen).map(v => Math.sign(v));
        
        let attempts = 0;
        let foundFalse = false;
        while (attempts < 15) {
            const scrambledVec = [...normalizedActual];
            // Matrix scrambling logic: invert signs or shift 0s
            const numToChange = Math.max(1, Math.floor(Math.random() * 2) + (interferenceRatio > 3 ? 1 : 0));
            const indices = shuffle(Array.from({length: scrambledVec.length}, (_, i) => i));
            
            for (let i = 0; i < Math.min(numToChange, scrambledVec.length); i++) {
                const idx = indices[i];
                if (scrambledVec[idx] === 0) {
                    scrambledVec[idx] = Math.random() < 0.5 ? 1 : -1;
                } else if (Math.random() < 0.7) {
                    scrambledVec[idx] = -scrambledVec[idx]; // Matrix Inversion
                } else {
                    scrambledVec[idx] = 0; // Matrix Nullification
                }
            }
            
            const newDir = getDirectionFromVector(scrambledVec, mode);
            if (newDir && newDir !== actualDirection) {
                presentedDirection = newDir;
                foundFalse = true;
                break;
            }
            attempts++;
        }
        
        if (!foundFalse) {
            const others = directions.filter(d => d.name !== actualDirection);
            presentedDirection = others.length > 0 ? shuffle(others)[0].name : actualDirection;
        }
    }

    // 5. Final check for edge case where scrambling accidentally lands on truth
    const finalIsTrue = presentedDirection === actualDirection;

    const statement: Conclusion = { itemA, direction: presentedDirection, itemB };
    const path = getShortestPath(itemA, itemB, premises);
    const difficulty = path ? path.length : 1;
    const explanation = getExplanation(itemA, itemB, premises, finalIsTrue, actualDirection, presentedDirection);

    return { statement, isTrue: finalIsTrue, difficulty, explanation, highlightNodes: [itemA, itemB] };
}

function createAnalogy(nodes: string[], coordinates: Map<string, Vector>, premises: Premise[], lastPremise: Premise | null = null, targetIsTrueProb: number = 0.5, interferenceRatio: number = 2, recentPairs: string[][] = [], activePreference: number = 0.9, offset: number = 3): { statement: Analogy, isTrue: boolean, difficulty: number, explanation: string, highlightNodes: string[] } {
    // 1. Decide if it will be true or false (target 50%)
    const isTrue = Math.random() < targetIsTrueProb;

    // 2. Select items using Window + (OldestIndex - 1)
    const lastIdx = nodes.length - 1;
    const oldestIdx = Math.max(0, lastIdx - (offset - 1));
    const shelfIdx = Math.max(0, oldestIdx - 1); // "Right next to the oldest item = oldest item index - 1"
    
    // We expand the candidate list to include the shelf item
    const candidateNodes = nodes.slice(shelfIdx);
    const newest = nodes[lastIdx];
    const allItems = Array.from(new Set(premises.flatMap(p => [p.itemA, p.itemB])));

    const getVec = (a: string, b: string) => {
        const cA = coordinates.get(a)!;
        const cB = coordinates.get(b)!;
        return cA.map((v, i) => Math.sign(v - cB[i]));
    };

    let statement: Analogy | null = null;

    if (isTrue) {
        // Attempt to find matching vectors in history
        const vectors: Map<string, [string, string][]> = new Map();
        for (let i = 0; i < allItems.length; i++) {
            for (let j = 0; j < allItems.length; j++) {
                if (i === j) continue;
                const v = getVec(allItems[i], allItems[j]);
                if (v.every(val => val === 0)) continue;
                const key = v.toString();
                if (!vectors.has(key)) vectors.set(key, []);
                vectors.get(key)!.push([allItems[i], allItems[j]]);
            }
        }

        // Try newest vs oldestIdx first, then newest vs shelfIdx
        const targets = [nodes[oldestIdx], nodes[shelfIdx]].filter(n => n && n !== newest);
        for (const target of targets) {
            const vKey = getVec(newest, target).toString();
            const matches = vectors.get(vKey) || [];
            const others = matches.filter(p => !((p[0] === newest && p[1] === target) || (p[0] === target && p[1] === newest)));
            if (others.length > 0) {
                const pair2 = shuffle(others)[0];
                statement = { itemA1: newest, itemB1: target, itemA2: pair2[0], itemB2: pair2[1] };
                break;
            }
        }
    }

    // 4. Scramble/Analogy completion if true matching failed or we want false
    if (!statement) {
        const itemA1 = newest;
        const itemB1 = nodes[oldestIdx] || allItems[0];
        
        // Pick pair 2 from the previous history or window
        const others = shuffle(allItems.filter(i => i !== itemA1 && i !== itemB1));
        if (others.length >= 2) {
            const [itemA2, itemB2] = others.slice(0, 2);
            statement = { itemA1, itemB1, itemA2, itemB2 };
        } else {
             // Super fallback for new puzzles
            statement = { itemA1, itemB1, itemA2: itemA1, itemB2: itemB1 }; 
        }
    }

    const vec1 = getVec(statement.itemA1, statement.itemB1);
    const vec2 = getVec(statement.itemA2, statement.itemB2);
    const finalIsTrue = vec1.toString() === vec2.toString();

    const explanation = finalIsTrue
        ? `The relationship between ${statement.itemA1} and ${statement.itemB1} is identical to the relationship between ${statement.itemA2} and ${statement.itemB2}.`
        : `The relationship between ${statement.itemA1} and ${statement.itemB1} is different from the relationship between ${statement.itemA2} and ${statement.itemB2}.`;

    return { statement, isTrue: finalIsTrue, difficulty: 2, explanation, highlightNodes: [statement.itemA1, statement.itemB1, statement.itemA2, statement.itemB2] };
}

const getChallenge = (
    nodes: string[], 
    coordinates: Map<string, Vector>, 
    premises: Premise[],
    challengeType: Settings['challengeType'], 
    lastPremise: Premise | null = null,
    targetIsTrueProb: number = 0.5,
    relationMode: Settings['relationMode'] = 'spatial',
    interferenceRatio: number = 2,
    recentPairs: string[][] = [],
    offset: number = 3
 ): Challenge => {
    
    let useAnalogy = false;
    if (challengeType === 'analogies') {
        useAnalogy = true;
    } else if (challengeType === 'mixed') {
        useAnalogy = Math.random() < 0.5;
    }

    const activePreference = (challengeType === 'mixed' && nodes.length === 3) ? 0.7 : 0.9;

    const allItems = Array.from(new Set(premises.flatMap(p => [p.itemA, p.itemB])));
    if (useAnalogy && allItems.length >= 4) {
        const { statement, isTrue, difficulty, explanation, highlightNodes } = createAnalogy(nodes, coordinates, premises, lastPremise, targetIsTrueProb, interferenceRatio, recentPairs, activePreference, offset);
        return { type: 'analogy', statement, isTrue, difficulty, explanation, highlightNodes };
    } else {
        const { statement, isTrue, difficulty, explanation, highlightNodes } = createConclusion(nodes, coordinates, premises, lastPremise, targetIsTrueProb, relationMode, interferenceRatio, recentPairs, activePreference, offset);
        return { type: 'conclusion', statement, isTrue, difficulty, explanation, highlightNodes };
    }
}


export const generateInitialPuzzle = (
    numNodes: number = 5, 
    challengeType: Settings['challengeType'] = 'mixed', 
    wordLength: number = 3, 
    targetIsTrueProb: number = 0.5,
    relationMode: Settings['relationMode'] = 'spatial',
    stimuliType: Settings['stimuliType'] = 'words',
    interferenceRatio: number = 2,
    recentPairs: string[][] = []
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
        const nodeIdx = puzzleNodes.indexOf(nodeToPlace);
        const futureTargetIdx = Math.max(0, nodeIdx - (numNodes - 1));
        const futureTargetNode = puzzleNodes[futureTargetIdx];

        // Pick from already placed nodes, but avoid the one that will be its transitive target
        const candidates = Array.from(placedNodes).filter(n => n !== futureTargetNode || nodeIdx < (numNodes - 1));
        const referenceNode = shuffle(candidates)[0] || puzzleNodes[nodeIdx - 1];
        
        const refCoords = coordinates.get(referenceNode)!;
        let newCoords: Vector, direction: string;
        let attempts = 0;
        do {
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            direction = randomDir.name;
            newCoords = refCoords.map((v, i) => v + randomDir.vector[i]);
            attempts++;
            if (attempts > 20) {
                const altRef = shuffle(Array.from(placedNodes))[0];
                const altCoords = coordinates.get(altRef)!;
                const altDir = directions[Math.floor(Math.random() * directions.length)];
                direction = altDir.name;
                newCoords = altCoords.map((v, i) => v + altDir.vector[i]);
                break;
            }
        } while (false); 
        coordinates.set(nodeToPlace, newCoords);
        placedNodes.add(nodeToPlace);
        premises.push({ itemA: nodeToPlace, direction, itemB: referenceNode });
    }

    const lastInitialPremise = premises.length > 0 ? premises[premises.length - 1] : null;

    // Keep original order: first created at index 0, last created at end
    const orderedNodes = [...puzzleNodes];
    
    const challenge = getChallenge(orderedNodes, coordinates, premises, challengeType, lastInitialPremise, targetIsTrueProb, relationMode, interferenceRatio, recentPairs, numNodes);
    return { premises, challenge, coordinates, nodes: orderedNodes };
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
    interferenceRatio: number = 2,
    recentPairs: string[][] = [],
    offset: number = 3
) => {
    const nodes = [...currentNodes];
    const coordinates = new Map(currentCoords);
    const directions = getDirectionsForMode(relationMode);

    // Oldest node was at the end in the new unshift/pop logic
    // but the user said "the list should keep track of the entire elements thus far"
    // so maybe I should NOT shift/pop if it keep track of "entire elements thus far".
    // "but it should have pointers that are pointing at the beginning of the list... offset by n"
    
    // If we keep EVERYTHING, nodes just grows at the front.
    // The "oldest" for removal (if we were to remove) would be from the end.
    // However, if we keep track of everything, we don't necessarily need to remove.
    // But let's see if we should still return an 'oldestNode' for animation?
    // In App.tsx, oldestNode is used for something?
    
    let removedNode: string | null = null;
    if (nodes.length > 30) { 
        removedNode = nodes.shift()!; // Remove oldest from front
    } else {
        removedNode = nodes[0]; 
    }

    let newNode: string;
    do {
        newNode = generateStimulus(stimuliType, wordLength);
    } while (nodes.includes(newNode));

    // Reference from the existing active pool (the LAST 'offset' items)
    const windowStart = Math.max(0, nodes.length - offset);
    // The target index for the NEXT round (after push) will be: current_nodes.length - (offset - 1)
    const futureTargetIdx = Math.max(0, nodes.length - (offset - 1));
    
    const activeNodes = nodes.slice(windowStart).filter((_, idx) => (idx + windowStart) !== futureTargetIdx);
    const referenceNode = shuffle(activeNodes)[0] || nodes[nodes.length - 1];
    const refCoords = coordinates.get(referenceNode)!;
    let newCoords: Vector, direction: string;
    let attempts = 0;
    do {
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        direction = randomDir.name;
        newCoords = refCoords.map((v, i) => v + randomDir.vector[i]);
        attempts++;
        if (attempts > 20) {
            const altRef = shuffle(activeNodes)[0] || nodes[nodes.length - 1];
            const altCoords = coordinates.get(altRef)!;
            const altDir = directions[Math.floor(Math.random() * directions.length)];
            direction = altDir.name;
            newCoords = altCoords.map((v, i) => v + altDir.vector[i]);
        }
    } while (false); 

    const newPremise: Premise = { itemA: newNode, direction, itemB: referenceNode };
    // New item at the end
    nodes.push(newNode);
    coordinates.set(newNode, newCoords);

    const updatedPremises = [...currentPremises, newPremise];
    const newChallenge = getChallenge(nodes, coordinates, updatedPremises, challengeType, newPremise, targetIsTrueProb, relationMode, interferenceRatio, recentPairs, offset);

    return { 
        newPremise, 
        newChallenge, 
        updatedNodes: nodes, 
        updatedCoordinates: coordinates, 
        updatedPremises, 
        oldestNode: removedNode 
    };
};
