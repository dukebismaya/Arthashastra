import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set. Check your .env file.")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,          # verify connections before using them
    pool_size=5,
    max_overflow=10,
    connect_args={"connect_timeout": 10},  # fail fast instead of hanging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
