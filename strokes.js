/**
 * @type {Object.<string, (string | string[])[]>}
 */
const strokeExpansionRules = {
    // SYMBOL : CAN BE RETRIEVED BY ...
    // string as value -> choice of resolution
    // string[] as value -> expansion
    '-' : ['H'],
    '|' : ['I'],
    'H1': ['H', ['|', '-', '|']],
    'I1': ['I', ['-', '|', '-']],
    '/': ['V'],
    '\\': ['V'],
    'R1': ['R'],
    'R2': ['R', '-'],
    'R3': ['R', '|'],
    'R4': ['R', '/'],
    'R5': ['R', '\\'],
    'O' : ['O'],
    'Q' : ['Q'],
    'P' : ['P'],

    'D1': ['D'],
    'D2': ['D', ['-', '-', '|']],
    'C1': ['C'],
    'C2': ['C', ['-', '-', '|']],
    'A' : ['A'],
    'U1': ['U'],
    'U2': ['U'],
    'U3': ['U'],
    'S' : ['S'],

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
    'F' : ['F', ['|', '\\']],
    'Z' : ['Z', ['|', '\\', '\\']],
    'N1': ['N', ['F', '|'], ['|', 'J1']],
    'N1V': ['N1', ['F', '/']],
    'N2': ['N', ['J1', '\\']],
    'M1': ['M', ['F', 'F'], ['Z', '|'], ['N1', '\\']],
    'M2': ['M', ['J1', 'J1'], ['Z', '|'], ['N1', '\\']],
    'M3': ['M', ['/', '/', '\\', '\\']],

    'G1': ['G', ['|', 'C']],
    'G2': ['G', ['|', 'D']],
    'G3': ['G', ['|', '|', '|', '/', '\\']],

    'X' : ['X', ['/', '\\']],
    'T1': ['T', ['-', '|']],
    'TL': ['T', ['L2', '-']],
    'TF': [['T', '\\'], ['F', '-']],
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
    "ꀀ": ['U1','-','-'],
    "ꀁ": ['U1','-','D1','A'],
    "ꀂ": ['U1','-','D1'],
    "ꀃ": ['C1','|','D1','\\'],
    "ꀄ": ['O','U1','-'],
    "ꀅ": ['O','F','J1','A'],
    "ꀆ": ['O','F','J1'],
    "ꀇ": ['O','C1','|','|'],
    "ꀈ": ['N1','\\'],
    "ꀉ": ['Z','\\','|','A'],
    "ꀊ": ['Z','\\','|'],
    "ꀋ": ['Z','\\','C1'],
    "ꀌ": ['H1', 'R3', 'R3', 'A'],
    "ꀍ": ['H1', 'R3', 'R3'],
    "ꀎ": ['O','O','U1'],
    "ꀏ": ['O','|','ER2'],
    "ꀐ": ['Z','O','R3','A'],
    "ꀑ": ['Z','O','R3'],
    "ꀒ": ['Z','O'],
    "ꀓ": ['EL3','-','Z','A'],
    "ꀔ": ['EL3','-','Z'],
    "ꀕ": ['ET2','2R3'],
    "ꀖ": ['O','X'],
    "ꀗ": ['|','-','C1','A'],
    "ꀘ": ['|','-','C1'],
    "ꀙ": ['N1','-','C1'],
    "ꀚ": ['O','-','C1'],
    "ꀛ": ['O','/','A'],
    "ꀜ": ['O','/'],
    "ꀝ": ['O','EL2'],
    "ꀞ": ['O','H1'],
    "ꀟ": ['ET2','H1'],
    "ꀠ": ['ET2','H1'],
    "ꀡ": ['/','\\','H1'],
    "ꀢ": ['G2','I1','A'],
    "ꀣ": ['G2','I1'],
    "ꀤ": ['I1'],
    "ꀥ": ['C1','ER2','\\','/'],
    "ꀦ": ['O','I1','A'],
    "ꀧ": ['O','I1'],
    "ꀨ": ['I1', 'I1'],
    "ꀩ": ['EB2','U1','R3','A'],
    "ꀪ": ['EB2','U1','R3'],
    "ꀫ": ['I1','X'],
    "ꀬ": ['O','|','R3'],
    "ꀭ": ['J1','|','A'],
    "ꀮ": ['J1','|'],
    "ꀯ": ['C1','C1'],
    "ꀰ": ['U2','-','-','A'],
    "ꀱ": ['U2','-','-'],
    "ꀲ": ['Z','X'],
    "ꀳ": ['Z','M3','A'],
    "ꀴ": ['Z','M3'],
    "ꀵ": ['TF','F','U1'],
    "ꀶ": ['C1','|','4R3','F','A'],
    "ꀷ": ['C1','|','4R3','F'],
    "ꀸ": ['C1','F','-','-'],
    "ꀹ": ['O','L1','A'],
    "ꀺ": ['O','L1'],
    "ꀻ": ['X','2R3'],
    "ꀼ": ['O','-','2R3','A'],
    "ꀽ": ['O','-','2R3'],
    "ꀾ": ['O','R3','ET2'],
    "ꀿ": ['H1'],
    "ꁀ": ['U1','T1','A'],
    "ꁁ": ['U1','T1'],
    "ꁂ": ['U1','-','|'],
    "ꁃ": ['C1','-','|','2R3','R3','A'],
    "ꁄ": ['C1','-','|','2R3','R3'],
    "ꁅ": ['C1','T1','J2'],
    "ꁆ": ['O','-','-','EL2'],
    "ꁇ": ['U1','|','-','-','A'],
    "ꁈ": ['U1','|','-','-'],
    "ꁉ": ['C1','T1','-'],
    "ꁊ": ['G3'],
    "ꁋ": ['ER3','|','A'],
    "ꁌ": ['ER3','|'],
    "ꁍ": ['Z','C1','R3'],
    "ꁎ": ['O','R3','T1','|','A'],
    "ꁏ": ['O','R3','T1','|'],
    "ꁐ": ['C1','F'],
    "ꁑ": ['B1','R3','A'],
    "ꁒ": ['B1','R3'],
    "ꁓ": ['F','TF','|','U1'],
    "ꁔ": ['F','2R3','C1','A'],
    "ꁕ": ['F','2R3','C1'],
    "ꁖ": ['O','-','-','ET2'],
    "ꁗ": ['X','|','A'],
    "ꁘ": ['X','|'],
    "ꁙ": ['O','C1','D1'],
    "ꁚ": ['O','ET2','R3'],
    "ꁛ": ['Z','C1','C1','-','A'],
    "ꁜ": ['Z','C1','C1','-'],
    "ꁝ": ['D1','C1','-'],
    "ꁞ": ['D1','C1','-','-','-'],
    "ꁟ": ['K1','K1','A'],
    "ꁠ": ['K1','K1'],
    "ꁡ": ['ET2','-','-'],
    "ꁢ": ['J1','N1','-','-','A'],
    "ꁣ": ['J1','N1','-','-'],
    "ꁤ": ['O','4R3'],
    "ꁥ": ['C1','|','R3'],
    "ꁦ": ['X','T1','-','A'],
    "ꁧ": ['X','T1','-'],
    "ꁨ": ['EB2','A','R3','U1'],
    "ꁩ": ['N1','N1','R2','-','A'],
    "ꁪ": ['N1','N1','R2','-'],
    "ꁫ": ['N1','J1','R2','/'],
    "ꁬ": ['N1','D1','D1','C1','C1'],
    "ꁭ": ['Z','N1','R3','A'],
    "ꁮ": ['Z','N1','R3'],
    "ꁯ": ['M1','F','R3'],
    "ꁰ": ['N1V','A','R3','A'],
    "ꁱ": ['N1V','A','R3'],
    "ꁲ": ['Z','Z','-','R3'],
    "ꁳ": ['Z','|','|','A'],
    "ꁴ": ['Z','|','|'],
    "ꁵ": ['Z','\\','\\'],
    "ꁶ": ['F','T1','|','2R3'],
    "ꁷ": ['O','TL','R3','A'],
    "ꁸ": ['O','TL','R3'],
    "ꁹ": ['F','TF','-'],
    "ꁺ": ['T1','-','-','\\','A'],
    "ꁻ": ['T1','-','-','\\'],
    "ꁼ": ['T1','-'],
    "ꁽ": ['Q','-','|','2R3'],
    "ꁾ": ['X','-','-','A'],
    "ꁿ": ['X','-','-'],
    "ꂀ": ['X','|','|'],
    "ꂁ": ['G3','/','|'],
    "ꂂ": ['ET2','T1'],
    "ꂃ": ['ET2','T1','U1'],
    "ꂄ": ['ET2','R3','U1'],
    "ꂅ": ['G1','|','-'],
    "ꂆ": ['O','C1','2R3','A'],
    "ꂇ": ['O','C1','2R3'],
    "ꂈ": ['O','|','R3'],
    "ꂉ": ['O','O','-','2R3','A'],
    "ꂊ": ['O','O','-','2R3'],
    "ꂋ": ['O','-','C1','2R3'],
    "ꂌ": ['U1','-','|','3R3','A'],
    "ꂍ": ['U1','-','|','3R3'],
    "ꂎ": ['M1','D1','ER2'],
    "ꂏ": ['T1','B1','A'],
    "ꂐ": ['T1','B1'],
    "ꂑ": ['Z','2R3'],
    "ꂒ": ['T1','U1','A','A'],
    "ꂓ": ['T1','U1','A'],
    "ꂔ": ['O','O','|','/','\\'],
    "ꂕ": ['J2','U1','2R3','A'],
    "ꂖ": ['J2','U1','2R3'],
    "ꂗ": ['N1','2R3'],
    "ꂘ": ['Z','\\','R5','R5','R5'],
    "ꂙ": ['N1','O','A'],
    "ꂚ": ['N1','O'],
    "ꂛ": ['F','D1','-'],
    "ꂜ": ['J2','N1','/','A'],
    "ꂝ": ['J2','N1','/'],
    "ꂞ": ['R3','M1','\\'],
    "ꂟ": ['F','C1','O'],
    "ꂠ": ['F','3R3','C1','A'],
    "ꂡ": ['F','3R3','C1'],
    "ꂢ": ['S','O'],
    "ꂣ": ['B2','R3'],
    "ꂤ": ['J1','4R3','A'],
    "ꂥ": ['J1','4R3'],
    "ꂦ": ['O','|','4R3'],
    "ꂧ": ['U1','3R3','A'],
    "ꂨ": ['U1','3R3'],
    "ꂩ": ['J1','2R3','\\','A'],
    "ꂪ": ['J1','2R3','\\'],
    "ꂫ": ['N1','3R3','3R3'],
    "ꂬ": ['T1','O','ET2','2R3','A'],
    "ꂭ": ['T1','O','ET2','2R3'],
    "ꂮ": ['O','EB2','-','R2'],
    "ꂯ": ['M2','/','\\','A'],
    "ꂰ": ['M2','/','\\'],
    "ꂱ": ['M2','-','-'],
    "ꂲ": ['O','X','R3','A'],
    "ꂳ": ['O','X','R3'],
    "ꂴ": ['M2','2R3'],
    "ꂵ": ['T1','F','F'],
    "ꂶ": ['O','-','A'],
    "ꂷ": ['O','-'],
    "ꂸ": ['ET2','T1','-'],
    "ꂹ": ['U1','3R5'],
    "ꂺ": [],
    "ꂻ": [],
    "ꂼ": [],
    "ꂽ": [],
    "ꂾ": [],
    "ꂿ": [],
    "ꃀ": [],
    "ꃁ": [],
    "ꃂ": [],
    "ꃃ": [],
    "ꃄ": [],
    "ꃅ": [],
    "ꃆ": [],
    "ꃇ": [],
    "ꃈ": [],
    "ꃉ": [],
    "ꃊ": [],
    "ꃋ": [],
    "ꃌ": [],
    "ꃍ": [],
    "ꃎ": [],
    "ꃏ": [],
    "ꃐ": [],
    "ꃑ": [],
    "ꃒ": [],
    "ꃓ": [],
    "ꃔ": [],
    "ꃕ": [],
    "ꃖ": [],
    "ꃗ": [],
    "ꃘ": [],
    "ꃙ": [],
    "ꃚ": [],
    "ꃛ": [],
    "ꃜ": [],
    "ꃝ": [],
    "ꃞ": [],
    "ꃟ": [],
    "ꃠ": [],
    "ꃡ": [],
    "ꃢ": [],
    "ꃣ": [],
    "ꃤ": [],
    "ꃥ": [],
    "ꃦ": [],
    "ꃧ": [],
    "ꃨ": [],
    "ꃩ": [],
    "ꃪ": [],
    "ꃫ": [],
    "ꃬ": [],
    "ꃭ": [],
    "ꃮ": [],
    "ꃯ": [],
    "ꃰ": [],
    "ꃱ": [],
    "ꃲ": [],
    "ꃳ": [],
    "ꃴ": [],
    "ꃵ": [],
    "ꃶ": [],
    "ꃷ": [],
    "ꃸ": [],
    "ꃹ": [],
    "ꃺ": [],
    "ꃻ": [],
    "ꃼ": [],
    "ꃽ": [],
    "ꃾ": [],
    "ꃿ": [],
    "ꄀ": [],
    "ꄁ": [],
    "ꄂ": [],
    "ꄃ": [],
    "ꄄ": [],
    "ꄅ": [],
    "ꄆ": [],
    "ꄇ": [],
    "ꄈ": [],
    "ꄉ": [],
    "ꄊ": [],
    "ꄋ": [],
    "ꄌ": [],
    "ꄍ": [],
    "ꄎ": [],
    "ꄏ": [],
    "ꄐ": [],
    "ꄑ": [],
    "ꄒ": [],
    "ꄓ": [],
    "ꄔ": [],
    "ꄕ": [],
    "ꄖ": [],
    "ꄗ": [],
    "ꄘ": [],
    "ꄙ": [],
    "ꄚ": [],
    "ꄛ": [],
    "ꄜ": [],
    "ꄝ": [],
    "ꄞ": [],
    "ꄟ": [],
    "ꄠ": [],
    "ꄡ": [],
    "ꄢ": [],
    "ꄣ": [],
    "ꄤ": [],
    "ꄥ": [],
    "ꄦ": [],
    "ꄧ": [],
    "ꄨ": [],
    "ꄩ": [],
    "ꄪ": [],
    "ꄫ": [],
    "ꄬ": [],
    "ꄭ": [],
    "ꄮ": [],
    "ꄯ": [],
    "ꄰ": [],
    "ꄱ": [],
    "ꄲ": [],
    "ꄳ": [],
    "ꄴ": [],
    "ꄵ": [],
    "ꄶ": [],
    "ꄷ": [],
    "ꄸ": [],
    "ꄹ": [],
    "ꄺ": [],
    "ꄻ": [],
    "ꄼ": [],
    "ꄽ": [],
    "ꄾ": [],
    "ꄿ": [],
    "ꅀ": [],
    "ꅁ": [],
    "ꅂ": [],
    "ꅃ": [],
    "ꅄ": [],
    "ꅅ": [],
    "ꅆ": [],
    "ꅇ": [],
    "ꅈ": [],
    "ꅉ": [],
    "ꅊ": [],
    "ꅋ": [],
    "ꅌ": [],
    "ꅍ": [],
    "ꅎ": [],
    "ꅏ": [],
    "ꅐ": [],
    "ꅑ": [],
    "ꅒ": [],
    "ꅓ": [],
    "ꅔ": [],
    "ꅕ": [],
    "ꅖ": [],
    "ꅗ": [],
    "ꅘ": [],
    "ꅙ": [],
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

const charStrokesExpanded = (function() {
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

    return ret;
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
