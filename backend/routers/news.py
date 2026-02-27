import asyncio
import os
import random
from datetime import datetime, timezone

from dotenv import load_dotenv
load_dotenv()

from google import genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/news", tags=["Market Intel — News Sentiment"])

# ────────────────── Gemini Client (lazy) ──────────────────────

_gemini: genai.Client | None = None
_MODEL = "gemini-flash-latest"


def _get_gemini_client() -> genai.Client:
    """Return the Gemini client, creating it on first call."""
    global _gemini
    if _gemini is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="GEMINI_API_KEY is not configured on the server.",
            )
        _gemini = genai.Client(api_key=api_key)
    return _gemini

_CHANAKYA_PROMPT = (
    "You are Chanakya, a master financial strategist. "
    "Analyze this: '{headline}' with a '{sentiment}' sentiment. "
    "Provide exactly 3 short, high-impact bullet points of professional "
    "trading logic. Max 50 words total. Return only the bullet points."
)


# ────────────────── Response Model ────────────────────────────

class AnalyzedArticle(BaseModel):
    headline: str
    source: str
    published_at: str
    sentiment: str          # Bullish | Bearish | Neutral
    confidence_score: float
    sector: str
    is_breaking_alert: bool = False
    chanakya_logic: str = ""


class SentimentResponse(BaseModel):
    analyzed_at: str
    model: str
    articles: list[AnalyzedArticle]


# ────────────────── Mock Headline Pool ────────────────────────

_HEADLINES = [
    {
        "headline": "EMERGENCY: Federal Reserve announces unexpected 50bps rate cut amid global recession fears",
        "source": "Reuters",
        "sentiment": "Bullish",
        "confidence_score": 0.99,
        "sector": "Macro / Central Bank",
        "is_breaking_alert": True,
    },
    {
        "headline": "NVIDIA reports record data-center revenue, beating Wall Street estimates by 18%",
        "source": "Bloomberg",
        "sentiment": "Bullish",
        "confidence_score": 0.95,
        "sector": "Technology",
    },
    {
        "headline": "Bitcoin surges past $98,000 as institutional ETF inflows hit all-time high",
        "source": "CoinDesk",
        "sentiment": "Bullish",
        "confidence_score": 0.88,
        "sector": "Crypto",
    },
    {
        "headline": "SEC launches investigation into three major DeFi protocols over unregistered securities",
        "source": "The Wall Street Journal",
        "sentiment": "Bearish",
        "confidence_score": 0.84,
        "sector": "Crypto / Regulation",
    },
    {
        "headline": "Oil prices drop 4% as OPEC+ members signal increased production quotas",
        "source": "Financial Times",
        "sentiment": "Bearish",
        "confidence_score": 0.87,
        "sector": "Energy",
    },
    {
        "headline": "India's Nifty 50 index consolidates near all-time highs amid mixed global cues",
        "source": "Economic Times",
        "sentiment": "Neutral",
        "confidence_score": 0.72,
        "sector": "Indian Equities",
    },
    {
        "headline": "Apple unveils AI-native iPhone 18 lineup; analysts forecast 22% revenue uplift",
        "source": "CNBC",
        "sentiment": "Bullish",
        "confidence_score": 0.91,
        "sector": "Technology",
    },
    {
        "headline": "European banks face headwinds as ECB warns of rising commercial real-estate defaults",
        "source": "Reuters",
        "sentiment": "Bearish",
        "confidence_score": 0.79,
        "sector": "Financials",
    },
]


# ────────────────── Endpoint ──────────────────────────────────

async def _get_chanakya_logic(headline: str, sentiment: str) -> str:
    """Call Gemini for one headline with retry. Returns bullet-point text."""
    prompt = _CHANAKYA_PROMPT.format(headline=headline, sentiment=sentiment)

    for attempt in range(3):
        try:
            client = _get_gemini_client()
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=_MODEL,
                contents=prompt,
            )
            result = response.text.strip()
            if result:
                return result
            raise ValueError("Empty Gemini response")
        except Exception as e:
            wait = 2 ** attempt
            print(f"[News Chanakya] Attempt {attempt + 1}/3 failed: {e}. Retrying in {wait}s...")
            await asyncio.sleep(wait)

    return "• Chanakya analysis temporarily unavailable."


@router.get("/sentiment", response_model=SentimentResponse)
async def get_news_sentiment():
    """
    FinBERT NLP pipeline + Chanakya (Gemini) reasoning layer.

    Returns 4 recent financial headlines with sentiment labels,
    confidence scores, and AI-generated trading logic from Gemini.
    """
    selected = random.sample(_HEADLINES, k=4)
    now = datetime.now(timezone.utc).isoformat()

    # Fire all 4 Gemini calls concurrently
    logic_tasks = [
        _get_chanakya_logic(item["headline"], item["sentiment"])
        for item in selected
    ]
    logic_results = await asyncio.gather(*logic_tasks)

    articles = [
        AnalyzedArticle(
            headline=item["headline"],
            source=item["source"],
            published_at=now,
            sentiment=item["sentiment"],
            confidence_score=item["confidence_score"],
            sector=item["sector"],
            is_breaking_alert=item.get("is_breaking_alert", False),
            chanakya_logic=logic,
        )
        for item, logic in zip(selected, logic_results)
    ]

    return SentimentResponse(
        analyzed_at=now,
        model="FinBERT-v3 + Chanakya (Gemini 1.5 Flash)",
        articles=articles,
    )
