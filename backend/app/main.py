from fastapi import FastAPI
from app.api import routes
from app.core import config
from app.utils.logger import get_logger

logger = get_logger(__name__)

def create_app() -> FastAPI:
    """
    Factory function to create and configure the FastAPI application.
    """
    logger.info(f"Initializing {config.API_TITLE} ({config.API_VERSION})...")
    
    app = FastAPI(
        title=config.API_TITLE,
        description=config.API_DESCRIPTION,
        version=config.API_VERSION,
        openapi_url="/api/v2/openapi.json",
        docs_url="/api/v2/docs",
        redoc_url="/api/v2/redoc"
    )

    # Include Routes
    app.include_router(routes.router, prefix="/api/v2")

    # CORS Middleware
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    logger.info("Application initialized successfully.")
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    # Run uvicorn server for development
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
