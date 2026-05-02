/**
 * @type {Object.<string, (string | string[])[]>}
 */
const strokeExpansionRules = {
    // SYMBOL : CAN BE RETRIEVED BY ...
    // string as value -> choice of resolution
    // string[] as value -> expansion
    '-': ['H'],
    '|': ['I'],
    'H1': ['H', ['|', '-', '|']],
    'HJ': [['H', '\\'], ['J1', '-', '|']],
    'I1': ['I', ['-', '|', '-']],
    '/': ['V'],
    '\\': ['V'],
    'R1': ['R'],
    'R2': ['R', '-'],
    'R3': ['R', '|'],
    'R4': ['R', '/'],
    'R5': ['R', '\\'],
    'O': ['O'],
    'Q': ['Q'],
    'P': ['P'],

    'D1': ['D'],
    'D2': ['D', ['-', '-', '|']],
    'C1': ['C'],
    'C2': ['C', ['-', '-', '|']],
    'A': ['A'],
    'U1': ['U'],
    'U2': ['U'],
    'U3': ['U'],
    'S': ['S'],

    'EL2': ['E', ['D1', 'D1']],
    'ER2': ['E', ['C1', 'C1']],
    'ET2': ['E', ['U1', 'U1']],
    'EB2': ['E', ['A', 'A']],
    'EL3': ['E', ['D1', 'D1', 'D1']],
    'ER3': ['E', ['C1', 'C1', 'C1']],
    'ET3': ['E', ['U1', 'U1', 'U1']],
    'EB3': ['E', ['A', 'A', 'A']],


    'J1': ['J', ['|', '\\']],
    'J2': ['J'],
    'L1': ['L', ['|', '/']],
    'L2': ['L'],
    'L3': ['L', ['|', '-']],
    'F': ['F', ['|', '\\']],
    'Z': ['Z', ['|', '\\', '\\']],
    'N1': ['N', ['F', '|'], ['|', 'J1']],
    'N1V': ['N1', ['F', '/']],
    'N2': ['N', ['J1', '\\']],
    'M1': ['M', ['F', 'F'], ['Z', '|'], ['N1', '\\']],
    'M2': ['M', ['J1', 'J1'], ['Z', '|'], ['N1', '\\']],
    'M3': ['M', ['/', '/', '\\', '\\']],

    'G1': ['G', ['|', 'C']],
    'G2': ['G', ['|', 'D']],
    'G3': ['G', ['|', '|', '|', '/', '\\']],

    'X': ['X', ['/', '\\']],
    'T1': ['T', ['-', '|']],
    'TL': ['T', ['L2', '-']],
    'TF': [['T', '\\'], ['F', '-']],
    'TZ': [['T', '\\', '\\'], ['Z', '-']],
    'TM': [['TF', 'F'], ['M1', '-']],
    'TN': [['TF', '|'], ['T1', 'J'], ['N1', '-']],
    'TI': [['T1', '-', '-'], ['I1', '-']],
    'TJ': ['TF'],
    'K1': ['K', ['|', 'X']],
    'K2': ['K', ['-', 'X']],
    'B1': ['B', ['|', '|', 'X']],
    'B2': ['B', ['-', '-', 'X']],
    'B3': ['B', ['A', 'U1', 'X']],

    '2R3': [['R3', 'R3']],
    '3R3': [['R3', 'R3', 'R3']],
    '4R3': [['R3', 'R3', 'R3', 'R3']],

    '3R5': [['R5', 'R5', 'R5']]
};

/**
 * 
 * @param {string[]} arr
 * @returns {Object.<string, number>} 
 */
function arrToCountObj(arr) {
    const result = {};
    for (const s of arr) {
        result[s] = (result[s] || 0) + 1;
    }
    return result;
}

function expandStrokes(strokes, memo) {
    const cacheKey = JSON.stringify(Object.entries(strokes).sort());
    if (memo.has(cacheKey)) return memo.get(cacheKey);

    let targetSym = null;
    for (const s of Object.keys(strokes)) {
        const rules = strokeExpansionRulesCleaned[s];
        if (!rules) continue;
        const hasNonIdentity = rules.some(v => !(Object.keys(v).length === 1 && v[s] === 1));
        if (hasNonIdentity) {
            targetSym = s;
            break;
        }
    }

    if (!targetSym) {
        const result = [strokes];
        memo.set(cacheKey, result);
        return result;
    }

    const totalCount = strokes[targetSym];
    const variants = strokeExpansionRulesCleaned[targetSym];
    const allResults = [];

    let hasIdentity = false;
    const otherVariants = [];
    for (const v of variants) {
        if (Object.keys(v).length === 1 && v[targetSym] === 1) {
            hasIdentity = true;
        } else {
            otherVariants.push(v);
        }
    }

    function enumerate(remaining, idx, selections) {
        if (idx === otherVariants.length - 1) {
            selections.push(remaining);
            const nextState = { ...strokes };
            delete nextState[targetSym];
            for (let i = 0; i < otherVariants.length; i++) {
                const times = selections[i];
                if (times === 0) continue;
                const variant = otherVariants[i];
                for (const [k, cnt] of Object.entries(variant)) {
                    nextState[k] = (nextState[k] || 0) + cnt * times;
                }
            }
            for (const sub of expandStrokes(nextState, memo)) {
                allResults.push(sub);
            }
            selections.pop();
            return;
        }
        for (let i = 0; i <= remaining; i++) {
            selections.push(i);
            enumerate(remaining - i, idx + 1, selections);
            selections.pop();
        }
    }

    enumerate(totalCount, 0, []);

    if (hasIdentity) {
        const remainingState = { ...strokes };
        delete remainingState[targetSym];
        const subResults = expandStrokes(remainingState, memo);
        for (const sub of subResults) {
            const withSym = { ...sub, [targetSym]: totalCount };
            allResults.push(withSym);
        }
    }

    const uniqueMap = new Map();
    for (const res of allResults) {
        const key = JSON.stringify(Object.entries(res).sort());
        if (!uniqueMap.has(key)) uniqueMap.set(key, res);
    }
    const finalResults = Array.from(uniqueMap.values());

    memo.set(cacheKey, finalResults);
    return finalResults;
}

const charStrokes = {
    "ꀀ": ['U1', '-', '-'],
    "ꀁ": ['U1', '-', 'D1', 'A'],
    "ꀂ": ['U1', '-', 'D1'],
    "ꀃ": ['C1', '|', 'D1', '\\'],
    "ꀄ": ['O', 'U1', '-'],
    "ꀅ": ['O', 'F', 'J1', 'A'],
    "ꀆ": ['O', 'F', 'J1'],
    "ꀇ": ['O', 'C1', '|', '|'],
    "ꀈ": ['N1', '\\'],
    "ꀉ": ['Z', '\\', '|', 'A'],
    "ꀊ": ['Z', '\\', '|'],
    "ꀋ": ['Z', '\\', 'C1'],
    "ꀌ": ['H1', '2R3', 'A'],
    "ꀍ": ['H1', '2R3'],
    "ꀎ": ['O', 'O', 'U1'],
    "ꀏ": ['O', '|', 'ER2'],
    "ꀐ": ['Z', 'O', 'R3', 'A'],
    "ꀑ": ['Z', 'O', 'R3'],
    "ꀒ": ['Z', 'O'],
    "ꀓ": ['EL3', '-', 'Z', 'A'],
    "ꀔ": ['EL3', '-', 'Z'],
    "ꀕ": ['ET2', '2R3'],
    "ꀖ": ['O', 'X'],
    "ꀗ": ['|', '-', 'C1', 'A'],
    "ꀘ": ['|', '-', 'C1'],
    "ꀙ": ['N1', '-', 'C1'],
    "ꀚ": ['O', '-', 'C1'],
    "ꀛ": ['O', '/', 'A'],
    "ꀜ": ['O', '/'],
    "ꀝ": ['O', 'EL2'],
    "ꀞ": ['O', 'H1'],
    "ꀟ": ['ET2', 'H1'],
    "ꀠ": ['ET2', 'H1'],
    "ꀡ": ['/', '\\', 'H1'],
    "ꀢ": ['G2', 'I1', 'A'],
    "ꀣ": ['G2', 'I1'],
    "ꀤ": ['I1'],
    "ꀥ": ['C1', 'ER2', '\\', '/'],
    "ꀦ": ['O', 'I1', 'A'],
    "ꀧ": ['O', 'I1'],
    "ꀨ": ['2I1'],
    "ꀩ": ['EB2', 'U1', 'R3', 'A'],
    "ꀪ": ['EB2', 'U1', 'R3'],
    "ꀫ": ['I1', 'X'],
    "ꀬ": ['O', '|', 'R3'],
    "ꀭ": ['J1', '|', 'A'],
    "ꀮ": ['J1', '|'],
    "ꀯ": ['2C1'],
    "ꀰ": ['U2', '2-', 'A'],
    "ꀱ": ['U2', '2-'],
    "ꀲ": ['Z', 'X'],
    "ꀳ": ['Z', 'M3', 'A'],
    "ꀴ": ['Z', 'M3'],
    "ꀵ": ['TF', 'F', 'U1'],
    "ꀶ": ['C1', '|', '4R3', 'F', 'A'],
    "ꀷ": ['C1', '|', '4R3', 'F'],
    "ꀸ": ['C1', 'F', '2-'],
    "ꀹ": ['O', 'L1', 'A'],
    "ꀺ": ['O', 'L1'],
    "ꀻ": ['X', '2R3'],
    "ꀼ": ['O', '-', '2R3', 'A'],
    "ꀽ": ['O', '-', '2R3'],
    "ꀾ": ['O', 'R3', 'ET2'],
    "ꀿ": ['H1'],
    "ꁀ": ['U1', 'T1', 'A'],
    "ꁁ": ['U1', 'T1'],
    "ꁂ": ['U1', '-', '|'],
    "ꁃ": ['C1', '-', '|', '3R3', 'A'],
    "ꁄ": ['C1', '-', '|', '3R3'],
    "ꁅ": ['C1', 'T1', 'J2'],
    "ꁆ": ['O', '2-', 'EL2'],
    "ꁇ": ['U1', '|', '2-', 'A'],
    "ꁈ": ['U1', '|', '2-'],
    "ꁉ": ['C1', '-', 'T1', '-'],
    "ꁊ": ['G3'],
    "ꁋ": ['ER3', '|', 'A'],
    "ꁌ": ['ER3', '|'],
    "ꁍ": ['Z', 'C1', 'R3'],
    "ꁎ": ['O', 'R3', 'T1', '|', 'A'],
    "ꁏ": ['O', 'R3', 'T1', '|'],
    "ꁐ": ['C1', 'F'],
    "ꁑ": ['B1', 'R3', 'A'],
    "ꁒ": ['B1', 'R3'],
    "ꁓ": ['F', 'TF', '|', 'U1'],
    "ꁔ": ['F', '2R3', 'C1', 'A'],
    "ꁕ": ['F', '2R3', 'C1'],
    "ꁖ": ['O', '2-', 'ET2'],
    "ꁗ": ['X', '|', 'A'],
    "ꁘ": ['X', '|'],
    "ꁙ": ['O', 'C1', 'D1'],
    "ꁚ": ['O', 'ET2', 'R3'],
    "ꁛ": ['Z', '2C1', '-', 'A'],
    "ꁜ": ['Z', '2C1', '-'],
    "ꁝ": ['D1', 'C1', '-'],
    "ꁞ": ['D1', 'C1', '3-'],
    "ꁟ": ['2K1', 'A'],
    "ꁠ": ['2K1'],
    "ꁡ": ['ET2', '2-'],
    "ꁢ": ['J1', 'N1', '2-', 'A'],
    "ꁣ": ['J1', 'N1', '2-'],
    "ꁤ": ['O', '4R3'],
    "ꁥ": ['C1', '|', 'R3'],
    "ꁦ": ['X', 'T1', '-', 'A'],
    "ꁧ": ['X', 'T1', '-'],
    "ꁨ": ['EB2', 'A', 'R3', 'U1'],
    "ꁩ": ['2N1', 'R2', '-', 'A'],
    "ꁪ": ['2N1', 'R2', '-'],
    "ꁫ": ['N1', 'J1', 'R2', '/'],
    "ꁬ": ['N1', 'D1', 'D1', '2C1'],
    "ꁭ": ['Z', 'N1', 'R3', 'A'],
    "ꁮ": ['Z', 'N1', 'R3'],
    "ꁯ": ['M1', 'F', 'R3'],
    "ꁰ": ['N1V', 'A', 'R3', 'A'],
    "ꁱ": ['N1V', 'A', 'R3'],
    "ꁲ": ['2Z', '-', 'R3'],
    "ꁳ": ['Z', '2|', 'A'],
    "ꁴ": ['Z', '2|'],
    "ꁵ": ['Z', '2\\'],
    "ꁶ": ['F', 'T1', '|', '2R3'],
    "ꁷ": ['O', 'TL', 'R3', 'A'],
    "ꁸ": ['O', 'TL', 'R3'],
    "ꁹ": ['F', 'TF', '-'],
    "ꁺ": ['T1', '2-', '\\', 'A'],
    "ꁻ": ['T1', '2-', '\\'],
    "ꁼ": ['T1', '-'],
    "ꁽ": ['Q', '-', '|', '2R3'],
    "ꁾ": ['X', '2-', 'A'],
    "ꁿ": ['X', '2-'],
    "ꂀ": ['X', '2|'],
    "ꂁ": ['G3', '/', '|'],
    "ꂂ": ['ET2', 'T1'],
    "ꂃ": ['ET2', 'T1', 'U1'],
    "ꂄ": ['ET2', 'R3', 'U1'],
    "ꂅ": ['G1', '|', '-'],
    "ꂆ": ['O', 'C1', '2R3', 'A'],
    "ꂇ": ['O', 'C1', '2R3'],
    "ꂈ": ['O', '|', 'R3'],
    "ꂉ": ['2O', '-', '2R3', 'A'],
    "ꂊ": ['2O', '-', '2R3'],
    "ꂋ": ['O', '-', 'C1', '2R3'],
    "ꂌ": ['U1', '-', '|', '3R3', 'A'],
    "ꂍ": ['U1', '-', '|', '3R3'],
    "ꂎ": ['M1', 'D1', 'ER2'],
    "ꂏ": ['T1', 'B1', 'A'],
    "ꂐ": ['T1', 'B1'],
    "ꂑ": ['Z', '2R3'],
    "ꂒ": ['T1', 'U1', 'A', 'A'],
    "ꂓ": ['T1', 'U1', 'A'],
    "ꂔ": ['2O', '|', '/', '\\'],
    "ꂕ": ['J2', 'U1', '2R3', 'A'],
    "ꂖ": ['J2', 'U1', '2R3'],
    "ꂗ": ['N1', '2R3'],
    "ꂘ": ['Z', '\\', '3R5'],
    "ꂙ": ['N1', 'O', 'A'],
    "ꂚ": ['N1', 'O'],
    "ꂛ": ['F', 'D1', '-'],
    "ꂜ": ['J2', 'N1', '/', 'A'],
    "ꂝ": ['J2', 'N1', '/'],
    "ꂞ": ['R3', 'M1', '\\'],
    "ꂟ": ['F', 'C1', 'O'],
    "ꂠ": ['F', '3R3', 'C1', 'A'],
    "ꂡ": ['F', '3R3', 'C1'],
    "ꂢ": ['S', 'O'],
    "ꂣ": ['B2', 'R3'],
    "ꂤ": ['J1', '4R3', 'A'],
    "ꂥ": ['J1', '4R3'],
    "ꂦ": ['O', '|', '4R3'],
    "ꂧ": ['U1', '3R3', 'A'],
    "ꂨ": ['U1', '3R3'],
    "ꂩ": ['J1', '2R3', '\\', 'A'],
    "ꂪ": ['J1', '2R3', '\\'],
    "ꂫ": ['N1', '6R3'],
    "ꂬ": ['T1', 'O', 'ET2', '2R3', 'A'],
    "ꂭ": ['T1', 'O', 'ET2', '2R3'],
    "ꂮ": ['O', 'EB2', '-', 'R2'],
    "ꂯ": ['M2', '/', '\\', 'A'],
    "ꂰ": ['M2', '/', '\\'],
    "ꂱ": ['M2', '2-'],
    "ꂲ": ['O', 'X', 'R3', 'A'],
    "ꂳ": ['O', 'X', 'R3'],
    "ꂴ": ['M2', '2R3'],
    "ꂵ": ['T1', '2F'],
    "ꂶ": ['O', '-', 'A'],
    "ꂷ": ['O', '-'],
    "ꂸ": ['ET2', 'T1', '-'],
    "ꂹ": ['U1', '3R5'],
    "ꂺ": ['2Z', '2\\', 'A'],
    "ꂻ": ['2Z', '2\\'],
    "ꂼ": ['Z', '2-', 'O', 'R3'],
    "ꂽ": ['F', 'C1', 'R3'],
    "ꂾ": ['F', 'D1', 'A', 'A'],
    "ꂿ": ['F', 'D1', 'A'],
    "ꃀ": ['G2'],
    "ꃁ": ['J1', '-', 'O', 'A'],
    "ꃂ": ['J1', '-', 'O'],
    "ꃃ": ['2R3', 'J1', 'EL2'],
    "ꃄ": ['HJ', 'A'],
    "ꃅ": ['HJ'],
    "ꃆ": ['P', 'O'],
    "ꃇ": ['J1', 'R3', '4-', 'A'],
    "ꃈ": ['J1', 'R3', '4-'],
    "ꃉ": ['N1', 'D1', 'C1'],
    "ꃊ": ['U1', '2R3', 'A'],
    "ꃋ": ['U1', '2R3'],
    "ꃌ": ['T1', '2R3'],
    "ꃍ": ['Q', '4-'],
    "ꃎ": ['|', '-', 'Z', 'A'],
    "ꃏ": ['|', '-', 'Z'],
    "ꃐ": ['|', '-', 'M1'],
    "ꃑ": ['J1', '-', '2O', 'F'],
    "ꃒ": ['N1', '2R3', 'U1', 'A'],
    "ꃓ": ['N1', '2R3', 'U1'],
    "ꃔ": ['N1', '3R3', 'U1'],
    "ꃕ": ['D1', 'C1', '\\', '/', '|', 'A'],
    "ꃖ": ['D1', 'C1', '\\', '/', '|'],
    "ꃗ": ['\\', 'C1', '/', '|', '-', '2R3'],
    "ꃘ": ['2R3', 'F', 'R3'],
    "ꃙ": ['2|', '-', '\\', '/', 'A'],
    "ꃚ": ['2|', '-', '\\', '/'],
    "ꃛ": ['K1', '4R3'],
    "ꃜ": ['D1', 'R3', 'N1', 'A'],
    "ꃝ": ['D1', 'R3', 'N1'],
    "ꃞ": ['N1', '2/'],
    "ꃟ": ['U1', '/', 'N1', 'A'],
    "ꃠ": ['U1', '/', 'N1'],
    "ꃡ": ['U1', 'N1', '/'],
    "ꃢ": ['U1', 'R3', 'N1'],
    "ꃣ": ['Z', 'C1', 'A'],
    "ꃤ": ['Z', 'C1'],
    "ꃥ": ['N1', 'R3', '|', 'D1'],
    "ꃦ": ['R3', 'J1', '/'],
    "ꃧ": ['T1', 'X', '2R3', '-', 'A'],
    "ꃨ": ['T1', 'X', '2R3', '-'],
    "ꃩ": ['I1', 'R3', 'D1'],
    "ꃪ": ['O', '2-'],
    "ꃫ": ['U1', 'A', 'A'],
    "ꃬ": ['U1', 'A'],
    "ꃭ": ['Z', 'K1'],
    "ꃮ": ['U1', 'N1'],
    "ꃯ": ['O', 'J1', '/', 'A'],
    "ꃰ": ['O', 'J1', '/'],
    "ꃱ": ['ER2', 'N1', '|'],
    "ꃲ": ['C1', 'EL2', 'A'],
    "ꃳ": ['C1', 'EL2'],
    "ꃴ": ['F', '\\', '2/'],
    "ꃵ": ['D1', 'C1', '2-', 'A'],
    "ꃶ": ['D1', 'C1', '2-'],
    "ꃷ": ['K2', 'R3', '\\'],
    "ꃸ": ['C1', '|', '2-', 'A'],
    "ꃹ": ['C1', '|', '2-'],
    "ꃺ": ['F', 'U1', 'A', '2R3'],
    "ꃻ": ['U1', '2R3', 'A'],
    "ꃼ": ['U1', '2R3'],
    "ꃽ": ['F', 'U1', 'A', 'R3'],
    "ꃾ": ['T1', '-', '2R3', 'U1', 'A'],
    "ꃿ": ['T1', '-', '2R3', 'U1'],
    "ꄀ": ['2N1', '|', 'EL2'],
    "ꄁ": ['J2', 'M1', 'A'],
    "ꄂ": ['J2', 'M1'],
    "ꄃ": ['Z', 'ET2', 'U1', 'R3'],
    "ꄄ": ['Z', '2C1', 'A'],
    "ꄅ": ['Z', '2C1'],
    "ꄆ": ['N1', 'X'],
    "ꄇ": ['U1', '-', '2R3'],
    "ꄈ": ['K1', 'R3', 'A'],
    "ꄉ": ['K1', 'R3'],
    "ꄊ": ['K1', 'Z'],
    "ꄋ": ['2J1', '|', 'A'],
    "ꄌ": ['2J1', '|'],
    "ꄍ": ['O', '|'],
    "ꄎ": ['TM', 'A'],
    "ꄏ": ['TM'],
    "ꄐ": ['TZ'],
    "ꄑ": ['Z', 'B2', 'A'],
    "ꄒ": ['Z', 'B2'],
    "ꄓ": ['N1', '|', 'A'],
    "ꄔ": ['ER2', 'C1', 'J1'],
    "ꄕ": ['P', '2-', 'R3', 'A'],
    "ꄖ": ['P', '2-', 'R3'],
    "ꄗ": ['O', 'L3', '-'],
    "ꄘ": ['TF', 'R3', 'A'],
    "ꄙ": ['TF', 'R3'],
    "ꄚ": ['TZ'],
    "ꄛ": ['TJ', '-', 'R3', 'A'],
    "ꄜ": ['TJ', '-', 'R3'],
    "ꄝ": ['TN'],
    "ꄞ": ['TZ', 'J2', 'A'],
    "ꄟ": ['TZ', 'J2'],
    "ꄠ": ['U1', 'A', 'J1'],
    "ꄡ": ['D2', 'C1'],
    "ꄢ": ['D2', '4R3', 'A'],
    "ꄣ": ['D2', '4R3'],
    "ꄤ": ['D2', '3-'],
    "ꄥ": ['EL2', 'ER2', '2R3'],
    "ꄦ": ['N1', '3-', 'A'],
    "ꄧ": ['N1', '3-'],
    "ꄨ": ['J1', 'N1', '3R3'],
    "ꄩ": ['Z', '2\\'],
    "ꄪ": ['M1', '2\\', 'R3', 'A'],
    "ꄫ": ['M1', '2\\', 'R3'],
    "ꄬ": ['ER3', 'EL3', '3R3'],
    "ꄭ": ['J1', 'X', 'T1', 'A'],
    "ꄮ": ['J1', 'X', 'T1'],
    "ꄯ": ['F', '\\', 'A'],
    "ꄰ": ['O', 'C1', 'R3'],
    "ꄱ": ['O', 'A'],
    "ꄲ": ['O'],
    "ꄳ": ['O', 'N1', '2R3'],
    "ꄴ": ['2Z', 'T1', '|', 'A'],
    "ꄵ": ['2Z', 'T1', '|'],
    "ꄶ": ['N1', '|', '2R3'],
    "ꄷ": ['Z', '2R5', 'A'],
    "ꄸ": ['Z', '2R5'],
    "ꄹ": ['N1', 'T1', '-'],
    "ꄺ": ['T1', 'H1', '-', 'A'],
    "ꄻ": ['T1', 'H1', '-'],
    "ꄼ": ['H1', '|', 'A'],
    "ꄽ": ['I1', 'O'],
    "ꄾ": ['TI', 'K1', 'A'],
    "ꄿ": ['TI', 'K1'],
    "ꅀ": ['N1', 'TI', '-'],
    "ꅁ": ['-', '|', 'O', 'A'],
    "ꅂ": ['-', '|'],
    "ꅃ": ['-', '|', 'K2'],
    "ꅄ": ['F', 'U1', '3R3'],
    "ꅅ": ['U1', 'T1', '3R3', 'A'],
    "ꅆ": ['U1', 'T1', '3R3'],
    "ꅇ": ['TN', 'U1', '2R3'],
    "ꅈ": ['D1', 'C1', 'R3', 'A'],
    "ꅉ": ['D1', 'C1', 'R3'],
    "ꅊ": ['J1', '-', 'F', 'C1'],
    "ꅋ": ['B2', '-', '|'],
    "ꅌ": ['U1', '|', 'R3', 'A'],
    "ꅍ": ['U1', '|', 'R3'],
    "ꅎ": ['ER2', 'T1', '|'],
    "ꅏ": ['U1', '|', 'A'],
    "ꅐ": ['U1', '|'],
    "ꅑ": ['N1', '4R3'],
    "ꅒ": ['HJ', '|', 'A'],
    "ꅓ": ['HJ', '|'],
    "ꅔ": ['Q', 'R3'],
    "ꅕ": ['TZ', '-', 'D1', 'C1', 'A'],
    "ꅖ": ['TZ', '-', 'D1', 'C1'],
    "ꅗ": ['M1', '-', 'O'],
    "ꅘ": ['TM', 'O', 'A'],
    "ꅙ": ['TM', 'O'],
    "ꅚ": [],
    "ꅛ": [],
    "ꅜ": [],
    "ꅝ": [],
    "ꅞ": [],
    "ꅟ": [],
    "ꅠ": [],
    "ꅡ": [],
    "ꅢ": [],
    "ꅣ": [],
    "ꅤ": [],
    "ꅥ": [],
    "ꅦ": [],
    "ꅧ": [],
    "ꅨ": [],
    "ꅩ": [],
    "ꅪ": [],
    "ꅫ": [],
    "ꅬ": [],
    "ꅭ": [],
    "ꅮ": [],
    "ꅯ": [],
    "ꅰ": [],
    "ꅱ": [],
    "ꅲ": [],
    "ꅳ": [],
    "ꅴ": [],
    "ꅵ": [],
    "ꅶ": [],
    "ꅷ": [],
    "ꅸ": [],
    "ꅹ": [],
    "ꅺ": [],
    "ꅻ": [],
    "ꅼ": [],
    "ꅽ": [],
    "ꅾ": [],
    "ꅿ": [],
    "ꆀ": [],
    "ꆁ": [],
    "ꆂ": [],
    "ꆃ": [],
    "ꆄ": [],
    "ꆅ": [],
    "ꆆ": [],
    "ꆇ": [],
    "ꆈ": [],
    "ꆉ": [],
    "ꆊ": [],
    "ꆋ": [],
    "ꆌ": [],
    "ꆍ": [],
    "ꆎ": [],
    "ꆏ": [],
    "ꆐ": [],
    "ꆑ": [],
    "ꆒ": [],
    "ꆓ": [],
    "ꆔ": [],
    "ꆕ": [],
    "ꆖ": [],
    "ꆗ": [],
    "ꆘ": [],
    "ꆙ": [],
    "ꆚ": [],
    "ꆛ": [],
    "ꆜ": [],
    "ꆝ": [],
    "ꆞ": [],
    "ꆟ": [],
    "ꆠ": [],
    "ꆡ": [],
    "ꆢ": [],
    "ꆣ": [],
    "ꆤ": [],
    "ꆥ": [],
    "ꆦ": [],
    "ꆧ": [],
    "ꆨ": [],
    "ꆩ": [],
    "ꆪ": [],
    "ꆫ": [],
    "ꆬ": [],
    "ꆭ": [],
    "ꆮ": [],
    "ꆯ": [],
    "ꆰ": [],
    "ꆱ": [],
    "ꆲ": [],
    "ꆳ": [],
    "ꆴ": [],
    "ꆵ": [],
    "ꆶ": [],
    "ꆷ": [],
    "ꆸ": [],
    "ꆹ": [],
    "ꆺ": [],
    "ꆻ": [],
    "ꆼ": [],
    "ꆽ": [],
    "ꆾ": [],
    "ꆿ": [],
    "ꇀ": [],
    "ꇁ": [],
    "ꇂ": [],
    "ꇃ": [],
    "ꇄ": [],
    "ꇅ": [],
    "ꇆ": [],
    "ꇇ": [],
    "ꇈ": [],
    "ꇉ": [],
    "ꇊ": [],
    "ꇋ": [],
    "ꇌ": [],
    "ꇍ": [],
    "ꇎ": [],
    "ꇏ": [],
    "ꇐ": [],
    "ꇑ": [],
    "ꇒ": [],
    "ꇓ": [],
    "ꇔ": [],
    "ꇕ": [],
    "ꇖ": [],
    "ꇗ": [],
    "ꇘ": [],
    "ꇙ": [],
    "ꇚ": [],
    "ꇛ": [],
    "ꇜ": [],
    "ꇝ": [],
    "ꇞ": [],
    "ꇟ": [],
    "ꇠ": [],
    "ꇡ": [],
    "ꇢ": [],
    "ꇣ": [],
    "ꇤ": [],
    "ꇥ": [],
    "ꇦ": [],
    "ꇧ": [],
    "ꇨ": [],
    "ꇩ": [],
    "ꇪ": [],
    "ꇫ": [],
    "ꇬ": [],
    "ꇭ": [],
    "ꇮ": [],
    "ꇯ": [],
    "ꇰ": [],
    "ꇱ": [],
    "ꇲ": [],
    "ꇳ": [],
    "ꇴ": [],
    "ꇵ": [],
    "ꇶ": [],
    "ꇷ": [],
    "ꇸ": [],
    "ꇹ": [],
    "ꇺ": [],
    "ꇻ": [],
    "ꇼ": [],
    "ꇽ": [],
    "ꇾ": [],
    "ꇿ": [],
    "ꈀ": [],
    "ꈁ": [],
    "ꈂ": [],
    "ꈃ": [],
    "ꈄ": [],
    "ꈅ": [],
    "ꈆ": [],
    "ꈇ": [],
    "ꈈ": [],
    "ꈉ": [],
    "ꈊ": [],
    "ꈋ": [],
    "ꈌ": [],
    "ꈍ": [],
    "ꈎ": [],
    "ꈏ": [],
    "ꈐ": [],
    "ꈑ": [],
    "ꈒ": [],
    "ꈓ": [],
    "ꈔ": [],
    "ꈕ": [],
    "ꈖ": [],
    "ꈗ": [],
    "ꈘ": [],
    "ꈙ": [],
    "ꈚ": [],
    "ꈛ": [],
    "ꈜ": [],
    "ꈝ": [],
    "ꈞ": [],
    "ꈟ": [],
    "ꈠ": [],
    "ꈡ": [],
    "ꈢ": [],
    "ꈣ": [],
    "ꈤ": [],
    "ꈥ": [],
    "ꈦ": [],
    "ꈧ": [],
    "ꈨ": [],
    "ꈩ": [],
    "ꈪ": [],
    "ꈫ": [],
    "ꈬ": [],
    "ꈭ": [],
    "ꈮ": [],
    "ꈯ": [],
    "ꈰ": [],
    "ꈱ": [],
    "ꈲ": [],
    "ꈳ": [],
    "ꈴ": [],
    "ꈵ": [],
    "ꈶ": [],
    "ꈷ": [],
    "ꈸ": [],
    "ꈹ": [],
    "ꈺ": [],
    "ꈻ": [],
    "ꈼ": [],
    "ꈽ": [],
    "ꈾ": [],
    "ꈿ": [],
    "ꉀ": [],
    "ꉁ": [],
    "ꉂ": [],
    "ꉃ": [],
    "ꉄ": [],
    "ꉅ": [],
    "ꉆ": [],
    "ꉇ": [],
    "ꉈ": [],
    "ꉉ": [],
    "ꉊ": [],
    "ꉋ": [],
    "ꉌ": [],
    "ꉍ": [],
    "ꉎ": [],
    "ꉏ": [],
    "ꉐ": [],
    "ꉑ": [],
    "ꉒ": [],
    "ꉓ": [],
    "ꉔ": [],
    "ꉕ": [],
    "ꉖ": [],
    "ꉗ": [],
    "ꉘ": [],
    "ꉙ": [],
    "ꉚ": [],
    "ꉛ": [],
    "ꉜ": [],
    "ꉝ": [],
    "ꉞ": [],
    "ꉟ": [],
    "ꉠ": [],
    "ꉡ": [],
    "ꉢ": [],
    "ꉣ": [],
    "ꉤ": [],
    "ꉥ": [],
    "ꉦ": [],
    "ꉧ": [],
    "ꉨ": [],
    "ꉩ": [],
    "ꉪ": [],
    "ꉫ": [],
    "ꉬ": [],
    "ꉭ": [],
    "ꉮ": [],
    "ꉯ": [],
    "ꉰ": [],
    "ꉱ": [],
    "ꉲ": [],
    "ꉳ": [],
    "ꉴ": [],
    "ꉵ": [],
    "ꉶ": [],
    "ꉷ": [],
    "ꉸ": [],
    "ꉹ": [],
    "ꉺ": [],
    "ꉻ": [],
    "ꉼ": [],
    "ꉽ": [],
    "ꉾ": [],
    "ꉿ": [],
    "ꊀ": [],
    "ꊁ": [],
    "ꊂ": [],
    "ꊃ": [],
    "ꊄ": [],
    "ꊅ": [],
    "ꊆ": [],
    "ꊇ": [],
    "ꊈ": [],
    "ꊉ": [],
    "ꊊ": [],
    "ꊋ": [],
    "ꊌ": [],
    "ꊍ": [],
    "ꊎ": [],
    "ꊏ": [],
    "ꊐ": [],
    "ꊑ": [],
    "ꊒ": [],
    "ꊓ": [],
    "ꊔ": [],
    "ꊕ": [],
    "ꊖ": [],
    "ꊗ": [],
    "ꊘ": [],
    "ꊙ": [],
    "ꊚ": [],
    "ꊛ": [],
    "ꊜ": [],
    "ꊝ": [],
    "ꊞ": [],
    "ꊟ": [],
    "ꊠ": [],
    "ꊡ": [],
    "ꊢ": [],
    "ꊣ": [],
    "ꊤ": [],
    "ꊥ": [],
    "ꊦ": [],
    "ꊧ": [],
    "ꊨ": [],
    "ꊩ": [],
    "ꊪ": [],
    "ꊫ": [],
    "ꊬ": [],
    "ꊭ": [],
    "ꊮ": [],
    "ꊯ": [],
    "ꊰ": [],
    "ꊱ": [],
    "ꊲ": [],
    "ꊳ": [],
    "ꊴ": [],
    "ꊵ": [],
    "ꊶ": [],
    "ꊷ": [],
    "ꊸ": [],
    "ꊹ": [],
    "ꊺ": [],
    "ꊻ": [],
    "ꊼ": [],
    "ꊽ": [],
    "ꊾ": [],
    "ꊿ": [],
    "ꋀ": [],
    "ꋁ": [],
    "ꋂ": [],
    "ꋃ": [],
    "ꋄ": [],
    "ꋅ": [],
    "ꋆ": [],
    "ꋇ": [],
    "ꋈ": [],
    "ꋉ": [],
    "ꋊ": [],
    "ꋋ": [],
    "ꋌ": [],
    "ꋍ": [],
    "ꋎ": [],
    "ꋏ": [],
    "ꋐ": [],
    "ꋑ": [],
    "ꋒ": [],
    "ꋓ": [],
    "ꋔ": [],
    "ꋕ": [],
    "ꋖ": [],
    "ꋗ": [],
    "ꋘ": [],
    "ꋙ": [],
    "ꋚ": [],
    "ꋛ": [],
    "ꋜ": [],
    "ꋝ": [],
    "ꋞ": [],
    "ꋟ": [],
    "ꋠ": [],
    "ꋡ": [],
    "ꋢ": [],
    "ꋣ": [],
    "ꋤ": [],
    "ꋥ": [],
    "ꋦ": [],
    "ꋧ": [],
    "ꋨ": [],
    "ꋩ": [],
    "ꋪ": [],
    "ꋫ": [],
    "ꋬ": [],
    "ꋭ": [],
    "ꋮ": [],
    "ꋯ": [],
    "ꋰ": [],
    "ꋱ": [],
    "ꋲ": [],
    "ꋳ": [],
    "ꋴ": [],
    "ꋵ": [],
    "ꋶ": [],
    "ꋷ": [],
    "ꋸ": [],
    "ꋹ": [],
    "ꋺ": [],
    "ꋻ": [],
    "ꋼ": [],
    "ꋽ": [],
    "ꋾ": [],
    "ꋿ": [],
    "ꌀ": [],
    "ꌁ": [],
    "ꌂ": [],
    "ꌃ": [],
    "ꌄ": [],
    "ꌅ": [],
    "ꌆ": [],
    "ꌇ": [],
    "ꌈ": [],
    "ꌉ": [],
    "ꌊ": [],
    "ꌋ": [],
    "ꌌ": [],
    "ꌍ": [],
    "ꌎ": [],
    "ꌏ": [],
    "ꌐ": [],
    "ꌑ": [],
    "ꌒ": [],
    "ꌓ": [],
    "ꌔ": [],
    "ꌕ": [],
    "ꌖ": [],
    "ꌗ": [],
    "ꌘ": [],
    "ꌙ": [],
    "ꌚ": [],
    "ꌛ": [],
    "ꌜ": [],
    "ꌝ": [],
    "ꌞ": [],
    "ꌟ": [],
    "ꌠ": [],
    "ꌡ": [],
    "ꌢ": [],
    "ꌣ": [],
    "ꌤ": [],
    "ꌥ": [],
    "ꌦ": [],
    "ꌧ": [],
    "ꌨ": [],
    "ꌩ": [],
    "ꌪ": [],
    "ꌫ": [],
    "ꌬ": [],
    "ꌭ": [],
    "ꌮ": [],
    "ꌯ": [],
    "ꌰ": [],
    "ꌱ": [],
    "ꌲ": [],
    "ꌳ": [],
    "ꌴ": [],
    "ꌵ": [],
    "ꌶ": [],
    "ꌷ": [],
    "ꌸ": [],
    "ꌹ": [],
    "ꌺ": [],
    "ꌻ": [],
    "ꌼ": [],
    "ꌽ": [],
    "ꌾ": [],
    "ꌿ": [],
    "ꍀ": [],
    "ꍁ": [],
    "ꍂ": [],
    "ꍃ": [],
    "ꍄ": [],
    "ꍅ": [],
    "ꍆ": [],
    "ꍇ": [],
    "ꍈ": [],
    "ꍉ": [],
    "ꍊ": [],
    "ꍋ": [],
    "ꍌ": [],
    "ꍍ": [],
    "ꍎ": [],
    "ꍏ": [],
    "ꍐ": [],
    "ꍑ": [],
    "ꍒ": [],
    "ꍓ": [],
    "ꍔ": [],
    "ꍕ": [],
    "ꍖ": [],
    "ꍗ": [],
    "ꍘ": [],
    "ꍙ": [],
    "ꍚ": [],
    "ꍛ": [],
    "ꍜ": [],
    "ꍝ": [],
    "ꍞ": [],
    "ꍟ": [],
    "ꍠ": [],
    "ꍡ": [],
    "ꍢ": [],
    "ꍣ": [],
    "ꍤ": [],
    "ꍥ": [],
    "ꍦ": [],
    "ꍧ": [],
    "ꍨ": [],
    "ꍩ": [],
    "ꍪ": [],
    "ꍫ": [],
    "ꍬ": [],
    "ꍭ": [],
    "ꍮ": [],
    "ꍯ": [],
    "ꍰ": [],
    "ꍱ": [],
    "ꍲ": [],
    "ꍳ": [],
    "ꍴ": [],
    "ꍵ": [],
    "ꍶ": [],
    "ꍷ": [],
    "ꍸ": [],
    "ꍹ": [],
    "ꍺ": [],
    "ꍻ": [],
    "ꍼ": [],
    "ꍽ": [],
    "ꍾ": [],
    "ꍿ": [],
    "ꎀ": [],
    "ꎁ": [],
    "ꎂ": [],
    "ꎃ": [],
    "ꎄ": [],
    "ꎅ": [],
    "ꎆ": [],
    "ꎇ": [],
    "ꎈ": [],
    "ꎉ": [],
    "ꎊ": [],
    "ꎋ": [],
    "ꎌ": [],
    "ꎍ": [],
    "ꎎ": [],
    "ꎏ": [],
    "ꎐ": [],
    "ꎑ": [],
    "ꎒ": [],
    "ꎓ": [],
    "ꎔ": [],
    "ꎕ": [],
    "ꎖ": [],
    "ꎗ": [],
    "ꎘ": [],
    "ꎙ": [],
    "ꎚ": [],
    "ꎛ": [],
    "ꎜ": [],
    "ꎝ": [],
    "ꎞ": [],
    "ꎟ": [],
    "ꎠ": [],
    "ꎡ": [],
    "ꎢ": [],
    "ꎣ": [],
    "ꎤ": [],
    "ꎥ": [],
    "ꎦ": [],
    "ꎧ": [],
    "ꎨ": [],
    "ꎩ": [],
    "ꎪ": [],
    "ꎫ": [],
    "ꎬ": [],
    "ꎭ": [],
    "ꎮ": [],
    "ꎯ": [],
    "ꎰ": [],
    "ꎱ": [],
    "ꎲ": [],
    "ꎳ": [],
    "ꎴ": [],
    "ꎵ": [],
    "ꎶ": [],
    "ꎷ": [],
    "ꎸ": [],
    "ꎹ": [],
    "ꎺ": [],
    "ꎻ": [],
    "ꎼ": [],
    "ꎽ": [],
    "ꎾ": [],
    "ꎿ": [],
    "ꏀ": [],
    "ꏁ": [],
    "ꏂ": [],
    "ꏃ": [],
    "ꏄ": [],
    "ꏅ": [],
    "ꏆ": [],
    "ꏇ": [],
    "ꏈ": [],
    "ꏉ": [],
    "ꏊ": [],
    "ꏋ": [],
    "ꏌ": [],
    "ꏍ": [],
    "ꏎ": [],
    "ꏏ": [],
    "ꏐ": [],
    "ꏑ": [],
    "ꏒ": [],
    "ꏓ": [],
    "ꏔ": [],
    "ꏕ": [],
    "ꏖ": [],
    "ꏗ": [],
    "ꏘ": [],
    "ꏙ": [],
    "ꏚ": [],
    "ꏛ": [],
    "ꏜ": [],
    "ꏝ": [],
    "ꏞ": [],
    "ꏟ": [],
    "ꏠ": [],
    "ꏡ": [],
    "ꏢ": [],
    "ꏣ": [],
    "ꏤ": [],
    "ꏥ": [],
    "ꏦ": [],
    "ꏧ": [],
    "ꏨ": [],
    "ꏩ": [],
    "ꏪ": [],
    "ꏫ": [],
    "ꏬ": [],
    "ꏭ": [],
    "ꏮ": [],
    "ꏯ": [],
    "ꏰ": [],
    "ꏱ": [],
    "ꏲ": [],
    "ꏳ": [],
    "ꏴ": [],
    "ꏵ": [],
    "ꏶ": [],
    "ꏷ": [],
    "ꏸ": [],
    "ꏹ": [],
    "ꏺ": [],
    "ꏻ": [],
    "ꏼ": [],
    "ꏽ": [],
    "ꏾ": [],
    "ꏿ": [],
    "ꐀ": [],
    "ꐁ": [],
    "ꐂ": [],
    "ꐃ": [],
    "ꐄ": [],
    "ꐅ": [],
    "ꐆ": [],
    "ꐇ": [],
    "ꐈ": [],
    "ꐉ": [],
    "ꐊ": [],
    "ꐋ": [],
    "ꐌ": [],
    "ꐍ": [],
    "ꐎ": [],
    "ꐏ": [],
    "ꐐ": [],
    "ꐑ": [],
    "ꐒ": [],
    "ꐓ": [],
    "ꐔ": [],
    "ꐕ": [],
    "ꐖ": [],
    "ꐗ": [],
    "ꐘ": [],
    "ꐙ": [],
    "ꐚ": [],
    "ꐛ": [],
    "ꐜ": [],
    "ꐝ": [],
    "ꐞ": [],
    "ꐟ": [],
    "ꐠ": [],
    "ꐡ": [],
    "ꐢ": [],
    "ꐣ": [],
    "ꐤ": [],
    "ꐥ": [],
    "ꐦ": [],
    "ꐧ": [],
    "ꐨ": [],
    "ꐩ": [],
    "ꐪ": [],
    "ꐫ": [],
    "ꐬ": [],
    "ꐭ": [],
    "ꐮ": [],
    "ꐯ": [],
    "ꐰ": [],
    "ꐱ": [],
    "ꐲ": [],
    "ꐳ": [],
    "ꐴ": [],
    "ꐵ": [],
    "ꐶ": [],
    "ꐷ": [],
    "ꐸ": [],
    "ꐹ": [],
    "ꐺ": [],
    "ꐻ": [],
    "ꐼ": [],
    "ꐽ": [],
    "ꐾ": [],
    "ꐿ": [],
    "ꑀ": [],
    "ꑁ": [],
    "ꑂ": [],
    "ꑃ": [],
    "ꑄ": [],
    "ꑅ": [],
    "ꑆ": [],
    "ꑇ": [],
    "ꑈ": [],
    "ꑉ": [],
    "ꑊ": [],
    "ꑋ": [],
    "ꑌ": [],
    "ꑍ": [],
    "ꑎ": [],
    "ꑏ": [],
    "ꑐ": [],
    "ꑑ": [],
    "ꑒ": [],
    "ꑓ": [],
    "ꑔ": [],
    "ꑕ": [],
    "ꑖ": [],
    "ꑗ": [],
    "ꑘ": [],
    "ꑙ": [],
    "ꑚ": [],
    "ꑛ": [],
    "ꑜ": [],
    "ꑝ": [],
    "ꑞ": [],
    "ꑟ": [],
    "ꑠ": [],
    "ꑡ": [],
    "ꑢ": [],
    "ꑣ": [],
    "ꑤ": [],
    "ꑥ": [],
    "ꑦ": [],
    "ꑧ": [],
    "ꑨ": [],
    "ꑩ": [],
    "ꑪ": [],
    "ꑫ": [],
    "ꑬ": [],
    "ꑭ": [],
    "ꑮ": [],
    "ꑯ": [],
    "ꑰ": [],
    "ꑱ": [],
    "ꑲ": [],
    "ꑳ": [],
    "ꑴ": [],
    "ꑵ": [],
    "ꑶ": [],
    "ꑷ": [],
    "ꑸ": [],
    "ꑹ": [],
    "ꑺ": [],
    "ꑻ": [],
    "ꑼ": [],
    "ꑽ": [],
    "ꑾ": [],
    "ꑿ": [],
    "ꒀ": [],
    "ꒁ": [],
    "ꒂ": [],
    "ꒃ": [],
    "ꒄ": [],
    "ꒅ": [],
    "ꒆ": [],
    "ꒇ": [],
    "ꒈ": [],
    "ꒉ": [],
    "ꒊ": [],
    "ꒋ": [],
    "ꒌ": [],
    // BELOW ARE RADICALS
    "꒐": [],
    "꒑": [],
    "꒒": [],
    "꒓": [],
    "꒔": [],
    "꒕": [],
    "꒖": [],
    "꒗": [],
    "꒘": [],
    "꒙": [],
    "꒚": [],
    "꒛": [],
    "꒜": [],
    "꒝": [],
    "꒞": [],
    "꒟": [],
    "꒠": [],
    "꒡": [],
    "꒢": [],
    "꒣": [],
    "꒤": [],
    "꒥": [],
    "꒦": [],
    "꒧": [],
    "꒨": [],
    "꒩": [],
    "꒪": [],
    "꒫": [],
    "꒬": [],
    "꒭": [],
    "꒮": [],
    "꒯": [],
    "꒰": [],
    "꒱": [],
    "꒲": [],
    "꒳": [],
    "꒴": [],
    "꒵": [],
    "꒶": [],
    "꒷": [],
    "꒸": [],
    "꒹": [],
    "꒺": [],
    "꒻": [],
    "꒼": [],
    "꒽": [],
    "꒾": [],
    "꒿": [],
    "꓀": [],
    "꓁": [],
    "꓂": [],
    "꓃": [],
    "꓄": [],
    "꓅": [],
    "꓆": [],
};

// existence check and auto sugar
{
    const vals = Array.from(new Set(Object.values(charStrokes).flat()));

    let problematic = false;

    for (const val of vals) {
        if (!(val in strokeExpansionRules)) {
            if ('23456'.includes(val[0])) {
                strokeExpansionRules[val] = [new Array(parseInt(val[0])).fill(val.slice(1))];
            } else {
                problematic = true;
                console.log(val);
            }
        }
    }

    if (problematic) {
        console.error("Non-symbol used in charStrokes definition! at:\n" +
            Object.entries(charStrokes)
                .filter(([, strokes]) => strokes.some(s => !(s in strokeExpansionRules)))
                .map(([key, value]) => [key,
                    value.filter(v => !(v in strokeExpansionRules))])
                .map(([key, value]) => `${value.map(s => "'" + s + "'").join(', ')} in ${key}`)
                .join('\n'));
    }
}

/**
 * @type {Object.<string, Object<string, number>[]>}
 */
const strokeExpansionRulesCleaned = Object.fromEntries(
    Object.entries(strokeExpansionRules)
        .map(([k, v]) => [k, v
            .map(x => typeof x === 'string' ? [x] : x)
            // turn string into string[]
            .map(arr => arrToCountObj(arr))
            // turn string[] into <string, number>
        ])
);

const inputtableStrokes = new Set(Object.values(strokeExpansionRules)
    .map(arr => arr.flat()).flat()
    .filter(elem => !strokeExpansionRules[elem] ||
        // VALUES THAT DO NOT APPEAR AS KEYS, OR
        strokeExpansionRules[elem].includes(elem)
        // VALUES IN IDENTITY MAPPINGS
    ));

const charStrokesExpanded = (function () {
    const memo = new Map();
    return Object.fromEntries(Object.entries(charStrokes)
        .map(([k, v]) => [k, expandStrokes(arrToCountObj(v), memo)]));
})();

/**
 * @type {Object.<string, Object<number, Set<string>>>}
 */
const charStrokesLookupReverse = {};

Object.entries(charStrokesExpanded).forEach(([char, countObjs]) => {
    countObjs.forEach(countObj => {
        Object.entries(countObj).forEach(([stroke, count]) => {
            if (!charStrokesLookupReverse[stroke]) {
                charStrokesLookupReverse[stroke] = {}
            }
            for (let i = 1; i <= count; ++i) {
                if (!charStrokesLookupReverse[stroke][i]) {
                    charStrokesLookupReverse[stroke][i] = new Set();
                }
                charStrokesLookupReverse[stroke][i].add(char);
            }
        });
    });
});

/**
 * 
 * @param {string[]} strokes
 * @returns {[string, bool][]}
 */
function resolveCharsFromStrokes(strokes) {
    const countObj = arrToCountObj(strokes);

    const sets = Object.entries(countObj)
        .map(([stroke, count]) =>
            charStrokesLookupReverse[stroke] &&
            charStrokesLookupReverse[stroke][count]);
    if (sets.length === 0 || sets.includes(undefined)) return [];

    const setsSorted = sets.sort((set1, set2) => set1.size - set2.size);
    const candidates = new Set(setsSorted[0]);

    for (const set of sets.slice(1)) {
        candidates.forEach(candidate => {
            if (!set.has(candidate)) {
                candidates.delete(candidate);
            }
        });
    }

    const ret = [];

    const prevChar = getPrevChar();

    for (const candidate of candidates) {
        const expansions = charStrokesExpanded[candidate];
        let match = false;
        let exact = false;
        for (const expansion of expansions) {
            if (Object.keys(expansion).length < Object.keys(countObj).length)
                continue;

            let expansionMatch = Object.keys(countObj)
                .every(key => key in expansion);
            let expansionExact = expansionMatch && Object.entries(expansion)
                .every(([key, value]) => key in countObj &&
                    countObj[key] === value);

            if (expansionMatch) match = true;
            if (expansionExact) {
                exact = true;
                break;
            }
        }
        if (match) ret.push([candidate, exact]);
    }

    if (prevChar !== undefined && compress(prevChar) !== undefined && ret.length > 0) {
        const withProbs = ret.map(elem => {
            const compressed = compress(elem[0]);
            const prob = compressed !== undefined ? getProb(prevChar, elem[0]) : 0;
            return { elem, prob };
        });

        withProbs.sort((a, b) => b.prob - a.prob);

        console.log('Sorted candidates by probability (descending):');
        withProbs.forEach(({ elem, prob }) => {
            console.log(`  ${elem[0]}: ${prob}`);
        });

        const sortedRet = withProbs.map(item => item.elem);

        ret.length = 0;
        ret.push(...sortedRet);
    } else if (ret.length > 0) {
        console.log('Skipping probability sort (prevChar undefined or compress(prevChar) undefined)');
    }

    return ret;
}

function getPrevChar() {
    const textarea = window.editor;
    if (!textarea) return null;

    const cursorPos = textarea.selectionStart;
    if (cursorPos === 0) return '\n';

    return textarea.value[cursorPos - 1];
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof charInfo === 'undefined') {
        alert(t('load_error'));
        return;
    }

    let currentStrokes = "";

    const strokeKeyboard = document.getElementById('stroke-keyboard');
    const strokeInputDisplay = document.getElementById('stroke-input-display');
    const strokeCharContainer = document.getElementById('stroke-char-buttons');
    const matchCountLabel = document.getElementById('match-count');
    const clearStrokeBtn = document.getElementById('clear-stroke-btn');

    function initStrokeKeyboard() {
        inputtableStrokes.forEach(stroke => {
            const btn = document.createElement('button');
            btn.textContent = stroke;
            btn.className = 'stroke-key-btn';
            btn.dataset.stroke = stroke;

            btn.addEventListener('click', () => {
                addStroke(stroke);
            });

            strokeKeyboard.appendChild(btn);
        });
    }

    function addStroke(stroke) {
        let strokeArray = currentStrokes.split('');
        strokeArray.push(stroke);
        strokeArray.sort();
        currentStrokes = strokeArray.join('');

        updateStrokeUI();
        filterCharsByStrokes();
    }

    function clearStrokes() {
        currentStrokes = "";
        updateStrokeUI();
        filterCharsByStrokes();
    }

    function updateStrokeUI() {
        strokeInputDisplay.textContent = currentStrokes;
        if (currentStrokes.length > 0) {
            strokeInputDisplay.style.backgroundColor = "#eef2ff";
        } else {
            strokeInputDisplay.style.backgroundColor = "#fff";
        }
    }

    function filterCharsByStrokes() {
        strokeCharContainer.innerHTML = '';

        if (currentStrokes.length === 0) {
            strokeCharContainer.innerHTML = `<p class="hint">${t('stroke_hint')}</p>`;
            matchCountLabel.textContent = '0';
            return;
        }

        const inputStrokes = currentStrokes;
        const matchedChars = resolveCharsFromStrokes(currentStrokes);

        matchCountLabel.textContent = matchedChars.length;

        if (matchedChars.length === 0) {
            strokeCharContainer.innerHTML = `<p class="hint">${t('stroke_no_match')}</p>`;
        } else {
            matchedChars.forEach(([char, exact]) => {
                const btn = createCharButton(char, exact);
                if (btn) strokeCharContainer.appendChild(btn);
            });
        }
    }

    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('panel-stroke').classList.contains('active')) return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        const key = e.key.toUpperCase();
        if (inputtableStrokes.has(key)) {
            e.preventDefault();
            addStroke(key);
        } else if (e.key === 'Escape') {
            clearStrokes();
        }
    });

    clearStrokeBtn.addEventListener('click', clearStrokes);

    initStrokeKeyboard();
});
