# 04. Bases de Datos (Database)

En `app/database/` yace la persistencia en formato relacional (SQL). La aplicación utiliza **SQLAlchemy** como su Motor ORM.  
Bajo la configuración por defecto de inicio, apunta a un banco SQLite local `mcp_v2.db`.

## Estructura

- **`base.py`**: Configuración core del Engine. Posee la generación del objeto `sessionmaker` y la inyección típica con `get_db()`.
- **`models.py`**: Aportan la traducción de POPO (Plain Old Python Objects) a tablas de SQL.  
  Aquí se declaran entidades del negocio como las métricas históricas de clientes, seguimientos o la auditoría de cada reporte final emitido.
- **`crud.py`**: Aísla todas las funciones tipo "Create, Read, Update, Delete". En vez de hacer queries o *commits* sueltos por los archivos, los archivos externos sólo traen y mandan al helper CRUD y delegan la responsabilidad.

## Pasos para Migraciones
Si en el futuro se requiriese evolucionar el sistema, aquí convivirían archivos de control para librerías como Alembic que apliquen migraciones automáticas al entorno de producción (ej, cambiar de SQLite a PostgreSQL).
