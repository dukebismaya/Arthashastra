from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import market, predict, news, user, academy
import models
from database import engine

app = FastAPI(
    title="Arthashastra API",
    description="Backend API for the Arthashastra financial platform",
    version="0.1.0",
)

# --------------- CORS Middleware ---------------
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------- Create DB Tables ---------------
models.Base.metadata.create_all(bind=engine)

# --------------- Routers ---------------
app.include_router(market.router, prefix="/api/v1")
app.include_router(predict.router, prefix="/api/v1")
app.include_router(news.router, prefix="/api/v1")
app.include_router(user.router, prefix="/api/v1")
app.include_router(academy.router, prefix="/api/v1")


# --------------- Health Check ---------------
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
