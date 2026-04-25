const initials = {
    "m": "m",
    "hm": "m̥",
    "n": "n",
    "hn": "n̥",
    "ny": "ɲ",
    "ng": "ŋ",
    "b": "p",
    "p": "pʰ",
    "bb": "b",
    "nb": "mb",
    "d": "t",
    "t": "tʰ",
    "dd": "d",
    "nd": "nd",
    "z": "ts",
    "c": "tsʰ",
    "zz": "dz",
    "nz": "ndz",
    "zh": "ʈʂ",
    "ch": "ʈʂʰ",
    "rr": "ɖʐ",
    "nr": "ɳɖʐ",
    "j": "tɕ",
    "q": "tɕʰ",
    "jj": "dʑ",
    "nj": "ɲdʑ",
    "g": "k",
    "k": "kʰ",
    "gg": "g",
    "mg": "ŋg",
    "f": "f",
    "v": "v",
    "hl": "ɬ",
    "l": "l",
    "s": "s",
    "ss": "z",
    "sh": "ʂ",
    "r": "ʐ",
    "x": "ɕ",
    "y": "ʑ",
    "h": "x",
    "w": "ɣ",
    "hx": "h"
}

const finals = {
    "i": "i",
    "y": "z",
    "yr": "z̙",
    "e": "ɯ",
    "u": "u",
    "ur": "u̙",
    "o": "o",
    "ie": "ɛ",
    "uo": "ɔ",
    "a": "ɒ"
}

const tones = {
    "": "̄",
    "t": "̋",
    "x": "́",
    "p": "̂"
}

function toIPA(pinyin) {
    let remaining = pinyin;
    let initialIPA = "";
    let finalIPA = "";
    let toneMark = tones[""];

    const lastChar = remaining.slice(-1);
    if (["t", "x", "p"].includes(lastChar)) {
        toneMark = tones[lastChar];
        remaining = remaining.slice(0, -1);
    }

    const initialKeys = Object.keys(initials).sort((a, b) => b.length - a.length);
    for (const key of initialKeys) {
        if (remaining.startsWith(key)) {
            initialIPA = initials[key];
            remaining = remaining.slice(key.length);
            break;
        }
    }

    if (finals[remaining]) {
        finalIPA = finals[remaining];
    } else {
        console.warn(`Unknown final: "${remaining}" in syllable "${pinyin}"`);
        return null;
    }

    return initialIPA + finalIPA + toneMark;
}