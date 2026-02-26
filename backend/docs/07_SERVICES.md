# 07. Servicios (Services) y Orquestación Backend

Directorio: `app/services/`

La carpeta `services` es el núcleo arquitectónico operacional. Mientras la API escucha, la BD almacena y los agentes razonan, el **Service** organiza y dirige la danza de todos estos elementos.

## Lógicas Presentes

1. **`evaluation_service.py`**
   - Recibe la carga parseada en la ruta FastAPI.
   - Envía a **Scoring** los balances.
   - Crea un registro pending en Base de Datos usando **CRUD**.
   - Invoca a través del Registry al Agente A, B y C (**Agents**).
   - Ensambla y recolecta lo que devolvieron los LLMs.
   - Dispara al Agente Moderador.
   - Cierra el trato, guarda el dictamen definitivo, y responde por fin.

2. **`report_services.py`** / **`report_service.py`**
   - Usado una vez que culmina la toma de decisión o por agentes de back-office institucionales. Genera resúmenes estructurados sobre el riesgo en formato JSON o documentos finales en base al registro guardado.

## Reglas de Arquitectura
- Si necesitas crear un nuevo flujo o endpoints masivos (EJ: importación vía excel de créditos, evaluaciones tipo batch), debes crear tu clase y funciones orquestadoras como `BatchEvaluationService` aquí adentro, no en las capas API ni Database.
