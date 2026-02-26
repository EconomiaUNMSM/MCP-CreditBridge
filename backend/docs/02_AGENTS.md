# 02. Sistema Multi-Agente (Agents)

Ubicado en la carpeta `app/agents/`, el sistema basa sus razonamientos adaptativos y sintéticos en una arquitectura Multi-Agente impulsada por Inteligencia Artificial.

En vez de tener un único motor generativo de texto, el análisis del crédito se delegó en un "comité" de roles, imitando a un equipo de analistas de riesgo y operaciones en una entidad financiera real.

## Roles Implementados

- **Audit Agent (`audit_agent.py`)**: Valida la coherencia de la información ingresada y detecta inconsistencias que los validadores comunes suelen omitir.
- **Economic Agent (`economic_agent.py`)**: Cruza la información contra perspectivas de rubro, mercado y macroeconomía del perfil (Ej. si solicita invertir un negocio en un rubro que actualmente está estresado).
- **ML Agent (`ml_agent.py`)**: Representa la conexión intermedia entre la IA tradicional en base a parámetros estáticos (y deterministas) con el texto libre.
- **Prescriptive Agent (`prescriptive_agent.py`)**: Agente resolutivo. En lugar de negación rotunda, sugiere condiciones adaptadas de crédito, como la solicitud de avales o co-deudores.
- **Stability Agent (`stability_agent.py`)**: Someta las proyecciones a pruebas de estrés con varianzas de ingreso, cesantía o fluctuación de tipos de interés, comprobando qué tan "estable" es el perfil frente al riesgo.
- **Advisor Agent (`advisor_agent.py`)**: Asesor que resume y estructura recomendaciones holísticas tanto para la institución como para el cliente (a manera de consultoría gratuita de cómo mejorar score).
- **Moderator Agent (`moderator_agent.py`)**: Verifica que las conclusiones y reportes de los demás no contengan sesgos excesivos de rechazo que rompan las vías para la inclusión, proveyendo un control o go-no-go final.
- **LLM Agent base (`llm_agent.py`)**: Framework genérico desde el cual los demás heredan métodos básicos para inyección y enrutamiento con el LLM.

## Registro y Coordinación (`registry.py`)
No todos los agentes se activarán a la vez o bajo las mismas circunstancias. El registry se encarga de servir las instancias necesarias e instanciarlas durante el runtime del *EvaluationService*.
