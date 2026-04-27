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

const strokeExpansionRulesCleaned = Object.fromEntries(
    Object.entries(strokeExpansionRules)
        .filter(([k, v]) => v.length != 1 || k != v[0])
        // remove identity mappings
        .map(([k, v]) => [k, 
            v.map(x => typeof x === 'string'
                ? [x] : x )]) // turn string into string[]
);

const inputtableStrokes = new Set(Object.values(strokeExpansionRules)
    .map(arr => arr.flat()).flat()
    .filter(elem => !strokeExpansionRules[elem] ||
        // VALUES THAT DO NOT APPEAR AS KEYS, OR
        strokeExpansionRules[elem].length == 1 &&
        strokeExpansionRules[elem][0] === elem
        // VALUES IN IDENTITY MAPPINGS
));

/**
 * 
 * @param {string[]} strokes 
 * @returns {string[][]}
 */
function expandStrokes(strokes) {
    // TO-DO: implement
}

const charStrokes = {
    "": [],
};

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

    function isMatch(input, target) {
        const inputCounts = {};
        for (let char of input) {
            inputCounts[char] = (inputCounts[char] || 0) + 1;
        }

        const targetCounts = {};
        for (let char of target) {
            targetCounts[char] = (targetCounts[char] || 0) + 1;
        }

        for (let char in inputCounts) {
            if (!targetCounts[char] || targetCounts[char] < inputCounts[char]) {
                return false;
            }
        }

        return true;
    }

    function filterCharsByStrokes() {
        strokeCharContainer.innerHTML = '';

        if (currentStrokes.length === 0) {
            strokeCharContainer.innerHTML = `<p class="hint">${t('stroke_hint')}</p>`;
            matchCountLabel.textContent = '0';
            return;
        }

        const inputStrokes = currentStrokes;
        const matchedChars = [];

        for (const char in charInfo) {
            const strokes = charStrokes[char];
            if (!strokes) continue;

            if (isMatch(inputStrokes, strokes)) {
                matchedChars.push(char);
            }
        }

        matchCountLabel.textContent = matchedChars.length;

        if (matchedChars.length === 0) {
            strokeCharContainer.innerHTML = `<p class="hint">${t('stroke_no_match')}</p>`;
        } else {
            matchedChars.forEach(char => {
                const btn = createCharButton(char);
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