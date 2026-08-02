import json
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

def extract_opportunity_data(raw_text: str) -> dict:
    """
    Sends raw scraped text to OpenAI to extract structured JSON data.
    If no API key is provided, returns a mock parsed response.
    """
    if not client:
        print("WARNING: OPENAI_API_KEY not set. Using mock AI extraction.")
        # Fallback heuristic logic similar to Phase 3
        opp_type = "Job" if "job" in raw_text.lower() or "hiring" in raw_text.lower() else "Article"
        return {
            "title": "Mock AI Extracted Title",
            "organization": "Mock Organization",
            "type": opp_type,
            "priority": "Medium",
            "deadline": "N/A",
            "summary": raw_text[:300] + "..."
        }

    prompt = f"""
    You are an AI assistant that extracts structured opportunity data from raw text scraped from the web.
    Extract the following fields from the text:
    - title: The job title, hackathon name, or event title.
    - organization: The company or host.
    - type: One of ["Job", "Internship", "Hackathon", "Event", "Article", "Other"].
    - priority: One of ["High", "Medium", "Low"]. Jobs/Internships at FAANG are High. Deadlines within 7 days are High.
    - deadline: The exact deadline date if mentioned, otherwise "N/A".
    - summary: A concise 2-sentence summary of the opportunity.

    Return ONLY a valid JSON object matching these keys.
    
    Raw Text:
    {raw_text[:4000]}  # Limit to 4000 chars to save tokens
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful data extraction assistant. You only output valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"Error extracting data with AI: {e}")
        # Fallback on error
        return {
            "title": "Error Processing AI",
            "organization": "Unknown",
            "type": "Other",
            "priority": "Low",
            "deadline": "N/A",
            "summary": raw_text[:300] + "..."
        }
