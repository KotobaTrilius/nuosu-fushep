const radicalMap = {
    "꒐": {
        name: "ꐈꀨ",
        name_trans: "QOT",
        syllables: [
            [1, ["yy", "yyx", "pu", "pux", "xy", "xyx", "nzy"]],
            [2, ["nbiep", "bbi", "bbix", "nyot", "kut", "ddu", "ddux", "hly", "hlyx", "nyup", "jjur", "jjurx", "ndu", "ndux", "bbot", "a", "ax", "fo", "fox", "zzyp", "shyt", "bi", "bix", "pat", "nbup", "xyr"]],
            [3, ["qot", "nzip", "zhe", "zhex", "hmi", "hmix", "zhy", "zhyx", "hxe", "hxex", "shut", "lyt", "huop", "jju", "jjux", "ddip", "dit", "jji", "jjix", "nry", "nryx", "nbap", "nrap", "nyu", "nyux", "ba", "bax", "bat", "ruop", "nryp", "nzyt", "ddup"]],
            [4, ["gge", "ggex", "uo", "uox", "quo", "quox", "bap", "fu", "fux", "zit", "ddiep", "mguo", "mguox", "hla", "hlax", "bbo", "bbox", "rur", "rurx", "fop"]],
            [5, ["lat", "ssyt", "ddie", "ddiex", "vyr", "vyrx", "zie", "ziex", "yyr", "yyrx", "rut", "vie"]]
        ]
    },
    "꒑": {
        name: "ꆹꀨ",
        name_trans: "LI",
        vars: ["꒒"],
        syllables: [
            [1, ["li", "lix", "liep", "ggo", "ggox", "bu", "bux", "nji", "njix", "njit"]],
            [2, ["nge", "ngex", "duo", "duox", "xip", "ku", "kux", "kur", "kurx", "dut", "qup", "tiep", "mu", "mux", "shu", "shux", "vo", "vox", "ngop", "sie", "siex", "zhuop", "zzep", "ggi", "ggix", "gguot", "me", "mex", "viet"]],
            [3, ["liet", "hxiet", "bbuo", "bbuox", "ndi", "ndix", "kit", "ti", "tix", "mur", "murx", "go", "gox", "hmy", "hmyx", "mut", "sit", "sat", "ngap", "bbep", "qie", "qiex", "su", "sux", "hlo", "hlox", "ndap", "zu", "zux", "hmie", "hmiex", "puop", "quot", "yup", "zuop"]],
            [4, ["hmu", "hmux", "te", "tex", "rruo", "rruox", "rrot", "tuop", "fat", "shap", "nyie"]],
            [5, ["sa", "sax", "sur", "surx", "ni", "nix", "chyp"]]
        ]
    },
    "꒓": {
        name: "ꑍꀨ",
        name_trans: "NYIP",
        syllables: [
            [1, ["nyip", "ci", "cix", "kop", "la", "lax", "hit", "ggie"]],
            [2, ["suo", "suox", "suop", "sip", "hxep", "huo", "huox", "hmap", "dur", "durx", "hni", "hnix", "tep", "mo", "mox", "cha", "chax", "chat", "zhuo", "zhuox", "zhot", "hnip", "rat", "jyt", "wep", "luo", "luox", "zzu", "zzux", "ie", "iex", "ciep", "cit", "xo", "xox", "ssop", "he", "hex", "rrut", "ruo", "ruox", "ciet", "mgie", "mgiex", "rryp", "zhu"]],
            [3, ["nyi", "nyix", "hnit", "huot", "se", "sex", "fut", "sha", "shax", "zzur", "zzurx", "nze", "nzex", "ziep", "hniet", "njuo", "njuox", "jjo", "jjox", "mat", "mga", "mgax", "zho", "zhox", "xop", "byp", "rra", "rrax", "wuop", "nbip"]],
            [4, ["ddot", "vyt", "we", "wex", "she", "shex", "shep", "pyp", "nru", "nrux", "ze", "zex", "chuot"]],
            [5, ["nbit", "nzap", "jjyp"]]
        ]
    },
    "꒔": {
        name: "ꋍꀨ",
        name_trans: "CYP",
        syllables: [
            [0, ["cyp"]],
            [1, ["ge", "gex", "hxo", "hxox", "sse", "ssex", "nuo", "nuox", "dop", "lo", "lox", "ggot", "by", "byx", "hie", "hiex", "cuo"]],
            [2, ["ne", "nex", "ddi", "ddix", "yot", "hxa", "hxax", "fi", "fix", "ndep", "pup", "bbyp", "hmit", "bby", "bbyx", "yip", "tot", "niep", "nryr", "nryrx", "yur", "yurx", "vap", "de", "dex", "tie", "tiex", "tit", "chop", "ap", "nzat", "hlyp", "njyp", "kuop", "vut", "ryp", "nyo", "nyox", "nut", "e", "ex", "byt"]],
            [3, ["nup", "nu", "nux", "vyp", "yiep", "muo", "muox", "yuo", "yuox", "zhur", "zhurx", "chuo", "chuox", "ngie", "ngiex", "nza", "nzax", "nzit", "bbyt"]],
            [4, ["hxap", "ggep", "so", "sox", "ko", "kox", "kuo", "kuox", "nur", "nurx", "yuot", "tur", "turx", "zzup", "hmat", "chot", "ndie", "ndiex", "ngiep"]],
            [5, ["gget", "jiet"]]
        ]
    },
    "꒕": {
        name: "ꌬꀨ",
        name_trans: "SSI",
        syllables: [
            [1, ["at", "tip", "hna", "hnax", "ggut", "kie", "kiex", "nzop"]],
            [2, ["gip", "yie", "yiex", "hmiep", "fur", "furx", "jyr", "jyrx", "zzy", "zzyx", "lit", "bbu", "bbux", "hat", "hliep", "ssi", "ssix", "bip", "zep", "myt", "vop", "vup"]],
            [3, ["kot", "hnat", "rret", "zhet", "rryr", "rryrx", "ssot", "zzo", "zzox", "jjot", "nret"]],
            [4, ["zzip", "ry", "ryx", "ssip", "zat", "chyr", "chyrx", "giep"]],
            [5, ["ddop", "ssit"]]
        ]
    },
    "꒖": {
        name: "ꈥꀨ",
        name_trans: "GGOP",
        syllables: [
            [1, ["rry", "rryx", "ggop", "shyp", "nga"]],
            [2, ["nyit", "hnie", "hniex", "njy", "njyx", "syp", "nryt", "ndot", "ggap", "le", "lex", "ndo", "ndox", "ggat", "mgap", "nre", "nrex", "zo", "zox", "fy", "fyx", "hmuo", "hmuox", "fyt"]],
            [3, ["tuo", "tuox", "rryt", "ssut"]],
            [4, ["ndop", "ssup", "shet", "jie"]],
            [5, ["hmyp"]]
        ]
    },
    "꒗": {
        name: "ꇱꀨ",
        name_trans: "GEP",
        vars: ["꒘"],
        syllables: [
            [1, ["gep", "di", "dix", "do", "dox", "mi"]],
            [2, ["hlut", "bbup", "nep", "nop", "fip", "nda", "ndax", "get", "ndat", "cup", "njyr", "njyrx", "na", "nax", "ssy", "ssyx", "hlyr", "hlyrx", "mip", "miep", "hmuop", "yut", "nbyp", "njur"]],
            [3, ["nap", "to", "tox", "kap", "lap", "hnop", "hnox", "hnut", "hnot", "ssu", "ssux", "chyt", "hniep"]],
            [4, ["no"]]
        ]
    },
    "꒙": {
        name: "ꉆꀨ",
        name_trans: "HXIT",
        syllables: [
            [1, ["hxit", "lyp", "hma"]],
            [2, ["ji", "jix", "ggiep", "ly", "lyx", "lep", "wa", "wax", "wap", "bbur", "bburx", "chy", "chyx", "dep", "rrep", "cho", "chox", "zhyp"]],
            [3, ["zziep", "ddit", "shuop", "fa", "fax", "zzit", "vip", "bbe"]],
            [4, ["ndit", "fap", "ssie", "ssiex", "ijyt", "ssiep"]],
            [5, ["zha"]]
        ]
    },
    "꒚": {
        name: "ꇙꀨ",
        name_trans: "LYR",
        vars: ["꒛"],
        syllables: [
            [0, ["lyr"]],
            [1, ["hmop"]],
            [2, ["sot", "njyt", "zhyt", "ryt"]],
            [3, ["gga"]],
            [4, ["sop", "sep", "bbut", "zyt", "jip"]]
        ]
    },
    "꒜": {
        name: "ꃀꀨ",
        name_trans: "MOP",
        vars: ["꒝", "꒞"],
        syllables: [
            [0, ["mop", "put"]],
            [1, ["gi", "gix", "hlap", "zip", "yo", "yox", "jup", "sap", "nrop"]],
            [2, ["nro", "nrox", "git", "cap", "nbut", "nbot", "zhap", "chur"]],
            [3, ["yi", "yix", "rrop", "buo", "buox", "yuop", "luot"]],
            [5, ["ssyp"]]
        ]
    },
    "꒟": {
        name: "ꉔꀨ",
        name_trans: "HXUO",
        vars: ["꒠"],
        syllables: [
            [0, ["hxuo"]],
            [1, ["bup", "ju", "jux", "vi", "vix", "hxie", "hxiex", "ngot", "tat", "rre", "rrex", "hxot", "jy"]],
            [2, ["die", "diex", "dde", "ddex", "njop", "rrur", "rrurx", "jjop", "rup", "iyp", "zhyr", "zhyrx", "shot", "njup", "bbiep"]],
            [3, ["nju", "njux", "mgu", "mgux", "vu", "vux", "jiep", "hluo", "hluox", "hne", "hnex", "tap", "kat", "wuo", "wuox", "bbie"]],
            [4, ["shyr", "shyrx", "nyiep", "nyiet", "bbat", "hnep", "rrup", "pop"]],
            [5, ["puo", "puox", "mge", "mgex", "jiuo"]]
        ]
    },
    "꒡": {
        name: "ꇤꀨ",
        name_trans: "GA",
        vars: ["꒢", "꒣"],
        syllables: [
            [1, ["syr", "syrx", "sy", "syx", "qy", "qyx", "ga", "gax", "kup", "cyt"]],
            [2, ["my", "myx", "syt", "xyp", "vit", "qyp", "yop", "gie", "giex", "hlyt", "juo", "juox", "jop", "ket", "sut", "hxuot", "hxuop", "jjuop", "fyp"]],
            [3, ["hmur", "hmurx", "kep", "vy", "vyx", "po", "pox", "jjiet", "xyt", "mgup", "hlit", "hli", "hlix", "yu", "yux", "zzop", "gat", "zap", "zi", "zix", "zup", "jit", "giet"]],
            [4, ["jjiep", "jjit", "yyt", "nzuo", "nzuox", "sho"]],
            [5, ["ddo", "ddox", "lot", "nrup", "nyuop"]]
        ]
    },
    "꒤": {
        name: "ꅐꀨ",
        name_trans: "DDUR",
        vars: ["꒥", "꒦"],
        syllables: [
            [1, ["gu", "gux", "ddur", "ddurx", "jur", "jurx", "mgur", "mgurx", "ngat", "njip", "vot", "va", "vax", "zzyr", "zzyrx", "gguo", "gguox", "nziep"]],
            [2, ["it", "i", "ix", "nzur", "nzurx", "pa", "pax", "pap", "luop", "cot", "wat", "bur", "burx", "jjie"]],
            [3, ["nzyr", "nzyrx", "quop", "gur", "gurx", "dat", "muot"]],
            [4, ["mgut", "nzie"]],
            [5, ["zhep", "nby"]]
        ]
    },
    "꒧": {
        name: "ꑘꀨ",
        name_trans: "NYOP",
        syllables: [
            [0, ["nyop"]],
            [1, ["ndip", "ki"]],
            [2, ["rro"]],
            [3, ["lop"]],
            [4, ["nbat", "fit"]]
        ]
    },
    "꒨": {
        name: "ꄲꀨ",
        name_trans: "TU",
        syllables: [
            [0, ["tu"]],
            [1, ["qip", "hlep", "qu", "qux", "ho", "hox", "ca", "cax", "ce", "cex", "hle"]],
            [2, ["qur", "qurx", "vat", "sso", "ssox", "lip", "nyut", "gap", "gup", "jut", "ssep", "cat"]],
            [3, ["lut", "qop", "nrat", "bo", "box", "mit", "mie"]],
            [4, ["guop", "nzyp", "hmip"]],
            [5, ["hmup"]]
        ]},
    "꒩": {
        name: "ꀒꀨ",
        name_trans: "OP",
        syllables: [
            [1, ["ma", "max", "hlop", "hlat", "sup", "op", "nie", "niex", "pi", "pix", "bie", "biex", "cie", "ciex", "ro", "rox", "rap", "biep", "dot"]],
            [2, ["hlur", "hlurx", "bbip", "mgat", "iet", "hluop", "hlip", "hnuo", "hnuox", "ngo", "ngox", "cop", "co", "cox", "zuo", "zuox", "nuop", "o", "ox", "zhut", "rep", "bit", "cur", "curx", "zut", "nrut", "mgep", "juop", "tut", "biet"]],
            [3, ["qut", "hxiep", "pie", "piex", "not", "ra", "rax", "iep", "chap", "zze", "zzex", "njie", "njiex", "juot", "cut", "pot", "nbu", "nbux", "xuo", "xuox", "bbit"]],
            [4, ["bbuop", "si", "six", "hep", "nbur", "nburx", "gut", "muop", "pur", "purx", "qo", "qox", "nbyt", "ngep"]],
            [5, ["nra", "nrax", "chu", "chux", "zhat", "chup"]]
        ]},
    "꒪": {
        name: "ꐧꀨ",
        name_trans: "JJUT",
        vars: ["꒫"],
        syllables: [
            [1, ["ggur", "ggurx", "nrur", "nrurx", "jjut", "shup", "ot", "zot"]],
            [2, ["but", "dup", "mgo", "mgox", "zhup", "nyuo", "nyuox", "piep", "zop", "uop", "mguop", "bbiet"]],
            [3, ["ndup", "re", "rex", "tup", "hlie", "hliex", "ssap", "hlup", "hap", "mgot", "nbi"]],
            [4, ["rru", "rrux", "ndur", "ndurx", "ssa", "ssax", "ha", "hax", "gguop"]],
            [5, ["hmyr", "hmyrx", "njiep"]]
        ]},
    "꒬": {
        name: "ꁐꀨ",
        name_trans: "PYT",
        vars: ["꒭", "꒮", "꒯"],
        syllables: [
            [0, ["pyt"]],
            [1, ["mot", "hmot", "nip", "ip", "nde"]],
            [2, ["pyr", "pyrx", "zzi", "zzix", "pit", "jjip", "ddep", "nrep", "qit", "hxat", "yit", "yiet", "vur"]],
            [3, ["hmo"]],
            [4, ["nit"]],
            [5, ["byr"]]
        ]},
    "꒰": {
        name: "ꏂꀨ",
        name_trans: "SHY",
        vars: ["꒱", "꒲"],
        syllables: [
            [0, ["shy"]],
            [1, ["hot", "yyp", "vep", "vex", "ryr"]],
            [2, ["mgop", "hlu", "hlux", "za", "zax", "ggit"]],
            [3, ["bot", "jjup", "zyp", "tuot"]],
            [4, ["zyr", "zyrx", "top"]]
        ]},
    "꒳": {
        name: "ꏮꀨ",
        name_trans: "JO",
        vars: ["꒴", "꒵", "꒶", "꒷"],
        syllables: [
            [1, ["jo"]],
            [2, ["bbap", "lu", "lux", "nbop", "jot", "xit", "xie", "xiex", "xiet", "jjy", "jjyx", "be", "bex", "w"]],
            [3, ["map", "nbo", "nbox", "cep", "xot", "dip", "bbop"]],
            [4, ["njiet", "ssat", "nzu", "nzux", "got", "ssyr"]],
            [5, ["nzup"]]
        ]},
    "꒸": {
        name: "ꎿꀨ",
        name_trans: "SHUR",
        vars: ["꒹", "꒺", "꒻"],
        syllables: [
            [0, ["shur"]],
            [1, ["mup", "lie", "liex", "siep"]],
            [2, ["wo"]],
            [3, ["du"]]
        ]},
    "꒼": {
        name: "ꋌꀨ",
        name_trans: "CY",
        vars: ["꒽"],
        syllables: [
            [1, ["cy", "cyx", "hop", "xi", "xix", "zy", "zyx", "diep", "cuop"]],
            [2, ["qi", "qix", "wop", "nba", "nbax", "pip", "ndut", "lur", "lurx", "lup", "cyr", "cyrx", "nguot", "rot", "rop"]],
            [3, ["zzap", "qiep", "xiep", "zhop"]],
            [4, ["zza"]]
        ]},
    "꒾": {
        name: "ꊱꀨ",
        name_trans: "CIP",
        vars: ["꒿"],
        syllables: [
            [0, ["cip", "hxop"]],
            [1, ["hmut", "py", "pyx", "kiep", "njo"]],
            [2, ["kip", "ddut", "hxi", "hxix", "nbyr"]],
            [3, ["qiet", "njot", "qyr"]]
        ]},
    "꓀": {
        name: "ꎫꀨ",
        name_trans: "SHAT",
        vars: ["꓁", "꓂", "꓃"],
        syllables: [
            [0, ["shat", "shop"]],
            [1, ["ka", "kax", "da", "dax", "dap", "qyt", "guot", "hnap"]],
            [2, ["ggu", "ggux", "bba", "bbax", "ggup", "guo", "guox", "zur", "zurx", "che", "chex", "chep", "nguo"]],
            [3, ["chuop", "cu", "cux", "chet"]]
        ]},
    "꓄": {
        name: "ꋔꀨ",
        name_trans: "ZZIET",
        vars: ["꓅"],
        syllables: [
            [1, ["buop", "dduo", "dduox", "hxip"]],
            [2, ["dduop", "ddat", "nbie"]],
            [3, ["shuo", "shuox", "viep", "ru", "rux", "zzie", "zziex", "bep"]],
            [4, ["bop", "dda", "ddax", "ddap"]],
            [5, ["zzat", "zziet"]]
        ]},
    "꓆": {
        name: "ꈌꀨ",
        name_trans: "KE",
        syllables: [
            [1, ["ke"]],
            [2, ["gop"]],
            [3, ["nzi", "nzix", "ta", "tax", "fup"]],
            [4, ["zzyt"]]
        ]}
};

//  ꒐	꒑	꒒	꒓	꒔	꒕	꒖	꒗	꒘	꒙	꒚	꒛	꒜	꒝	꒞	꒟
//  ꒠	꒡	꒢	꒣	꒤	꒥	꒦	꒧	꒨	꒩	꒪	꒫	꒬	꒭	꒮	꒯
//  ꒰	꒱	꒲	꒳	꒴	꒵	꒶	꒷	꒸	꒹	꒺	꒻	꒼	꒽	꒾	꒿
//  ꓀	꓁	꓂	꓃	꓄	꓅	꓆

document.addEventListener('DOMContentLoaded', () => {
    const radicalContainer = document.getElementById('radical-buttons');
    const radicalCharContainer = document.getElementById('radical-char-buttons');
    const currentRadicalLabel = document.getElementById('current-radical-name');

    function initRadicals() {
        radicalContainer.innerHTML = ''; 
        
        for (const radicalChar in radicalMap) {
            const radicalData = radicalMap[radicalChar];
            
            let btnText = `[${radicalData.name}]\u00A0\u00A0\u00A0`;
            btnText += radicalChar
            if (radicalData.vars && radicalData.vars.length > 0) {
                btnText += ` ( ${radicalData.vars.join(' ')} )`;
            }

            const btn = document.createElement('button');
            btn.textContent = btnText;
            btn.className = 'radical-btn';
            
            btn.addEventListener('click', () => {
                renderRadicalChars(radicalChar, radicalData);
                const radicalGroupName = (["za"].includes(document.documentElement.lang) ? t("radical_group") + " " + radicalData.name_trans : radicalData.name_trans + " " + t("radical_group"));
                currentRadicalLabel.textContent = radicalData.name + " - " + radicalGroupName;
                currentRadicalLabel.dataset.radicalId = radicalChar;
                delete currentRadicalLabel.dataset.i18n;
            });
            
            radicalContainer.appendChild(btn);
        }
    }

    function renderRadicalChars(radicalChar, radicalData) {
        radicalCharContainer.innerHTML = '';
        
        const groups = radicalData.syllables || [];

        if (!groups.length) {
            radicalCharContainer.innerHTML = `<p class="hint">${t('radical_empty')}</p>`;
            return;
        }

        
        groups.forEach(group => {
            const strokeCount = group[0]; 
            const syllableList = group[1]; 
            
            if (!syllableList || syllableList.length === 0) return;

            
            const charsInGroup = [];
            syllableList.forEach(syl => {
                const yiChar = charLookupReverse[syl];
                
                if (yiChar && charInfo[yiChar] && !charsInGroup.includes(yiChar)) {
                    charsInGroup.push(yiChar);
                }
            });

            if (charsInGroup.length === 0) return;
            
            const rowDiv = document.createElement('div');
            rowDiv.className = 'radical-stroke-row';

            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'stroke-label';
            
            labelSpan.textContent = t(`radical_stroke_${strokeCount}`) || `${strokeCount}画`;
            rowDiv.appendChild(labelSpan);

            
            const charsDiv = document.createElement('div');
            charsDiv.className = 'stroke-char-list';
            
            charsInGroup.forEach(char => {
                const btn = createCharButton(char);
                if (btn) charsDiv.appendChild(btn);
            });
            rowDiv.appendChild(charsDiv);
            
            radicalCharContainer.appendChild(rowDiv);
        });
    }

    initRadicals();
});