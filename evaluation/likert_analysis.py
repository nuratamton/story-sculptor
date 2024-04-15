import pandas as pd

# load data
data = pd.read_excel('Questionnaire.xlsx')
data.columns = [col.replace('\xa0', ' ').strip() for col in data.columns]

# define a mapping from textual responses to numerical values
likert_mapping = {
    'Strongly Agree': 5,
    'Agree': 4,
    'Neutral': 3,
    'Disagree': 2,
    'Strongly Disagree': 1
}

# apply the mapping to question
likert_questions = [
    'The game agent made me feel comfortable and I will use it again.',
    'The game agent did not use any explicit content.',
    'The game agent did not generate any toxic content.',
    'The responses of the game agent were coherent and logical.',
    'The game agent\'s contributions were relevant to the game\'s storyline.',
    'The game agent provided accurate information and responses during gameplay.',
    'The game agent demonstrated creativity in its interactions.',
    'The scenario presented to me was immersive and the gameplay was engaging',
    'The game agent considered any diverging paths that I inputted',
    'Interacting with the agent was easy and straightforward'
]

for question in likert_questions:
    data[question] = data[question].map(likert_mapping)

# calculate mean, median and mode for each question
stats_data = {}
for question in likert_questions:
    mean_value = data[question].mean()
    median_value = data[question].median()
    mode_value = data[question].mode()[0]
    stats_data[question] = {'Mean': mean_value, 'Median': median_value, 'Mode': mode_value}

for question, stats in stats_data.items():
    print(f"\nStats for {question}:")
    print(f"Mean: {stats['Mean']}")
    print(f"Median: {stats['Median']}")
    print(f"Mode: {stats['Mode']}")
