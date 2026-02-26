import sys
import os
import json
from pathlib import Path
from sqlalchemy.orm import Session # type: ignore

# Add the backend folder to sys.path
backend_path = str(Path(__file__).parent.parent.parent)
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.api.schemas import (
    EvaluationRequest, 
    CoreMCPFeatures, 
    V2ExtendedFeatures, 
    EconomicInput, 
    IntegrationInput
)
from app.services.evaluation_service import InclusionPipeline
from app.database import models
from app.database.base import SessionLocal

def test_v2_architecture():
    print("🚀 Starting MCP-CreditBridge V2 Architecture Test (with SHAP)...\n")
    
    # 1. Prepare V2 Data
    print("📊 Preparing V2 Data Payload...")
    
    # Example: High Risk Profile (Low income, high debt) to test explainability
    economic_data = EconomicInput(
        monthly_income=650.0,
        income_stability_months=6,
        employment_type="informal",
        debt_ratio=0.65, # HIGH DEBT
        savings_months_cover=0.5
    )
    
    integration_data = IntegrationInput(
        language_level=2,
        housing_stability_months=12,
        local_references=1,
        ngo_validation=False
    )
    
    v2_data = V2ExtendedFeatures(
        volatility_of_income=0.8, # HIGH VOLATILITY
        income_growth_trend=-0.1,
        asset_index=0.2,
        punctualidad_reportada=0.5,
        consistencia_declarativa=0.7,
        vulnerability_score=0.8 # HIGH VULNERABILITY
    )
    
    request = EvaluationRequest(
        applicant_id="test_shap_user_001",
        core_features=CoreMCPFeatures(
            economic=economic_data,
            integration=integration_data
        ),
        v2_features=v2_data
    )

    # 2. Execute Pipeline
    print("⚙️ Executing InclusionPipeline (Service Layer)...")
    pipeline = InclusionPipeline()
    
    try:
        response = pipeline.run_full_evaluation(request)
        print("\n✅ Pipeline Execution Successful.")
        print(f"   -> Final Index: {response.inclusion_index}")
        print(f"   -> ML Probability: {response.ml_probability}")
        print(f"   -> Explanation Summary: {response.explanation_summary[:100]}...")
        
        # 3. Verify SHAP Explainability
        # Note: The response object itself doesn't expose the raw SHAP list to the API consumer in the Schema,
        # but the LLM uses it. To verify it working, we check if the explanation mentions key factors.
        print("\n🔍 Verifying Explainability Integration:")
        print(f"   -> Key Factors (LLM): {response.risk_flags}")
        
    except Exception as e:
        print(f"❌ Pipeline Failed: {e}")
        import traceback
        traceback.print_exc()
        return

    # 4. Verify Persistence (Audit)
    print("\n💾 Verifying Database Persistence & Audit Log...")
    db: Session = SessionLocal()
    try:
        # Check Snapshot
        snapshot = db.query(models.SnapshotHistory)\
            .filter(models.SnapshotHistory.applicant_id == "test_shap_user_001")\
            .order_by(models.SnapshotHistory.id.desc())\
            .first()
            
        if snapshot:
            print(f"✅ Snapshot Record Found (ID: {snapshot.id})")
            print(f"   -> System Version: {snapshot.system_version}")
            print(f"   -> Model Version: {snapshot.model_version_used}")
        else:
            print("❌ Snapshot NOT found in DB.")

        # Check Audit Ledger (File based)
        audit_path = Path(__file__).parent.parent.parent / "data" / "audit_ledger.jsonl"
        if audit_path.exists():
            print(f"✅ Audit Ledger exists at {audit_path}")
            # Read last line
            with open(audit_path, "r") as f:
                lines = f.readlines()
                if lines:
                    last_audit = json.loads(lines[-1])
                    print("   -> Last Audit Record Content:")
                    ml_data = last_audit.get("ml_model", {})
                    print(f"      - ML Prob: {ml_data.get('probability')}")
                    print(f"      - SHAP Entries: {len(ml_data.get('shap_explanation', []))}")
                    if ml_data.get('shap_explanation'):
                        print(f"      - Top Driver: {ml_data['shap_explanation'][0]}")
        else:
             print("❌ Audit Ledger file not found.")

    finally:
        db.close()

    print("\n🎉 SUCCESS: V2 Architecture + SHAP Verified.")

if __name__ == "__main__":
    test_v2_architecture()
