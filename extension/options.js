document.addEventListener('DOMContentLoaded', () => {
    // ۱. وقتی صفحه لود شد، تنظیمات قبلی رو از حافظه بخون
    chrome.storage.sync.get({
        autocompleteEnabled: true, // پیش‌فرض روشنه
        nextwordEnabled: true      // پیش‌فرض روشنه
    }, (items) => {
        document.getElementById('autocomplete-toggle').checked = items.autocompleteEnabled;
        document.getElementById('nextword-toggle').checked = items.nextwordEnabled;
    });

    // ۲. وقتی کاربر روی دکمه ذخیره کلیک کرد
    document.getElementById('save-btn').addEventListener('click', () => {
        const autocomplete = document.getElementById('autocomplete-toggle').checked;
        const nextword = document.getElementById('nextword-toggle').checked;

        // ذخیره تو حافظه مرورگر
        chrome.storage.sync.set({
            autocompleteEnabled: autocomplete,
            nextwordEnabled: nextword
        }, () => {
            // نشون دادن پیام موفقیت
            const status = document.getElementById('status');
            status.textContent = '✅ تنظیمات با موفقیت ذخیره شد!';
            
            // پاک کردن پیام بعد از ۲.۵ ثانیه
            setTimeout(() => {
                status.textContent = '';
            }, 2500);
        });
    });
});