// ==========================================
// 🌟 تنظیمات و متغیرهای اولیه 🌟
// ==========================================
let modelData = null;
let extensionSettings = {
    autocompleteEnabled: true,
    nextwordEnabled: true
};

chrome.storage.sync.get(extensionSettings, (items) => {
    extensionSettings = items;
});

// گوش دادن به تغییرات تنظیمات
chrome.storage.onChanged.addListener((changes) => {
    if (changes.autocompleteEnabled) extensionSettings.autocompleteEnabled = changes.autocompleteEnabled.newValue;
    if (changes.nextwordEnabled) extensionSettings.nextwordEnabled = changes.nextwordEnabled.newValue;
    if (!extensionSettings.autocompleteEnabled && !extensionSettings.nextwordEnabled) suggestionBox.style.display = 'none';
});

// ==========================================
// 🌟 ساختار اصلی و بارگذاری مدل 🌟
// ==========================================
const suggestionBox = document.createElement('div');
suggestionBox.id = 'ai-suggestion-box';
document.body.appendChild(suggestionBox);

async function loadModel() {
    try {
        const url = chrome.runtime.getURL('model.json');
        const response = await fetch(url);
        modelData = await response.json();
        console.log("✅ مدل آفلاین لود شد.");
    } catch (err) {
        console.error("❌ خطا در لود مدل:", err);
    }
}
loadModel();

function normalize(text) {
    if(!text) return "";
    text = text.toLowerCase();
    const replacements = {'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u'};
    for (let char in replacements) { text = text.split(char).join(replacements[char]); }
    return text;
}

let currentTarget = null;
let fetchCounter = 0;
let isNextWordMode = false;
let isInserting = false;
let selectedIndex = -1; 

async function fetchAndShow(prefix, previousWord, target) {
    if (!modelData) return;
    let suggestions = [];
    
    if (prefix) {
        let normPrefix = normalize(prefix);
        let matchesSingle = Object.keys(modelData.vocab).filter(n => n.startsWith(normPrefix)).map(n => modelData.vocab[n]);
        let matchesConcat = Object.keys(modelData.concat).filter(n => n.startsWith(normPrefix)).map(n => modelData.concat[n]);
        suggestions = [...new Set([...matchesSingle, ...matchesConcat])].slice(0, 3);
    } else if (previousWord) {
        let normPrev = normalize(previousWord);
        if (modelData.bigram[normPrev]) suggestions = modelData.bigram[normPrev];
    }

    if (suggestions.length > 0) {
        showSuggestions(suggestions, target);
    } else {
        suggestionBox.style.display = 'none';
    }
}

// ==========================================
// 🌟 مدیریت ورودی و نمایش 🌟
// ==========================================
document.addEventListener('input', async (e) => {
    if (isInserting || !e.isTrusted) return;

    currentTarget = e.target;
    if (currentTarget.tagName !== 'TEXTAREA' && currentTarget.tagName !== 'INPUT' && !currentTarget.isContentEditable) return;

    let text = currentTarget.value !== undefined ? currentTarget.value : currentTarget.innerText;
    isNextWordMode = text.endsWith(' ') || text.endsWith('\n');

    if (isNextWordMode && !extensionSettings.nextwordEnabled) { suggestionBox.style.display = 'none'; return; }
    if (!isNextWordMode && !extensionSettings.autocompleteEnabled) { suggestionBox.style.display = 'none'; return; }

    let words = text.trim().split(/\s+/);
    let prefix = isNextWordMode ? "" : (words[words.length - 1] || "");
    let previousWord = isNextWordMode ? (words[words.length - 1] || "") : (words.length > 1 ? words[words.length - 2] : "");

    fetchAndShow(prefix, previousWord, currentTarget);
});

function showSuggestions(suggestions, target) {
    selectedIndex = -1; 
    suggestionBox.innerHTML = ''; 
    
    suggestions.forEach(word => {
        let div = document.createElement('div');
        div.className = 'ai-suggestion-item';
        div.innerText = word;
        div.dir = 'auto';
        div.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            e.stopPropagation();
            insertWord(word, target);
        });
        suggestionBox.appendChild(div);
    });
    
    const rect = target.getBoundingClientRect();
    suggestionBox.style.left = `${rect.left + window.scrollX}px`;
    suggestionBox.style.top = `${rect.bottom + window.scrollY + 5}px`;
    suggestionBox.style.display = 'block';
}

function insertWord(selectedWord, target) {
    isInserting = true;
    fetchCounter++; 
    target.focus(); 

    let isContentEditable = target.value === undefined;
    let text = isContentEditable ? target.innerText : target.value;

    if (isContentEditable) {
        if (!isNextWordMode) {
            let words = text.trim().split(/\s+/);
            let lastWord = words[words.length - 1] || "";
            for (let i = 0; i < lastWord.length; i++) { document.execCommand('delete', false, null); }
        }
        document.execCommand('insertText', false, selectedWord + " ");
    } else {
        let newText = isNextWordMode ? (text + selectedWord + " ") : (text.substring(0, text.lastIndexOf(' ') + 1) + selectedWord + " ");
        target.value = newText;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.setSelectionRange(target.value.length, target.value.length);
    }

    suggestionBox.style.display = 'none'; 
    if (extensionSettings.nextwordEnabled) fetchAndShow("", selectedWord, target);
    setTimeout(() => { isInserting = false; }, 50);
}

// ==========================================
// 🌟 کنترل با کیبورد (فقط با نگه داشتن Ctrl) 🌟
// ==========================================
document.addEventListener('keydown', (e) => {
    if (suggestionBox.style.display !== 'block') return;
    const items = suggestionBox.querySelectorAll('.ai-suggestion-item');
    if (items.length === 0) return;

    // 🌟 فقط وقتی Ctrl نگه داشته شده باشد، لیست ما بالا و پایین می‌شود
    if (e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault(); 
        e.stopPropagation();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateHighlight(items);
    } else if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length; 
        updateHighlight(items);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (selectedIndex >= 0) {
            e.preventDefault(); 
            e.stopPropagation(); 
            insertWord(items[selectedIndex].innerText, currentTarget);
            selectedIndex = -1; 
        }
    } else if (e.key === 'Escape') {
        suggestionBox.style.display = 'none';
        selectedIndex = -1;
    }
}, true); // UseCapture فعال برای اولویت بالاتر

function updateHighlight(items) {
    items.forEach((item, index) => {
        if (index === selectedIndex) item.classList.add('active'); 
        else item.classList.remove('active'); 
    });
}

document.addEventListener('mousedown', (e) => {
    if (suggestionBox.style.display === 'block' && !suggestionBox.contains(e.target)) {
        suggestionBox.style.display = 'none';
    }
});