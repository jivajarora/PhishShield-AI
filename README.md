<p align="center">
  <img src="phishshield_logo.png" alt="PhishShield AI Logo" width="200"/>
</p>

<h1 align="center">PhishShield AI</h1>

<p align="center">
  <strong>Advanced Cybersecurity Intelligence Platform for Phishing & Scam Detection</strong>
</p>

<p align="center">
  <a href="https://phish-shield-ai-psi.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Scikit_Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-Learn"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

---

## 🛡️ Project Overview

**PhishShield AI** is a state-of-the-art cybersecurity platform engineered to identify and mitigate phishing threats across multiple vectors. By leveraging machine learning and advanced heuristic analysis, PhishShield provides users with real-time protection against malicious URLs, fraudulent emails, and suspicious QR codes.

The project implements a "Red Alert" threat intelligence aesthetic, designed to provide high-visibility security alerts and a comprehensive dashboard for threat monitoring.

## 🌐 Deployed Application

The platform is live-hosted and deployed on Vercel:
🔗 **[https://phish-shield-ai-psi.vercel.app](https://phish-shield-ai-psi.vercel.app)**

> [!NOTE]
> Google Sign-In authentication is active. To perform scans, authenticate with your Google account. Authorized admin accounts (e.g., `arorajivaj3009@gmail.com`) can view the global dashboard with full scan logs.

## 🚀 Key Features

- **🔍 Intelligent URL Scanner**: Analyzes URLs using a combination of heuristic patterns (entropy, structure, obfuscation) and a trained **Random Forest Classifier**.
- **📧 Email & Text Analyzer**: Detects psychological manipulation, urgency-based social engineering, and hidden malicious links in email content.
- **📱 Secure QR Scanner**: Decodes QR codes and automatically performs a security audit on the extracted destination URL to prevent "Quishing" (QR Phishing).
- **🌐 Chrome Extension**: Real-time browser protection that scans pages as you browse and alerts you to potential threats.
- **📊 Security Dashboard**: A centralized hub for monitoring threat history, risk scores, and detailed breakdown of detected vulnerabilities.

## 🏗️ Architecture

```mermaid
graph TD
    User((User)) -->|Interacts| Frontend[React + Vite Frontend]
    User -->|Browses| Extension[Chrome Extension]
    
    Frontend -->|API Requests| Backend[FastAPI Backend]
    Extension -->|Scanning| Backend
    
    subgraph "Security Engine"
        Backend --> Heuristics[Heuristic Analyzer]
        Backend --> AI[Random Forest ML Model]
        Backend --> QR[ZBar QR Decoder]
    end
    
    Heuristics --> Intel[Threat Intelligence Report]
    AI --> Intel
    
    Backend -->|Log Result| DB[(MongoDB)]
    Intel -->|Risk Score| Frontend
```

## 🛡️ Cybersecurity Highlights & Requirements

This project successfully implements critical cybersecurity tools and requirements:

- **AI-Powered Detection**: Utilization of `Scikit-learn` to train a model on phishing datasets, enabling predictive detection beyond static blacklists.
- **Heuristic Threat Intel**: Custom-built engine to detect common phishing patterns (HTTP vs HTTPS, @ symbols, suspicious keywords, URL length).
- **Anti-Quishing Measures**: Integrated QR decoding and link validation to mitigate the rising threat of QR-based phishing.
- **Risk Scoring System**: Automated calculation of risk levels (Safe, Suspicious, Dangerous) based on weighted threat vectors.
- **Persistence & Audit Log**: Comprehensive logging of scan history in MongoDB for forensic analysis and security auditing.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **Machine Learning** | Scikit-learn (Random Forest), Joblib, Pandas |
| **Database** | MongoDB |
| **Security Tools** | ZBar (QR Decoding), Regex-based Heuristics |
| **Deployment** | Docker, Jenkins (CI/CD Ready) |

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### AI Model Training
```bash
cd ai-model
python train_model.py
```

## 📄 License

This project is licensed under the MIT License - © 2026 Jivaj Arora. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Developed with ❤️ for the Cybersecurity Community.
</p>
