from typing import Dict, TypedDict

class AdvisorAgent:
    """
    Agent responsible for locale-specific institutional context.
    Currently rule-based strategy pattern.
    """
    
    LOCALE_CONTEXTS = {
        "en": {
            "title_suffix": "Global - FCA Standard",
            "regulatory_note": "Assessment conducted in compliance with UK Financial Conduct Authority (FCA) fair lending principles.",
            "inclusion_framework": "Standard MCP Framework v2.0"
        },
        "es": {
            "title_suffix": "LATAM - Inclusión Financiera",
            "regulatory_note": "Evaluación alineada con los pilares de inclusión financiera de la Superintendencia de Banca y Seguros.",
            "inclusion_framework": "Marco MCP Adaptado v2.0 (Contexto Migrante)"
        }
    }

    def run(self, locale: str = "en") -> Dict[str, str]:
        """
        Returns institutional context for the specified locale.
        Falls back to 'en' if locale not supported.
        """
        context = self.LOCALE_CONTEXTS.get(locale, self.LOCALE_CONTEXTS["en"])
        return context
