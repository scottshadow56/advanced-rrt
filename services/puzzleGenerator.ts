
import type { Premise, Conclusion, Vector, Analogy, Challenge, Settings } from '../types';

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
const DIRECTIONS: { name: string, vector: Vector }[] = [
    { name: "North", vector: [0, 1] }, { name: "South", vector: [0, -1] },
    { name: "East", vector: [1, 0] }, { name: "West", vector: [-1, 0] },
    { name: "North-East", vector: [1, 1] }, { name: "South-East", vector: [1, -1] },
    { name: "North-West", vector: [-1, 1] }, { name: "South-West", vector: [-1, -1] },
];

function generateNonsenseWord(length: number): string {
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

function getDirectionFromVector(vec: Vector): string | null {
    for (const dir of DIRECTIONS) {
        if (dir.vector[0] === vec[0] && dir.vector[1] === vec[1]) {
            return dir.name;
        }
    }
    return null;
}

function usesSameItemsAsPremise(conclusion: Conclusion, premise: Premise | null): boolean {
    if (!premise) return false;
    const conclusionItems = [conclusion.itemA, conclusion.itemB].sort();
    const premiseItems = [premise.itemA, premise.itemB].sort();
    return conclusionItems[0] === premiseItems[0] && conclusionItems[1] === premiseItems[1];
}

function usesSameItemsAsPremiseForAnalogy(analogy: Analogy, premise: Premise | null): boolean {
    if (!premise) return false;
    const premiseItems = [premise.itemA, premise.itemB].sort();
    const analogyPair1 = [analogy.itemA1, analogy.itemB1].sort();
    if (analogyPair1[0] === premiseItems[0] && analogyPair1[1] === premiseItems[1]) {
        return true;
    }
    const analogyPair2 = [analogy.itemA2, analogy.itemB2].sort();
    if (analogyPair2[0] === premiseItems[0] && analogyPair2[1] === premiseItems[1]) {
        return true;
    }
    return false;
}

function createConclusion(nodes: string[], coordinates: Map<string, Vector>, lastPremise: Premise | null = null): { statement: Conclusion, isTrue: boolean } {
    let statement: Conclusion;
    let isTrue: boolean;

    do {
        // Since min items is 3, nodes will always have at least 2 elements to pick from.
        const [itemB, itemA] = shuffle(nodes).slice(0, 2);
        
        const vec: Vector = [coordinates.get(itemA)![0] - coordinates.get(itemB)![0], coordinates.get(itemA)![1] - coordinates.get(itemB)![1]];
        const actualDirection = getDirectionFromVector(vec);
        const shouldBeTrue = Math.random() > 0.4;
        
        if (shouldBeTrue && actualDirection) {
            statement = { itemA, direction: actualDirection, itemB };
            isTrue = true;
        } else {
            const allDirs = DIRECTIONS.map(d => d.name);
            const falseDirection = shuffle(allDirs).find(d => d !== actualDirection) || "North";
            statement = { itemA, direction: falseDirection, itemB };
            isTrue = false;
        }
    } while (usesSameItemsAsPremise(statement, lastPremise));
    
    return { statement, isTrue };
}

function createAnalogy(nodes: string[], coordinates: Map<string, Vector>, lastPremise: Premise | null = null): { statement: Analogy, isTrue: boolean } {
    let statement: Analogy;
    let isTrue: boolean;

    do {
        isTrue = Math.random() > 0.5;
        if (isTrue) {
            const vectors: Map<string, [string, string][]> = new Map();
            for (let i = 0; i < nodes.length; i++) {
                for (let j = 0; j < nodes.length; j++) {
                    if (i === j) continue;
                    const itemA = nodes[i];
                    const itemB = nodes[j];
                    const vec: Vector = [coordinates.get(itemA)![0] - coordinates.get(itemB)![0], coordinates.get(itemA)![1] - coordinates.get(itemB)![1]];
                    const vecKey = vec.toString();
                    if (!vectors.has(vecKey)) vectors.set(vecKey, []);
                    vectors.get(vecKey)!.push([itemA, itemB]);
                }
            }
            const validPairs = Array.from(vectors.values()).filter(v => v.length >= 2);
            
            if (validPairs.length > 0) {
                const pairSet = shuffle(validPairs)[0];
                const [[itemA1, itemB1], [itemA2, itemB2]] = shuffle(pairSet).slice(0, 2);
                statement = { itemA1, itemB1, itemA2, itemB2 };
            } else {
                 isTrue = false; // Cannot create a true analogy, force false
            }
        }
        
        if (!isTrue) {
             let [itemA1, itemB1, itemA2, itemB2] = shuffle(nodes).slice(0, 4);
             let vec1: Vector, vec2: Vector;
             do {
                 [itemA1, itemB1, itemA2, itemB2] = shuffle(nodes).slice(0, 4);
                 vec1 = [coordinates.get(itemA1)![0] - coordinates.get(itemB1)![0], coordinates.get(itemA1)![1] - coordinates.get(itemB1)![1]];
                 vec2 = [coordinates.get(itemA2)![0] - coordinates.get(itemB2)![0], coordinates.get(itemA2)![1] - coordinates.get(itemB2)![1]];
             } while (vec1[0] === vec2[0] && vec1[1] === vec2[1]);
             statement = { itemA1, itemB1, itemA2, itemB2 };
        }
    } while (usesSameItemsAsPremiseForAnalogy(statement!, lastPremise));

    return { statement: statement!, isTrue };
}

const getChallenge = (
    nodes: string[], 
    coordinates: Map<string, Vector>, 
    challengeType: Settings['challengeType'], 
    lastPremise: Premise | null = null
): Challenge => {
    
    let useAnalogy = false;
    if (challengeType === 'analogies') {
        useAnalogy = true;
    } else if (challengeType === 'mixed') {
        useAnalogy = Math.random() < 0.5;
    }

    if (useAnalogy && nodes.length >= 4) {
        const { statement, isTrue } = createAnalogy(nodes, coordinates, lastPremise);
        return { type: 'analogy', statement, isTrue };
    } else {
        const { statement, isTrue } = createConclusion(nodes, coordinates, lastPremise);
        return { type: 'conclusion', statement, isTrue };
    }
};


export const generateInitialPuzzle = (numNodes: number = 5, challengeType: Settings['challengeType'] = 'mixed', wordLength: number = 3): { premises: Premise[], challenge: Challenge, coordinates: Map<string, Vector>, nodes: string[] } => {
    const words = new Set<string>();
    while (words.size < numNodes) {
        words.add(generateNonsenseWord(wordLength));
    }
    const puzzleNodes = Array.from(words);
    
    const coordinates: Map<string, Vector> = new Map();
    const premises: Premise[] = [];
    
    coordinates.set(puzzleNodes[0], [0, 0]);
    const placedNodes = new Set([puzzleNodes[0]]);
    const unplacedNodes = puzzleNodes.slice(1);

    while (unplacedNodes.length > 0) {
        const nodeToPlace = unplacedNodes.shift()!;
        const referenceNode = shuffle(Array.from(placedNodes))[0];
        const refCoords = coordinates.get(referenceNode)!;
        let newCoords: Vector, direction: string;
        do {
            const randomDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            direction = randomDir.name;
            newCoords = [refCoords[0] + randomDir.vector[0], refCoords[1] + randomDir.vector[1]];
        } while (Array.from(coordinates.values()).some(c => c[0] === newCoords[0] && c[1] === newCoords[1]));
        coordinates.set(nodeToPlace, newCoords);
        placedNodes.add(nodeToPlace);
        premises.push({ itemA: nodeToPlace, direction, itemB: referenceNode });
    }

    const lastInitialPremise = premises.length > 0 ? premises[premises.length - 1] : null;
    const challenge = getChallenge(puzzleNodes, coordinates, challengeType, lastInitialPremise);
    return { premises, challenge, coordinates, nodes: puzzleNodes };
};

export const advancePuzzle = (currentNodes: string[], currentCoords: Map<string, Vector>, challengeType: Settings['challengeType'] = 'mixed', wordLength: number = 3) => {
    const nodes = [...currentNodes];
    const coordinates = new Map(currentCoords);

    const oldestNode = nodes.shift()!;
    coordinates.delete(oldestNode);

    let newNode: string;
    do {
        newNode = generateNonsenseWord(wordLength);
    } while (nodes.includes(newNode) || newNode === oldestNode);

    const referenceNode = shuffle(nodes)[0];
    const refCoords = coordinates.get(referenceNode)!;
    let newCoords: Vector, direction: string;
    do {
        const randomDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        direction = randomDir.name;
        newCoords = [refCoords[0] + randomDir.vector[0], refCoords[1] + randomDir.vector[1]];
    } while (Array.from(coordinates.values()).some(c => c[0] === newCoords[0] && c[1] === newCoords[1]));

    const newPremise: Premise = { itemA: newNode, direction, itemB: referenceNode };
    nodes.push(newNode);
    coordinates.set(newNode, newCoords);

    const newChallenge = getChallenge(nodes, coordinates, challengeType, newPremise);

    return { newPremise, newChallenge, updatedNodes: nodes, updatedCoordinates: coordinates, oldestNode };
};
