from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from app.database import models
from app.database.base import engine

# Create tables immediately upon import for this MVP context
models.Base.metadata.create_all(bind=engine)

def create_applicant(db: Session, applicant_id: str) -> models.Applicant:
    db_applicant = models.Applicant(id=applicant_id)
    db.add(db_applicant)
    db.commit()
    return db_applicant

def get_applicant(db: Session, applicant_id: str) -> Optional[models.Applicant]:
    return db.query(models.Applicant).filter(models.Applicant.id == applicant_id).first()

def create_snapshot(
    db: Session, 
    applicant_id: str,
    inclusion_index: float,
    confidence_score: float,
    ml_probability: Optional[float],
    core_features: Dict[str, Any],
    v2_features: Optional[Dict[str, Any]],
    model_version: str,
    system_version: str
) -> models.SnapshotHistory:
    
    # Ensure applicant exists
    if not get_applicant(db, applicant_id):
        create_applicant(db, applicant_id)

    db_snapshot = models.SnapshotHistory(
        applicant_id=applicant_id,
        inclusion_index=inclusion_index,
        confidence_score=confidence_score,
        ml_probability=ml_probability,
        core_features=core_features,
        v2_features=v2_features,
        model_version_used=model_version,
        system_version=system_version
    )
    db.add(db_snapshot)
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot

def create_training_record(
    db: Session,
    snapshot_id: int,
    applicant_id: str,
    feature_vector: List[float]
) -> models.TrainingRecord:
    
    db_record = models.TrainingRecord(
        snapshot_id=snapshot_id,
        applicant_id=applicant_id,
        feature_vector=feature_vector
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def update_outcome(
    db: Session,
    snapshot_id: int,
    default_flag: bool,
    repayment_score: float,
    notes: str = None
) -> models.OutcomeRecord:
    
    snapshot = db.query(models.SnapshotHistory).get(snapshot_id)
    if not snapshot:
        raise ValueError("Snapshot not found")

    outcome = models.OutcomeRecord(
        applicant_id=snapshot.applicant_id,
        snapshot_id=snapshot_id,
        default_flag=default_flag,
        repayment_score=repayment_score,
        notes=notes
    )
    db.add(outcome)
    
    # Also update the TrainingRecord targets immediately
    training_record = db.query(models.TrainingRecord).filter_by(snapshot_id=snapshot_id).first()
    if training_record:
        training_record.target_default_flag = default_flag
        training_record.target_repayment_behavior_6m = repayment_score
        
    db.commit()
    return outcome

def get_training_dataset(db: Session, min_age_months: int = 6) -> List[models.TrainingRecord]:
    """
    Retrieves training records that have a valid outcome and are older than min_age_months.
    Strictly prevents data leakage by ensuring the outcome is mature.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=min_age_months*30)
    
    return db.query(models.TrainingRecord)\
        .join(models.SnapshotHistory)\
        .filter(models.SnapshotHistory.snapshot_date <= cutoff_date)\
        .filter(models.TrainingRecord.target_default_flag.isnot(None))\
        .all()
