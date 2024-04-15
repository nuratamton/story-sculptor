from transformers import AutoTokenizer
from nltk.translate.bleu_score import sentence_bleu
from nltk.tokenize import word_tokenize
import numpy as np

# load the tokenizer
tokenizer = AutoTokenizer.from_pretrained('mistralai/Mistral-7B-Instruct-v0.2')

def load_responses(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        responses = file.readlines()
    responses = [response.strip() for response in responses]
    return responses

def calculate_self_bleu(texts):
    scores = []
    for index, candidate in enumerate(texts):
        references = [texts[i] for i in range(len(texts)) if i != index]
        references = [tokenizer.tokenize(ref) for ref in references]
        candidate_tokens = tokenizer.tokenize(candidate) 
        # calculate BLEU score with uniform weights for 1-4 grams
        score = sentence_bleu(references, candidate_tokens, weights=(0.25, 0.25, 0.25, 0.25))
        scores.append(score)
    return np.mean(scores), scores

def main():
    filepath = 'response.txt'
    responses = load_responses(filepath)
    average_self_bleu, _ = calculate_self_bleu(responses)
    print(f"Average Self-BLEU Score: {average_self_bleu}")

if __name__ == "__main__":
    main()
