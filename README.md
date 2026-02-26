# 🧠 AI Text Predictor (Multi-Language)

---

## 🇬🇧 English

### 🚀 Overview
**AI Text Predictor** is an advanced, privacy-first AI typing assistant that runs entirely locally in your browser. Powered by a custom-trained Bigram language model, it provides zero-latency autocomplete and next-word predictions for English, Persian, and Turkish. Since the AI model is executed 100% offline, your keystrokes are never sent to any external servers.

### 🏗️ Project Architecture & States
This repository is divided into two main environments:
1. 🟢 **Pre-Trained & Ready (`/extension`):** The production-ready browser extension. It includes a highly optimized, pre-trained `model.json` file that loads directly into the browser's memory for instant text generation.
2. 🟡 **Trainable AI Engine (`/trainer`):** The development environment containing Python scripts (`export_model.py`). Developers can feed custom text datasets to this engine to train the neural logic and generate their own custom AI models.

### 📦 Installation Guide

#### Option A: Official Firefox Store
* 🦊 **Firefox:** [Install from Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/ai-text-predictor/)
#### Option B: Chrome / Edge (Manual Installation)
Since the extension is fully offline, you can easily install it for free via Developer Mode:
1. Download this repository as a ZIP file and extract it.
2. Open Google Chrome or Microsoft Edge and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in the top right corner).
4. Click **Load unpacked** and select the `/extension` folder.

### ⌨️ How to Use
* Start typing in any text field on the web.
* Hold **Ctrl** and use **Arrow Up / Arrow Down** to navigate through the AI's suggestions.
* Press **Enter** or **Tab** to insert the predicted word.

---

## 🇮🇷 فارسی

### 🚀 معرفی پروژه
**AI Text Predictor** یک دستیار تایپ هوشمند و پیشرفته است که کاملاً به صورت محلی در مرورگر شما اجرا می‌شود. این سیستم با استفاده از یک مدل زبانی آموزش‌دیده (Bigram)، کلمات فعلی و بعدی را در زبان‌های فارسی، انگلیسی و ترکی با سرعت بالا (بدون تاخیر) پیش‌بینی می‌کند. از آنجایی که موتور هوش مصنوعی ۱۰۰٪ آفلاین عمل می‌کند، امنیت حریم خصوصی شما کاملاً تضمین شده و هیچ داده‌ای به سرورهای خارجی ارسال نمی‌گردد.

### 🏗️ معماری و وضعیت‌های پروژه
این مخزن (Repository) به دو بخش اصلی تقسیم شده است:
۱. 🟢 **نسخه آماده و آموزش‌دیده (`/extension`):** افزونه نهایی مرورگر که شامل فایل `model.json` (هوش مصنوعی آموزش‌دیده) است. این مدل مستقیماً در حافظه مرورگر بارگذاری شده و آماده تولید متن است.
۲. 🟡 **موتور آموزش مدل (`/trainer`):** محیط توسعه شامل اسکریپت‌های پایتون (`export_model.py`). توسعه‌دهندگان می‌توانند با ارائه دیتاست‌های متنی جدید به این موتور، هوش مصنوعی اختصاصی خود را آموزش داده و مدل‌های جدید استخراج کنند.

### 📦 راهنمای نصب

#### روش اول: نصب رسمی برای فایرفاکس
* 🦊 **فایرفاکس:** [نصب از استور رسمی موزیلا]({Link_Firefox_Here})

#### روش دوم: کروم و اج (نصب دستی و رایگان)
با توجه به آفلاین بودن پروژه، می‌توانید آن را به راحتی از طریق حالت توسعه‌دهنده نصب کنید:
۱. این مخزن را دانلود کرده و از حالت فشرده خارج کنید.
۲. در مرورگر کروم یا اج به آدرس `chrome://extensions/` بروید.
۳. گزینه **Developer Mode** (حالت توسعه‌دهنده) را از گوشه بالا سمت راست روشن کنید.
۴. روی دکمه **Load unpacked** کلیک کرده و پوشه `/extension` را انتخاب کنید.

### ⌨️ نحوه استفاده
* در هر کادر متنی در وب شروع به تایپ کنید.
* کلید **Ctrl** را نگه داشته و با **فلش‌های بالا و پایین (Arrow Keys)** بین پیشنهادات هوش مصنوعی جابجا شوید.
* با زدن دکمه **Enter** یا **Tab** کلمه پیش‌بینی شده را جایگذاری کنید.

---

## 🇹🇷 Türkçe

### 🚀 Genel Bakış
**AI Text Predictor**, tarayıcınızda tamamen yerel olarak çalışan, gizlilik odaklı, gelişmiş bir yapay zeka yazım asistanıdır. Özel olarak eğitilmiş bir Bigram dil modeli ile desteklenen bu sistem; İngilizce, Farsça ve Türkçe dilleri için gecikmesiz kelime tamamlama ve sonraki kelime tahmini sağlar. Yapay zeka modeli %100 çevrimdışı çalıştığı için, yazdığınız hiçbir veri harici sunuculara gönderilmez.

### 🏗️ Proje Mimarisi ve Durumları
Bu depo (repository) iki ana ortama ayrılmıştır:
1. 🟢 **Eğitilmiş ve Hazır (`/extension`):** Üretime hazır tarayıcı eklentisidir. Anında metin üretimi için doğrudan tarayıcının belleğine yüklenen, son derece optimize edilmiş, eğitilmiş bir `model.json` dosyası içerir.
2. 🟡 **Eğitilebilir Yapay Zeka Motoru (`/trainer`):** Python betiklerini (`export_model.py`) içeren geliştirme ortamıdır. Geliştiriciler, bu motora özel metin veri setleri sağlayarak kendi özel yapay zeka modellerini eğitebilir ve üretebilirler.

### 📦 Kurulum Rehberi

#### Seçenek A: Resmi Firefox Mağazası
* 🦊 **Firefox:** [Mozilla Eklentilerinden Yükle]({Link_Firefox_Here})

#### Seçenek B: Chrome / Edge (Manuel Kurulum)
Eklenti tamamen çevrimdışı olduğundan, Geliştirici Modu (Developer Mode) üzerinden kolayca ve ücretsiz kurabilirsiniz:
1. Bu depoyu ZIP dosyası olarak indirin ve klasöre çıkarın.
2. Google Chrome veya Microsoft Edge'i açın ve `chrome://extensions/` adresine gidin.
3. Sağ üst köşeden **Geliştirici Modu**'nu (Developer Mode) etkinleştirin.
4. **Paketlenmemiş öğeyi yükle** (Load unpacked) butonuna tıklayın ve `/extension` klasörünü seçin.

### ⌨️ Nasıl Kullanılır
* Web üzerindeki herhangi bir metin kutusunda yazmaya başlayın.
* Yapay zeka önerileri arasında gezinmek için **Ctrl** tuşunu basılı tutun ve **Yukarı / Aşağı Yön Tuşlarını** kullanın.
* Tahmin edilen kelimeyi eklemek için **Enter** veya **Tab** tuşuna basın.

---
**Creator:** Saeid Madhi
