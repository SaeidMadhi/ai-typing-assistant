const translations = {
    fa: {
        title: "⚙️ تنظیمات افزونه",
        opt1: "تکمیل و اصلاح کلمه فعلی",
        opt2: "پیشنهاد کلمه بعدی (هوش مصنوعی)",
        btn: "ذخیره تنظیمات",
        success: "✅ با موفقیت ذخیره شد!",
        dir: "rtl"
    },
    en: {
        title: "⚙️ Extension Settings",
        opt1: "Autocomplete & Word Correction",
        opt2: "Next Word Prediction (AI)",
        btn: "Save Settings",
        success: "✅ Saved successfully!",
        dir: "ltr"
    },
    tr: {
        title: "⚙️ Eklenti Ayarları",
        opt1: "Kelime Tamamlama ve Düzeltme",
        opt2: "Sonraki Kelime Tahmini (Yapay Zeka)",
        btn: "Ayarları Kaydet",
        success: "✅ Başarıyla kaydedildi!",
        dir: "ltr"
    }
};

function updateUI(lang) {
    document.getElementById('html-tag').dir = translations[lang].dir;
    document.getElementById('title-text').innerText = translations[lang].title;
    document.getElementById('opt1-text').innerText = translations[lang].opt1;
    document.getElementById('opt2-text').innerText = translations[lang].opt2;
    document.getElementById('save-btn').innerText = translations[lang].btn;
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({
        autocompleteEnabled: true,
        nextwordEnabled: true,
        uiLanguage: 'fa' 
    }, (items) => {
        document.getElementById('autocomplete-toggle').checked = items.autocompleteEnabled;
        document.getElementById('nextword-toggle').checked = items.nextwordEnabled;
        document.getElementById('ui-lang-select').value = items.uiLanguage;
        
        updateUI(items.uiLanguage);
    });

    document.getElementById('ui-lang-select').addEventListener('change', (e) => {
        updateUI(e.target.value);
    });

    document.getElementById('save-btn').addEventListener('click', () => {
        const autocomplete = document.getElementById('autocomplete-toggle').checked;
        const nextword = document.getElementById('nextword-toggle').checked;
        const uiLang = document.getElementById('ui-lang-select').value;

        chrome.storage.sync.set({
            autocompleteEnabled: autocomplete,
            nextwordEnabled: nextword,
            uiLanguage: uiLang
        }, () => {
            const status = document.getElementById('status');
            status.textContent = translations[uiLang].success; 
            setTimeout(() => { status.textContent = ''; }, 2000);
        });
    });
});
