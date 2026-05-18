import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# We can use a local MongoDB if Atlas URI is not provided.
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
db = client["phishshield_db"]

# Collections
scan_history = db["scan_history"]
threat_reports = db["threat_reports"]

def save_scan_result(data: dict):
    try:
        scan_history.insert_one(data)
        return True
    except Exception as e:
        print(f"Failed to save to MongoDB: {e}")
        return False

def get_scan_history(limit=50):
    try:
        results = list(scan_history.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
        return results
    except Exception as e:
        print(f"Failed to fetch history: {e}")
        return []
