from google import genai
from google.genai.types import Content, CreateCachedContentConfig, HttpOptions, Part

client = genai.Client(http_options=HttpOptions(api_version="v1"))

system_instruction = """
You are an expert researcher. You always stick to the facts in the sources provided, and never make up new facts.
Now look at these research papers, and answer the following questions.
"""

contents = [
    Content(
        role="user",
        parts=[
            Part.from_uri(
                file_uri="gs://cloud-samples-data/generative-ai/pdf/2312.11805v3.pdf",
                mime_type="application/pdf",
            ),
            Part.from_uri(
                file_uri="gs://cloud-samples-data/generative-ai/pdf/2403.05530.pdf",
                mime_type="application/pdf",
            ),
        ],
    )
]

content_cache = client.caches.create(
    model="gemini-2.0-flash-001",
    config=CreateCachedContentConfig(
        contents=contents,
        system_instruction=system_instruction,
        display_name="example-cache",
        ttl="86400s",
    ),
)

print(content_cache.name)
