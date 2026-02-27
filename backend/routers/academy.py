"""
Academy Router — Kautilya's Academy
Real courses with lessons, quizzes, wallet-connected progress & rewards.
"""
# pyright: reportArgumentType=false

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
import models

router = APIRouter(prefix="/academy", tags=["Academy"])

# ═══════════════════════════════════════════════════════════════
#  COURSE CONTENT — Full educational material + quiz questions
# ═══════════════════════════════════════════════════════════════

_COURSES: list[dict] = [
    # ────────── COURSE 1: Web3 Fundamentals ──────────
    {
        "id": 1,
        "title": "Web3 Fundamentals",
        "description": (
            "Decode the architecture of decentralised finance. Master wallets, "
            "private keys, smart contract mechanics, and the immutable ledger "
            "that underpins the new financial order."
        ),
        "category": "Web3",
        "difficulty": "Initiate",
        "reward": 500.0,
        "xp_reward": 120,
        "modules": [
            {
                "id": 1,
                "title": "Blockchain Basics",
                "content": (
                    "A **blockchain** is a distributed, immutable digital ledger that "
                    "records transactions across a network of computers. Unlike traditional "
                    "databases controlled by a single entity, a blockchain is maintained by "
                    "thousands of nodes worldwide, each holding an identical copy of the ledger.\n\n"
                    "Every transaction is grouped into a **block**, which is cryptographically "
                    "linked to the previous block — forming a chain. This linkage makes it "
                    "virtually impossible to alter past records without changing every subsequent "
                    "block and gaining consensus from the majority of the network.\n\n"
                    "**Consensus mechanisms** are the rules that determine how nodes agree on "
                    "the state of the ledger. Bitcoin uses **Proof of Work (PoW)**, where miners "
                    "compete to solve complex mathematical puzzles. Ethereum has transitioned to "
                    "**Proof of Stake (PoS)**, where validators stake their own cryptocurrency as "
                    "collateral — reducing energy consumption by over 99%.\n\n"
                    "The key properties of blockchain are **decentralization** (no single point "
                    "of failure), **transparency** (all transactions are publicly verifiable), "
                    "and **immutability** (once written, data cannot be altered)."
                ),
                "questions": [
                    {
                        "id": 1,
                        "question": "What links blocks together in a blockchain?",
                        "options": [
                            "Database indexes",
                            "HTTP connections",
                            "Cryptographic hashes",
                            "API endpoints",
                        ],
                        "correct": 2,
                    },
                    {
                        "id": 2,
                        "question": "Ethereum's current consensus mechanism is:",
                        "options": [
                            "Proof of Work",
                            "Delegated Proof of Stake",
                            "Proof of Authority",
                            "Proof of Stake",
                        ],
                        "correct": 3,
                    },
                    {
                        "id": 3,
                        "question": "Which property means blockchain data cannot be altered after being written?",
                        "options": [
                            "Immutability",
                            "Scalability",
                            "Interoperability",
                            "Fungibility",
                        ],
                        "correct": 0,
                    },
                ],
            },
            {
                "id": 2,
                "title": "Wallets & Private Keys",
                "content": (
                    "A **cryptocurrency wallet** doesn't actually store your coins — it stores "
                    "the **private keys** that prove ownership of your assets on the blockchain. "
                    "Think of your private key like the master password to your vault; anyone who "
                    "has it can move your funds.\n\n"
                    "Your wallet generates a **key pair**: a **private key** (kept secret) and a "
                    "**public key** (shared openly). The public key is hashed to create your "
                    "**wallet address** — similar to a bank account number that others can use to "
                    "send you funds. When you send a transaction, you **digitally sign** it with "
                    "your private key, proving you authorized the transfer without revealing the "
                    "key itself.\n\n"
                    "A **seed phrase** (also called a recovery phrase) is a human-readable backup "
                    "of your private key — typically 12 or 24 words. If you lose access to your "
                    "wallet device, you can restore your entire wallet using this phrase. Never "
                    "share it with anyone, and store it offline in a secure location.\n\n"
                    "Wallets come in two main types: **hot wallets** (connected to the internet — "
                    "like MetaMask or Trust Wallet) are convenient for daily use but more vulnerable "
                    "to hacks. **Cold wallets** (offline hardware devices like Ledger or Trezor) "
                    "are the gold standard for long-term storage, keeping your keys completely offline."
                ),
                "questions": [
                    {
                        "id": 4,
                        "question": "What does a cryptocurrency wallet actually store?",
                        "options": [
                            "Cryptocurrency coins",
                            "Transaction receipts",
                            "Private keys",
                            "Smart contracts",
                        ],
                        "correct": 2,
                    },
                    {
                        "id": 5,
                        "question": "A seed phrase is typically how many words?",
                        "options": [
                            "6 or 8 words",
                            "12 or 24 words",
                            "32 or 64 words",
                            "100 words",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 6,
                        "question": "Which wallet type is considered most secure for long-term storage?",
                        "options": [
                            "Browser extension wallets",
                            "Exchange wallets",
                            "Mobile hot wallets",
                            "Cold hardware wallets",
                        ],
                        "correct": 3,
                    },
                ],
            },
            {
                "id": 3,
                "title": "Smart Contracts & Gas Fees",
                "content": (
                    "A **smart contract** is a self-executing program stored on the blockchain "
                    "that automatically enforces the terms of an agreement when predefined "
                    "conditions are met. Written in languages like **Solidity** (for Ethereum), "
                    "smart contracts eliminate the need for intermediaries — the code itself is "
                    "the trusted third party.\n\n"
                    "For example, a smart contract could automatically release payment to a "
                    "freelancer once a client confirms delivery, or distribute lottery winnings "
                    "to the winner's wallet — all without any human intervention. Once deployed, "
                    "a smart contract's code is **immutable** and runs exactly as programmed.\n\n"
                    "**Gas** is the unit measuring the computational effort required to execute "
                    "operations on Ethereum. Every transaction — from simple transfers to complex "
                    "smart contract interactions — requires gas. You pay gas fees in **ETH**. "
                    "Gas prices fluctuate based on network demand: during peak times, fees can "
                    "spike significantly.\n\n"
                    "Each transaction is processed by the **Ethereum Virtual Machine (EVM)** — "
                    "a global, decentralized computer that executes smart contract bytecode. The "
                    "EVM ensures that every node processes transactions identically, maintaining "
                    "consensus across the network. Timing transactions during low-traffic periods "
                    "can save significant fees."
                ),
                "questions": [
                    {
                        "id": 7,
                        "question": "Smart contracts on Ethereum are most commonly written in:",
                        "options": ["Python", "JavaScript", "Solidity", "Rust"],
                        "correct": 2,
                    },
                    {
                        "id": 8,
                        "question": "Gas fees on Ethereum are paid in:",
                        "options": ["Bitcoin", "USDT", "The deployed token", "ETH"],
                        "correct": 3,
                    },
                    {
                        "id": 9,
                        "question": "The EVM ensures that:",
                        "options": [
                            "Only miners can execute transactions",
                            "Transactions are free during weekends",
                            "Every node processes transactions identically",
                            "Smart contracts can be edited after deployment",
                        ],
                        "correct": 2,
                    },
                ],
            },
        ],
    },
    # ────────── COURSE 2: FinBERT & Sentiment Analysis ──────────
    {
        "id": 2,
        "title": "FinBERT & Sentiment Analysis",
        "description": (
            "Wield the power of transformer-based NLP to decode market narratives. "
            "Learn how FinBERT extracts actionable signals from financial news and "
            "how Arthashastra integrates them into its intelligence engine."
        ),
        "category": "AI / ML",
        "difficulty": "Strategist",
        "reward": 600.0,
        "xp_reward": 150,
        "modules": [
            {
                "id": 4,
                "title": "NLP in Finance",
                "content": (
                    "**Natural Language Processing (NLP)** is a branch of artificial intelligence "
                    "that enables computers to understand, interpret, and generate human language. "
                    "In finance, NLP is used to extract signals from earnings calls, SEC filings, "
                    "news articles, analyst reports, and social media posts.\n\n"
                    "The first step in any NLP pipeline is **tokenization** — breaking text into "
                    "smaller units (tokens) such as words or subwords. For example, the sentence "
                    "\"Apple beat earnings\" becomes [\"Apple\", \"beat\", \"earnings\"]. These tokens "
                    "are then converted into numerical representations called **embeddings**.\n\n"
                    "**Word embeddings** capture semantic relationships between words in a "
                    "high-dimensional vector space. Words with similar meanings (like \"bullish\" "
                    "and \"optimistic\") cluster together, while unrelated words are far apart. "
                    "Models like Word2Vec and GloVe pioneered this approach, but modern "
                    "transformer-based models produce **contextual embeddings** — the same word "
                    "gets different vectors depending on surrounding context.\n\n"
                    "In quantitative finance, NLP powers **sentiment analysis** (gauging market "
                    "mood), **event detection** (identifying earnings surprises or M&A rumors), "
                    "and **risk assessment** (flagging negative language in 10-K filings). "
                    "The ability to process thousands of documents in seconds gives NLP-equipped "
                    "traders a significant information edge."
                ),
                "questions": [
                    {
                        "id": 10,
                        "question": "What is the first step in most NLP pipelines?",
                        "options": [
                            "Sentiment scoring",
                            "Tokenization",
                            "Model training",
                            "Data visualization",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 11,
                        "question": "Word embeddings capture:",
                        "options": [
                            "File sizes of documents",
                            "Network latency",
                            "Semantic relationships between words",
                            "Database schemas",
                        ],
                        "correct": 2,
                    },
                    {
                        "id": 12,
                        "question": "In finance, NLP is used for all EXCEPT:",
                        "options": [
                            "Sentiment analysis of news",
                            "Detecting earnings surprises",
                            "Mining cryptocurrency",
                            "Analysing SEC filings",
                        ],
                        "correct": 2,
                    },
                ],
            },
            {
                "id": 5,
                "title": "Transformer Models & FinBERT",
                "content": (
                    "The **Transformer** architecture, introduced in the landmark 2017 paper "
                    "\"Attention Is All You Need\", revolutionised NLP. Its key innovation is the "
                    "**self-attention mechanism**, which allows the model to weigh the importance "
                    "of every word in a sentence relative to every other word — capturing long-range "
                    "dependencies that previous RNN/LSTM models struggled with.\n\n"
                    "**BERT** (Bidirectional Encoder Representations from Transformers) is a "
                    "pre-trained language model developed by Google. Unlike GPT (which reads left-to-"
                    "right), BERT reads text **bidirectionally** — considering both left and right "
                    "context simultaneously. This makes BERT excellent at understanding the meaning "
                    "of ambiguous words based on context.\n\n"
                    "**FinBERT** is BERT fine-tuned specifically on financial text — earnings "
                    "reports, analyst notes, financial news, and SEC filings. It classifies text "
                    "into three sentiment categories: **positive**, **negative**, and **neutral**. "
                    "For example, \"Company X reported record earnings\" → positive; \"Revenues "
                    "declined sharply amid supply chain disruptions\" → negative.\n\n"
                    "FinBERT achieves approximately **87% accuracy** on financial sentiment "
                    "benchmarks, significantly outperforming general-purpose models. It understands "
                    "domain-specific language — for instance, that \"raising guidance\" is positive "
                    "while \"raising concerns\" is negative."
                ),
                "questions": [
                    {
                        "id": 13,
                        "question": "The Transformer's key innovation is the:",
                        "options": [
                            "Convolutional layer",
                            "Self-attention mechanism",
                            "Decision tree ensemble",
                            "Linear regression model",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 14,
                        "question": "FinBERT classifies text sentiment into how many categories?",
                        "options": [
                            "2 (positive / negative)",
                            "3 (positive / negative / neutral)",
                            "5 (very positive to very negative)",
                            "10 granular levels",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 15,
                        "question": "What makes BERT different from GPT in text processing?",
                        "options": [
                            "BERT is faster",
                            "BERT reads text bidirectionally",
                            "BERT uses less memory",
                            "BERT only processes numbers",
                        ],
                        "correct": 1,
                    },
                ],
            },
            {
                "id": 6,
                "title": "Trading with Sentiment Signals",
                "content": (
                    "Sentiment analysis produces **sentiment scores** typically ranging from -1 "
                    "(extremely negative) to +1 (extremely positive). A score of -0.8 from FinBERT "
                    "on an earnings headline signals strong bearish sentiment, while +0.9 signals "
                    "strong bullish sentiment. These scores become **alpha signals** — inputs to "
                    "trading models that aim to predict future price movements.\n\n"
                    "Successful quantitative strategies rarely rely on a single signal. "
                    "**Multi-factor analysis** combines sentiment with other data sources: "
                    "technical indicators (RSI, MACD), fundamental metrics (P/E ratio, revenue "
                    "growth), and alternative data (satellite imagery, web traffic). The fusion "
                    "of multiple uncorrelated factors produces more robust predictions.\n\n"
                    "Before deploying a sentiment strategy with real capital, rigorous "
                    "**backtesting** is essential. Backtesting involves running your strategy "
                    "against historical data to evaluate how it would have performed. Key metrics "
                    "include **Sharpe ratio** (risk-adjusted return), **maximum drawdown** (largest "
                    "peak-to-trough decline), and **win rate** (percentage of profitable trades).\n\n"
                    "Common pitfalls include **overfitting** (optimizing a strategy to historical "
                    "data so well that it fails on new data), **look-ahead bias** (accidentally "
                    "using future information), and **survivorship bias** (only testing on stocks "
                    "that still exist today). Arthashastra's intelligence engine mitigates these "
                    "by combining Chanakya AI reasoning with real-time FinBERT sentiment."
                ),
                "questions": [
                    {
                        "id": 16,
                        "question": "A FinBERT sentiment score of -0.8 suggests:",
                        "options": [
                            "Strongly positive sentiment",
                            "Neutral sentiment",
                            "Strongly negative / bearish sentiment",
                            "No meaningful signal",
                        ],
                        "correct": 2,
                    },
                    {
                        "id": 17,
                        "question": "Combining sentiment with technical indicators is called:",
                        "options": [
                            "Arbitrage",
                            "Multi-factor analysis",
                            "Dollar-cost averaging",
                            "Passive indexing",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 18,
                        "question": "Backtesting a strategy means:",
                        "options": [
                            "Running it with real money immediately",
                            "Asking financial advisors for opinions",
                            "Testing it against historical data",
                            "Using random number generators",
                        ],
                        "correct": 2,
                    },
                ],
            },
        ],
    },
    # ────────── COURSE 3: Value Investing Principles ──────────
    {
        "id": 3,
        "title": "Value Investing Principles",
        "description": (
            "Study the timeless frameworks of Graham, Buffett, and Munger through "
            "a Kautilyan lens. Understand intrinsic value, margin of safety, moat "
            "identification, and the valuation metrics that separate signal from noise."
        ),
        "category": "Investing",
        "difficulty": "Strategist",
        "reward": 750.0,
        "xp_reward": 130,
        "modules": [
            {
                "id": 7,
                "title": "Intrinsic Value & Margin of Safety",
                "content": (
                    "**Intrinsic value** is the estimated true worth of a company based on "
                    "its fundamentals — independent of its current market price. Benjamin Graham, "
                    "the father of value investing, taught that the market is often irrational: "
                    "prices fluctuate based on fear and greed, but intrinsic value is anchored in "
                    "real cash flows, assets, and earnings power.\n\n"
                    "The most widely used method for estimating intrinsic value is **Discounted "
                    "Cash Flow (DCF)** analysis. DCF projects a company's future free cash flows "
                    "and discounts them back to present value using a **discount rate** (typically "
                    "the weighted average cost of capital, or WACC). The sum of these discounted "
                    "cash flows — plus a terminal value — gives you the fair value of the business.\n\n"
                    "The **margin of safety** is the cornerstone of value investing. It means only "
                    "buying a stock when its market price is **significantly below** your estimate "
                    "of intrinsic value. If you calculate a stock's value at $100, you might only "
                    "buy it at $70 — giving yourself a 30% margin of safety to account for errors "
                    "in your analysis or unforeseen risks.\n\n"
                    "As Warren Buffett summarizes: \"Price is what you pay; value is what you get.\" "
                    "The wider the gap between price and intrinsic value, the lower your risk and "
                    "the higher your potential return."
                ),
                "questions": [
                    {
                        "id": 19,
                        "question": "Intrinsic value is best described as:",
                        "options": [
                            "The current market price of a stock",
                            "A company's estimated true worth based on fundamentals",
                            "The 52-week high price",
                            "The average analyst price target",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 20,
                        "question": "DCF analysis estimates value by:",
                        "options": [
                            "Looking at past stock price charts",
                            "Discounting future expected cash flows to present value",
                            "Counting the number of employees",
                            "Comparing logos of competitor companies",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 21,
                        "question": "A 30% margin of safety means you buy when price is:",
                        "options": [
                            "30% above intrinsic value",
                            "Exactly at intrinsic value",
                            "30% below your estimated intrinsic value",
                            "At the 52-week low regardless of value",
                        ],
                        "correct": 2,
                    },
                ],
            },
            {
                "id": 8,
                "title": "Economic Moats",
                "content": (
                    "Warren Buffett coined the term **economic moat** to describe a company's "
                    "durable competitive advantage — the structural barrier that protects its "
                    "profits from competitors, much like a castle moat defends against invaders. "
                    "Companies with wide moats can sustain above-average returns for decades.\n\n"
                    "There are five primary types of moats: **Brand power** (Coca-Cola, Apple) — "
                    "consumers pay premium prices for trusted names. **Switching costs** (Microsoft "
                    "Office, Salesforce) — it's too expensive or disruptive for customers to switch. "
                    "**Network effects** (Visa, social media platforms) — the product becomes more "
                    "valuable as more people use it. **Cost advantage** (Walmart, TSMC) — producing "
                    "goods cheaper than competitors. **Intangible assets** (patents, licenses, "
                    "regulatory approvals) — legal barriers to competition.\n\n"
                    "The strongest businesses often have **multiple moats** working together. "
                    "Apple combines brand power + switching costs + an ecosystem network effect. "
                    "Identifying moats early is one of the most valuable skills in equity analysis.\n\n"
                    "A **narrowing moat** is a warning sign: when a company's competitive advantage "
                    "is eroding (e.g., Kodak's film moat dissolved with digital cameras). Monitor "
                    "for disruptive technologies, regulatory changes, and new entrants that could "
                    "weaken an established player's moat."
                ),
                "questions": [
                    {
                        "id": 22,
                        "question": "An 'economic moat' refers to a company's:",
                        "options": [
                            "Physical headquarters",
                            "Sustainable competitive advantage",
                            "Marketing budget",
                            "Number of patents only",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 23,
                        "question": "Which is an example of a network effect moat?",
                        "options": [
                            "A company with low manufacturing costs",
                            "A social platform that's more valuable with more users",
                            "A firm with a famous logo",
                            "A business with exclusive raw material access",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 24,
                        "question": "A narrowing moat is best described as:",
                        "options": [
                            "A growing competitive advantage",
                            "An eroding competitive advantage",
                            "A new product launch",
                            "A stock split event",
                        ],
                        "correct": 1,
                    },
                ],
            },
            {
                "id": 9,
                "title": "Valuation Metrics: P/E, PEG & Beyond",
                "content": (
                    "The **Price-to-Earnings (P/E) ratio** is the most-cited valuation metric. "
                    "It divides a company's stock price by its earnings per share (EPS). A P/E of "
                    "15 means investors pay $15 for every $1 of annual earnings. Lower P/E "
                    "suggests a stock may be undervalued relative to its earnings; higher P/E "
                    "suggests the market expects strong future growth.\n\n"
                    "However, P/E alone is misleading. A company growing earnings at 30% per year "
                    "deserves a higher P/E than one growing at 5%. The **PEG ratio** (P/E divided by "
                    "earnings growth rate) adjusts for this: a PEG of 1.0 means the stock is "
                    "fairly valued relative to its growth. Below 1.0 is potentially undervalued; "
                    "above 2.0 may signal overvaluation.\n\n"
                    "The **Price-to-Book (P/B) ratio** compares market price to the book value "
                    "(net assets) per share. A P/B below 1.0 can indicate the stock trades below "
                    "the value of its assets — a traditional value signal. However, this metric "
                    "works best for asset-heavy industries (banks, manufacturing) and less well "
                    "for asset-light tech companies.\n\n"
                    "**EV/EBITDA** (Enterprise Value divided by Earnings Before Interest, Taxes, "
                    "Depreciation & Amortization) is useful for comparing companies with different "
                    "capital structures. It strips out the effects of financing and accounting "
                    "decisions, giving a cleaner picture of operational value. No single metric "
                    "tells the whole story — skilled investors triangulate across multiple ratios."
                ),
                "questions": [
                    {
                        "id": 25,
                        "question": "A P/E ratio of 20 means investors pay:",
                        "options": [
                            "$2 for every $10 of earnings",
                            "$20 for every $1 of earnings",
                            "20% of the company's revenue",
                            "$1 for every $20 of earnings",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 26,
                        "question": "The PEG ratio improves on P/E by accounting for:",
                        "options": [
                            "Debt levels",
                            "Earnings growth rate",
                            "Dividend yield",
                            "Market capitalization",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 27,
                        "question": "A P/B ratio below 1.0 may indicate:",
                        "options": [
                            "An overvalued stock",
                            "High growth expectations",
                            "A potentially undervalued stock",
                            "High debt levels",
                        ],
                        "correct": 2,
                    },
                ],
            },
        ],
    },
    # ────────── COURSE 4: Chanakya AI — The Reasoner ──────────
    {
        "id": 4,
        "title": "Chanakya AI: The Reasoner",
        "description": (
            "Go under the hood of Arthashastra's prediction engine. Master "
            "directional forecasting, confidence scoring, and the fusion of "
            "technical and fundamental signals via LLM reasoning."
        ),
        "category": "AI / ML",
        "difficulty": "Grandmaster",
        "reward": 850.0,
        "xp_reward": 200,
        "modules": [
            {
                "id": 10,
                "title": "LLMs in Financial Analysis",
                "content": (
                    "A **Large Language Model (LLM)** is an AI system trained on vast amounts "
                    "of text data to understand and generate human-like language. Models like "
                    "GPT-4 and Gemini can reason about complex topics, summarize documents, "
                    "answer questions, and — crucially for finance — synthesize information from "
                    "multiple sources into coherent analysis.\n\n"
                    "In Arthashastra, the **Chanakya AI** leverages Google's Gemini model via "
                    "carefully crafted **prompt engineering**. Prompt engineering is the practice "
                    "of designing input instructions that guide an LLM to produce specific, "
                    "high-quality outputs. For financial analysis, prompts include context about "
                    "the stock, current price, technical indicators, and the user's directional "
                    "prediction.\n\n"
                    "LLMs excel at **structured reasoning** — breaking down complex questions into "
                    "logical steps. When analysing a stock, Chanakya considers: recent price "
                    "action, technical indicator signals, sector trends, macroeconomic context, "
                    "and sentiment data. The model synthesizes these inputs into concise, "
                    "explainable bullet points — not black-box predictions.\n\n"
                    "The key limitation: LLMs do not have real-time data access unless explicitly "
                    "provided. Arthashastra solves this by fetching live market data via yfinance "
                    "and feeding it directly into the Chanakya prompt — ensuring analysis is based "
                    "on current market conditions."
                ),
                "questions": [
                    {
                        "id": 28,
                        "question": "LLM stands for:",
                        "options": [
                            "Low Latency Memory",
                            "Large Language Model",
                            "Linear Logic Machine",
                            "Local Learning Module",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 29,
                        "question": "Prompt engineering is:",
                        "options": [
                            "Building physical hardware",
                            "Crafting effective input instructions for AI models",
                            "Managing database schemas",
                            "Designing network infrastructure",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 30,
                        "question": "Arthashastra provides real-time data to Chanakya AI via:",
                        "options": [
                            "The LLM's built-in training data",
                            "Manual user input only",
                            "Live market data fetched via yfinance",
                            "Social media scraping",
                        ],
                        "correct": 2,
                    },
                ],
            },
            {
                "id": 11,
                "title": "Technical Indicators: RSI & MACD",
                "content": (
                    "The **Relative Strength Index (RSI)** is a momentum oscillator that "
                    "measures the speed and magnitude of recent price changes on a scale of "
                    "0 to 100. It was developed by J. Welles Wilder in 1978. The standard "
                    "calculation uses a 14-period lookback window.\n\n"
                    "An RSI above **70** typically signals **overbought** conditions — the stock "
                    "may have risen too fast and could be due for a pullback. An RSI below **30** "
                    "signals **oversold** conditions — the stock may be undervalued and ripe for "
                    "a bounce. However, in strong trends, RSI can stay overbought/oversold for "
                    "extended periods, so it's best used in combination with other indicators.\n\n"
                    "The **Moving Average Convergence Divergence (MACD)** consists of two lines "
                    "and a histogram. The **MACD line** is the difference between the 12-period "
                    "and 26-period exponential moving averages (EMAs). The **signal line** is a "
                    "9-period EMA of the MACD line. The **histogram** shows the gap between them.\n\n"
                    "A **bullish crossover** occurs when the MACD line crosses **above** the "
                    "signal line, suggesting upward momentum. A **bearish crossover** occurs when "
                    "it crosses **below**, indicating downward pressure. **Divergences** — when "
                    "price makes a new high but MACD doesn't — are powerful reversal signals. "
                    "Chanakya AI integrates both RSI and MACD into its analysis pipeline."
                ),
                "questions": [
                    {
                        "id": 31,
                        "question": "An RSI value above 70 typically indicates:",
                        "options": [
                            "Oversold conditions",
                            "Overbought conditions",
                            "Neutral momentum",
                            "High trading volume",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 32,
                        "question": "MACD consists of:",
                        "options": [
                            "One line only",
                            "Two lines and a histogram",
                            "Three moving averages",
                            "A pie chart and bar chart",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 33,
                        "question": "A bullish MACD crossover occurs when:",
                        "options": [
                            "MACD line crosses below the signal line",
                            "MACD line crosses above the signal line",
                            "Both lines reach zero simultaneously",
                            "The histogram turns red",
                        ],
                        "correct": 1,
                    },
                ],
            },
            {
                "id": 12,
                "title": "Confidence Scoring & Risk Management",
                "content": (
                    "Chanakya AI assigns a **confidence score** (0-100%) to each directional "
                    "prediction. This score reflects the model's conviction based on the "
                    "convergence of multiple signals: if RSI, MACD, sentiment, and fundamental "
                    "data all agree on a direction, confidence will be high; conflicting signals "
                    "lower it. A confidence of 85% does **not** mean an 85% chance of profit — "
                    "it means the model has strong signal alignment.\n\n"
                    "**Position sizing** should scale with confidence. The **Kelly Criterion** "
                    "is a mathematical formula that calculates the optimal bet fraction based on "
                    "edge and probability. In practice, most traders use a **fractional Kelly** "
                    "(betting half or quarter of the calculated amount) to reduce volatility. "
                    "Never risk more than 2-5% of your portfolio on a single trade.\n\n"
                    "**Diversification** reduces portfolio risk by spreading capital across "
                    "uncorrelated assets. Owning stocks across different sectors, geographies, "
                    "and asset classes (equities, bonds, crypto) ensures that a downturn in one "
                    "area doesn't devastate your entire portfolio. As the saying goes: \"Don't "
                    "put all your eggs in one basket.\"\n\n"
                    "Finally, always set a **stop-loss** — a predetermined price at which you "
                    "exit a losing position to cap your downside. Combining Chanakya's confidence "
                    "scores with disciplined position sizing and stop-losses creates a robust, "
                    "risk-managed trading framework."
                ),
                "questions": [
                    {
                        "id": 34,
                        "question": "A confidence score of 85% from Chanakya AI means:",
                        "options": [
                            "An 85% guaranteed return",
                            "The model has high signal alignment for its prediction",
                            "85% of traders agree on this direction",
                            "The stock will move 85% in one direction",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 35,
                        "question": "Position sizing should be based on:",
                        "options": [
                            "Gut feeling and mood",
                            "Risk tolerance and conviction level",
                            "The result of the last trade only",
                            "Random amount selection",
                        ],
                        "correct": 1,
                    },
                    {
                        "id": 36,
                        "question": "Diversification primarily helps to:",
                        "options": [
                            "Maximize returns in all conditions",
                            "Reduce portfolio risk",
                            "Eliminate all possible losses",
                            "Increase trading frequency",
                        ],
                        "correct": 1,
                    },
                ],
            },
        ],
    },
]

# Quick-lookup maps
_COURSE_MAP: dict[int, dict] = {c["id"]: c for c in _COURSES}
_MODULE_MAP: dict[tuple[int, int], dict] = {}
for _c in _COURSES:
    for _m in _c["modules"]:
        _MODULE_MAP[(_c["id"], _m["id"])] = _m


# ═══════════════════════════════════════════════════════════════
#  PYDANTIC SCHEMAS
# ═══════════════════════════════════════════════════════════════

class QuestionOut(BaseModel):
    id: int
    question: str
    options: list[str]


class ModuleSummary(BaseModel):
    id: int
    title: str
    completed: bool = False
    score: int | None = None
    total: int | None = None


class ModuleDetail(BaseModel):
    id: int
    title: str
    content: str
    questions: list[QuestionOut]
    completed: bool = False
    score: int | None = None
    total: int | None = None


class CourseSummary(BaseModel):
    id: int
    title: str
    description: str
    category: str
    difficulty: str
    reward: float
    xp_reward: int
    total_modules: int
    completed_modules: int = 0
    course_completed: bool = False


class CourseDetail(BaseModel):
    id: int
    title: str
    description: str
    category: str
    difficulty: str
    reward: float
    xp_reward: int
    modules: list[ModuleSummary]
    course_completed: bool = False


class SubmitRequest(BaseModel):
    wallet_address: str
    answers: list[int]


class SubmitResult(BaseModel):
    passed: bool
    score: int
    total: int
    correct_answers: list[int]
    already_completed: bool = False
    course_completed: bool = False
    reward_credited: float = 0.0
    new_balance: float | None = None


class ProgressResponse(BaseModel):
    total_earned: float
    xp_earned: int
    courses_completed: int
    modules_completed: int
    completed_course_ids: list[int]
    completed_module_ids: list[int]


# ═══════════════════════════════════════════════════════════════
#  HELPER
# ═══════════════════════════════════════════════════════════════

def _get_user(wallet_address: str, db: Session) -> models.User:
    user = db.query(models.User).filter(
        models.User.wallet_address == wallet_address
    ).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found. Connect wallet first via /api/v1/user/{wallet}.",
        )
    return user


# ═══════════════════════════════════════════════════════════════
#  ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@router.get("/courses", response_model=list[CourseSummary])
async def list_courses(
    wallet_address: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """List all courses. If wallet_address provided, include user progress."""
    user_module_completions: set[Any] = set()
    user_course_completions: set[Any] = set()

    if wallet_address:
        user = db.query(models.User).filter(
            models.User.wallet_address == wallet_address
        ).first()
        if user:
            mods = db.query(models.ModuleCompletion).filter(
                models.ModuleCompletion.user_id == user.id
            ).all()
            user_module_completions = {(m.course_id, m.module_id) for m in mods}

            courses_done = db.query(models.CourseCompletion).filter(
                models.CourseCompletion.user_id == user.id
            ).all()
            user_course_completions = {c.course_id for c in courses_done}

    result = []
    for c in _COURSES:
        completed_modules = sum(
            1 for m in c["modules"]
            if (c["id"], m["id"]) in user_module_completions
        )
        result.append(CourseSummary(
            id=c["id"],
            title=c["title"],
            description=c["description"],
            category=c["category"],
            difficulty=c["difficulty"],
            reward=c["reward"],
            xp_reward=c["xp_reward"],
            total_modules=len(c["modules"]),
            completed_modules=completed_modules,
            course_completed=c["id"] in user_course_completions,
        ))
    return result


@router.get("/courses/{course_id}", response_model=CourseDetail)
async def get_course(
    course_id: int,
    wallet_address: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """Get course detail with module list and progress."""
    course = _COURSE_MAP.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    user_module_map: dict[Any, models.ModuleCompletion] = {}
    course_done = False

    if wallet_address:
        user = db.query(models.User).filter(
            models.User.wallet_address == wallet_address
        ).first()
        if user:
            mods = db.query(models.ModuleCompletion).filter(
                models.ModuleCompletion.user_id == user.id,
                models.ModuleCompletion.course_id == course_id,
            ).all()
            user_module_map = {m.module_id: m for m in mods}

            course_done = db.query(models.CourseCompletion).filter(
                models.CourseCompletion.user_id == user.id,
                models.CourseCompletion.course_id == course_id,
            ).first() is not None

    modules = []
    for m in course["modules"]:
        mc = user_module_map.get(m["id"])
        modules.append(ModuleSummary(
            id=m["id"],
            title=m["title"],
            completed=mc is not None,
            score=mc.score if mc else None,
            total=mc.total if mc else None,
        ))

    return CourseDetail(
        id=course["id"],
        title=course["title"],
        description=course["description"],
        category=course["category"],
        difficulty=course["difficulty"],
        reward=course["reward"],
        xp_reward=course["xp_reward"],
        modules=modules,
        course_completed=course_done,
    )


@router.get("/courses/{course_id}/modules/{module_id}", response_model=ModuleDetail)
async def get_module(
    course_id: int,
    module_id: int,
    wallet_address: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """Get module with lesson content and quiz questions (answers excluded)."""
    module_data = _MODULE_MAP.get((course_id, module_id))
    if not module_data:
        raise HTTPException(status_code=404, detail="Module not found")

    completed = False
    score = None
    total = None

    if wallet_address:
        user = db.query(models.User).filter(
            models.User.wallet_address == wallet_address
        ).first()
        if user:
            mc = db.query(models.ModuleCompletion).filter(
                models.ModuleCompletion.user_id == user.id,
                models.ModuleCompletion.course_id == course_id,
                models.ModuleCompletion.module_id == module_id,
            ).first()
            if mc:
                completed = True
                score = mc.score
                total = mc.total

    questions_out = [
        QuestionOut(id=q["id"], question=q["question"], options=q["options"])
        for q in module_data["questions"]
    ]

    return ModuleDetail(
        id=module_data["id"],
        title=module_data["title"],
        content=module_data["content"],
        questions=questions_out,
        completed=completed,
        score=score,
        total=total,
    )


@router.post(
    "/courses/{course_id}/modules/{module_id}/submit",
    response_model=SubmitResult,
)
async def submit_quiz(
    course_id: int,
    module_id: int,
    req: SubmitRequest,
    db: Session = Depends(get_db),
):
    """
    Submit quiz answers. Validates server-side.
    Pass threshold: >= 2 out of 3 correct.
    On pass: records completion. If all modules done, credits course reward.
    """
    module_data = _MODULE_MAP.get((course_id, module_id))
    if not module_data:
        raise HTTPException(status_code=404, detail="Module not found")

    course = _COURSE_MAP.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    user = _get_user(req.wallet_address, db)

    questions = module_data["questions"]
    if len(req.answers) != len(questions):
        raise HTTPException(
            status_code=400,
            detail=f"Expected {len(questions)} answers, got {len(req.answers)}",
        )

    # Check if already completed
    existing = db.query(models.ModuleCompletion).filter(
        models.ModuleCompletion.user_id == user.id,
        models.ModuleCompletion.course_id == course_id,
        models.ModuleCompletion.module_id == module_id,
    ).first()

    correct_answers = [q["correct"] for q in questions]
    score = sum(1 for a, c in zip(req.answers, correct_answers) if a == c)
    total = len(questions)
    passed = score >= 2  # pass threshold

    if existing:
        return SubmitResult(
            passed=True,
            score=existing.score,
            total=existing.total,
            correct_answers=correct_answers,
            already_completed=True,
            course_completed=False,
            reward_credited=0.0,
            new_balance=user.portfolio_balance,
        )

    course_completed = False
    reward_credited = 0.0

    if passed:
        mc = models.ModuleCompletion(
            user_id=user.id,
            course_id=course_id,
            module_id=module_id,
            score=score,
            total=total,
        )
        db.add(mc)
        db.flush()

        # Check if all modules in this course are now complete
        course_module_ids = {m["id"] for m in course["modules"]}
        completed_module_ids = set(
            row[0]
            for row in db.query(models.ModuleCompletion.module_id)
            .filter(
                models.ModuleCompletion.user_id == user.id,
                models.ModuleCompletion.course_id == course_id,
            )
            .all()
        )

        if course_module_ids == completed_module_ids:
            existing_course = db.query(models.CourseCompletion).filter(
                models.CourseCompletion.user_id == user.id,
                models.CourseCompletion.course_id == course_id,
            ).first()

            if not existing_course:
                cc = models.CourseCompletion(
                    user_id=user.id,
                    course_id=course_id,
                    reward_credited=course["reward"],
                )
                db.add(cc)
                user.portfolio_balance += course["reward"]
                course_completed = True
                reward_credited = course["reward"]

        db.commit()
        db.refresh(user)

    return SubmitResult(
        passed=passed,
        score=score,
        total=total,
        correct_answers=correct_answers,
        already_completed=False,
        course_completed=course_completed,
        reward_credited=reward_credited,
        new_balance=user.portfolio_balance,
    )


@router.get("/progress", response_model=ProgressResponse)
async def get_progress(
    wallet_address: str = Query(...),
    db: Session = Depends(get_db),
):
    """Get the user's overall academy progress."""
    user = _get_user(wallet_address, db)

    module_completions = db.query(models.ModuleCompletion).filter(
        models.ModuleCompletion.user_id == user.id,
    ).all()

    course_completions = db.query(models.CourseCompletion).filter(
        models.CourseCompletion.user_id == user.id,
    ).all()

    total_earned = sum(cc.reward_credited for cc in course_completions)
    xp_earned = sum(
        _COURSE_MAP[cc.course_id]["xp_reward"]
        for cc in course_completions
        if cc.course_id in _COURSE_MAP
    )

    return ProgressResponse(
        total_earned=total_earned,
        xp_earned=xp_earned,
        courses_completed=len(course_completions),
        modules_completed=len(module_completions),
        completed_course_ids=[cc.course_id for cc in course_completions],
        completed_module_ids=[mc.module_id for mc in module_completions],
    )
