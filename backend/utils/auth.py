from fastapi import Depends, HTTPException, Security, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests
import os

security = HTTPBearer(auto_error=False)
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

def verify_google_token(token: str) -> dict:
    """
    Verifies a Google ID token (JWT) using Google's public keys.
    """
    if not CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID is not configured on the backend server.",
        )

    # Real Google OAuth Verification
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        
        # Verify the issuer is Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
        return {
            "email": idinfo["email"],
            "name": idinfo.get("name", idinfo["email"].split("@")[0]),
            "picture": idinfo.get("picture")
        }
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google session expired or invalid token. Details: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency that extracts the Bearer token from the Authorization header 
    and returns the authenticated user's details.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials are required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    return verify_google_token(token)
