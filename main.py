import os
from collections import defaultdict, Counter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🌟 فیلتر جادویی یکسان‌سازی متن 🌟
# ==========================================
def normalize(text):
    text = text.lower()
    replacements = {
        'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u',
        'i̇': 'i'
    }
    for tr_char, en_char in replacements.items():
        text = text.replace(tr_char, en_char)
    return text

# ==========================================
# دیتابیس‌های جدید و هوشمند
# ==========================================
vocab_dict = {}
bigram_model = defaultdict(Counter)
concat_dict = {} # 🌟 دیکشنری برای کلماتی که به هم چسبیدن (مثل iyimisin)

def train_model(file_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            words = line.strip().split()
            if not words: continue
            
            for i in range(len(words)):
                # یادگیری کلمات تکی
                norm_w = normalize(words[i])
                if norm_w not in vocab_dict:
                    vocab_dict[norm_w] = words[i]
                
                # یادگیری کلمات بعدی و کلمات چسبیده
                if i < len(words) - 1:
                    norm_current = normalize(words[i])
                    original_next_word = words[i + 1]
                    bigram_model[norm_current][original_next_word] += 1
                    
                    # 🌟 جادوی حل مشکل فاصله: ذخیره دو کلمه متوالی به صورت چسبیده
                    norm_next = normalize(words[i+1])
                    concat_norm = norm_current + norm_next
                    
                    # اگر تو متن بوده "iyi misin"، تو ذهن پایتون میشه "iyimisin"
                    if concat_norm not in concat_dict:
                        concat_dict[concat_norm] = f"{words[i]} {words[i+1]}"

print("در حال آموزش مدل هوش مصنوعی با سیستم ضدِ چسبندگی کلمات...")
train_model("fa.txt")
train_model("en.txt")
train_model("tr.txt")
print("آموزش کامل شد! آماده کار.")

# ==========================================
# API ارتباطی
# ==========================================
@app.get("/suggest")
def get_suggestions(prefix: str = "", previous_word: str = ""):
    suggestions = []
    
    if prefix:
        norm_prefix = normalize(prefix)
        
        # ۱. جستجو در کلمات تکی (مثل merhaba)
        matches_single = [orig for norm, orig in vocab_dict.items() if norm.startswith(norm_prefix)]
        
        # ۲. جستجو در کلمات دوگانه چسبیده (مثل iyimisin که پیشنهاد میده iyi misin)
        matches_concat = [combo for concat_norm, combo in concat_dict.items() if concat_norm.startswith(norm_prefix)]
        
        # ترکیب هر دو لیست و حذف تکراری‌ها
        all_matches = list(dict.fromkeys(matches_single + matches_concat))
        
        # مرتب‌سازی بر اساس طول و برگرداندن ۳ تای اول
        suggestions = sorted(all_matches, key=len)[:3]
        
    elif previous_word:
        norm_prev = normalize(previous_word)
        if norm_prev in bigram_model:
            top_next_words = bigram_model[norm_prev].most_common(3)
            suggestions = [word for word, count in top_next_words]
        
    return {"suggestions": suggestions}