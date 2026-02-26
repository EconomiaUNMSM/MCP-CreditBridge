# 03. API, Endpoints y Schemas

El directorio `app/api/` es la puerta formal a este microservicio. 

Utiliza la librería líder de Python para despliegues HTTP asincrónicos: **FastAPI**.

## Archivos Principales

1. **`routes.py`**  
   Encargado de listar los controladores finales o HTTP Verbs (`GET`, `POST`, `PUT`, `DELETE`).  
   Acá es donde vemos la inyección de dependencias `Depends()` de FastAPI que llaman a las piezas de la base de datos de manera automatizada para cada request entrante.
   - Enlaza el router a un *Service* dedicado.

2. **`schemas.py`**  
   El uso de *Pydantic* a lo largo de este archivo es la base de todo.  
   - Provee los moldes de Request / Response (Ej: `EvaluationRequest`, `ReportResponse`).
   - Sirve como validador de seguridad, forzando tipos estrictos.  
   - Las validaciones que logran atrapar Pydantic en `schemas.py` protegen al sistema de inyecciones antes de que la orden toque los agentes LLM.

## Buenas Prácticas

- Ninguna ruta directamente llama a los agentes.  
- Ninguna regla de lógica de negocios pesada debe ejecutarse en el `routes.py`, en caso de necesitar procesamiento de más de 25 líneas, debe extraerse a su propio servicio ubicado en `app/services/`.
