import re

# Scam Indicator Dictionaries
URGENCY_PATTERNS = [
    (r'\b(immediately|urgent|within\s+\d+\s*(hours?|mins?|minutes?)|tonight|expires\s+soon|last\s+chance|immediate\s+action)\b', 'Extreme Urgency Tactic', 'Scammers create artificial panic to force quick emotional decisions before victims can think logically.'),
    (r'\b(blocked|suspended|terminated|deactivated|disconnected|legal\s+action|police|arrest|court\s+notice)\b', 'Threat of Negative Consequence', 'Fabricated threats of service cancellation or legal action are designed to intimidate victims into compliance.')
]

CREDENTIAL_PATTERNS = [
    (r'\b(otp|one[\s-]?time[\s-]?password|pin|upi[\s-]?pin|cvv|password|passcode|secret\s+code)\b', 'Request for Sensitive Credentials', 'CRITICAL RED FLAG: Legitimate banks and support teams NEVER ask for your OTP, PIN, or password.'),
    (r'\b(refund|cashback|lottery|won\s+₹|claim\s+reward|bonus|credited|prize|investment\s+double)\b', 'Unsolicited Financial Bait', 'Promises of free money, lottery winnings, or high guaranteed investment returns are almost universally fraudulent.')
]

IMPERSONATION_PATTERNS = [
    (r'\b(sbi|hdfc|icici|axis|punjab\s+national|rbi|bank\s+manager|customer\s+care)\b', 'Bank / Financial Impersonation', 'Impersonating well-known banks to trick users into updating "KYC" or sharing debit card details.'),
    (r'\b(electricity\s+bill|power\s+department|disconnection|mseb|bses|bescom)\b', 'Utility Provider Scam (Disconnection Notice)', 'Widespread scam claiming power will be disconnected unless a small payment or app is downloaded immediately.'),
    (r'\b(fedex|dhl|customs|courier|parcel|postal|tracking\s+held)\b', 'Courier / Customs Parcel Scam', 'False claims of detained parcels with illegal contents used to extort money or install trojan APKs.'),
    (r'\b(digital\s+arrest|cbi|ncb|mumbai\s+police|cyber\s+crime\s+branch|customs\s+officer)\b', 'Digital Arrest Impersonation', 'Fake police/CBI video calls claiming your identity was used in illegal narcotics/money laundering.')
]

APK_PATTERNS = [
    (r'\.apk\b', 'Malicious Android APK Lure', 'Requests to download an APK file outside Google Play Store often install Remote Access Trojans (RAT) that steal OTPs.'),
    (r'\b(anydesk|teamviewer|rustdesk|quicksupport)\b', 'Remote Desktop Software Coercion', 'Scammers instruct victims to install remote viewing apps to take complete control of their mobile screen and banking apps.')
]

def analyze_message_content(text: str) -> dict:
    if not text or not text.strip():
        return {
            'risk_level': 'Unknown',
            'score': 0,
            'summary': 'Empty message provided.',
            'red_flags': [],
            'extracted_urls': [],
            'recommendations': [],
            'disclaimer': 'Automated heuristics can make mistakes. Always verify independently.'
        }

    raw_text = text.strip()
    lower_text = raw_text.lower()
    red_flags = []
    score = 0

    # 1. Check for Urgency
    for pattern, flag_name, desc in URGENCY_PATTERNS:
        match = re.search(pattern, lower_text)
        if match:
            score += 25
            red_flags.append({
                'type': flag_name,
                'matched_text': match.group(0),
                'severity': 'High',
                'explanation': desc
            })
            break

    # 2. Check for Credential / Financial Requests
    for pattern, flag_name, desc in CREDENTIAL_PATTERNS:
        match = re.search(pattern, lower_text)
        if match:
            score += 35
            red_flags.append({
                'type': flag_name,
                'matched_text': match.group(0),
                'severity': 'Critical',
                'explanation': desc
            })

    # 3. Check for Impersonation
    for pattern, flag_name, desc in IMPERSONATION_PATTERNS:
        match = re.search(pattern, lower_text)
        if match:
            score += 20
            red_flags.append({
                'type': flag_name,
                'matched_text': match.group(0),
                'severity': 'Medium',
                'explanation': desc
            })
            break

    # 4. Check for APK or Remote Access software
    for pattern, flag_name, desc in APK_PATTERNS:
        match = re.search(pattern, lower_text)
        if match:
            score += 40
            red_flags.append({
                'type': flag_name,
                'matched_text': match.group(0),
                'severity': 'Critical',
                'explanation': desc
            })
            break

    # 5. Extract URLs
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    found_urls = re.findall(url_pattern, raw_text)
    if found_urls:
        score += 15
        red_flags.append({
            'type': 'Embedded Hyperlinks Detected',
            'matched_text': ', '.join(found_urls[:2]),
            'severity': 'Medium',
            'explanation': 'Unsolicited links in messages are the #1 delivery mechanism for phishing pages and malware.'
        })

    # Calculate Verdict
    final_score = min(score, 100)
    if final_score >= 60:
        risk_level = 'High Risk (Likely Scam)'
        badge_color = '#FF3038'
    elif final_score >= 30:
        risk_level = 'Moderate Suspicion'
        badge_color = '#FFAA00'
    else:
        risk_level = 'Low Risk'
        badge_color = '#00FF66'

    # Recommendations
    recommendations = [
        'NEVER share OTP, UPI PIN, or passwords with anyone over phone, SMS, or WhatsApp.',
        'Do not click on links sent from unknown numbers.',
        'Never install APK files or remote control apps (AnyDesk, QuickSupport) at the instruction of a caller.',
        'If claiming to be a bank or police officer, disconnect and contact the official helpline directly.',
        'In India, report fraud immediately to 1930 or visit cybercrime.gov.in.'
    ]

    return {
        'risk_level': risk_level,
        'badge_color': badge_color,
        'score': final_score,
        'red_flags_count': len(red_flags),
        'red_flags': red_flags,
        'extracted_urls': found_urls,
        'recommendations': recommendations,
        'disclaimer': 'Note: Automated analysis provides educational heuristics and may occasionally yield false positives or false negatives. Exercise caution with any unsolicited communication.'
    }
