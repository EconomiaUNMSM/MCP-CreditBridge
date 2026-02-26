from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from sqlalchemy.orm import Session
from app.database import models
from app.agents.audit_agent import AuditAgent
import json
import os

AUDIT_LEDGER_PATH = AuditAgent.LEDGER_PATH

def _find_audit_record(snapshot_id: int) -> dict:
    """
    Streams the JSONL ledger to find the record for a given snapshot_id.
    Returns None if not found or if file doesn't exist.
    """
    if not os.path.exists(AUDIT_LEDGER_PATH):
        return None

    try:
        with open(AUDIT_LEDGER_PATH, 'r') as f:
            for line in f:
                try:
                    record = json.loads(line)
                    if record.get("snapshot_id") == snapshot_id:
                        return record
                except json.JSONDecodeError:
                    continue 
    except Exception as e:
        print(f"Error reading audit ledger: {e}")
        return None
    
    return None

def _get_inclusion_category(index: float) -> str:
    if index >= 75:
        return "Strong Integration"
    elif index >= 60:
        return "Developing Stability"
    elif index >= 45:
        return "Requires Structured Support"
    else:
        return "High Monitoring Required"

from app.agents.registry import registry # Global instance

def generate_report(snapshot_id: int, db: Session, identity: dict = None, locale: str = 'en') -> str:
    """
    Generates a semi-visual Institutional Inclusion Assessment Report.
    Retrieves narrative context from the Audit Ledger JSONL.
    Optionally includes applicant identity information.
    """
    snapshot = db.query(models.SnapshotHistory).get(snapshot_id)
    if not snapshot:
        raise ValueError("Snapshot Record Not Found")

    # Retrieve Extended Context from Ledger
    audit_record = _find_audit_record(snapshot_id)
    
    # 1. Locale-Specific Filename
    filename = f"report_{snapshot.applicant_id}_{snapshot_id}_{locale}.pdf"
    filepath = os.path.join("reports", filename)
    os.makedirs("reports", exist_ok=True)

    # 2. Get Institutional Context
    advisor_context = registry.advisor.run(locale)

    doc = SimpleDocTemplate(filepath, pagesize=A4,
                            rightMargin=50, leftMargin=50,
                            topMargin=50, bottomMargin=50)

    styles = getSampleStyleSheet()
    # Custom Styles
    title_style = ParagraphStyle(
        'InstitutionalTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=10,
        textColor=colors.HexColor("#1e3a8a")  # Dark Blue
    )
    subtitle_style = ParagraphStyle(
        'InstitutionalSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.gray,
        spaceAfter=30
    )
    section_header = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading3'],
        fontSize=14,
        spaceBefore=15,
        spaceAfter=10,
        textColor=colors.HexColor("#1e3a8a"),
        borderPadding=5,
        borderColor=colors.HexColor("#e5e7eb"),
        borderWidth=1,
        borderRadius=4
    )
    body_text = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        spaceAfter=10
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=1 # Center
    )

    story = []

    # --- 1. HEADER ---
    story.append(Paragraph("MCP-CreditBridge", subtitle_style))
    story.append(Paragraph("Inclusion Assessment Report", title_style))
    story.append(Paragraph(advisor_context["title_suffix"], subtitle_style)) # Localized Suffix
    
    # Regulatory Note
    story.append(Paragraph(f"<i>{advisor_context['regulatory_note']}</i>", body_text))
    story.append(Spacer(1, 10))
    
    header_data = [
        [f"Snapshot ID: {snapshot_id}", f"Date: {snapshot.snapshot_date.strftime('%Y-%m-%d %H:%M')}"],
        [f"Applicant ID: {snapshot.applicant_id}", f"System Version: {snapshot.system_version}"]
    ]
    t_header = Table(header_data, colWidths=[3*inch, 3*inch])
    t_header.setStyle(TableStyle([
        ('TEXTCOLOR', (0,0), (-1,-1), colors.gray),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,0), (-1,-1), 1, colors.lightgrey),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 20))

    # --- 2. APPLICANT PROFILE (if identity provided) ---
    if identity:
        story.append(Paragraph("Applicant Profile", section_header))
        
        profile_data = [
            ["Applicant Name:", identity.get("fullName", "N/A")],
            ["Nationality:", identity.get("nationality", "N/A")],
            ["Years in Country:", identity.get("yearsInCountry", "N/A")],
            ["Employment Type:", identity.get("employmentType", "N/A")]
        ]
        
        # Add reference code if provided
        if identity.get("referenceCode"):
            profile_data.append(["Reference Code:", identity.get("referenceCode")])
        
        t_profile = Table(profile_data, colWidths=[2*inch, 4*inch])
        t_profile.setStyle(TableStyle([
            ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor("#64748b")),  # Left column gray
            ('TEXTCOLOR', (1,0), (1,-1), colors.HexColor("#1e293b")),  # Right column dark
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t_profile)
        story.append(Spacer(1, 20))

    # --- 3. EXECUTIVE SUMMARY ---
    story.append(Paragraph("Executive Summary", section_header))
    
    explanation_text = "Narrative explanation not available for this snapshot record."
    if audit_record and audit_record.get("llm_explanation"):
        explanation_text = audit_record.get("llm_explanation")
        
        # Contextualize with applicant name if available
        if identity and identity.get("fullName"):
            # Only prefix if the name is not already in the text
            if identity.get("fullName") not in explanation_text:
                explanation_text = f"{identity.get('fullName')} {explanation_text[0].lower()}{explanation_text[1:]}"
    
    story.append(Paragraph(explanation_text, body_text))
    story.append(Spacer(1, 10))

    # --- 3. DECISION METRICS TABLE ---
    story.append(Paragraph("Decision Metrics Overview", section_header))

    inclusion_index = snapshot.inclusion_index
    category = _get_inclusion_category(inclusion_index)
    ml_prob = f"{snapshot.ml_probability:.4f}" if snapshot.ml_probability is not None else "N/A"
    confidence = f"{snapshot.confidence_score:.2f}"

    metrics_data = [
        ["Metric", "Value", "Status/Outlook"],
        ["Inclusion Index", f"{inclusion_index:.2f}", category],
        ["Repayment Probability (ML)", ml_prob, "Model Estimate"],
        ["Data Confidence Score", confidence, "Structure Reliability"]
    ]

    t_metrics = Table(metrics_data, colWidths=[2.5*inch, 1.5*inch, 2.5*inch])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.black),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
        ('FONTNAME', (1,1), (1,1), 'Helvetica-Bold'), # Bold Index Value
        ('TEXTCOLOR', (1,1), (1,1), colors.HexColor("#2563eb")), # Blue Index
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 20))

    # --- 4. DIMENSIONAL BREAKDOWN (If Available) ---
    if audit_record and audit_record.get("metrics") and audit_record["metrics"].get("dimension_scores"):
        story.append(Paragraph("Dimensional Breakdown", section_header))
        scores = audit_record["metrics"]["dimension_scores"]
        
        dim_data = [
            ["Dimension", "Score (0-100)"],
            ["Economic Stability", f"{scores.get('economic', 0) * 100:.1f}"],
            ["Social Integration", f"{scores.get('integration', 0) * 100:.1f}"],
            ["Structural Resilience", f"{scores.get('stability', 0) * 100:.1f}"]
        ]
        t_dim = Table(dim_data, colWidths=[4*inch, 2*inch])
        t_dim.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e5e7eb")),
        ]))
        story.append(t_dim)
        story.append(Spacer(1, 20))

    # --- 5. HUMANIZED FACTORS (SHAP) ---
    if audit_record and audit_record.get("shap"):
        story.append(Paragraph("Key Contributing Factors", section_header))
        
        # Strengthening
        story.append(Paragraph("<b>Strengthening Factors:</b>", body_text))
        positives = audit_record["shap"].get("top_positive", [])
        if positives:
            for feat in positives:
                story.append(Paragraph(f"• {feat.replace('_', ' ').title()}", body_text))
        else:
            story.append(Paragraph("• No significant positive drivers identified.", body_text))
        
        story.append(Spacer(1, 10))

        # Monitoring
        story.append(Paragraph("<b>Factors Requiring Monitoring:</b>", body_text))
        negatives = audit_record["shap"].get("top_negative", [])
        if negatives:
            for feat in negatives:
                story.append(Paragraph(f"• {feat.replace('_', ' ').title()}", body_text))
        else:
            story.append(Paragraph("• No significant risk drivers identified.", body_text))

    # --- 6. MULTI-AGENT CONSENSUS (Dialogue) ---
    if audit_record and audit_record.get("agent_consensus"):
        consensus = audit_record["agent_consensus"]
        story.append(Paragraph("Multi-Agent Consensus", section_header))
        
        # Dialogue Bubbles
        for msg in consensus.get("dialogue", []):
            agent_name = msg.get("agent", "Agent")
            text = msg.get("message", "")
            sentiment = msg.get("sentiment", "neutral")
            
            # Simple color coding for sentiment
            color = "#1e293b" # Default dark
            if sentiment == "positive": color = "#166534" # Green
            if sentiment == "warning": color = "#991b1b" # Red
            
            story.append(Paragraph(f"<b>{agent_name}:</b> <font color='{color}'>{text}</font>", body_text))
            
        story.append(Spacer(1, 10))
        story.append(Paragraph(f"<b>Final Synthesis:</b> {consensus.get('synthesis', '')}", body_text))
        story.append(Spacer(1, 20))

    # --- 7. PRESCRIPTIVE ROADMAP (Actionable) ---
    if audit_record and audit_record.get("prescriptive_roadmap"):
        roadmap = audit_record["prescriptive_roadmap"]
        story.append(Paragraph("Inclusion Roadmap (Actionable Steps)", section_header))
        
        for step in roadmap:
            title = step.get("title", "Action")
            desc = step.get("description", "")
            priority = step.get("priority", 3)
            
            action_text = f"<b>{priority}. {title}:</b> {desc}"
            story.append(Paragraph(action_text, body_text))
        
        story.append(Spacer(1, 20))

    # --- 8. FOOTER / DISCLAIMER ---
    story.append(Spacer(1, 40))
    story.append(Paragraph("_" * 60, disclaimer_style)) # Separator Line
    story.append(Spacer(1, 10))
    
    if identity and identity.get("fullName"):
        disclaimer_text = f"This assessment reflects structural inclusion indicators for {identity.get('fullName')} and does not constitute a final credit decision. Final determinations remain subject to institutional review."
    else:
        disclaimer_text = "This assessment reflects structural inclusion indicators for the above-named applicant and does not constitute a final credit decision. Final determinations remain subject to institutional review."
    
    story.append(Paragraph(disclaimer_text, disclaimer_style))


    doc.build(story)
    return filepath
