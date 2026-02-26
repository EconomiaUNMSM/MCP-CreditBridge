
import sys
import os
import pytest
from unittest.mock import MagicMock, patch
from pathlib import Path

# Add backend to path
backend_path = str(Path(__file__).parent.parent.parent)
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.api.schemas import EvaluationRequest, CoreMCPFeatures, V2ExtendedFeatures, EconomicInput, IntegrationInput
from app.services.evaluation_service import InclusionPipeline
from app.services.report_services import generate_report
from app.database import models

# Mock Data
MOCK_APPLICANT_ID = "test_agent_007"
MOCK_SNAPSHOT_ID = 999


import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime

class TestMultiAgentFlow(unittest.TestCase):
    
    def setUp(self):
        self.mock_request = EvaluationRequest(
            applicant_id="test_agent_007",
            core_features=CoreMCPFeatures(
                economic=EconomicInput(monthly_income=1000, income_stability_months=12, employment_type="formal", debt_ratio=0.3, savings_months_cover=3),
                integration=IntegrationInput(language_level=5, housing_stability_months=24, local_references=3, ngo_validation=True)
            ),
            v2_features=V2ExtendedFeatures()
        )

    @patch("app.agents.llm_agent.call_llm")
    @patch("app.agents.moderator_agent.call_llm")
    @patch("app.agents.prescriptive_agent.call_llm")
    @patch("app.services.evaluation_service.crud")
    @patch("app.services.evaluation_service.SessionLocal")
    # REMOVED: @patch("app.services.report_services.SimpleDocTemplate") -> We want REAL PDF generation
    @patch("app.services.report_services._find_audit_record")
    @patch("app.services.report_services.Session") # Use Session context
    def test_full_flow(self, mock_session_cls, mock_find_audit, mock_session_local, mock_crud, mock_pres_llm, mock_mod_llm, mock_llm):

        
        # 1. MOCK LLM RESPONSES
        mock_llm.return_value = {
            "executive_summary": "Solid profile.",
            "technical_breakdown": "Good.",
            "risk_level": "Low",
            "key_factors": ["High Income"],
            "model_limitations": "None",
            "confidence_interpretation": "High",
            "ml_explainability": {"top_features": []}
        }
        
        mock_mod_llm.return_value = {
            "dialogue": [{"agent": "Economic", "message": "Strong.", "sentiment": "positive"}],
            "synthesis": "Consensus reached."
        }
        
        mock_pres_llm.return_value = {
            "improvement_steps": [{"title": "Save More", "description": "Increase savings.", "impact": "High", "effort": "Low", "priority": 1}]
        }

        # 2. MOCK DB
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        # Mock Snapshot for both Creation AND Retrieval (for Report)
        mock_snapshot = MagicMock()
        mock_snapshot.id = 999
        mock_snapshot.applicant_id = "test_agent_007"
        mock_snapshot.snapshot_date = datetime.now()
        mock_snapshot.system_version = "v2.0-test"
        mock_snapshot.inclusion_index = 85.0
        mock_snapshot.ml_probability = 0.9
        mock_snapshot.confidence_score = 90.0
        
        mock_crud.create_snapshot.return_value = mock_snapshot
        
        # Mock Audit Record for Report Generation
        mock_find_audit.return_value = {
            "metrics": {
                "dimension_scores": {
                    "economic": 0.8,
                    "integration": 0.7,
                    "stability": 0.6
                }
            },
            "shap": {
                "top_positive": ["Income"],
                "top_negative": ["Debt"]
            },
            "llm_explanation": "Test explanation.",
            "agent_consensus": {
                "dialogue": [{"agent": "Economic", "message": "Strong.", "sentiment": "positive"}],
                "synthesis": "Consensus reached."
            },
            "prescriptive_roadmap": [
                {"title": "Save More", "description": "Increase savings.", "impact": "High", "effort": "Low", "priority": 1}
            ]
        }
        
        # For Report Retrieval:
        # report_services.py: snapshot = db.query(...).get(id)
        mock_db.query.return_value.get.return_value = mock_snapshot

        # 3. RUN PIPELINE
        pipeline = InclusionPipeline()
        print("\n🚀 Running Multi-Agent Pipeline...")
        response = pipeline.run_full_evaluation(self.mock_request)
        
        # 4. ASSERTIONS
        self.assertIsNotNone(response.agent_consensus)
        self.assertEqual(response.agent_consensus.synthesis, "Consensus reached.")
        print("✅ Moderator Agent Dialogue Synthesis Verified.")

        self.assertIsNotNone(response.prescriptive_roadmap)
        self.assertEqual(response.prescriptive_roadmap[0].title, "Save More")
        print("✅ Prescriptive Agent Roadmap Verified.")
        
        # 5. TEST REPORT GENERATION (Locale-Awareness)
        print("\n📄 Testing Locale-Aware Report Generation...")
        
        # English
        path_en = generate_report(999, mock_db, locale="en")
        self.assertIn("_en.pdf", path_en)
        print(f"✅ English Report Suffix Verified: {path_en}")
        
        # Spanish
        path_es = generate_report(999, mock_db, locale="es")
        self.assertIn("_es.pdf", path_es)
        print(f"✅ Spanish Report Suffix Verified: {path_es}")


if __name__ == "__main__":
    unittest.main()
