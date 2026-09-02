from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import json
from services import threat_intel, qr_scanner
from models import database
from utils.auth import get_current_user

router = APIRouter()

class URLScanRequest(BaseModel):
    url: str

class EmailScanRequest(BaseModel):
    content: str

@router.post("/scan-url")
def scan_url(request: URLScanRequest, current_user: dict = Depends(get_current_user)):
    # Verify the URL actually exists on the web before running AI scanning
    url_exists, _ = threat_intel.check_url_exists(request.url)
    if not url_exists:
        raise HTTPException(status_code=400, detail="The entered URL does not exist.")

    result = threat_intel.analyze_url(request.url)
    
    # Save to MongoDB associated with the user
    record = {
        "user_email": current_user["email"],
        "type": "url",
        "input": request.url,
        "timestamp": datetime.now(timezone.utc),
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threats_detected": result["threats_detected"]
    }
    database.save_scan_result(record)
    
    return result

@router.post("/scan-email")
def scan_email(request: EmailScanRequest, current_user: dict = Depends(get_current_user)):
    result = threat_intel.analyze_text(request.content)
    
    # Save to MongoDB associated with the user
    record = {
        "user_email": current_user["email"],
        "type": "email",
        "input": request.content,
        "timestamp": datetime.now(timezone.utc),
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threats_detected": result["threats_detected"]
    }
    database.save_scan_result(record)
    
    return result

@router.post("/scan-qr")
async def scan_qr(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    contents = await file.read()
    decoded_url = qr_scanner.decode_qr(contents)
    
    if not decoded_url:
        raise HTTPException(status_code=400, detail="Could not decode QR code.")
    
    # Verify existence if the decoded QR code contains a URL
    if decoded_url.startswith(("http://", "https://")) or "." in decoded_url:
        url_exists, _ = threat_intel.check_url_exists(decoded_url)
        if not url_exists:
            raise HTTPException(status_code=400, detail="The entered URL does not exist.")

    # Scan the decoded URL
    result = threat_intel.analyze_url(decoded_url)
    
    # Save to MongoDB associated with the user
    record = {
        "user_email": current_user["email"],
        "type": "qr",
        "input": decoded_url,
        "timestamp": datetime.now(timezone.utc),
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threats_detected": result["threats_detected"]
    }
    database.save_scan_result(record)
    
    return {"decoded_url": decoded_url, "scan_result": result}

ADMIN_EMAILS = {"arorajivaj3009@gmail.com"}

@router.get("/history")
def get_history(current_user: dict = Depends(get_current_user)):
    # If the user is an admin, fetch all histories; otherwise, filter by their email
    if current_user["email"] in ADMIN_EMAILS:
        history = database.get_scan_history(user_email=None)
    else:
        history = database.get_scan_history(user_email=current_user["email"])
    return {"history": history}
