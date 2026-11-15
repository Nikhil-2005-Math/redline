import re
import urllib.parse
import idna
import requests

# Common high-risk keywords used in phishing attacks
SUSPICIOUS_KEYWORDS = [
    'login', 'signin', 'verify', 'account', 'banking', 'secure', 'update',
    'confirm', 'password', 'credential', 'wallet', 'crypto', 'support',
    'auth', 'billing', 'invoice', 'free-gift', 'claim', 'kyc-update',
    'pan-card', 'aadhaar', 'lottery', 'reward'
]

# TLDs frequently associated with disposable/free domains in spam
HIGH_RISK_TLDS = {'.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.work', '.click', '.fit', '.buzz', '.rest', '.quest'}

# Known legitimate domains to cross-check impersonation
POPULAR_BRANDS = {
    'paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook',
    'instagram', 'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'whatsapp'
}

def analyze_url_safety(url_input: str, safe_browsing_key: str = None) -> dict:
    findings = []
    suspicious_score = 0
    clean_url = url_input.strip()

    # Prepend scheme if missing for parsing
    if not clean_url.startswith(('http://', 'https://')):
        clean_url = 'http://' + clean_url

    try:
        parsed = urllib.parse.urlparse(clean_url)
    except Exception as e:
        return {
            'status': 'Unable to verify',
            'verdict_code': 'INVALID_FORMAT',
            'summary': f'Invalid URL structure: {str(e)}',
            'score': 100,
            'findings': ['Malformed URL syntax entered.'],
            'safe_browsing_checked': False,
            'disclaimer': 'Never label an unchecked website as completely safe.'
        }

    hostname = parsed.hostname or ''
    scheme = parsed.scheme.lower()
    path = parsed.path or ''
    query = parsed.query or ''

    # 1. Scheme Check
    if scheme == 'http':
        suspicious_score += 25
        findings.append({
            'severity': 'Medium',
            'type': 'Unencrypted Connection (HTTP)',
            'description': 'The URL uses unencrypted HTTP. Data entered on this website (passwords, card details) can be intercepted by anyone on the network.'
        })
    elif scheme == 'https':
        findings.append({
            'severity': 'Info',
            'type': 'Encrypted Connection (HTTPS)',
            'description': 'The URL uses HTTPS encryption for in-transit data. Note: Phishing sites can also have HTTPS certificates, so HTTPS alone does not guarantee legitimacy.'
        })

    # 2. IP Address in Hostname
    ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
    if re.match(ip_pattern, hostname):
        suspicious_score += 45
        findings.append({
            'severity': 'High',
            'type': 'Direct IP Address Hostname',
            'description': 'Legitimate organizations rarely use raw IP addresses in public URLs. Attackers use this to evade domain-based reputation blocks.'
        })

    # 3. Punycode / Homograph Attack Detection
    try:
        ascii_domain = idna.encode(hostname).decode('ascii')
        if ascii_domain.startswith('xn--') or 'xn--' in ascii_domain:
            suspicious_score += 50
            findings.append({
                'severity': 'High',
                'type': 'Punycode / Homograph Deception Detected',
                'description': f'Domain uses Punycode ({ascii_domain}). Attackers use identical-looking Unicode characters from foreign alphabets (e.g., Cyrillic "а" instead of Latin "a") to spoof legitimate brand names.'
            })
    except Exception:
        pass

    # 4. Brand Impersonation / Deceptive Subdomain Stacking
    parts = hostname.split('.')
    for brand in POPULAR_BRANDS:
        # Check if brand is in subdomain while main domain is different
        if brand in hostname:
            # Check if domain ends with legitimate brand domain
            is_legit_domain = hostname == f"{brand}.com" or hostname.endswith(f".{brand}.com") or hostname.endswith(f".{brand}.co.in")
            if not is_legit_domain:
                suspicious_score += 40
                findings.append({
                    'severity': 'High',
                    'type': f'Brand Impersonation Target: {brand.upper()}',
                    'description': f'The name "{brand}" appears in the URL, but the actual root domain appears to be different. This is a classic tactic used in credential harvesting.'
                })
                break

    # 5. Excessive Subdomains
    if len(parts) > 4:
        suspicious_score += 20
        findings.append({
            'severity': 'Medium',
            'type': 'Suspicious Subdomain Stacking',
            'description': f'URL contains {len(parts)} domain segments. Attackers frequently chain subdomains to push the real domain off-screen on mobile screens.'
        })

    # 6. High-Risk TLD Check
    for tld in HIGH_RISK_TLDS:
        if hostname.endswith(tld):
            suspicious_score += 25
            findings.append({
                'severity': 'Medium',
                'type': f'High-Risk Top Level Domain ({tld})',
                'description': f'The domain uses the {tld} extension, which is statistically associated with a high volume of disposable phishing and spam campaigns.'
            })
            break

    # 7. Suspicious Keywords in Path or Hostname
    found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in (hostname + path + query).lower()]
    if len(found_keywords) >= 2:
        suspicious_score += 25
        findings.append({
            'severity': 'Medium',
            'type': 'Multiple Phishing Triggers Found',
            'description': f'Detected high-risk security trigger words in URL: {", ".join(found_keywords)}.'
        })

    # 8. External Threat Intelligence (Google Safe Browsing) if key provided
    safe_browsing_checked = False
    safe_browsing_flagged = False
    if safe_browsing_key:
        try:
            sb_endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={safe_browsing_key}"
            payload = {
                "client": {"clientId": "redline-security", "clientVersion": "1.0.0"},
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": clean_url}]
                }
            }
            res = requests.post(sb_endpoint, json=payload, timeout=4)
            safe_browsing_checked = True
            if res.status_code == 200:
                data = res.json()
                if data.get('matches'):
                    safe_browsing_flagged = True
                    suspicious_score = 100
                    findings.insert(0, {
                        'severity': 'Critical',
                        'type': 'Google Safe Browsing Match',
                        'description': f'Identified as a malicious threat: {data["matches"][0].get("threatType")}'
                    })
        except Exception:
            safe_browsing_checked = False

    # Determine Verdict
    if safe_browsing_flagged or suspicious_score >= 70:
        status = 'Known Threat Reported' if safe_browsing_flagged else 'Suspicious Indicators Found'
        risk_level = 'High Risk'
    elif suspicious_score >= 35:
        status = 'Suspicious Indicators Found'
        risk_level = 'Moderate Risk'
    else:
        status = 'No Known Threat Detected'
        risk_level = 'Low Risk'

    return {
        'url': clean_url,
        'hostname': hostname,
        'scheme': scheme,
        'status': status,
        'risk_level': risk_level,
        'score': min(suspicious_score, 100),
        'findings': findings,
        'safe_browsing_checked': safe_browsing_checked,
        'disclaimer': 'IMPORTANT: "No Known Threat Detected" means no heuristic or blacklist flag was triggered. It does not certify an unchecked website as safe. Never enter sensitive passwords or banking credentials on unfamiliar websites.'
    }
