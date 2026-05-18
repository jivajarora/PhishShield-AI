from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json
from services import threat_intel, qr_scanner
from models import database

router = APIRouter()

class URLScanRequest(BaseModel):
    url: str

class EmailScanRequest(BaseModel):
    content: str

@router.post("/scan-url")
def scan_url(request: URLScanRequest):
    result = threat_intel.analyze_url(request.url)
    
    # Save to MongoDB
    record = {
        "type": "url",
        "input": request.url,
        "timestamp": datetime.utcnow(),
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threats_detected": result["threats_detected"]
    }
    database.save_scan_result(record)
    
    return result

@router.post("/scan-email")
def scan_email(request: EmailScanRequest):
    result = threat_intel.analyze_text(request.content)
    
    record = {
        "type": "email",
        "input": request.content[:100] + "..." if len(request.content) > 100 else request.content,
        "timestamp": datetime.utcnow(),
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threats_detected": result["threats_detected"]
    }
    database.save_scan_result(record)
    
    return result

@router.post("/scan-qr")
async def scan_qr(file: UploadFile = File(...)):
    contents = await file.read()
    decoded_url = qr_scanner.decode_qr(contents)
    
    if not decoded_url:
        raise HTTPException(status_code=400, detail="Could not decode QR code.")
    
    # Scan the decoded URL
    result = threat_intel.analyze_url(decoded_url)
    
    record = {
        "type": "qr",
        "input": decoded_url,
        "timestamp": datetime.utcnow(),
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threats_detected": result["threats_detected"]
    }
    database.save_scan_result(record)
    
    return {"decoded_url": decoded_url, "scan_result": result}

@router.get("/history")
def get_history():
    history = database.get_scan_history()
    return {"history": history}
