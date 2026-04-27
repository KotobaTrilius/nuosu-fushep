/**
 * @type {Object.<string, (string | string[])[]>}
 */
const strokeExpansionRules = {
    // SYMBOL : CAN BE RETRIEVED BY ...
    // string as value -> choice of resolution
    // string[] as value -> expansion
    'H' : ['H'],
    'I' : ['I'],
    'V1': ['V'],
    'V2': ['V'],
    'R1': ['R'],
    'R2': ['R', 'H'],
    'R3': ['R', 'I'],
    'R4': ['R', 'V1'],
    'R5': ['R', 'V2'],
    'O' : ['O'],
    'Q' : ['Q'],
    'P' : ['P'],

    'D1': ['D'],
    'D2': ['D', ['H', 'H', 'I']],
    'C1': ['C'],
    'C2': ['C', ['H', 'H', 'I']],
    'A' : ['A'],
    'U1': ['U'],
    'U2': ['U'],
    'U3': ['U'],
    'S' : ['S'],

    'J1': ['J', ['I', 'V2']],
    'J2': ['J'],
    'L1': ['L', ['I', 'V1']],
    'L2': ['L'],
    'F' : ['F', ['I', 'V2']],
    'Z' : ['Z', ['I', 'V2', 'V2']],
    'N1': ['N', ['I', 'I', 'V2']],
    'N2': ['N', ['I', 'V2', 'V2']],
    'M1': ['M', ['I', 'I', 'V2', 'V2']],
    'M2': ['M', ['I', 'I', 'V2', 'V2']],

    'G1': ['G', ['I', 'C']],
    'G2': ['G', ['I', 'D']],
    'G3': ['G', ['I', 'I', 'I', 'V1', 'V2']],

    'X' : ['X', ['V1', 'V2']],
    'T' : ['T', ['H', 'I']],
    'K1': ['K', ['I', 'V1', 'V2']],
    'K2': ['K', ['H', 'V1', 'V2']],
    'B1': ['B', ['I', 'I', 'V1', 'V2']],
    'B2': ['B', ['H', 'H', 'V1', 'V2']],
    'B3': ['B', ['H', 'H', 'V1', 'V2']],
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
        .map(([k, v]) => [k, v.filter(arr => arr != k)])
        .filter(([k, v]) => v.length > 0)
        // remove identity mappings
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

/**
 * 
 * @param {Object.<string, number>} strokes
 * @param {Map} memo
 * @returns {Object.<string, number>[]}
 */
function expandStrokes(strokes, memo) {
    const key = JSON.stringify(Object.entries(strokes).sort());
    if (memo.has(key)) return memo.get(key);
    
    const sym = Object.keys(strokes).find(s => s in strokeExpansionRulesCleaned);
    if (!sym) {
        return [strokes];
    }
    
    const total = strokes[sym];
    const variants = strokeExpansionRulesCleaned[sym];
    const results = [];
    
    function allocate(remain, idx, distribution) {
        if (idx === variants.length - 1) {
            distribution.push(remain);
            
            const next = { ...strokes };
            delete next[sym];
            
            for (let i = 0; i < variants.length; i++) {
                const times = distribution[i];
                if (times === 0) continue;
                const varCnt = variants[i];
                for (const [s, c] of Object.entries(varCnt)) {
                    next[s] = (next[s] || 0) + c * times;
                }
            }
            
            for (const sub of expandStrokes(next, memo)) {
                results.push(sub);
            }
            
            distribution.pop();
            return;
        }
        
        for (let i = 0; i <= remain; i++) {
            distribution.push(i);
            allocate(remain - i, idx + 1, distribution);
            distribution.pop();
        }
    }
    
    allocate(total, 0, []);
    
    const unique = new Map();
    for (const r of results) {
        const k = JSON.stringify(Object.entries(r).sort());
        if (!unique.has(k)) unique.set(k, r);
    }
    const out = Array.from(unique.values());
    
    memo.set(key, out);
    return out;
}

const charStrokes = {
    // for test
    'ddip': ['N1', 'I', 'H', 'H'],
    'yy': ['I', 'C1'],
};

if (Object.values(charStrokes).flat().some(x => !(x in strokeExpansionRules))) {
    console.error.log("Non-symbol used in charStrokes definition!");
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
    const ret = new Set(setsSorted[0]);

    for (let set of sets.slice(1)) {
        ret.forEach(candidate => {
            if (!set.has(candidate)) {
                ret.delete(candidate);
            }
        });
    }

    return ret.values().map(char => [char, 
        charStrokesExpanded[char].some(cObj => 
            Object.entries(cObj).every(([k, v]) => countObj[k] === v))]);
            // reverse condition is not needed
            // as such would be filtered right before
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
                const btn = createCharButton(charLookupReverse[char], exact);
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
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            // TO-DO: delete strokes
        } else if (e.key === 'Escape') {
            clearStrokes();
        }
    });

    clearStrokeBtn.addEventListener('click', clearStrokes);

    initStrokeKeyboard();
});