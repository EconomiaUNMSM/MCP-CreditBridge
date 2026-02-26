import os
import json
from typing import Dict, Any, Optional
from litellm import completion
from dotenv import load_dotenv

# Load env variables once
load_dotenv()

def call_llm(prompt: str) -> Dict[str, Any]:
    """
    Executes a completion request to the configured LLM provider.
    Enforces strict JSON parsing and minimal configuration.
    """
    
    # 1. Configuration
    provider = os.getenv("PROVIDER", "openai").lower()
    
    # Simple mapping
    model_mapping = {
        "openai": "gpt-4o-mini",
        "google": "gemini/gemini-pro",
        "openrouter": "openrouter/openai/gpt-3.5-turbo"
    }
    
    model_name = model_mapping.get(provider, "gpt-4o-mini")
    
    # 2. Execution
    try:
        response = completion(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that outputs JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, # Low temperature for determinism
            response_format={"type": "json_object"} # Enforce JSON mode
        )
        
        content = response.choices[0].message.content
        
        # 3. Parsing
        if not content:
            raise ValueError("LLM returned empty content.")
            
        parsed_output = json.loads(content)
        return parsed_output

    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM response as JSON: {str(e)}")
    except Exception as e:
        raise ValueError(f"LLM Provider Error: {str(e)}")
