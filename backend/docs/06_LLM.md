# 06. LLM Runtime y Manejo de Prompts

El corazón comunicacional a la inteligencia generativa vive en `app/llm_runtime/`. 

Ya que el sistema requiere estar a la vanguardia de las inteligencias conectables, depender de una sola API nativa o SDK como la de OpenAI era un limitante muy restrictivo (Vendor Lock-in).

## LiteLLM (`litellm_client.py`)

Para ello este backend integra explícitamente **LiteLLM**. 
- Permite invocar modelos de Anthropic (Claude), OpenAI (GPT-4), Google (Gemini) o despliegues locales como Ollama o vLLM sin tener que reescribir un solo renglón de código.
- Se hace cargo del *rate-limiting*, las re-tomas (Retries) automáticas y provee interfaces de uso asincrónico modernas.

## Central de Prompts (`prompts.py`)

Los "System Prompts" son las instrucciones base de personalidad y restricciones de cada agente (ej: de Audit o de Prescriptive).
- Al tener los *prompts* en un solo espacio, es sencillo hacer iteraciones y tests tipo A/B en cómo responde el LLM.
- Permite inyección de formatos o *f-strings* y plantillas en donde el servicio de `EvaluationService` pasa variables JSON serializadas que llenan los "huecos" que el Prompt necesita conocer de cada cliente evaluado.
