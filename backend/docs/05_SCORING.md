# 05. Motor de Scoring e Inclusión

Ubicado en la ruta `app/scoring/`. Aquí no interviene la IA generativa; este entorno confía exclusivamente en reglas predictivas, modelos algorítmicos duros y matemáticas estandarizadas del sistema financiero, complementadas para abordar casos marginados económicamente.

## Sus módulos

1. **`inclusion_index.py` (Índice de Inclusión)**
   Genera puntuaciones de inclusión. El objetivo de MCP CreditBridge es facilitar acceso. Este módulo calcula un índice favorable para perfiles que, en el modelo bancario clásico (altamente penalizador del historial nulo), resultaban rechazados, tomando en cuenta la liquidez libre y métricas operacionales.

2. **`normalization.py` (Normalizador / Estandarizador)**
   Las variables económicas ingresan en distintas dimensiones, magnitudes (ej, ingresos de $50,000 contra antigüedades de 2 años). Los modelos requieren normalización estadística a escalas estándares (por ej: [0, 1] o Z-scores).

3. **`confidence.py` (Confianza del Análisis)**
   Asigna márgenes de error. Si la data es frágil o con pocos comprobantes cruzados (un scoring ideal pero no verificable), la tasa de confianza baja y ajusta las decisiones posteriores que vayan a tomar los agentes IA.
