# Database Schema

PhishShield AI uses MongoDB Atlas as its database. Since MongoDB is NoSQL, the schemas are flexible, but we enforce the following structure within our Python application.

## 1. Collection: `scan_history`
Stores records of all scans performed by users.

```json
{
  "_id": "ObjectId",
  "type": "string", // "url", "email", or "qr"
  "input": "string", // The scanned URL or text content
  "timestamp": "ISODate", // Date and time of the scan
  "status": "string", // "safe", "suspicious", or "dangerous"
  "risk_score": "number", // integer between 0 and 100
  "threats_detected": ["string"] // Array of strings detailing the specific threats found
}
```

## 2. Collection: `threat_reports`
(For Future Expansion) Stores specific, manually reported threats by users.

```json
{
  "_id": "ObjectId",
  "url": "string",
  "reported_by": "string", // User email or ID
  "description": "string",
  "timestamp": "ISODate",
  "verified": "boolean" // Whether an admin has verified the report
}
```
