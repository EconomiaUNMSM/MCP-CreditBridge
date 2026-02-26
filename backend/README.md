# MCP CreditBridge - Backend API

Bienvenido al backend de MCP CreditBridge. Este sistema está construido sobre **FastAPI** y sigue una arquitectura modular en Python impulsada por múltiples agentes inteligentes y modelos de Machine Learning/LLM.

## Estructura de Documentación Granular

Para facilitar la comprensión del sistema, la documentación ha sido dividida de manera granular. A continuación encontrarás los enlaces a los diferentes módulos dentro de la carpeta `docs/`:

1. [01_ARCHITECTURE.md](docs/01_ARCHITECTURE.md) - Visión global del sistema y arquitectura.
2. [02_AGENTS.md](docs/02_AGENTS.md) - Sistema multi-agente (Roles: Audit, Economic, Prescriptive, etc.).
3. [03_API.md](docs/03_API.md) - Rutas FastAPI y Pydantic Schemas.
4. [04_DATABASE.md](docs/04_DATABASE.md) - Modelos, CRUD y conexión a SQLite/Base de datos.
5. [05_SCORING.md](docs/05_SCORING.md) - Lógica de Scoring matemática, índices de inclusión y normalización.
6. [06_LLM.md](docs/06_LLM.md) - Interfaz con LiteLLM y prompts del sistema.
7. [07_SERVICES.md](docs/07_SERVICES.md) - Orquestación de lógica de negocios en evaluaciones y reportes.

## Requisitos Previos

- Python 3.9 o superior
- Entorno Virtual configurado (`venv`)
- Variables de entorno en el archivo (`.env`)

## Instalación y Ejecución Local

1. Activa tu entorno virtual
2. Instala los requerimientos:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecuta el servidor API usando Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```

## Stack Tecnológico
- **FastAPI**: Manejo de rutas y endpoints rápidos.
- **LiteLLM**: Interacción unificada con diversos proveedores (OpenAI, Anthropic, etc.).
- **SQLAlchemy**: Capa de ORM a base de datos.
- **Pydantic**: Validación y tipado robusto.
