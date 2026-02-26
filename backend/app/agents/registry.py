from app.agents.economic_agent import EconomicAgent
from app.agents.integration_agent import IntegrationAgent
from app.agents.stability_agent import StabilityAgent
from app.agents.ml_agent import MLAgent
from app.agents.llm_agent import LLMAgent
from app.agents.audit_agent import AuditAgent
from app.agents.moderator_agent import ModeratorAgent
from app.agents.prescriptive_agent import PrescriptiveAgent
from app.agents.advisor_agent import AdvisorAgent

class AgentRegistry:
    """
    Central registry for all agents in the MCP-CreditBridge system.
    Responsible for instantiation and lifecycle management of agents.
    Discards the dictionary pattern in favor of strongly-typed class attributes
    for better IDE support and type safety.
    """
    def __init__(self):
        self.economic = EconomicAgent()
        self.integration = IntegrationAgent()
        self.stability = StabilityAgent()
        self.ml = MLAgent()
        self.llm = LLMAgent()
        self.audit = AuditAgent()
        
        # New Consensus & Actionable Agents (Phase 8)
        self.moderator = ModeratorAgent()
        self.prescriptive = PrescriptiveAgent()
        self.advisor = AdvisorAgent()

# Singleton instance for easy access if needed (optional)
registry = AgentRegistry()
