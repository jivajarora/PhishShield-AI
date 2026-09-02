import os
import re
import socket
import urllib3
import requests
import joblib
from urllib.parse import urlparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Try local folder first (for Vercel deployment bundling), fallback to root-relative path
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'phishing_model.pkl')
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../ai-model/phishing_model.pkl')

# List of common URL shorteners (matching the training pipeline)
SHORTENERS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "rebrand.ly", "is.gd", "ow.ly", 
    "buff.ly", "adf.ly", "bit.do", "lnkd.in", "db.tt", "qr.ae", "ity.im", 
    "q.gs", "po.st", "bc.vc", "twitthis.com", "u.to", "j.mp", "buzurl.com", 
    "cutt.us", "u.bb", "yourls.org", "x.co", "prettylinkpro.com", "scrnch.me", 
    "filoops.info", "linkis.com", "tr.im", "url4.eu", "firebaseapp.com"
}

def extract_url_features(url: str) -> tuple:
    """
    Extracts the 8 URL features matching the 5.urldata.csv dataset structure.
    Returns:
        features_list: list of 8 binary/integer values
        features_dict: dictionary mapping feature names to values (for description generation)
    """
    if not url.startswith(("http://", "https://")):
        url_for_parse = "http://" + url
    else:
        url_for_parse = url
        
    try:
        parsed = urlparse(url_for_parse)
        domain = parsed.netloc
        path = parsed.path
    except Exception:
        domain = ""
        path = ""

    # 1. Have_IP
    ip_pattern = r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'
    have_ip = 1 if re.match(ip_pattern, domain) else 0

    # 2. Have_At
    have_at = 1 if '@' in url else 0

    # 3. URL_Length
    url_length = 1 if len(url) >= 54 else 0

    # 4. URL_Depth
    url_depth = path.count('/')
    if path.startswith('/') and len(path) == 1:
        url_depth = 0

    # 5. Redirection
    redirection = 1 if '//' in path else 0

    # 6. https_Domain
    https_domain = 1 if "http" in domain or "https" in domain else 0

    # 7. TinyURL
    is_shortener = 0
    clean_domain = domain.lower().replace("www.", "")
    if clean_domain in SHORTENERS or any(clean_domain.endswith("." + s) for s in SHORTENERS):
        is_shortener = 1
    tiny_url = is_shortener

    # 8. Prefix/Suffix
    prefix_suffix = 1 if '-' in domain else 0

    features_list = [have_ip, have_at, url_length, url_depth, redirection, https_domain, tiny_url, prefix_suffix]
    features_dict = {
        "IP address in domain": have_ip,
        "Contains '@' character": have_at,
        "Suspicious length (>= 54 characters)": url_length,
        "Suspicious path depth": url_depth,
        "Uses '//' path redirection": redirection,
        "Contains 'http/https' token in domain": https_domain,
        "Uses URL shortener service": tiny_url,
        "Contains hyphen '-' prefix/suffix": prefix_suffix
    }
    
    return features_list, features_dict

TRUSTED_DOMAINS = {
    "google.com", "google.co.in", "google.co.uk", "google.ca", "google.de", "google.fr", "google.co.jp",
    "youtube.com", "gmail.com", "android.com", "chrome.com",
    "microsoft.com", "microsoftonline.com", "live.com", "outlook.com", "office.com", "sharepoint.com", "skype.com",
    "apple.com", "icloud.com",
    "amazon.com", "amazon.co.uk", "amazon.in", "amazon.de", "amazon.co.jp", "aws.amazon.com",
    "facebook.com", "instagram.com", "messenger.com", "whatsapp.com",
    "twitter.com", "x.com", "linkedin.com", "github.com", "gitlab.com",
    "wikipedia.org", "wikimedia.org",
    "netflix.com", "zoom.us", "slack.com", "zoom.com", "teams.live.com",
    "paypal.com", "stripe.com",
    "yahoo.com", "bing.com", "duckduckgo.com"
}

def check_trusted_domain(url: str) -> bool:
    """
    Checks if a URL belongs to a globally trusted domain (like Google, Apple, Microsoft)
    to avoid false positives on legitimate accounts and services.
    """
    if not url.startswith(("http://", "https://")):
        url_for_parse = "http://" + url
    else:
        url_for_parse = url
        
    try:
        parsed = urlparse(url_for_parse)
        domain = parsed.netloc.lower().replace("www.", "")
    except Exception:
        return False
        
    for trusted in TRUSTED_DOMAINS:
        if domain == trusted or domain.endswith("." + trusted):
            return True
            
    return False

def check_url_exists(raw_url: str) -> tuple:
    """
    Verifies whether a given URL actually exists on the internet before scanning.
    Returns:
        (exists: bool, reason: str)
    """
    url = (raw_url or "").strip()
    if not url:
        return False, "The entered URL does not exist."

    has_scheme = url.startswith(("http://", "https://"))
    test_url = url if has_scheme else "http://" + url

    try:
        parsed = urlparse(test_url)
        hostname = parsed.hostname
    except Exception:
        return False, "The entered URL does not exist."

    if not hostname:
        return False, "The entered URL does not exist."

    is_ip = bool(re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', hostname))
    if not is_ip and hostname != "localhost" and "." not in hostname:
        return False, "The entered URL does not exist."

    if hostname.startswith(".") or hostname.endswith(".") or ".." in hostname:
        return False, "The entered URL does not exist."

    # 1. DNS Resolution (fast check to eliminate non-existent domains)
    try:
        socket.getaddrinfo(hostname, None)
    except (socket.gaierror, socket.herror, UnicodeError):
        return False, "The entered URL does not exist."
    except Exception:
        return False, "The entered URL does not exist."

    # 2. HTTP / HTTPS reachability check
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    if has_scheme:
        schemes = [url]
        alt = ("http://" if url.startswith("https://") else "https://") + url.split("://", 1)[1]
        schemes.append(alt)
    else:
        schemes = ["https://" + url, "http://" + url]

    for target in schemes:
        try:
            requests.head(target, headers=headers, timeout=3.5, allow_redirects=True, verify=False)
            return True, "URL exists and is reachable."
        except requests.exceptions.SSLError:
            # Server exists and is listening even if SSL certificate is invalid
            return True, "URL exists and is reachable."
        except requests.RequestException:
            try:
                requests.get(target, headers=headers, timeout=3.5, stream=True, verify=False)
                return True, "URL exists and is reachable."
            except requests.exceptions.SSLError:
                return True, "URL exists and is reachable."
            except requests.RequestException:
                pass

    # 3. Fallback: Direct TCP socket connection on web ports (80, 443)
    target_port = parsed.port
    ports = [target_port] if target_port else [443, 80]
    for p in ports:
        try:
            with socket.create_connection((hostname, p), timeout=2.0):
                return True, "URL exists and is reachable."
        except Exception:
            pass

    return False, "The entered URL does not exist."

def analyze_url(url: str) -> dict:
    # 1. Bypass trusted domains to eliminate false positives on safe platforms
    if check_trusted_domain(url):
        return {
            "status": "safe",
            "risk_score": 0,
            "threats_detected": []
        }

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
        
    parsed = urlparse(url if url.startswith(("http://", "https://")) else "http://" + url)
    
    if parsed.scheme != "https" and not url.startswith("https://"):
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
            
    # AI prediction using Random Forest model trained on 5.urldata.csv
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            features_list, features_dict = extract_url_features(url)
            
            # If all URL features are 0, override to safe (0) to prevent dataset collection bias false positives
            if sum(features_list) == 0:
                prediction = 0
            else:
                prediction = model.predict([features_list])[0]
                
            if prediction == 1:
                # Compile which URL traits contributed to classification
                active_traits = [trait for trait, active in features_dict.items() if (active > 0 if isinstance(active, int) else active)]
                traits_desc = ", ".join(active_traits) if active_traits else "Unusual URL structure"
                threats.append({
                    "title": "AI Model Classification: Phishing",
                    "description": f"Our Random Forest model trained on a real-world dataset analyzed this URL and classified it as a phishing attempt. Flagged traits: {traits_desc}."
                })
                risk_score += 50
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}. Skipping AI prediction.")
    except Exception as e:
        print(f"Model prediction failed: {e}")

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
