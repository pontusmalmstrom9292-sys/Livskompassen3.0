import os
import logging
import vertexai
from vertexai.language_models import TextEmbeddingModel
from vertexai.generative_models import GenerativeModel
from google.cloud import aiplatform

# Konfigurera loggning för att enklare felsöka i molnet (t.ex. via Cloud Run)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class KnowledgeVault:
    """
    Ett kunskapsvalv som använder Vertex AI Vector Search för att hitta relevant
    information och svarar på frågor med hjälp av Gemini ("Kompis"-agenten).
    """
    def __init__(self, index_endpoint_id: str, deployed_index_id: str, documents_metadata: dict):
        logger.info("Ansluter till kunskapsvalvet...")
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        self.location = os.getenv("GOOGLE_CLOUD_LOCATION", "europe-west1")
        
        if not self.project_id:
            raise ValueError("Miljövariabeln GOOGLE_CLOUD_PROJECT saknas i din omgivning.")

        vertexai.init(
            project=self.project_id,
            location=self.location,
        )

        aiplatform.init(
            project=self.project_id,
            location=self.location,
        )

        self.embedding_model = TextEmbeddingModel.from_pretrained("text-embedding-004")
        # Använder den senaste snabba modellen för effektiv realtidskommunikation enligt er arkitektur
        self.generative_model = GenerativeModel("gemini-2.0-flash-001")

        self.index_endpoint = aiplatform.MatchingEngineIndexEndpoint(index_endpoint_id)
        self.deployed_index_id = deployed_index_id
        self.documents_metadata = documents_metadata
        
        logger.info("Kunskapsvalvet är redo!")

    def _get_embedding(self, text: str) -> list[float]:
        """Hämtar en embedding för en enstaka text."""
        embeddings = self.embedding_model.get_embeddings([text])
        return embeddings[0].values

    def search(self, query: str) -> str:
        """Söker i valvet efter det mest relevanta dokumentet med vektoriserad sökning."""
        try:
            query_embedding = self._get_embedding(query)
            search_results = self.index_endpoint.find_neighbors(
                deployed_index_id=self.deployed_index_id,
                queries=[query_embedding],
                num_neighbors=1
            )

            if not search_results or not search_results[0]:
                return ""

            best_match_id = search_results[0][0].id
            return self.documents_metadata.get(best_match_id, "")
            
        except Exception as e:
            logger.error(f"Ett fel uppstod vid vektorsökning: {e}")
            return ""

    def ask(self, question: str) -> str:
        """Huvudfunktionen: Söker i valvet och låter Kompis svara."""
        relevant_context = self.search(question)

        if not relevant_context:
            return "Jag kunde tyvärr inte hitta någon relevant information i ditt Kampspår just nu."

        # Personifierad Kompis-prompt enligt arkitekturen (Empatisk AI och RAG)
        prompt = f"""
        SYSTEMINSTRUKTION:
        Du är 'Kompis', en empatisk och proaktiv livscoach/AI-assistent för Livskompassen v2.
        Din ton ska vara uppmuntrande, trygg och professionell.
        
        STRIKTA REGLER:
        1. Svara ALLTID på SVENSKA.
        2. Använd ENDAST den bifogade kontexten för att svara på användarens fråga.
        3. Om svaret inte finns i kontexten, säg: "Jag kunde tyvärr inte hitta någon information om detta i ditt Kampspår just nu. Vill du berätta mer så att jag kan lära mig?"
        4. NÄMNA ALDRIG, gissa aldrig eller hitta aldrig på information som inte uttryckligen står i kontexten.
        5. Om kontexten är tvetydig, be om förtydligande istället för att anta.

        Kontext:
        {relevant_context}
        
        Användarens fråga:
        {question}
        
        DITT SVAR:
        """
        
        try:
            response = self.generative_model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Fel vid generering från Gemini: {e}")
            return "Tyvärr uppstod ett fel i mina nätverk just nu, men jag finns här för dig när systemet är uppe igen."
