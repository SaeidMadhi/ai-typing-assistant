
let extensionSettings = {
    autocompleteEnabled: true,
    nextwordEnabled: true
};

chrome.storage.sync.get(extensionSettings, (items) => {
    extensionSettings = items;
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.autocompleteEnabled) {
        extensionSettings.autocompleteEnabled = changes.autocompleteEnabled.newValue;
        if (!extensionSettings.autocompleteEnabled) suggestionBox.style.display = 'none';
    }
    if (changes.nextwordEnabled) {
        extensionSettings.nextwordEnabled = changes.nextwordEnabled.newValue;
        if (!extensionSettings.nextwordEnabled) suggestionBox.style.display = 'none';
    }
});


const suggestionBox = document.createElement('div');
suggestionBox.id = 'ai-suggestion-box';
document.body.appendChild(suggestionBox);

let currentTarget = null;
let fetchCounter = 0;
let isNextWordMode = false;
let isInserting = false; 

async function fetchAndShow(prefix, previousWord, target) {
    if (!prefix && !previousWord) {
        suggestionBox.style.display = 'none';
        return;
    }

    let currentFetch = ++fetchCounter;

    try {
        let response = await fetch(`http://127.0.0.1:8000/suggest?prefix=${prefix}&previous_word=${previousWord}`);
        let data = await response.json();
        
        if (currentFetch !== fetchCounter) return;
        
        if (data.suggestions && data.suggestions.length > 0) {
            showSuggestions(data.suggestions, target);
        } else {
            suggestionBox.style.display = 'none';
        }
    } catch (err) {
        console.error("خطا:", err);
    }
}

document.addEventListener('input', async (e) => {
    if (isInserting) return; 
    if (!e.isTrusted) return;

    currentTarget = e.target;
    if (currentTarget.tagName !== 'TEXTAREA' && currentTarget.tagName !== 'INPUT' && !currentTarget.isContentEditable) return;

    let text = currentTarget.value !== undefined ? currentTarget.value : currentTarget.innerText;
    
    isNextWordMode = text.endsWith(' ') || text.endsWith('\n');

    if (isNextWordMode && !extensionSettings.nextwordEnabled) {
        suggestionBox.style.display = 'none';
        return;
    }
    if (!isNextWordMode && !extensionSettings.autocompleteEnabled) {
        suggestionBox.style.display = 'none';
        return;
    }

    let words = text.trim().split(/\s+/);
    let prefix = "";
    let previousWord = "";

    if (isNextWordMode) {
        prefix = "";
        previousWord = words[words.length - 1] || "";
    } else {
        prefix = words[words.length - 1] || "";
        previousWord = words.length > 1 ? words[words.length - 2] : "";
    }

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
            for (let i = 0; i < lastWord.length; i++) {
                document.execCommand('delete', false, null);
            }
        }
        document.execCommand('insertText', false, selectedWord + " ");
    } else {
        let newText = "";
        if (isNextWordMode) {
            newText = text + selectedWord + " ";
        } else {
            let lastSpaceIndex = text.lastIndexOf(' ');
            newText = text.substring(0, lastSpaceIndex + 1) + selectedWord + " ";
        }
        target.value = newText;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
        target.setSelectionRange(target.value.length, target.value.length);
    }

    suggestionBox.style.display = 'none'; 
    suggestionBox.innerHTML = ''; 

    if (extensionSettings.nextwordEnabled) {
        isNextWordMode = true; 
        fetchAndShow("", selectedWord, target);
    }

    setTimeout(() => {
        isInserting = false;
    }, 50);
}


let selectedIndex = -1; 

document.addEventListener('keydown', (e) => {
    if (suggestionBox.style.display !== 'block') return;

    const items = document.querySelectorAll('.ai-suggestion-item');
    if (items.length === 0) return;

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
        e.preventDefault();
        suggestionBox.style.display = 'none';
        selectedIndex = -1;
    }
}, true); 

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
