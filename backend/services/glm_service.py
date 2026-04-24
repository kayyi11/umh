import os
from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

def get_glm_model():
    api_key = os.getenv("ZAI_API_KEY")
    api_base = os.getenv("ZAI_API_BASE") 
    model_name = os.getenv("ZAI_MODEL_NAME")

    if not api_key:
        raise ValueError("ZAI_API_KEY not found in .env file!")

    # --- URL CLEANER START ---
    # If the URL ends with /chat/completions, we remove it.
    # This prevents the "404 Route Not Found" error.
    if api_base and api_base.endswith("/chat/completions"):
        api_base = api_base.replace("/chat/completions", "")
    # --- URL CLEANER END ---

    return LLM(
        # Use 'openai/' prefix because ilmu.ai uses the OpenAI-standard format
        model=f"openai/{model_name}", 
        base_url=api_base,
        api_key=api_key,
        temperature=0.2
    )