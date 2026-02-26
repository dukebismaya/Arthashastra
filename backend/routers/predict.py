import random

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import yfinance as yf

router = APIRouter(prefix="/predict", tags=["Chanakya AI"])

# ────────────────── Request / Response Models ──────────────────

class PredictionRequest(BaseModel):
    ticker: str
    direction: str = Field(..., pattern="^(bullish|bearish)$")
    wager: float = Field(..., gt=0)


class PredictionResponse(BaseModel):
    ticker: str
    direction: str
    current_price: float | None
    wager: float
    confidence_score: int
    explainable_logic: list[str]
    status: str


# ────────────────── Mock Reasoning Pools ──────────────────────

_BULLISH_LOGIC = [
    "MACD indicates strong upward momentum on the daily chart",
    "Recent volume surge supports a potential breakout above resistance",
    "RSI at 58 — trending upward with room before overbought territory",
    "50-day EMA crossed above 200-day EMA (Golden Cross detected)",
    "Institutional accumulation spotted in the last 5 sessions",
    "Bollinger Bands tightening — volatility expansion likely favours bulls",
]

_BEARISH_LOGIC = [
    "MACD histogram declining — bearish divergence forming",
    "Volume dried up on recent rally attempts, signalling weak conviction",
    "RSI approaching overbought at 72 — mean reversion probable",
    "Price rejected the 200-day moving average resistance twice",
    "Put/Call ratio spiking — smart money hedging for downside",
    "Spinning-top candle on the weekly chart signals trend exhaustion",
]


# ────────────────── Endpoint ──────────────────────────────────

@router.post("/analyze", response_model=PredictionResponse)
async def analyze_prediction(req: PredictionRequest):
    """
    Simulate Chanakya AI analysis.

    Fetches live price via yfinance, generates a mock confidence score,
    and returns direction-aware explainable reasoning.
    """
    # Fetch live price
    try:
        stock = yf.Ticker(req.ticker)
        info = stock.info
        current_price = info.get("currentPrice")
    except Exception:
        raise HTTPException(
            status_code=404,
            detail=f"Could not retrieve data for ticker '{req.ticker}'.",
        )

    # Mock AI confidence
    confidence_score = random.randint(65, 98)

    # Pick 3 random reasoning strings based on direction
    pool = _BULLISH_LOGIC if req.direction == "bullish" else _BEARISH_LOGIC
    explainable_logic = random.sample(pool, 3)

    return PredictionResponse(
        ticker=req.ticker.upper(),
        direction=req.direction,
        current_price=current_price,
        wager=req.wager,
        confidence_score=confidence_score,
        explainable_logic=explainable_logic,
        status=f"Chanakya AI analysed {req.ticker.upper()} — "
               f"{confidence_score}% confidence on {req.direction} thesis.",
    )
