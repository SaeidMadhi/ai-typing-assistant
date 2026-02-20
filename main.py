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

# --- موتور هوش مصنوعی (NLP Engine) ---
vocabulary = set()
bigram_model = defaultdict(Counter)

def train_model(file_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            words = line.strip().split()
            if not words: continue
            
            # یادگیری کلمات
            for w in words:
                vocabulary.add(w)
                
            # یادگیری روابط بین کلمات (کلمه بعدی)
            for i in range(len(words) - 1):
                current_word = words[i]
                next_word = words[i + 1]
                bigram_model[current_word][next_word] += 1

print("در حال لود کردن دیتابیس هوش مصنوعی...")
train_model("fa.txt")
train_model("en.txt")
train_model("tr.txt")
print("آموزش کامل شد! آماده پیشنهاد کلمات.")

# --- API ارتباط با مرورگر ---
@app.get("/suggest")
def get_suggestions(prefix: str = "", previous_word: str = ""):
    suggestions = []
    
    # حالت اول: کاربر داره یه کلمه رو تایپ میکنه (تکمیل کلمه)
    if prefix:
        matches = [w for w in vocabulary if w.startswith(prefix)]
        suggestions = sorted(matches, key=len)[:3]
        
    # حالت دوم: کاربر Space زده و منتظر کلمه بعدیه (پیش‌بینی هوش مصنوعی)
    elif previous_word and previous_word in bigram_model:
        top_next_words = bigram_model[previous_word].most_common(3)
        suggestions = [word for word, count in top_next_words]
        
    return {"suggestions": suggestions}