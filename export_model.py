import os
import json
from collections import defaultdict, Counter


def normalize(text):
    text = text.lower()
    replacements = {
        'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u',
        'i̇': 'i'
    }
    for tr_char, en_char in replacements.items():
        text = text.replace(tr_char, en_char)
    return text

vocab_dict = {}
bigram_model = defaultdict(Counter)
concat_dict = {}

def train_model(file_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            words = line.strip().split()
            if not words: continue
            
            for i in range(len(words)):
                norm_w = normalize(words[i])
                if norm_w not in vocab_dict:
                    vocab_dict[norm_w] = words[i]
                
                if i < len(words) - 1:
                    norm_current = normalize(words[i])
                    original_next_word = words[i + 1]
                    bigram_model[norm_current][original_next_word] += 1
                    
                    norm_next = normalize(words[i+1])
                    concat_norm = norm_current + norm_next
                    if concat_norm not in concat_dict:
                        concat_dict[concat_norm] = f"{words[i]} {words[i+1]}"

print("در حال آموزش و استخراج مدل...")
train_model("fa.txt")
train_model("en.txt")
train_model("tr.txt")

export_data = {
    "vocab": vocab_dict,
    "concat": concat_dict,
    "bigram": {}
}

for prev_word, next_words_counter in bigram_model.items():
    export_data["bigram"][prev_word] = [word for word, count in next_words_counter.most_common(3)]

with open("model.json", "w", encoding="utf-8") as f:
    json.dump(export_data, f, ensure_ascii=False, separators=(',', ':'))

print("✅ آموزش تمام شد! فایل model.json با موفقیت ساخته شد.")
