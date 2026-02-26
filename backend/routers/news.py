import random
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/news", tags=["Market Intel — News Sentiment"])


# ────────────────── Response Model ────────────────────────────

class AnalyzedArticle(BaseModel):
    headline: str
    source: str
    published_at: str
    sentiment: str          # Bullish | Bearish | Neutral
    confidence_score: float
    sector: str
    is_breaking_alert: bool = False


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

@router.get("/sentiment", response_model=SentimentResponse)
async def get_news_sentiment():
    """
    Simulated FinBERT NLP pipeline.

    Returns 4 recent financial headlines with sentiment labels
    and confidence scores as if processed by our fine-tuned
    FinBERT model.
    """
    # Pick 4 random headlines from the pool (no repeats)
    selected = random.sample(_HEADLINES, k=4)

    now = datetime.now(timezone.utc).isoformat()

    articles = [
        AnalyzedArticle(
            headline=item["headline"],
            source=item["source"],
            published_at=now,
            sentiment=item["sentiment"],
            confidence_score=item["confidence_score"],
            sector=item["sector"],
            is_breaking_alert=item.get("is_breaking_alert", False),
        )
        for item in selected
    ]

    return SentimentResponse(
        analyzed_at=now,
        model="FinBERT-v3-arthashastra (mock)",
        articles=articles,
    )
