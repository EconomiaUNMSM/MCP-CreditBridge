import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent.parent
APP_DIR = BASE_DIR / "app"
DATA_DIR = BASE_DIR / "data"
LOG_DIR = BASE_DIR / "logs"
REPORTS_DIR = BASE_DIR / "reports"
ARTIFACTS_DIR = APP_DIR / "models" / "artifacts"

# Ensure directories exist
os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# System Constants
SYSTEM_VERSION = "v2.0-hybrid-shap"
ENVIRONMENT = os.getenv("ENV", "dev")

# File Paths
MODEL_PATH = ARTIFACTS_DIR / "model_v2.pkl"
MODEL_METADATA_PATH = ARTIFACTS_DIR / "model_metadata.json"
LEDGER_PATH = DATA_DIR / "audit_ledger.jsonl"
SNAPSHOT_DB_PATH = DATA_DIR / "snapshots.db" 

# Reporting
REPORT_OUTPUT_DIR = REPORTS_DIR

# API Configuration
API_TITLE = "MCP-CreditBridge V2 API"
API_DESCRIPTION = "Explainable Credit Inclusion Engine for Underserved Populations"
API_VERSION = "2.0.0"

# LLM Configuration (LiteLLM)
# Assume OS Env Vars are set for API Keys
LLM_MODEL = "gpt-4o-mini"
