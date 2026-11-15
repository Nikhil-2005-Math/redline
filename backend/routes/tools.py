from flask import Blueprint, request, jsonify, current_app
from database import db
from models import SecurityTool
from services.url_checker import analyze_url_safety
from services.message_analyzer import analyze_message_content
import re

tools_bp = Blueprint('tools', __name__)

@tools_bp.route('', methods=['GET'])
def get_tools_list():
    tools = SecurityTool.query.all()
    return jsonify({
        'tools': [t.to_dict() for t in tools]
    }), 200

@tools_bp.route('/analyze-url', methods=['POST'])
def analyze_url():
    data = request.get_json() or {}
    url = data.get('url', '').strip()
    if not url:
        return jsonify({'error': 'Please provide a URL to analyze.'}), 400

    api_key = current_app.config.get('SAFE_BROWSING_API_KEY')
    result = analyze_url_safety(url, safe_browsing_key=api_key)
    return jsonify(result), 200

@tools_bp.route('/analyze-message', methods=['POST'])
def analyze_message():
    data = request.get_json() or {}
    message_text = data.get('message', '').strip()
    if not message_text:
        return jsonify({'error': 'Please paste a message, SMS, or email body to analyze.'}), 400

    result = analyze_message_content(message_text)
    return jsonify(result), 200

@tools_bp.route('/inspect-email-headers', methods=['POST'])
def inspect_email_headers():
    data = request.get_json() or {}
    headers_raw = data.get('headers', '').strip()
    if not headers_raw:
        return jsonify({'error': 'Please provide raw email headers to inspect.'}), 400

    findings = []
    risk_score = 0

    # Extract From header
    from_match = re.search(r'From:\s*(.*?)(?:\r?\n|$)', headers_raw, re.IGNORECASE)
    from_val = from_match.group(1).strip() if from_match else 'Not Found'

    # Extract Reply-To header
    reply_match = re.search(r'Reply-To:\s*(.*?)(?:\r?\n|$)', headers_raw, re.IGNORECASE)
    reply_val = reply_match.group(1).strip() if reply_match else 'Matches From (Default)'

    # Extract Authentication Results (SPF, DKIM, DMARC)
    auth_match = re.search(r'Authentication-Results:\s*(.*?)(?:\r?\n[^\t\s]|$)', headers_raw, re.IGNORECASE | re.DOTALL)
    auth_val = auth_match.group(1).strip() if auth_match else ''

    # Check SPF
    spf_pass = 'spf=pass' in headers_raw.lower()
    spf_fail = 'spf=fail' in headers_raw.lower() or 'spf=softfail' in headers_raw.lower()

    # Check DKIM
    dkim_pass = 'dkim=pass' in headers_raw.lower()
    dkim_fail = 'dkim=fail' in headers_raw.lower()

    # Check DMARC
    dmarc_pass = 'dmarc=pass' in headers_raw.lower()
    dmarc_fail = 'dmarc=fail' in headers_raw.lower()

    if reply_match and from_match:
        from_email = re.findall(r'[\w\.-]+@[\w\.-]+', from_val)
        reply_email = re.findall(r'[\w\.-]+@[\w\.-]+', reply_val)
        if from_email and reply_email and from_email[0].lower() != reply_email[0].lower():
            risk_score += 40
            findings.append({
                'severity': 'High',
                'title': 'Reply-To Address Mismatch Detected',
                'description': f'The email claims to be From "{from_email[0]}", but replies are directed to a completely different address: "{reply_email[0]}". This is a classic tactic used in CEO fraud and phishing.'
            })

    if spf_fail:
        risk_score += 35
        findings.append({
            'severity': 'High',
            'title': 'SPF (Sender Policy Framework) Failed',
            'description': 'The sending server IP is not authorized in the sender domain DNS SPF records. The email may have been spoofed.'
        })
    elif spf_pass:
        findings.append({
            'severity': 'Info',
            'title': 'SPF Verification Passed',
            'description': 'The sender IP is authorized by the domain DNS records.'
        })

    if dkim_fail:
        risk_score += 35
        findings.append({
            'severity': 'High',
            'title': 'DKIM (DomainKeys Identified Mail) Failed',
            'description': 'The cryptographic digital signature on this email is invalid or has been modified in transit.'
        })
    elif dkim_pass:
        findings.append({
            'severity': 'Info',
            'title': 'DKIM Verification Passed',
            'description': 'The email contains a valid cryptographic signature confirming it was not altered in transit.'
        })

    if dmarc_fail:
        risk_score += 30
        findings.append({
            'severity': 'Critical',
            'title': 'DMARC Alignment Check Failed',
            'description': 'The message failed DMARC policy alignment, indicating a high likelihood of domain spoofing.'
        })

    verdict = 'High Risk of Spoofing' if risk_score >= 50 else ('Moderate Caution' if risk_score >= 25 else 'Headers Appear Consistent')

    return jsonify({
        'from_header': from_val,
        'reply_to_header': reply_val,
        'spf_status': 'PASS' if spf_pass else ('FAIL' if spf_fail else 'NEUTRAL / UNKNOWN'),
        'dkim_status': 'PASS' if dkim_pass else ('FAIL' if dkim_fail else 'NEUTRAL / UNKNOWN'),
        'dmarc_status': 'PASS' if dmarc_pass else ('FAIL' if dmarc_fail else 'NEUTRAL / UNKNOWN'),
        'risk_score': min(risk_score, 100),
        'verdict': verdict,
        'findings': findings
    }), 200
