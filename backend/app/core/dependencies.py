from functools import lru_cache
from app.models.predictor import Predictor
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Global singleton instance
_predictor_instance = None

def get_predictor() -> Predictor:
    """
    Returns a singleton instance of the Predictor class.
    Ensures the model and SHAP explainer are loaded only once.
    """
    global _predictor_instance
    if _predictor_instance is None:
        logger.info("Initializing Predictor Singleton...")
        try:
            _predictor_instance = Predictor()
            logger.info("Predictor Singleton initialized successfully.")
        except Exception as e:
            logger.critical(f"Failed to initialize Predictor: {e}")
            raise e
            
    return _predictor_instance

from app.database.base import SessionLocal
from typing import Generator

def get_db() -> Generator:
    """
    Dependency for database session lifecycle management per request.
    Yields a SQLAlchemy session and closes it after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
