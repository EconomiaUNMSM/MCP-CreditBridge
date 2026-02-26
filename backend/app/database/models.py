from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    snapshots = relationship("SnapshotHistory", back_populates="applicant")
    outcomes = relationship("OutcomeRecord", back_populates="applicant")


class SnapshotHistory(Base):
    """
    Immutable record of a credit evaluation run.
    Contains raw features, computed scores, and system metadata for full reproducibility.
    """
    __tablename__ = "snapshot_history"

    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(String, ForeignKey("applicants.id"))
    snapshot_date = Column(DateTime, default=datetime.utcnow)
    
    # Scores
    inclusion_index = Column(Float)
    confidence_score = Column(Float)
    ml_probability = Column(Float, nullable=True)
    
    # Feature Data (Correctly Segmented for V2)
    core_features = Column(JSON) # Stores CoreMCPFeatures dict
    v2_features = Column(JSON, nullable=True) # Stores V2ExtendedFeatures dict
    
    # Audit Metadata
    feature_schema_version = Column(String, default="v2.0")
    model_version_used = Column(String) # e.g. "mcp_rf_v1.0" or "not_trained"
    system_version = Column(String) # e.g. "v1.0-deterministic"
    
    # Relationships
    applicant = relationship("Applicant", back_populates="snapshots")
    training_record = relationship("TrainingRecord", uselist=False, back_populates="snapshot")
    outcomes = relationship("OutcomeRecord", back_populates="snapshot")


class TrainingRecord(Base):
    """
    Flattened, ML-ready record derived from a Snapshot.
    Used for efficient model training without complex JSON parsing at training time.
    """
    __tablename__ = "training_records"

    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(String, index=True)
    snapshot_id = Column(Integer, ForeignKey("snapshot_history.id"))
    
    # The actual vector used/to be used for training
    feature_vector = Column(JSON) # Ordered list or dict of numerical features
    
    # Targets (To be filled by OutcomeRecord updates)
    target_default_flag = Column(Boolean, nullable=True)
    target_repayment_behavior_6m = Column(Float, nullable=True) 
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    snapshot = relationship("SnapshotHistory", back_populates="training_record")


class OutcomeRecord(Base):
    """
    Ground truth data received from financial partners.
    Strictly linked to a specific snapshot to prevent leakage.
    """
    __tablename__ = "outcome_records"

    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(String, ForeignKey("applicants.id"))
    snapshot_id = Column(Integer, ForeignKey("snapshot_history.id")) # Link to the decision instance
    outcome_date = Column(DateTime, default=datetime.utcnow)
    
    # Indicators
    default_flag = Column(Boolean)
    repayment_score = Column(Float) # 0.0 to 1.0 repayment performance
    notes = Column(Text, nullable=True)

    applicant = relationship("Applicant", back_populates="outcomes")
    snapshot = relationship("SnapshotHistory", back_populates="outcomes")
