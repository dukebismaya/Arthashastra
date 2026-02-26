import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv("backend/.env")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

models_to_test = [
    "gemini-2.0-flash-lite-preview-02-05", 
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-flash-latest",
    "gemini-pro-latest"
]

print("Testing models...")
for model in models_to_test:
    print(f"\nTrying {model}...")
    try:
        response = client.models.generate_content(
            model=model,
            contents="Say Hello"
        )
        print(f"Success with {model}!")
        print(response.text)
        break
    except Exception as e:
        print(f"Failed {model}: {e}")
        time.sleep(1)
