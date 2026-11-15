# REDLINE — Cyber Safety & Threat Intelligence Ecosystem

> **Tagline:** *"Understand the Threat. Recognize the Risk. Protect Yourself."*

**REDLINE** is an original, production-grade cybersecurity awareness and threat intelligence ecosystem designed for everyday internet users, students, parents, elders, and non-technical individuals.

---

## 🎨 Visual Identity & Design System

REDLINE features a dark, futuristic **red-neon cybersecurity aesthetic** inspired by high-tech security operations centers (SOC):

- **Pure Dark Background:** `#050505`
- **Secondary Background:** `#0B0B0F`
- **Card Background:** `#101014` (Glassmorphism with subtle blur)
- **Primary Neon Red:** `#FF3038`
- **Secondary Crimson Red:** `#C81020`
- **Bright Red Highlight:** `#FF5555`
- **Primary Text:** `#F5F5F5`
- **Secondary Text:** `#A0A0A8`
- **Glowing Borders:** `rgba(255, 48, 56, 0.35)`
- **Typography:**
  - Headings: `Rajdhani`, `Space Grotesk`
  - Body Content: `Inter`
  - System Badges & Telemetry: `Orbitron`, `Space Grotesk Monospace`
- **Effects:** Ambient red node matrix canvas, glowing borders, thin gradient separators, and subtle radar indicators.

---

## 🚀 Key Modules & Architecture

### 1. Unified Homepage
- **Hero Section:** *"THE DIGITAL WORLD IS FULL OF THREATS."*
- **12 Interactive Threat Cards:** Phishing, Malware, Online Scams, Camera & Mic Privacy, Identity Theft, Password Attacks, Social Engineering, Network Attacks, Ransomware, Spyware, Data Breaches, Deepfakes.
- **Security Tools Showcase:** Immediate access to analysis utilities.
- **Cyber Awareness Hub:** Daily Cybersecurity Tip (with shuffle), Common Scam Spotlight (Digital Arrest, UPI PIN deception), Alert Ticker, and 1-Click Emergency Shortcut.
- **Live Platform Stats:** Real threat topic counts, active tools, quizzes, and simulations.

### 2. Threat Library (35+ Structured Deep Dives)
Organized into 7 comprehensive categories:
1. **Social Engineering:** Phishing, Spear Phishing, Smishing, Vishing, Pretexting, Baiting, Impersonation Scams, Business Email Compromise (BEC).
2. **Malware & Malicious Code:** Ransomware, Spyware, Trojans, Keyloggers, Viruses, Worms, Adware, Rootkits.
3. **Privacy & Surveillance Risks:** Camera Privacy & Camfecting, Microphone Permissions, Location Tracking, Browser Tracking & Fingerprinting, Excessive App Permissions, Unauthorized Data Collection, Hidden Camera Awareness.
4. **Account & Identity Security:** Password Attacks, Credential Stuffing, Brute-Force Concepts, Account Takeover, Session Hijacking, SIM Swapping.
5. **Network & Wi-Fi Threats:** Public Wi-Fi Risks, Rogue Access Points, Man-in-the-Middle (MITM) Attacks, DNS Spoofing, Bluetooth Vulnerabilities, SOHO Router Exploits.
6. **Financial & Online Scams:** UPI Scams, QR Code Traps, Digital Arrest Extortion, Fake Courier/FedEx SMS, Fake Part-time Telegram Jobs, Loan App Extortion, Lottery Fraud.
7. **Emerging & AI Threats:** Deepfake Synthetic Media, AI Voice Cloning, AI-Generated Phishing, Malicious Browser Extensions.

**Every Threat Detail Page Includes 10 Mandatory Sections:**
1. What is this threat?
2. How does it work? (Educational breakdown)
3. Real-world attack examples
4. Common warning signs & red flags
5. Who can be affected?
6. Potential consequences & impact
7. Prevention methods & best practices
8. What to do if affected (Emergency recovery)
9. Related threats
10. Interactive Knowledge-Check Quiz with instant feedback

### 3. Genuinely Functional Security Tools
1. **URL Safety Checker:** Validates format, flags unencrypted HTTP, audits Punycode (homograph attacks), detects IP hostnames, checks brand spoofing, and queries Google Safe Browsing / heuristic engine.
2. **Password Strength Analyzer:** 100% private client-side evaluation. Calculates Shannon entropy bits, GPU brute-force crack time (10B guesses/sec), character diversity, and detects common dictionary patterns without sending data over the network.
3. **Suspicious Message Analyzer:** NLP threat scanner for SMS/WhatsApp/Email. Flags artificial urgency, demands for OTP/UPI PINs, impersonation keywords, and extracts links.
4. **Email Security Inspector:** Inspects RFC 5322 headers, flags display-name spoofing and Reply-To address mismatches, and explains SPF, DKIM, and DMARC alignment.
5. **QR Code Safety Guide:** Decodes QR images locally in browser canvas using `jsQR`. Reveals destination URL as plain text before opening and alerts against UPI money-request traps ("Enter PIN to receive").
6. **File Security Awareness:** Inspects file extensions and MIME types, catches double-extension deception (e.g. `invoice.pdf.exe`), and explains safe sandboxing with VirusTotal.
7. **Privacy & Permission Guide:** Interactive simulator for reviewing and revoking Camera, Microphone, and Location permissions across Android, Windows, and Web Browsers.
8. **Browser Privacy Awareness:** Live client audit of WebRTC exposure, canvas entropy, Do Not Track headers, and cookie privacy settings.

### 4. Interactive Cyber Lab (6 Isolated Simulations)
- **Sim A: Phishing Awareness:** Inspect an interactive spoofed bank email to click and identify all 4 red flags.
- **Sim B: Social Engineering:** Interactive dialogue tree handling a fake bank manager pressuring you for an OTP.
- **Sim C: Camera Permission Awareness:** Simulated browser permission prompt showing deceptive verification tricks without accessing real hardware.
- **Sim D: Password Cracking Lab:** Visual comparison of GPU crack duration across simple passwords vs passphrases.
- **Sim E: Public Wi-Fi Sniffing:** Animated comparison of plaintext HTTP packets sniffed on open Wi-Fi vs TLS/HTTPS tunnels.
- **Sim F: Scam Detection Speed Challenge:** Rapid-fire scenario cards categorized as Legitimate or Fraudulent.

### 5. AI Cyber Safety Assistant
- Conversational cybersecurity advisor powered by **Google Gemini API** (`@google/genai` / `google-genai`) with an intelligent **REDLINE Cyber Defense Core Engine** fallback.
- **Dual Language Support:** Full support for both **English** and **മലയാളം (Malayalam)**.
- Pre-loaded emergency intent matching for Digital Arrest scams, OTP fraud, clicked links, and camera concerns.

### 6. India-Specific Cyber Safety Portal
- **1930 National Cybercrime Helpline:** Comprehensive guidance on the "Golden Hour" (first 2 hours to freeze stolen bank funds).
- **cybercrime.gov.in:** Step-by-step reporting walkthrough.
- **UPI Golden Rule:** Clear education that receiving money never requires entering a UPI PIN.
- **Digital Arrest Defense:** Educational debunking of fake police/CBI video arrest calls.
- **Aadhaar Biometric Locking:** Guide to locking biometrics via mAadhaar / UIDAI to prevent AePS fraud.

### 7. Emergency Help Center
Clickable triage scenarios with prioritized, checklist-based recovery actions:
- I shared an OTP or PIN
- I made a fraudulent payment
- I clicked a suspicious link
- My account was compromised
- I installed an unknown APK/App
- I suspect unauthorized camera/mic spyware
- I received a blackmail, sextortion, or extortion threat
- My documents/data were exposed

### 8. Cyber Awareness Quiz & Certification
- Quizzes across **Beginner**, **Intermediate**, and **Advanced** tiers.
- Instant explanations for every answer.
- Score tracking, awareness badges ("Master Cyber Guardian", "Certified Defender").
- Dynamic **Certificate of Completion** generated with the user's name and printable directly.

### 9. User Dashboard & Account System
- Optional signup and login using bcrypt password hashing and JWT authentication.
- Tracks Cyber Awareness Points, average quiz scores, and saved threat articles.
- Visitors can explore all tools and features without registering.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite, `canvas-confetti`, `jsQR` |
| **Backend** | Python Flask, REST API, PyJWT, Werkzeug, Bcrypt, Google GenAI SDK |
| **Database** | SQLAlchemy ORM, SQLite (`redline.db` zero-setup) + MySQL 8.0 DDL (`database_schema.sql`) |
| **Security** | CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Zero-Transmission Client Tools |

---

## ⚡ Quick Start & Run Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Option A: One-Click Windows Launch
Double-click `run.bat` in the project root:
```cmd
run.bat
```
*(Or right-click `start.ps1` and select "Run with PowerShell".)*

### Option B: Manual Startup

**1. Start the Backend:**
```cmd
cd backend
python app.py
```
*Backend runs on `http://127.0.0.1:5000` (Database auto-seeds on first launch).*

**2. Start the Frontend:**
```cmd
cd frontend
npm.cmd run dev
```
*Frontend runs on `http://127.0.0.1:5173`.*

---

## 🗄️ Database Schema & Production MySQL

For production deployment with MySQL:
1. Create a MySQL database using `backend/database_schema.sql`.
2. Configure environment variables in `backend/.env`:
   ```ini
   DB_ENGINE=mysql
   MYSQL_URL=mysql+pymysql://username:password@localhost:3306/redline_db?charset=utf8mb4
   ```

---

## 🛡️ Safety & Ethics Declaration
REDLINE is strictly an educational cyber defense ecosystem. It does not harvest credentials, activate physical cameras without authorization, deploy malware, or perform real attacks. All simulations use fictional sandbox entities.
