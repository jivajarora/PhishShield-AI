import os
import re
import joblib
from urllib.parse import urlparse

# Mock loading AI model. In production, load the .pkl file trained in ai-model/
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../ai-model/phishing_model.pkl')

def analyze_url(url: str) -> dict:
    threats = []
    risk_score = 10
    status = "safe"

    # Basic heuristics
    if len(url) > 75:
        threats.append({
            "title": "Unusually Long URL",
            "description": "The URL length exceeds 75 characters. Attackers often use long URLs to hide the actual domain or payload they are redirecting to."
        })
        risk_score += 20
        
    parsed = urlparse(url)
    
    if parsed.scheme != "https":
        threats.append({
            "title": "Unencrypted Connection (HTTP)",
            "description": "The URL uses HTTP instead of HTTPS. This means data sent between your browser and the site is not encrypted and can be easily intercepted by third parties."
        })
        risk_score += 30
        
    if "@" in url:
        threats.append({
            "title": "Suspicious '@' Symbol",
            "description": "The URL contains an '@' symbol. Browsers typically ignore everything before the '@' symbol, which is a common trick used in phishing to disguise the real destination domain."
        })
        risk_score += 40
        
    suspicious_keywords = ["login", "verify", "update", "secure", "account", "banking"]
    for keyword in suspicious_keywords:
        if keyword in url.lower():
            threats.append({
                "title": f"Suspicious Keyword Detected: '{keyword}'",
                "description": f"The keyword '{keyword}' is often used by malicious actors to create a false sense of legitimacy, commonly seen in fake login or account verification pages."
            })
            risk_score += 15
            
    # Mock AI prediction
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            # mock features
            prediction = model.predict([[len(url), int(parsed.scheme == "https"), url.count('.')]])[0]
            if prediction == 1:
                threats.append({
                    "title": "AI Model Classification: Phishing",
                    "description": "Our machine learning model has analyzed the structure and features of this URL and classified it as a high-risk phishing attempt."
                })
                risk_score += 50
    except Exception as e:
        print(f"Model prediction failed or model missing: {e}")

    # Clamp risk score
    risk_score = min(risk_score, 100)
    
    if risk_score > 70:
        status = "dangerous"
    elif risk_score > 30:
        status = "suspicious"

    return {
        "status": status,
        "risk_score": risk_score,
        "threats_detected": threats
    }

def analyze_text(text: str) -> dict:
    threats = []
    risk_score = 10
    status = "safe"
    
    lower_text = text.lower()
    
    urgency_keywords = ["urgent", "immediate action required", "suspend", "block", "verify your account"]
    for keyword in urgency_keywords:
        if keyword in lower_text:
            threats.append({
                "title": f"Urgency/Manipulation Keyword: '{keyword}'",
                "description": f"The message contains '{keyword}'. Attackers use psychological manipulation to rush you into acting without thinking, such as clicking a malicious link or revealing sensitive info."
            })
            risk_score += 30
            
    if re.search(r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', text, re.IGNORECASE):
        threats.append({
            "title": "Embedded Email Addresses",
            "description": "The message contains direct email addresses. In some contexts, this is a tactic to bypass spam filters or direct you to communicate with a fraudulent support team."
        })
        risk_score += 10
        
    # Check for URLs in text
    urls = re.findall(r'(https?://\S+)', text)
    if urls:
        threats.append({
            "title": f"Contains Links ({len(urls)})",
            "description": "The message contains hyperlinks. Always be cautious of links in unsolicited messages, as they may lead to phishing sites or malware downloads."
        })
        risk_score += 20
        
    risk_score = min(risk_score, 100)
    
    if risk_score > 70:
        status = "dangerous"
    elif risk_score > 30:
        status = "suspicious"

    return {
        "status": status,
        "risk_score": risk_score,
        "threats_detected": threats
    }
