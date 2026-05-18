from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import scan

app = FastAPI(
    title="PhishShield AI API",
    description="Backend API for phishing and scam detection",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",  # Support connections from local network IPs (like mobile devices)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to PhishShield AI API"}
