from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yfinance as yf

router = APIRouter(prefix="/market", tags=["Market Data"])


class QuoteResponse(BaseModel):
    ticker: str
    current_price: float | None
    day_high: float | None
    day_low: float | None
    previous_close: float | None


@router.get("/quote/{ticker}", response_model=QuoteResponse)
async def get_stock_quote(ticker: str):
    """
    Fetch real-time quote data for a given stock ticker using yfinance.
    Returns currentPrice, dayHigh, dayLow, and previousClose.
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        if not info or info.get("trailingPegRatio") is None and info.get("currentPrice") is None:
            # yfinance returns a near-empty dict for invalid tickers
            raise KeyError

        return QuoteResponse(
            ticker=ticker.upper(),
            current_price=info.get("currentPrice"),
            day_high=info.get("dayHigh"),
            day_low=info.get("dayLow"),
            previous_close=info.get("previousClose"),
        )

    except Exception:
        raise HTTPException(
            status_code=404,
            detail=f"Could not retrieve quote for ticker '{ticker}'. "
                   "Verify the symbol and try again.",
        )
