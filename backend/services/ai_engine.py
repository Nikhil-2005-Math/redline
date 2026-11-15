import os
import re

SYSTEM_INSTRUCTION_EN = """
You are REDLINE Cyber Safety AI, an empathetic, highly knowledgeable cybersecurity guardian and educational advisor designed for ordinary internet users, students, elders, and non-technical people.
Your goals:
1. Provide crystal-clear, beginner-friendly explanations of cyber threats and scams.
2. Provide step-by-step, actionable emergency safety instructions when a user reports a crisis.
3. Keep answers calm, concise, and structured with bullet points.
4. If the user mentions India, mention the National Cyber Crime Helpline (1930) and cybercrime.gov.in.
5. NEVER fabricate real-time threat scan results or claim you can hack back.
6. If the user asks in Malayalam or requests Malayalam, provide the explanation in warm, accurate Malayalam.
"""

# Pre-defined offline intelligence responses for educational fallback
KNOWLEDGE_BASE = [
    {
        'keywords': ['digital arrest', 'arrest scam', 'cbi call', 'police video', 'customs parcel', 'skype call'],
        'en': """### 🚨 Warning: This is a Classic "Digital Arrest" Scam!

Indian law enforcement agencies (CBI, ED, Police, NIA) **NEVER** arrest people over Skype, WhatsApp, or video calls.

#### What you need to know:
1. **There is NO legal concept of "Digital Arrest"** under Indian Law.
2. The Supreme Court and Ministry of Home Affairs have issued clear warnings against this syndicate.
3. Scammers wear fake police uniforms and use fake Supreme Court letterheads to intimidate you.

#### Immediate Steps:
* **Disconnect the call immediately.** Do not argue with them.
* **Do NOT transfer any money** to "RBI verification accounts" or escrow accounts.
* Call the National Cyber Crime Helpline **1930** immediately.
* File an online complaint at [cybercrime.gov.in](https://cybercrime.gov.in).""",
        'ml': """### 🚨 മുന്നറിയിപ്പ്: ഇത് ഒരു വ്യാജ "ഡിജിറ്റൽ അറസ്റ്റ്" (Digital Arrest) തട്ടിപ്പാണ്!

ഇന്ത്യൻ നിയമപ്രകാരം **'ഡിജിറ്റൽ അറസ്റ്റ്'** എന്നൊരു കാര്യമില്ല. പോലീസോ, സി.ബി.ഐയോ, കസ്റ്റംസോ ഒരിക്കലും വാട്സ്ആപ്പിലോ സ്കൈപ്പിലോ വീഡിയോ കോൾ വഴി ആരെയും അറസ്റ്റ് ചെയ്യുകയോ പണം ആവശ്യപ്പെടുകയോ ചെയ്യില്ല.

#### നിങ്ങൾ ചെയ്യേണ്ട കാര്യങ്ങൾ:
1. ഉടൻ തന്നെ കോൾ കട്ട് ചെയ്യുക. ഭയപ്പെടേണ്ടതില്ല.
2. ഒരു കാരണവശാലും അവർ പറയുന്ന അക്കൗണ്ടിലേക്ക് പണം അയക്കരുത്.
3. ഉടൻ തന്നെ **1930** എന്ന സൈബർ ഹെൽപ്‌ലൈൻ നമ്പറിൽ വിളിച്ച് പരാതിപ്പെടുക.
4. [cybercrime.gov.in](https://cybercrime.gov.in) എന്ന വെബ്സൈറ്റിൽ പരാതി രജിസ്റ്റർ ചെയ്യുക."""
    },
    {
        'keywords': ['clicked link', 'clicked a link', 'suspicious link', 'phishing link', 'fake link'],
        'en': """### ⚡ Immediate Steps: You Clicked a Suspicious Link

Stay calm. Merely clicking a link does not always mean your device is hacked, but you should take defensive action right away:

1. **Disconnect from Internet:** Turn off Wi-Fi and Mobile Data immediately to prevent background data exfiltration.
2. **Did you enter passwords or OTP?**
   * If **YES**: Immediately change your password from another safe device and enable Two-Factor Authentication (2FA).
   * If banking details were entered: Contact your bank branch or customer care to temporarily freeze debit cards/net banking.
3. **Did a file download?**
   * Do **NOT** open or install any `.apk`, `.exe`, or `.zip` file that downloaded. Delete it from your Downloads folder immediately.
4. **Clear Browser Cache:** Go to browser settings > Clear browsing data (Cookies, cached images, and site data).
5. **Run a Malware Scan:** Use Google Play Protect (on Android) or Windows Security to scan your device.""",
        'ml': """### ⚡ നിങ്ങൾ ഒരു വ്യാജ ലിങ്കിൽ ക്ലിക്ക് ചെയ്താൽ ഉടൻ ചെയ്യേണ്ട കാര്യങ്ങൾ:

ഭയപ്പെടേണ്ടതില്ല, താഴെ പറയുന്ന മുൻകരുതലുകൾ ഉടൻ സ്വീകരിക്കുക:

1. **ഇന്റർനെറ്റ് ഓഫ് ചെയ്യുക:** വൈ-ഫൈയും മൊബൈൽ ഡാറ്റയും ഉടൻ ഓഫ് ചെയ്യുക.
2. **പാസ്‌വേഡോ OTP യോ നൽകിയിരുന്നോ?**
   * നൽകിയിട്ടുണ്ടെങ്കിൽ, മറ്റൊരു സുരക്ഷിത ഫോണിൽ നിന്നോ കമ്പ്യൂട്ടറിൽ നിന്നോ ആ അക്കൗണ്ടിന്റെ പാസ്‌വേഡ് ഉടൻ മാറ്റുക.
   * ബാങ്ക് വിവരങ്ങളാണ് നൽകിയതെങ്കിൽ, ഉടൻ ബാങ്കിൽ വിളിച്ച് കാർഡും നെറ്റ് ബാങ്കിംഗും ബ്ലോക്ക് ചെയ്യുക.
3. **എന്തെങ്കിലും ഫയൽ ഡൗൺലോഡ് ആയോ?**
   * ഒരു കാരണവശാലും ആ ഫയൽ (.apk അല്ലെങ്കിൽ .exe) ഇൻസ്റ്റാൾ ചെയ്യരുത്. ഡൗൺലോഡ്സ് ഫോൾഡറിൽ നിന്ന് ഡിലീറ്റ് ചെയ്യുക.
4. ബ്രൗസർ ഹിസ്റ്ററിയും കാഷെയും (Cache) ക്ലിയർ ചെയ്യുക."""
    },
    {
        'keywords': ['shared otp', 'gave otp', 'otp fraud', 'money debited', 'fraud payment', 'lost money'],
        'en': """### 🚨 CRITICAL EMERGENCY: OTP Shared / Unauthorized Payment

Act within the **"Golden Hour"** (first 2 hours) to maximize chances of freezing the stolen funds:

1. **Call 1930 Cyber Helpline Immediately:**
   * Dial **1930** (Indian National Cyber Crime Reporting Portal).
   * Keep transaction details ready: Bank name, account number, UTR/Transaction ID, scammer's UPI ID/number, and amount.
2. **Block Bank Account & Cards:**
   * Call your bank's 24x7 emergency helpline or use your official mobile banking app to freeze net banking and UPI.
3. **Never Share OTP Again:**
   * Remember: Banks and payment apps NEVER require an OTP or UPI PIN to *receive* money.
4. **Preserve Evidence:**
   * Take screenshots of the SMS, call logs, WhatsApp chats, and bank debit notification.""",
        'ml': """### 🚨 അടിയന്തിര മുന്നറിയിപ്പ്: OTP നൽകുകയോ പണം നഷ്ടപ്പെടുകയോ ചെയ്താൽ!

ആദ്യത്തെ 2 മണിക്കൂർ (Golden Hour) വളരെ നിർണായകമാണ്. പണം തിരികെ ലഭിക്കാൻ ഉടൻ ചെയ്യുക:

1. **ഉടൻ 1930 എന്ന നമ്പറിലേക്ക് വിളിക്കുക:**
   * ഇത് ദേശീയ സൈബർ ക്രൈം ഹെൽപ്‌ലൈൻ നമ്പറാണ്. ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങളും ട്രാൻസാക്ഷൻ ഐഡിയും കൈവശം കരുതുക.
2. **ബാങ്കിൽ വിളിച്ച് അക്കൗണ്ട് മരവിപ്പിക്കുക:**
   * ഉടൻ നിങ്ങളുടെ ബാങ്കിന്റെ കസ്റ്റമർ കെയറിൽ വിളിച്ച് കാർഡും യു.പി.ഐയും ബ്ലോക്ക് ചെയ്യുക.
3. **ഓർക്കുക:** പണം ലഭിക്കാൻ (Receive) ഒരിക്കലും OTP യോ UPI PIN നോ നൽകേണ്ടതില്ല.
4. ചാറ്റുകളുടെയും മെസ്സേജുകളുടെയും സ്ക്രീൻഷോട്ടുകൾ എടുത്തു സൂക്ഷിക്കുക."""
    },
    {
        'keywords': ['camera', 'microphone', 'mic permission', 'spying', 'listen', 'watching me'],
        'en': """### 🔒 Camera & Microphone Privacy Guide

Modern operating systems have strict hardware indicators to show when recording devices are active:

1. **Green/Orange Dot Indicator:**
   * On Android and iOS, a glowing green or orange dot appears in the top corner whenever an app accesses your camera or microphone.
2. **Reviewing Permissions on Android:**
   * Go to **Settings > Privacy > Permission Manager > Camera / Microphone**.
   * Change permissions for suspicious apps to **"Don't allow"** or **"Ask every time"**.
3. **Reviewing Permissions on Windows:**
   * Go to **Settings > Privacy & security > Camera / Microphone**.
   * Turn off camera access for apps you don't recognize.
4. **Physical Safety Tip:**
   * Use a physical sliding webcam cover on laptops for 100% peace of mind against firmware-level zero-days.""",
        'ml': """### 🔒 ക്യാമറ, മൈക്രോഫോൺ സുരക്ഷാ നിർദ്ദേശങ്ങൾ

1. **ഗ്രീൻ / ഓറഞ്ച് ലൈറ്റ് സൂചന:**
   * ഫോണിൽ ഏതെങ്കിലും ആപ്പ് ക്യാമറയോ മൈക്കോ ഉപയോഗിക്കുമ്പോൾ സ്ക്രീനിന്റെ മുകളിൽ പച്ചയോ ഓറഞ്ചോ നിറത്തിലുള്ള ചെറിയ ബിന്ദു കാണാം.
2. **ആപ്പ് പെർമിഷനുകൾ പരിശോധിക്കുക:**
   * Settings > Privacy > Permission Manager എടുത്ത് ക്യാമറ, മൈക്ക് പെർമിഷനുകൾ ആവശ്യമില്ലാത്ത ആപ്പുകൾക്ക് നൽകിയിട്ടുണ്ടെങ്കിൽ ഒഴിവാക്കുക (Don't allow).
3. അജ്ഞാതമായ ആപ്പുകൾക്ക് ഒരിക്കലും മൈക്രോഫോൺ, ക്യാമറ പെർമിഷൻ നൽകരുത്."""
    },
    {
        'keywords': ['upi', 'qr code', 'receive money', 'scan qr', 'olx scam'],
        'en': """### 💳 UPI & QR Code Golden Rule

**CRITICAL RULE:** You **NEVER** need to scan a QR code or enter your UPI PIN to **RECEIVE** money.

* **Entering UPI PIN = Money GOES OUT of your account.**
* **Scanning QR Code in UPI app = You are PAYING someone.**
* Scammers on OLX/Marketplace say: *"Scan this QR code to receive the advance payment."* — This is a 100% fraud trick.
* Do not accept "Collect Request" notifications on PhonePe/Google Pay/Paytm from unknown parties.""",
        'ml': """### 💳 യു.പി.ഐ (UPI), ക്യു.ആർ കോഡ് തട്ടിപ്പുകൾ — പ്രധാന നിയമം

**ഓർക്കുക:** നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പണം വരാൻ (Receive ചെയ്യാൻ) ഒരിക്കലും **UPI PIN അടിക്കേണ്ടതില്ല**, **QR കോഡ് സ്കാൻ ചെയ്യേണ്ടതില്ല**.

* UPI PIN നൽകുന്നത് പണം നിങ്ങളുടെ അക്കൗണ്ടിൽ നിന്ന് **മറ്റൊരാൾക്ക് അയക്കാൻ** മാത്രമാണ്.
* ഒ.എൽ.എക്സ് (OLX) പോലെയുള്ള പ്ലാറ്റ്‌ഫോമുകളിൽ "പണം അങ്ങോട്ട് തരാൻ ക്യു.ആർ കോഡ് സ്കാൻ ചെയ്യൂ" എന്ന് പറയുന്നത് 100% തട്ടിപ്പാണ്."""
    }
]

def generate_chat_response(message: str, language: str = 'en', api_key: str = None) -> dict:
    user_msg = message.strip()
    msg_lower = user_msg.lower()

    # 1. Attempt Gemini 2.5 Flash if API key is provided
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            lang_prompt = "Respond in simple, clear Malayalam." if language == 'ml' else "Respond in beginner-friendly, structured English."
            prompt_content = f"{SYSTEM_INSTRUCTION_EN}\n\nLanguage requirement: {lang_prompt}\n\nUser Question: {user_msg}"
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt_content
            )
            if response and response.text:
                return {
                    'response': response.text,
                    'provider': 'Google Gemini 2.5 Flash',
                    'language': language,
                    'is_fallback': False
                }
        except Exception as e:
            # Fall back gracefully to internal knowledge base
            pass

    # 2. Offline Knowledge Engine matching
    for entry in KNOWLEDGE_BASE:
        for kw in entry['keywords']:
            if kw in msg_lower:
                return {
                    'response': entry['ml'] if language == 'ml' else entry['en'],
                    'provider': 'REDLINE Cyber Defense Core Engine',
                    'language': language,
                    'is_fallback': True
                }

    # 3. Default safe educational response
    if language == 'ml':
        default_resp = f"""### 🛡️ റെഡ്‌ലൈൻ സൈബർ സുരക്ഷാ ഉപദേശം

നിങ്ങൾ ചോദിച്ച വിഷയം: *"{user_msg}"*

#### പൊതുവായ സുരക്ഷാ നിർദ്ദേശങ്ങൾ:
1. **അപരിചിതമായ ലിങ്കുകളിൽ ക്ലിക്ക് ചെയ്യരുത്:** എസ്.എം.എസ് അല്ലെങ്കിൽ വാട്സ്ആപ്പ് വഴി വരുന്ന അജ്ഞാത ലിങ്കുകൾ ഒഴിവാക്കുക.
2. **OTP, PIN ഒരിക്കലും പങ്കുവെക്കരുത്:** ബാങ്ക് ജീവനക്കാരോ പോലീസോ ഒരിക്കലും നിങ്ങളുടെ പാസ്‌വേഡ് ചോദിക്കില്ല.
3. **ടു-ഫാക്ടർ ഓതന്റിക്കേഷൻ (2FA) ഉപയോഗിക്കുക:** വാട്സ്ആപ്പ്, ജിമെയിൽ, സോഷ്യൽ മീഡിയ അക്കൗണ്ടുകൾക്ക് 2FA നിർബന്ധമാക്കുക.
4. **അടിയന്തിര ഘട്ടങ്ങളിൽ:** സൈബർ തട്ടിപ്പിന് ഇരയായാൽ ഉടൻ **1930** എന്ന ഹെൽപ്‌ലൈനിൽ വിളിക്കുക അല്ലെങ്കിൽ [cybercrime.gov.in](https://cybercrime.gov.in) സന്ദർശിക്കുക."""
    else:
        default_resp = f"""### 🛡️ REDLINE Cyber Defense Advice

Regarding your inquiry: *"{user_msg}"*

#### Core Cyber Safety Principles:
1. **Zero-Trust for Unsolicited Contacts:** Treat unexpected emails, SMS, or WhatsApp messages claiming urgency or threats as unverified until proven otherwise.
2. **Protect Credentials:** Never share One-Time Passwords (OTP), UPI PINs, or account passwords with anyone over the phone or online forms.
3. **Verify Before Clicking:** Inspect links carefully for misspellings, strange domains, or IP addresses using our **URL Safety Checker**.
4. **Enable Multi-Factor Authentication (2FA):** Always use authenticator apps or biometric verification on banking and email accounts.
5. **Incident Reporting:** In India, call **1930** or report cybercrimes at [cybercrime.gov.in](https://cybercrime.gov.in)."""

    return {
        'response': default_resp,
        'provider': 'REDLINE Cyber Defense Core Engine',
        'language': language,
        'is_fallback': True
    }
