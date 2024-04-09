from datasets import Dataset
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig,TrainingArguments
from peft import LoraConfig
from trl import SFTTrainer
import torch
import os

# constants
DATA_FILE = "final.json"
BASE_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'
NEW_MODEL_DIR = "final"
FINAL_MODEL_HF = "nuratamton/story_sculptor_mistral"

quant_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, padding='right')
tokenizer.add_special_tokens({'pad_token': '[PAD]'})
model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, quantization_config = quant_config)

def data_processing(file):
    with open(file, 'r') as file:
        data = json.load(file)

    chats = []

    for session in data:
        messages = []
        for interaction in session["interaction"]:
            if interaction["input"] and interaction["output"]:
                user_input = interaction["input"]
                response = interaction["output"]
                messages.append({"role": "user", "content": user_input})
                messages.append({"role": "assistant", "content":response})
        chats.append(messages)

    return Dataset.from_dict({"chat": chats})

dataset = data_processing(DATA_FILE)
shuffled_dataset = dataset.shuffle(seed=42)
shuffled_dataset = shuffled_dataset.map(lambda x: {"formatted_chat": tokenizer.apply_chat_template(x["chat"], return_tensors="pt", tokenize=False, batch=True)})

# peft parameters
peft_params = LoraConfig(
    lora_alpha=64,
    lora_dropout=0.1,
    r=32,
    target_modules=[
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
        "gate_proj",
        "up_proj",
        "down_proj",
        "lm_head",
    ],
    bias="none",
    task_type="CAUSAL_LM",
)

# training parameters
training_params = TrainingArguments(

    output_dir="./results",
    num_train_epochs=10,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    optim="paged_adamw_32bit",
    save_steps=50,
    logging_steps=25,
    learning_rate=3e-5,
    weight_decay=0.001,
    fp16=False,
    bf16=True,
    max_grad_norm=0.3,
    max_steps=500,
    warmup_ratio=0.03,
    group_by_length=True,
    lr_scheduler_type="constant",
    report_to="tensorboard",
)

# create trainer
trainer = SFTTrainer(
    model=model,
    train_dataset=shuffled_dataset,
    peft_config=peft_params,
    dataset_text_field="formatted_chat",
    max_seq_length=None,
    tokenizer=tokenizer,
    args=training_params,
    packing=False,
)

# train model
trainer.train()

trainer.model.save_pretrained(NEW_MODEL_DIR)
trainer.tokenizer.save_pretrained(NEW_MODEL_DIR)
# torch.save(trainer.model.state_dict(), os.path.join(new_model, "pytorch_model.bin"))
# trainer.model.config.save_pretrained(new_model)
model.push_to_hub(FINAL_MODEL_HF)
tokenizer.push_to_hub(FINAL_MODEL_HF)