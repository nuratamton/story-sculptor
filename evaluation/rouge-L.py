from rouge import Rouge
import json


def load_data(file):
    with open(file, 'r') as file:
        data = json.load(file)
    return data

def compute_rouge_l(reference, hypothesis):
    rouge = Rouge()
    scores = rouge.get_scores(hypothesis, reference)
    return scores[0]['rouge-l']

def evaluate_variability(data):
    baseline_scores = []
    finetuned_scores = []

    for interaction in data:
        gpt = interaction['gpt_response']
        baseline = interaction['baseline_response']
        finetuned = interaction['fine_tuned_response']

        base_rouge_l = compute_rouge_l(gpt, baseline)
        baseline_scores.append(base_rouge_l['f'])

        tuned_rouge_l = compute_rouge_l(gpt, finetuned)
        finetuned_scores.append(tuned_rouge_l['f'])
    
    # get the average F1 scores
    average_basescore = sum(baseline_scores) / len(baseline_scores)
    average_tunedscore = sum(finetuned_scores) / len(finetuned_scores)
    return average_basescore, average_tunedscore, baseline_scores, finetuned_scores

def main():
    filepath = "comparison.json"
    data = load_data(filepath)
    average_baseline_score, average_finetuned_score, baseline_scores, finetuned_scores = evaluate_variability(data)
    print(f"Average ROUGE-L F1 Score for Baseline: {average_baseline_score}")
    print(f"Average ROUGE-L F1 Score for Fine-tuned: {average_finetuned_score}")
    print(baseline_scores)
    print(finetuned_scores)

if __name__ == "__main__":
    main()