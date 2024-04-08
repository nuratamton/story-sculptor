from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
from langchain.memory import ConversationBufferWindowMemory
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORSMiddleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
base_model = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(base_model, pad_token="[PAD]")
model = AutoModelForCausalLM.from_pretrained(
    base_model,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True,
)
ft_model = PeftModel.from_pretrained(model, "nuratamton/story_sculptor_mistral").eval()
memory = ConversationBufferWindowMemory(k=10)


class UserRequest(BaseModel):
    message: str


@app.post("/generate/")
async def generate_text(request: UserRequest):
    user_in = request.message

    if user_in.lower() in ["adventure", "mystery", "horror", "sci-fi"]:
        memory.clear()

    if user_in.lower() == "quit":
        raise HTTPException(status_code=400, detail="User requested to quit")

    memory_context = memory.load_memory_variables({})["history"]
    user_input = f"{memory_context}[INST] Continue the game and maintain context: {user_in}[/INST]"

    encodings = tokenizer(user_input, return_tensors="pt", padding=True).to(device)
    input_ids, attention_mask = encodings["input_ids"], encodings["attention_mask"]
    output_ids = ft_model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_new_tokens=1000,
        num_return_sequences=1,
        do_sample=True,
        temperature=1.1,
        top_p=0.9,
        repetition_penalty=1.2,
    )

    generated_ids = output_ids[0, input_ids.shape[-1] :]
    response = tokenizer.decode(generated_ids, skip_special_tokens=True)
    memory.save_context({"input": user_in}, {"output": response})

    response = response.replace("AI: ", "")
    # response = response.replace("Human: ", "")

    return {"response": response}


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}
