
import sys
import json
import os
from pathlib import Path

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.api.schemas import (
    EvaluationRequest, 
    CoreMCPFeatures, 
    V2ExtendedFeatures, 
    EconomicInput, 
    IntegrationInput
)

client = TestClient(app)

def verify_backend():
    print("🚀 Starting Backend API Verification...")

    # 1. Prepare Data
    payload = {
        "applicant_id": "api_test_user_001",
        "core_features": {
            "economic": {
                "monthly_income": 5000.0,
                "income_stability_months": 12,
                "employment_type": "formal",
                "debt_ratio": 0.5,
                "savings_months_cover": 2.0
            },
            "integration": {
                "language_level": 3,
                "housing_stability_months": 24,
                "local_references": 2,
                "ngo_validation": True
            }
        },
        "v2_features": {
            "volatility_of_income": 0.4,
            "income_growth_trend": 0.05,
            "asset_index": 0.5,
            "punctualidad_reportada": 0.8,
            "consistencia_declarativa": 0.9,
            "digital_interaction_score": 0.6,
            "zone_risk_index": 0.3,
            "vulnerability_score": 0.4
        }
    }

    # 2. Test POST /evaluate
    print("\n📡 Testing POST /api/v2/evaluate...")
    response = client.post("/api/v2/evaluate", json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Evaluation Successful")
        print(f"   -> Snapshot ID: {data.get('snapshot_id')}")
        print(f"   -> Inclusion Index: {data.get('final_index')}")
        print(f"   -> ML Prob: {data.get('ml_probability')}")
        
        snapshot_id = data.get('snapshot_id')
        
        # 3. Test GET /report/{id}
        if snapshot_id:
            print(f"\n📄 Testing GET /api/v2/report/{snapshot_id}...")
            report_response = client.get(f"/api/v2/report/{snapshot_id}")
            
            if report_response.status_code == 200:
                print("✅ Report Generated Successfully")
                content_type = report_response.headers.get("content-type")
                print(f"   -> Content-Type: {content_type}")
                
                # Save locally to check
                output_file = Path("backend_verification_report.pdf")
                with open(output_file, "wb") as f:
                    f.write(report_response.content)
                print(f"   -> Saved to {output_file.absolute()}")
                print("👉 IMPORTANT: Open this PDF to verify the new 'Institutional Inclusion Assessment' layout.")
            else:
                print(f"❌ Report Generation Failed: {report_response.status_code} - {report_response.text}")
    else:
        print(f"❌ Evaluation Failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    verify_backend()
