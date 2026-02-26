# 01. Arquitectura del Sistema

El backend de MCP CreditBridge está construido utilizando un enfoque **modular**. Cada servicio o funcionalidad principal reside en su propio subdirectorio especializado dentro de `app/`. 

## Directorios Principales

- **api/**: Rutas expuestas y esquemas de validación (Pydantic). Capa encargada de la manipulación HTTP y seguridad de peticiones.
- **services/**: Contiene las reglas principales de negocio y casos de uso. Esta capa es el nexo conector entre la red de agentes, las bases de datos y la API REST.
- **agents/**: Contenido principal del framework AI. Orquestación de mini-bots o agentes con roles enfocados dentro del área de riesgo y crédito.
- **database/**: Configuración del ORM, conexión (SQLite/PostgreSQL) y abstracciones de queries o repositorios CRUD.
- **scoring/**: Reglas puramente algorímicas y matemáticas que corren métricas vitales como el Índice de Inclusión Financiera o la Confianza del score. Separado de la IA predictiva/generativa. 
- **llm_runtime/**: Envoltorios de LiteLLM, abstracción de proveedores, y control maestro de system prompts por contexto.

## Flujo General de Ejecución (Evaluation Pipeline)

1. El usuario cliente manda un payload de perfil a través del endpoint `POST /api/...`
2. `api/routes.py` usa a `schemas.py` para asegurarse que el dato viene tipado correctamente.
3. Se invoca una función dentro de los **Services** (ej. `evaluation_service.py`).
4. El servicio registra el inicio localmente en la Base de Datos usando un manejador CRUD para crear un estado de solicitud.
5. Se corren las métricas numéricas bases llamando al folder **Scoring**.
6. Luego se invoca a uno o más agentes en **Agents** para analizar factores como entorno macroeconómico (EconomicAgent), validación y antifraude (AuditAgent), y prescripción de opciones (PrescriptiveAgent).
7. Dichos agentes disparan comandos al modelo LLM usando el **llm_runtime** ensamblando variables y prompts fijos de cada especialidad.
8. Un agente final moderador (ModeratorAgent u orquestador manual) emite el consenso.
9. Se plasma la respuesta y score a través del DB **CRUD**.
10. La API le responde al Front End de forma limpia con formato tipado garantizado.
