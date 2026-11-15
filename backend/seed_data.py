import json
from database import db
from models import ThreatCategory, Threat, SecurityTool, QuizQuestion, CyberAlert, LearningModule

def seed_database():
    # Only seed if categories table is empty
    if ThreatCategory.query.first():
        return

    print("[*] Seeding REDLINE Cybersecurity Database...")

    # 1. Threat Categories
    categories_data = [
        {
            'slug': 'social-engineering',
            'name': 'Social Engineering',
            'description': 'Psychological manipulation tactics that trick people into revealing confidential credentials, making fraudulent payments, or compromising security.',
            'icon': 'Users',
            'display_order': 1
        },
        {
            'slug': 'malware',
            'name': 'Malware & Malicious Code',
            'description': 'Hostile software programs designed to damage, infiltrate, spy on, or extort devices, networks, and confidential data.',
            'icon': 'Bug',
            'display_order': 2
        },
        {
            'slug': 'privacy-surveillance',
            'name': 'Privacy & Surveillance Risks',
            'description': 'Unauthorized tracking, microphone and camera intrusions, excessive app permissions, and digital surveillance vectors.',
            'icon': 'EyeOff',
            'display_order': 3
        },
        {
            'slug': 'account-security',
            'name': 'Account & Identity Security',
            'description': 'Attacks targeting credentials, multi-factor tokens, session cookies, and authentication systems.',
            'icon': 'Key',
            'display_order': 4
        },
        {
            'slug': 'network-security',
            'name': 'Network & Wi-Fi Threats',
            'description': 'Vulnerabilities in public networks, rogue access points, interception attacks, and router exposures.',
            'icon': 'WifiOff',
            'display_order': 5
        },
        {
            'slug': 'financial-scams',
            'name': 'Financial & Online Scams',
            'description': 'Fraudulent schemes targeting UPI, banking apps, online marketplaces, job seekers, and digital payment systems.',
            'icon': 'CreditCard',
            'display_order': 6
        },
        {
            'slug': 'emerging-threats',
            'name': 'Emerging & AI Threats',
            'description': 'Next-generation attack vectors driven by synthetic media, deepfakes, AI voice cloning, and browser extensions.',
            'icon': 'Cpu',
            'display_order': 7
        }
    ]

    cat_map = {}
    for c in categories_data:
        cat = ThreatCategory(
            slug=c['slug'],
            name=c['name'],
            description=c['description'],
            icon=c['icon'],
            display_order=c['display_order']
        )
        db.session.add(cat)
        db.session.flush()
        cat_map[c['slug']] = cat.id

    # 2. Comprehensive Threat Library (35+ Detailed Threats with 10 structured sections each)
    threats_data = [
        # --- Social Engineering ---
        {
            'category_slug': 'social-engineering',
            'slug': 'phishing',
            'name': 'Phishing',
            'short_desc': 'Deceptive emails and fake portals mimicking trusted services to steal logins and credit card details.',
            'risk_category': 'Critical',
            'difficulty': 'Beginner',
            'icon': 'MailWarning',
            'content': {
                'what_is': 'Phishing is the most widespread social engineering attack where cybercriminals impersonate reputable organizations (banks, streaming services, tech platforms) to deceive recipients into handing over sensitive credentials or financial information.',
                'how_it_works': 'Attackers craft emails or web portals matching the exact branding, typography, and logos of a recognized organization. The message usually creates artificial urgency ("Account suspended in 2 hours") and embeds a link leading to a lookalike fake portal controlled by the attacker.',
                'real_world_examples': [
                    'An email appearing to be from Netflix claiming payment failure and prompting you to update your credit card on a fake netflx-secure.com domain.',
                    'A message appearing to be from your corporate IT helpdesk requesting an emergency password reset to avoid account lockout.'
                ],
                'warning_signs': [
                    'Generic greetings like "Dear Customer" instead of your actual name.',
                    'Urgent, threatening, or fear-inducing deadlines.',
                    'Mismatched domain in the sender email (e.g., support@paypal-notification-alert.com instead of paypal.com).',
                    'Suspicious URLs with typos, hyphens, or unusual domain endings.'
                ],
                'who_affected': 'All internet users, especially students, busy professionals, and seniors who browse email quickly on mobile devices.',
                'consequences': 'Compromised email accounts, unauthorized bank withdrawals, identity theft, and corporate network intrusion.',
                'prevention': [
                    'Never click login links in unsolicited emails. Navigate to the service directly via your bookmarks or address bar.',
                    'Always inspect the actual sender email address, not just the displayed name.',
                    'Enable Hardware Security Keys or Authenticator App-based Multi-Factor Authentication (2FA).',
                    'Inspect links using REDLINE URL Safety Checker before visiting.'
                ],
                'what_to_do': [
                    'Immediately change your account password from a known safe device.',
                    'Revoke active login sessions from account security settings.',
                    'If financial details were entered, immediately call your bank or freeze the card in your banking app.',
                    'In India, report to 1930 and file a report at cybercrime.gov.in.'
                ],
                'related_threats': ['spear-phishing', 'smishing', 'credential-stuffing', 'business-email-compromise'],
                'quiz': [
                    {
                        'question': 'Which indicator is the most reliable sign of an email phishing attempt?',
                        'options': ['The email contains colorful images', 'The sender domain does not match the official organization domain', 'The email was received on a weekend', 'The email has a footer disclaimer'],
                        'correct_index': 1,
                        'explanation': 'Examining the actual RFC sender domain in the header reveals whether the email originated from the legitimate organization or an attacker domain.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'spear-phishing',
            'name': 'Spear Phishing',
            'short_desc': 'Highly targeted, personalized phishing attacks customized using reconnaissance on the victim.',
            'risk_category': 'Critical',
            'difficulty': 'Intermediate',
            'icon': 'Target',
            'content': {
                'what_is': 'Spear phishing is a customized, highly targeted variant of phishing. Unlike generic mass phishing, the attacker researches the specific victim using social media, LinkedIn, or past leaks to build convincing, tailored pretexts.',
                'how_it_works': 'Attackers gather personal details such as employer name, colleagues, recent purchases, or academic projects. They send an email that mentions specific projects or managers, making the request appear completely legitimate.',
                'real_world_examples': [
                    'An email addressed to an accounts manager containing an "updated vendor invoice" matching the current construction supplier of the firm.',
                    'A college student receiving an email from a fake professor asking them to review a PDF assignment link.'
                ],
                'warning_signs': [
                    'Unexpected requests to bypass normal corporate payment or authorization procedures.',
                    'Pressure to keep the communication confidential or offline.',
                    'Sender using personal Gmail/Yahoo addresses while claiming to represent senior staff.'
                ],
                'who_affected': 'Finance executives, HR personnel, IT administrators, students, and employees with access to sensitive funds or databases.',
                'consequences': 'Catastrophic corporate financial losses, confidential intellectual property theft, and long-term network compromise.',
                'prevention': [
                    'Verify unusual or sensitive financial requests via a secondary communication channel (phone call or in person).',
                    'Limit oversharing of organizational hierarchies and project timelines on public social media.',
                    'Implement strict multi-person authorization protocols for wire transfers.'
                ],
                'what_to_do': [
                    'Alert your organization’s Information Security / IT incident response team immediately.',
                    'Preserve full email headers (RFC 5322) as evidence for forensic analysis.',
                    'Isolate any device that opened attachments from the internal network.'
                ],
                'related_threats': ['phishing', 'business-email-compromise', 'pretexting'],
                'quiz': [
                    {
                        'question': 'How does spear phishing differ from ordinary mass phishing?',
                        'options': ['Spear phishing only uses SMS', 'Spear phishing is tailored with specific personal details about the victim', 'Spear phishing never contains links', 'Spear phishing is conducted only by governments'],
                        'correct_index': 1,
                        'explanation': 'Spear phishing uses detailed intelligence gathered on the victim to make the attack personalized and highly convincing.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'smishing',
            'name': 'Smishing (SMS Phishing)',
            'short_desc': 'Fraudulent SMS text messages with deceptive links claiming urgent bank blockages or package deliveries.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'MessageSquareWarning',
            'content': {
                'what_is': 'Smishing is phishing carried out over Short Message Service (SMS) text messages. Attackers prey on the high trust and fast response rates of mobile phone users.',
                'how_it_works': 'Users receive a brief SMS claiming their bank account, PAN card, or electricity connection is about to be terminated. The SMS includes a shortened or misspelled link leading to a credential-harvesting mobile page.',
                'real_world_examples': [
                    '"Dear Customer, your electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately contact officer at 98765xxxxx."',
                    '"Your SBI Account has been blocked due to unverified PAN. Click here to update KYC: bit.ly/sbi-pan-kyc"'
                ],
                'warning_signs': [
                    'Sent from regular 10-digit mobile numbers instead of registered company sender IDs (e.g. VK-SBIINB).',
                    'Extremely short deadlines (e.g., "within 30 minutes").',
                    'Shortened links (bit.ly, tinyurl) or misspelled bank URLs.',
                    'Poor grammar, spelling mistakes, or strange punctuation.'
                ],
                'who_affected': 'Mobile smartphone users, elderly citizens, and individuals awaiting courier parcels or bill payments.',
                'consequences': 'Unauthorized bank debits, SIM hijacking, installation of remote monitoring APKs.',
                'prevention': [
                    'Never tap on links sent in SMS from unfamiliar numbers.',
                    'Banks in India always use official SMS Sender IDs (6 characters, ending with bank name).',
                    'Use the REDLINE Suspicious Message Analyzer before taking action.'
                ],
                'what_to_do': [
                    'Do not click the link or call the number provided in the SMS.',
                    'Report the SMS as spam/phishing in your phone’s default messaging app.',
                    'If you shared your bank details or OTP, contact your bank immediately and dial 1930.'
                ],
                'related_threats': ['vishing', 'phishing', 'upi-scams'],
                'quiz': [
                    {
                        'question': 'What is a dead giveaway that an SMS claiming to be from your bank is fraudulent?',
                        'options': ['It asks you to visit the bank branch', 'It comes from a regular 10-digit phone number and threatens account suspension', 'It provides a toll-free customer care number', 'It is delivered during business hours'],
                        'correct_index': 1,
                        'explanation': 'Official bank notifications in India are sent via registered 6-character Alpha-numeric sender headers, never individual personal 10-digit numbers.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'vishing',
            'name': 'Vishing (Voice Phishing)',
            'short_desc': 'Phone call fraud where scammers impersonate bank managers, credit card agents, or telecom representatives.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'PhoneCall',
            'content': {
                'what_is': 'Vishing is phone-based social engineering where attackers use voice calls and phone number spoofing to deceive victims into disclosing OTPs, credit card numbers, or installing remote access apps.',
                'how_it_works': 'The scammer calls claiming to be from your bank’s fraud division, telecom provider, or credit card reward program. They claim an unauthorized charge was detected and that they need your OTP or card CVV to "cancel the fraudulent charge".',
                'real_world_examples': [
                    'A caller claiming your SIM card will be deactivated unless you read out the 6-digit porting OTP sent to your phone.',
                    'A caller claiming you have ₹8,500 in reward points expiring today that can be converted to cash in your bank account.'
                ],
                'warning_signs': [
                    'High-pressure insistence that you must not disconnect the call.',
                    'Requesting OTP, debit card expiry, or CVV code.',
                    'Asking you to install remote support applications like AnyDesk or TeamViewer.',
                    'Background sounds imitating call centers or police control rooms.'
                ],
                'who_affected': 'Seniors, non-technical internet users, and credit card holders.',
                'consequences': 'Complete bank account drain, identity compromise, and unauthorized loan issuance.',
                'prevention': [
                    'Remember: No genuine bank employee will ever ask for your OTP or UPI PIN under any circumstance.',
                    'Hang up immediately if an unsolicited caller mentions OTPs or account blockages.',
                    'Verify independently by calling the official customer service number printed on the back of your debit/credit card.'
                ],
                'what_to_do': [
                    'Immediately disconnect the call.',
                    'If OTP was revealed, call your bank customer care immediately to freeze internet banking and UPI.',
                    'File an official incident report on the 1930 Cyber helpline.'
                ],
                'related_threats': ['smishing', 'digital-arrest-scams', 'impersonation-scams'],
                'quiz': [
                    {
                        'question': 'When is it safe to share your One-Time Password (OTP) over a phone call?',
                        'options': ['When the caller claims to be the bank manager', 'When they are canceling a fraudulent charge', 'NEVER under any circumstance', 'When they verify your date of birth'],
                        'correct_index': 2,
                        'explanation': 'OTPs are private authentication tokens designed exclusively for you. No legitimate bank, police officer, or organization will ever ask for your OTP.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'pretexting',
            'name': 'Pretexting',
            'short_desc': 'Creating an elaborate fabricated scenario to manipulate a victim into surrendering private data.',
            'risk_category': 'High',
            'difficulty': 'Intermediate',
            'icon': 'FileQuestion',
            'content': {
                'what_is': 'Pretexting is a social engineering technique where the attacker establishes a fictitious scenario or identity (a pretext) to gain the target’s trust and extract confidential records or access privileges.',
                'how_it_works': 'The attacker invents a credible backstory (e.g. an auditor doing an IT security compliance check, an insurance agent following up on a hospital claim, or a law enforcement detective). They use this fabricated pretext to request personal identification or employee credentials.',
                'real_world_examples': [
                    'An attacker calling an IT support desk pretending to be a remote field employee who lost their phone and urgently needs a password reset.',
                    'A fraudster posing as an HR payroll auditor asking employees to verify their Aadhaar and bank details for salary disbursement.'
                ],
                'warning_signs': [
                    'The caller claims urgent compliance or legal necessity but requests sensitive data over informal channels.',
                    'Reluctance to have you call them back through their company’s official switchboard.',
                    'Unusual knowledge of minor company details designed to make them sound legitimate.'
                ],
                'who_affected': 'Corporate employees, helpdesk operators, healthcare receptionists, and university administrators.',
                'consequences': 'Unauthorized disclosure of internal documents, customer privacy breaches, and privilege escalation.',
                'prevention': [
                    'Always verify the identity of callers requesting confidential data by calling back via verified official directory numbers.',
                    'Enforce strict verification protocols for password resets and employee credential modifications.',
                    'Train frontline staff on social engineering defense.'
                ],
                'what_to_do': [
                    'Document the details of the communication (phone number, name claimed, pretext used).',
                    'Report the incident to the corporate security officer or DPO.',
                    'Notify affected departments to watch for suspicious access requests.'
                ],
                'related_threats': ['impersonation-scams', 'spear-phishing', 'vishing'],
                'quiz': [
                    {
                        'question': 'What is the core defining characteristic of pretexting?',
                        'options': ['Encrypting user files for ransom', 'Inventing an elaborate fictitious scenario to build trust and obtain data', 'Cracking Wi-Fi WPA2 passwords', 'Sending automated malware via USB'],
                        'correct_index': 1,
                        'explanation': 'Pretexting relies on building an elaborate fictional backstory to deceive victims into handing over information willingly.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'baiting',
            'name': 'Baiting',
            'short_desc': 'Luring victims with attractive promises such as free movie downloads, prizes, or infected USB drives.',
            'risk_category': 'Medium',
            'difficulty': 'Beginner',
            'icon': 'Gift',
            'content': {
                'what_is': 'Baiting relies on human greed or natural curiosity. Attackers dangle an irresistible hook—such as free software, pirated media, or a physical USB drive labelled "Confidential Executive Salaries"—to induce victims into installing malware.',
                'how_it_works': 'In the physical world, attackers scatter infected USB drives in parking lots or lobbies. When a curious person inserts it into their PC, an autorun script or hidden malicious executable deploys. Digitally, baiting occurs via pirate streaming links, cheat engines, or free gift cards.',
                'real_world_examples': [
                    'Finding an unmarked USB flash drive in a company lobby labelled "Confidential Q4 Salary Reviews" and plugging it into an office PC.',
                    'Downloading a "Free GTA 6 Game Setup" from a random forum that is actually a keylogger and info-stealer.'
                ],
                'warning_signs': [
                    '"Too good to be true" offers (expensive software or games offered for free).',
                    'Unattended physical storage devices found in public spaces.',
                    'Download sites requiring you to disable Windows Defender before running the installer.'
                ],
                'who_affected': 'Gamers, college students looking for free textbooks or cracked software, and office workers.',
                'consequences': 'Remote Access Trojan (RAT) infections, webcam hijacking, and crypto-mining malware.',
                'prevention': [
                    'NEVER plug an unknown USB drive into any computer you value.',
                    'Only download software from verified official repositories and app stores.',
                    'Keep endpoint antivirus real-time scanning active at all times.'
                ],
                'what_to_do': [
                    'If a strange USB was inserted, immediately disconnect the computer from the network.',
                    'Run a comprehensive offline antivirus scan.',
                    'Format the external media securely using a dedicated hardware-isolated sandbox.'
                ],
                'related_threats': ['trojans', 'spyware', 'social-engineering'],
                'quiz': [
                    {
                        'question': 'You find a USB flash drive labelled "Executive Bonuses 2026" in the office cafeteria. What is the safest action?',
                        'options': ['Plug it into your laptop to find the owner', 'Plug it into a colleague\'s computer', 'Turn it over to the corporate IT security team without plugging it in', 'Format it immediately on your home PC'],
                        'correct_index': 2,
                        'explanation': 'Unknown USB devices can deliver lethal malware or USB-killer electrical charges. Always hand them over to security personnel without connecting them.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'impersonation-scams',
            'name': 'Impersonation Scams',
            'short_desc': 'Fraudsters posing as police officers, tax officials, tech support representatives, or trusted friends.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'UserCheck',
            'content': {
                'what_is': 'Impersonation scams occur when a malicious party assumes the persona of an authority figure, reputable business, or trusted family member to manipulate the victim into complying with urgent financial demands.',
                'how_it_works': 'Using cloned social media profiles, spoofed caller IDs, or fabricated badges, scammers pretend to be government regulators, bank officials, or a distressed relative stranded in another city who needs immediate emergency funds.',
                'real_world_examples': [
                    'Receiving a WhatsApp message from a profile using your friend’s photo saying: "My phone fell in water, this is my temporary number, please GPay ₹10,000 urgently for hospital bills."',
                    'A caller pretending to be from Microsoft Windows Support stating your PC is transmitting malicious viruses across the country.'
                ],
                'warning_signs': [
                    'Sudden crisis requiring emergency money transfers via UPI, cryptocurrency, or gift cards.',
                    'Requests to keep the transfer secret from other family members.',
                    'New, unfamiliar phone number claiming to belong to a known contact.'
                ],
                'who_affected': 'Parents, grandparents, retail banking customers, and WhatsApp users.',
                'consequences': 'Severe monetary fraud, psychological distress, and disclosure of personal documents.',
                'prevention': [
                    'Always verify emergency requests by calling the known official phone number of your relative or friend.',
                    'Establish a secret family "safe word" for verifying genuine distress situations.',
                    'Never trust caller ID display names, as caller ID can be spoofed using VOIP tools.'
                ],
                'what_to_do': [
                    'Call your friend or relative on their original verified phone number to confirm.',
                    'Report the imposter WhatsApp/social account to the platform and local cyber cell.',
                    'If money was transferred, call 1930 immediately.'
                ],
                'related_threats': ['vishing', 'digital-arrest-scams', 'deepfake-scams'],
                'quiz': [
                    {
                        'question': 'Your cousin texts you from a new number asking for an emergency UPI transfer of ₹15,000. What is your first step?',
                        'options': ['Transfer the money immediately to show family loyalty', 'Call your cousin on their original, known phone number to verify', 'Ask for their bank IFSC code', 'Forward the message to your parents'],
                        'correct_index': 1,
                        'explanation': 'Always establish out-of-band verification by calling the person directly on their established contact number before sending money.'
                    }
                ]
            }
        },
        {
            'category_slug': 'social-engineering',
            'slug': 'business-email-compromise',
            'name': 'Business Email Compromise (BEC)',
            'short_desc': 'Sophisticated attacks targeting corporate accounts to divert million-dollar wire transfers to criminal accounts.',
            'risk_category': 'Critical',
            'difficulty': 'Advanced',
            'icon': 'Briefcase',
            'content': {
                'what_is': 'Business Email Compromise (BEC) is a high-stakes scam where criminals compromise or spoof legitimate corporate email accounts to trick finance departments or clients into wiring funds to fraudulent accounts.',
                'how_it_works': 'Attackers use phishing or credential stuffing to gain access to a CEO, CFO, or vendor email account. They silently monitor email threads for upcoming transactions. When an invoice is due, they step in and instruct the finance officer that "our banking details have changed due to an annual audit, wire the funds to this new account instead."',
                'real_world_examples': [
                    'A supplier email account gets hacked. The scammer sends a revised invoice with updated bank details for a scheduled ₹40,00,000 vendor payment.',
                    'An email pretending to be from the CEO requesting an urgent, discreet wire transfer to complete an acquisition.'
                ],
                'warning_signs': [
                    'Last-minute changes to vendor banking details or beneficiary account numbers.',
                    'Urgent instructions to bypass normal dual-signoff payment controls.',
                    'Slightly altered domain names (e.g. `company-finance.com` instead of `company.com`).'
                ],
                'who_affected': 'Accounts payable departments, small-to-medium businesses, law firms, and real estate buyers.',
                'consequences': 'Devastating financial loss often running into millions, legal liabilities, and reputational damage.',
                'prevention': [
                    'Establish a mandatory voice callback protocol: Call the known vendor contact to verify any bank detail modification.',
                    'Enforce multi-factor authentication (MFA) on all corporate email accounts.',
                    'Set up DMARC, DKIM, and SPF security records on company email domains.'
                ],
                'what_to_do': [
                    'Immediately contact your bank’s wire fraud unit to recall the funds.',
                    'Contact the beneficiary bank to freeze the recipient account.',
                    'Notify law enforcement (Cyber Crime Cell) immediately; the first 24 hours are critical.'
                ],
                'related_threats': ['spear-phishing', 'phishing', 'account-takeover'],
                'quiz': [
                    {
                        'question': 'What is the most effective policy for preventing Business Email Compromise (BEC) wire fraud?',
                        'options': ['Always trust emails marked "Urgent"', 'Requiring out-of-band verbal confirmation via a pre-established phone number for any bank account changes', 'Only using email for wire transfers', 'Disabling spam filters'],
                        'correct_index': 1,
                        'explanation': 'Verbal confirmation through an established secondary channel completely neutralizes compromised or spoofed email instructions.'
                    }
                ]
            }
        },

        # --- Malware ---
        {
            'category_slug': 'malware',
            'slug': 'ransomware',
            'name': 'Ransomware',
            'short_desc': 'Malware that encrypts your personal files, photos, and databases, demanding payment for the decryption key.',
            'risk_category': 'Critical',
            'difficulty': 'Intermediate',
            'icon': 'Lock',
            'content': {
                'what_is': 'Ransomware is an extortion-based malware that silently encrypts files on infected computers and network drives using unbreakable military-grade cryptography (AES-256 / RSA-4096), demanding a cryptocurrency ransom for the decryption tool.',
                'how_it_works': 'Delivered via malicious email attachments, unpatched vulnerabilities, or pirated game cracks. Once executed, it terminates security processes, encrypts document files (`.docx`, `.pdf`, `.jpg`, `.db`), appends a new file extension, deletes shadow copies, and changes the desktop wallpaper to a ransom note.',
                'real_world_examples': [
                    'WannaCry ransomware infecting over 200,000 systems globally via the EternalBlue SMB exploit.',
                    'A college student downloading a cracked version of Photoshop that encrypts their entire dissertation and personal photo collection.'
                ],
                'warning_signs': [
                    'Sudden high CPU/disk activity and fans running at full speed.',
                    'Files suddenly unable to open and showing strange new extensions like `.locked`, `.crypto`, or `.crypted`.',
                    'A text file or image appearing on your desktop titled `README_DECRYPT_FILES.txt`.'
                ],
                'who_affected': 'Hospitals, schools, corporations, government bodies, and ordinary personal computer users.',
                'consequences': 'Permanent loss of invaluable family memories or critical business data; financial extortion.',
                'prevention': [
                    'Follow the **3-2-1 Backup Rule**: 3 copies of your data, on 2 different media types, with 1 copy stored offline / air-gapped.',
                    'Keep your operating system and software updated with the latest security patches.',
                    'Never download software cracks, keygens, or pirated games.'
                ],
                'what_to_do': [
                    'Immediately disconnect the infected device from Wi-Fi and unplug all ethernet cables to stop lateral network spread.',
                    'Do NOT pay the ransom! Paying funds criminals and does NOT guarantee you will get your data back.',
                    'Check the **No More Ransom Project** (nomoreransom.org) for free public decryption tools developed by security researchers.'
                ],
                'related_threats': ['trojans', 'worms', 'data-breaches'],
                'quiz': [
                    {
                        'question': 'What is the most resilient defense against ransomware file loss?',
                        'options': ['Paying the ransom in cryptocurrency immediately', 'Maintaining regular, verified, offline (air-gapped) backups', 'Renaming all your files to .txt', 'Turning off your computer monitor'],
                        'correct_index': 1,
                        'explanation': 'Offline backups cannot be reached by network-encrypting malware, allowing complete restoration without paying extortionists.'
                    }
                ]
            }
        },
        {
            'category_slug': 'malware',
            'slug': 'spyware',
            'name': 'Spyware & Stalkerware',
            'short_desc': 'Stealthy software that monitors your keystrokes, tracks your GPS location, and covertly activates your microphone.',
            'risk_category': 'Critical',
            'difficulty': 'Intermediate',
            'icon': 'Eye',
            'content': {
                'what_is': 'Spyware is malicious software installed without the user’s knowledge to secretly record keystrokes, monitor visited websites, harvest passwords, capture screen recordings, and track physical location.',
                'how_it_works': 'Often bundled with free utility apps, torrents, or secretly sideloaded onto a phone by an abusive party (stalkerware). It runs in the background with hidden system names, logs activities, and uploads encrypted reports to an attacker server.',
                'real_world_examples': [
                    'Pegasus spyware targeting journalists and activists.',
                    'A spouse or jealous acquaintance installing a hidden "Phone Tracker" APK with accessibility permissions enabled.'
                ],
                'warning_signs': [
                    'Smartphone battery draining unusually fast even when not in use.',
                    'Device feeling warm to the touch while idle.',
                    'Unexpected spikes in mobile data usage.',
                    'Camera/microphone green indicator dots illuminating spontaneously.'
                ],
                'who_affected': 'Smartphone users, individuals in contentious domestic situations, journalists, corporate executives.',
                'consequences': 'Complete violation of personal privacy, identity theft, unauthorized tracking, and credential theft.',
                'prevention': [
                    'Never leave your phone unlocked or allow others unsupervised physical access.',
                    'Check Settings > Apps for unfamiliar apps with device administrator or accessibility privileges.',
                    'Disable "Install apps from Unknown Sources" on Android.'
                ],
                'what_to_do': [
                    'Restart the phone in Safe Mode to isolate third-party apps.',
                    'Review permissions in Android Permission Manager (Camera, Mic, Location).',
                    'In severe cases of stalkerware, perform a clean factory reset after backing up personal photos safely.'
                ],
                'related_threats': ['keyloggers', 'camera-privacy-risks', 'trojans'],
                'quiz': [
                    {
                        'question': 'Which symptom frequently indicates background spyware or stalkerware activity on a mobile phone?',
                        'options': ['Clear screen resolution', 'Unusual battery drain, high idle temperature, and strange data spikes', 'Fast Wi-Fi speed', 'Loud ringtones'],
                        'correct_index': 1,
                        'explanation': 'Continuous background recording, GPS tracking, and data transmission consume significant CPU, power, and bandwidth.'
                    }
                ]
            }
        },
        {
            'category_slug': 'malware',
            'slug': 'trojans',
            'name': 'Trojan Horses',
            'short_desc': 'Deceptive programs disguised as legitimate utilities, games, or document viewers that secretly infect devices.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'ShieldAlert',
            'content': {
                'what_is': 'Named after the mythological Trojan Horse, this malware masquerades as a legitimate, desirable piece of software (e.g. PDF reader, media codec, game mod) to trick the user into installing it.',
                'how_it_works': 'The user downloads an executable file thinking it is a helpful utility. Once launched, the utility may display a fake error message while silently dropping and executing a secondary payload (such as a backdoor, remote access tool, or botnet agent).',
                'real_world_examples': [
                    'Downloading a "WhatsApp Gold" or "Instagram Mod" APK that sends premium SMS messages in the background.',
                    'A cracked Adobe Premiere installer that deploys a crypto-mining program in the background.'
                ],
                'warning_signs': [
                    'Software requiring administrative privileges during installation for no apparent reason.',
                    'Antivirus alerts warning about generic trojan dropper signatures.',
                    'Unrecognized programs appearing in your Startup programs list.'
                ],
                'who_affected': 'Users downloading pirated media, cheats, cracked software, and unofficial app store packages.',
                'consequences': 'Device becomes part of a botnet, personal files stolen, persistent backdoor access for criminals.',
                'prevention': [
                    'Only download software from authorized developers and reputable app stores.',
                    'Verify digital signatures and hashes (SHA-256) of executable files.',
                    'Never disable your antivirus scanner when running an installer.'
                ],
                'what_to_do': [
                    'Run a thorough scan using Windows Security or Malwarebytes.',
                    'Check Task Manager for suspicious processes consuming high memory or GPU.',
                    'Uninstall recent suspicious applications from Safe Mode.'
                ],
                'related_threats': ['viruses', 'ransomware', 'spyware'],
                'quiz': [
                    {
                        'question': 'How does a Trojan horse malware deceive its victims?',
                        'options': ['By disguising itself as legitimate or desirable software', 'By physically breaking your computer screen', 'By sending paper mail to your home', 'By disconnecting your keyboard'],
                        'correct_index': 0,
                        'explanation': 'Trojans rely on disguise—pretending to be useful utilities, games, or updates—so users execute them voluntarily.'
                    }
                ]
            }
        },
        {
            'category_slug': 'malware',
            'slug': 'keyloggers',
            'name': 'Keyloggers',
            'short_desc': 'Hardware or software tools that secretly record every keystroke typed, capturing passwords and messages.',
            'risk_category': 'High',
            'difficulty': 'Intermediate',
            'icon': 'Keyboard',
            'content': {
                'what_is': 'A keylogger is surveillance software (or physical hardware adapter) that logs every keyboard key pressed by the user, effectively intercepting passwords, credit card numbers, confidential chats, and search queries.',
                'how_it_works': 'Software keyloggers hook into the operating system keyboard API or driver stack. Each keypress is recorded with a timestamp and the active application title. At scheduled intervals, the log is transmitted via email or HTTP to the attacker.',
                'real_world_examples': [
                    'Using a public cyber café computer where the previous user or cafe operator installed a keylogger to harvest banking passwords.',
                    'A tiny physical USB passthrough device plugged between the keyboard cable and the back of a desktop computer.'
                ],
                'warning_signs': [
                    'Noticeable delay or lag between pressing a key and the letter appearing on the screen.',
                    'Unknown USB dongles connected between your keyboard and PC chassis.',
                    'Antivirus flagging unauthorized API keyboard hooks.'
                ],
                'who_affected': 'Users of shared or public computers, gaming cafe visitors, corporate workstations.',
                'consequences': 'Total compromise of all accounts typed into the machine, including passwords and recovery questions.',
                'prevention': [
                    'Never log in to personal or banking accounts on public computers or cyber cafes.',
                    'Use password managers with auto-fill (since auto-fill does not trigger physical keypress events).',
                    'Inspect the physical USB connections on unfamiliar computers.'
                ],
                'what_to_do': [
                    'Immediately change all passwords typed on the compromised machine using a separate, secure device.',
                    'Enable Two-Factor Authentication (2FA) with an authenticator app.',
                    'Perform an in-depth antivirus scan or reinstall the operating system.'
                ],
                'related_threats': ['spyware', 'password-attacks', 'credential-stuffing'],
                'quiz': [
                    {
                        'question': 'Why is using a password manager with auto-fill safer against software keyloggers?',
                        'options': ['Password managers change your computer screen', 'Auto-fill injects credentials directly without generating individual physical keystrokes', 'Password managers turn off the internet', 'Auto-fill makes passwords shorter'],
                        'correct_index': 1,
                        'explanation': 'Because keyloggers listen for keyboard input events, programmatic credential injection via a password manager bypasses keystroke logging.'
                    }
                ]
            }
        },

        # --- Privacy & Surveillance ---
        {
            'category_slug': 'privacy-surveillance',
            'slug': 'camera-privacy-risks',
            'name': 'Camera Privacy & Camfecting',
            'short_desc': 'Unauthorized activation and covert recording using laptop, smartphone, or tablet webcams.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'Camera',
            'content': {
                'what_is': 'Camfecting is the unauthorized remote activation and surveillance of a victim’s webcam or smartphone camera without their consent or knowledge, often for blackmail, extortion, or corporate espionage.',
                'how_it_works': 'Attackers use Remote Access Trojans (RATs) or malicious browser permission abuses. Advanced malware can sometimes disable the hardware LED indicator light on older webcams while recording video and capturing snapshots.',
                'real_world_examples': [
                    'Extortionists claiming to have recorded video of a victim via their webcam, threatening to send it to friends unless Bitcoin is paid.',
                    'A flashlight or calculator mobile app requesting unrestricted camera access upon installation.'
                ],
                'warning_signs': [
                    'Webcam indicator light flickering or staying on when no video conferencing app is open.',
                    'Smartphone camera icon showing in the status bar while the phone is idle.',
                    'Apps crashing or running slowly when camera functions are called.'
                ],
                'who_affected': 'Laptop owners, smartphone users, students attending online classes, and public figures.',
                'consequences': 'Severe privacy invasion, blackmail, sextortion attempts, and emotional trauma.',
                'prevention': [
                    'Use a physical, sliding webcam cover on laptops for 100% optical safety.',
                    'Review camera permissions in your operating system and revoke access for unnecessary apps.',
                    'Never grant camera permissions to websites claiming it is needed for "human verification / CAPTCHA".'
                ],
                'what_to_do': [
                    'Cover the camera physically with tape or a slider immediately.',
                    'Open Task Manager and terminate unrecognized processes utilizing video hardware.',
                    'Run a thorough offline antivirus scan to detect and remove remote administration trojans.'
                ],
                'related_threats': ['microphone-permissions', 'spyware', 'trojans'],
                'quiz': [
                    {
                        'question': 'What is the most foolproof, tamper-proof protection against laptop webcam surveillance?',
                        'options': ['Closing the browser', 'A physical sliding camera cover or opaque tape over the lens', 'Turning down the brightness', 'Unplugging the mouse'],
                        'correct_index': 1,
                        'explanation': 'A physical barrier completely blocks optical capture regardless of software vulnerabilities or malware capabilities.'
                    }
                ]
            }
        },
        {
            'category_slug': 'privacy-surveillance',
            'slug': 'microphone-permissions',
            'name': 'Microphone Permissions & Eavesdropping',
            'short_desc': 'Apps abusing audio recording privileges to eavesdrop on private conversations and phone calls.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'Mic',
            'content': {
                'what_is': 'Microphone eavesdropping occurs when mobile apps, browser tabs, or background spyware access your device microphone to record private conversations, ambient room sounds, or phone calls.',
                'how_it_works': 'Apps request microphone permissions during setup (often disguised as needed for voice search or video features). Once granted, poorly regulated or rogue apps can initialize audio capture whenever the app runs in the background.',
                'real_world_examples': [
                    'Users talking about buying a specific brand of shoes and seeing hyper-targeted ads within hours from apps with background audio permissions.',
                    'A malicious game requesting microphone permission and transmitting audio recordings to an advertising analytics SDK.'
                ],
                'warning_signs': [
                    'The orange/green microphone privacy dot appearing in the top status bar on Android or iOS unexpectedly.',
                    'Battery and data drain associated with simple games or utility apps.',
                    'Flashlight or wallpaper apps insisting on microphone access.'
                ],
                'who_affected': 'All smartphone and smart speaker users.',
                'consequences': 'Confidential business meetings leaked, intimate personal conversations recorded, profiling by advertisers.',
                'prevention': [
                    'Set microphone permissions to "Allow only while using the app" or "Ask every time".',
                    'Audit installed apps in Settings > Privacy > Permission Manager > Microphone.',
                    'Mute or disconnect smart speakers in rooms where confidential discussions occur.'
                ],
                'what_to_do': [
                    'Immediately revoke microphone permissions for any suspicious app.',
                    'Uninstall apps that refuse to function without unjustified microphone access.',
                    'Check background battery usage to identify which apps were active recently.'
                ],
                'related_threats': ['camera-privacy-risks', 'spyware', 'excessive-app-permissions'],
                'quiz': [
                    {
                        'question': 'What should you do if a simple calculator or flashlight app requests microphone permission on installation?',
                        'options': ['Grant permission immediately', 'Deny the permission and uninstall the app', 'Give permission only on weekends', 'Turn off your phone sound'],
                        'correct_index': 1,
                        'explanation': 'A calculator has no legitimate functional need for a microphone. Demanding unjustified permissions is a clear sign of data harvesting or malware.'
                    }
                ]
            }
        },
        {
            'category_slug': 'privacy-surveillance',
            'slug': 'location-tracking',
            'name': 'Location Tracking & Geo-Stalking',
            'short_desc': 'Covert tracking of your physical movements through GPS, Wi-Fi triangulation, and Bluetooth beacons.',
            'risk_category': 'Medium',
            'difficulty': 'Beginner',
            'icon': 'MapPin',
            'content': {
                'what_is': 'Location tracking is the continuous harvesting of precise physical geographic coordinates using GPS sensors, cell tower triangulation, Wi-Fi network BSSIDs, and Bluetooth beacons.',
                'how_it_works': 'Apps package third-party location SDKs that record coordinates every few minutes. This data is sold to data brokers or accessible to stalkers who have access to shared account dashboards (like Find My Device or Google Maps location sharing).',
                'real_world_examples': [
                    'An abuser monitoring a partner’s movements via an unnoticed location sharing link in Google Maps.',
                    'Photos posted online containing precise EXIF GPS metadata revealing home and school addresses.'
                ],
                'warning_signs': [
                    'Location pin icon constantly active in the phone notification bar.',
                    'Someone knowing your exact schedule or physical location without being told.',
                    'Location sharing active in Google Maps / Find My settings without your memory of enabling it.'
                ],
                'who_affected': 'Smartphone users, children, teenagers, and survivors of domestic harassment.',
                'consequences': 'Physical stalking, home burglaries when away on vacation, creation of detailed behavioral profiles.',
                'prevention': [
                    'Audit Google Maps and Apple Find My "Location Sharing" menus regularly.',
                    'Strip EXIF metadata from photos before sharing on public social platforms.',
                    'Set location permission to "Approximate Location" rather than "Precise Location" where possible.'
                ],
                'what_to_do': [
                    'Immediately open Google Maps > tap your profile > Location Sharing, and remove any unauthorized users.',
                    'Turn off Location Services in phone settings when not actively navigating.',
                    'Review app location history in Android/iOS privacy settings.'
                ],
                'related_threats': ['spyware', 'excessive-app-permissions', 'browser-tracking'],
                'quiz': [
                    {
                        'question': 'What hidden data in photos taken with smartphones can accidentally reveal your home address?',
                        'options': ['Color saturation values', 'EXIF metadata containing exact GPS latitude and longitude', 'File compression ratio', 'Camera shutter speed'],
                        'correct_index': 1,
                        'explanation': 'EXIF metadata embedded inside smartphone photos frequently stores exact GPS coordinates where the picture was taken.'
                    }
                ]
            }
        },
        {
            'category_slug': 'privacy-surveillance',
            'slug': 'browser-tracking',
            'name': 'Browser Tracking & Fingerprinting',
            'short_desc': 'Profiling users across the web using third-party cookies, tracking pixels, and browser fingerprinting.',
            'risk_category': 'Medium',
            'difficulty': 'Intermediate',
            'icon': 'Globe',
            'content': {
                'what_is': 'Browser tracking is the practice of monitoring a user’s web browsing behavior across multiple websites to build a commercial or surveillance profile, even when Incognito/Private mode is used.',
                'how_it_works': 'Beyond cookies, advanced trackers use **Browser Fingerprinting**: querying your browser for screen resolution, installed fonts, GPU renderer, WebGL canvas hash, audio context, and timezone. The combination is mathematically unique and tracks you without cookies.',
                'real_world_examples': [
                    'Searching for medical symptoms on one site and seeing health insurance advertisements on unrelated news sites.',
                    'Visiting sites in Private mode but still being recognized because your browser canvas fingerprint is identical.'
                ],
                'warning_signs': [
                    'Advertisements matching your exact search history across different devices on the same home network.',
                    'Websites loading hundreds of third-party tracking scripts.'
                ],
                'who_affected': 'All internet users browsing the modern web.',
                'consequences': 'Loss of personal anonymity, behavioral manipulation through targeted political or commercial ads, price discrimination.',
                'prevention': [
                    'Use privacy-respecting browsers (such as Brave, Firefox with Enhanced Tracking Protection, or Tor Browser).',
                    'Install open-source content blockers like uBlock Origin.',
                    'Test your browser with the REDLINE Browser Privacy Awareness tool.'
                ],
                'what_to_do': [
                    'Clear third-party cookies and site data in browser settings.',
                    'Enable "Global Privacy Control" and "Do Not Track" in browser preferences.',
                    'Use privacy-protecting DNS providers (such as Quad9 or Cloudflare 1.1.1.1 with DoH).'
                ],
                'related_threats': ['location-tracking', 'camera-privacy-risks', 'browser-fingerprinting'],
                'quiz': [
                    {
                        'question': 'Does using "Incognito" or "Private Browsing" mode make you completely anonymous to websites and your ISP?',
                        'options': ['Yes, it makes you 100% invisible to everyone', 'No, websites can still fingerprint your device and your ISP sees your network traffic', 'Yes, it encrypts your internet with military security', 'Yes, it changes your IP address every minute'],
                        'correct_index': 1,
                        'explanation': 'Private mode only prevents local history and cookies from saving on your device. Websites can still fingerprint you, and your ISP sees the domain traffic.'
                    }
                ]
            }
        },

        # --- Account & Identity Security ---
        {
            'category_slug': 'account-security',
            'slug': 'password-attacks',
            'name': 'Password Attacks & Brute-Force',
            'short_desc': 'Automated attempts to guess or crack passwords using wordlists, GPU clusters, and dictionary algorithms.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'KeyRound',
            'content': {
                'what_is': 'Password attacks involve automated software attempting to crack or guess user account passwords through dictionary attacks, brute-force permutations, or leaked credential matching.',
                'how_it_works': 'Attackers use specialized cracking software (like Hashcat or John the Ripper) running on powerful GPU clusters. A simple 8-character password containing only lowercase letters can be cracked in less than a second through billions of guesses per second.',
                'real_world_examples': [
                    'Common passwords like "Password123" or "admin123" being guessed within seconds by automated bots scanning open servers.',
                    'A social media account hacked because the user used their birthday and pet name.'
                ],
                'warning_signs': [
                    'Email notifications stating: "Multiple failed login attempts detected on your account."',
                    'Two-Factor Authentication prompt received when you were not trying to log in.'
                ],
                'who_affected': 'Anyone using short, common, or predictable passwords.',
                'consequences': 'Account takeover, personal message exposure, email hijacking, unauthorized purchases.',
                'prevention': [
                    'Use long passphrases (14+ characters) combining unrelated words, numbers, and symbols.',
                    'Never reuse the same password across multiple websites.',
                    'Use a reputable password manager to generate and store unique credentials.',
                    'Test password resilience locally with the REDLINE Password Analyzer.'
                ],
                'what_to_do': [
                    'Change the password immediately to a strong, randomly generated passphrase.',
                    'Select "Log out of all other devices" in account security settings.',
                    'Enable Two-Factor Authentication (2FA) immediately.'
                ],
                'related_threats': ['credential-stuffing', 'account-takeover', 'sim-swapping'],
                'quiz': [
                    {
                        'question': 'Which password is statistically the most secure against modern GPU brute-force attacks?',
                        'options': ['P@ssw0rd', '12345678', 'BlueElephant!DancingOver99Clouds', 'qwerty2026'],
                        'correct_index': 2,
                        'explanation': 'Length is the single most powerful factor in cryptographic entropy. A 32-character passphrase takes trillions of years to brute-force.'
                    }
                ]
            }
        },
        {
            'category_slug': 'account-security',
            'slug': 'credential-stuffing',
            'name': 'Credential Stuffing',
            'short_desc': 'Automated bot attacks testing billions of username and password pairs leaked from past database breaches.',
            'risk_category': 'High',
            'difficulty': 'Intermediate',
            'icon': 'Repeat',
            'content': {
                'what_is': 'Credential stuffing is an automated cyberattack where criminals use massive lists of compromised username/password pairs leaked from past data breaches and test them across hundreds of other popular websites.',
                'how_it_works': 'Because over 60% of people reuse the exact same password for multiple accounts, attackers use bots to automatically test leaked credentials against Netflix, Amazon, Spotify, banking portals, and social media sites.',
                'real_world_examples': [
                    'A minor fitness app suffers a data breach. Hackers take the leaked email/passwords and successfully break into the victims’ PayPal and Amazon accounts.',
                    'Mass account takeover attacks hitting Disney+ subscribers within days of launch.'
                ],
                'warning_signs': [
                    'Receiving emails from services you rarely use alerting you to logins from foreign countries or unknown IP addresses.',
                    'Finding unauthorized orders or profile changes on shopping sites.'
                ],
                'who_affected': 'Anyone who reuses the same password across multiple online platforms.',
                'consequences': 'Widespread account takeovers across banking, shopping, and entertainment platforms.',
                'prevention': [
                    'NEVER reuse passwords! Every single account must have a distinct, unique password.',
                    'Use a password manager (e.g. Bitwarden, 1Password) to manage unique logins effortlessly.',
                    'Enable Multi-Factor Authentication (MFA) on every important service.'
                ],
                'what_to_do': [
                    'Check if your email has appeared in public breaches on haveibeenpwned.com.',
                    'Change passwords across all accounts where the compromised password was reused.',
                    'Revoke all active sessions and enable 2FA.'
                ],
                'related_threats': ['password-attacks', 'account-takeover', 'data-breaches'],
                'quiz': [
                    {
                        'question': 'Why is credential stuffing so successful for attackers?',
                        'options': ['Because attackers can guess any password instantly', 'Because many people reuse the same password across multiple websites', 'Because websites do not use firewalls', 'Because hackers control all internet routers'],
                        'correct_index': 1,
                        'explanation': 'Reusing passwords means a single security breach at an obscure website gives criminals keys to all your other accounts.'
                    }
                ]
            }
        },
        {
            'category_slug': 'account-security',
            'slug': 'sim-swapping',
            'name': 'SIM Swapping Awareness',
            'short_desc': 'Attackers tricking your mobile operator into transferring your phone number to their SIM card to steal 2FA OTPs.',
            'risk_category': 'Critical',
            'difficulty': 'Intermediate',
            'icon': 'Smartphone',
            'content': {
                'what_is': 'SIM swapping (SIM jacking) occurs when a criminal convinces your mobile network provider that your SIM card was lost or damaged, tricking them into transferring your phone number to a new SIM card under the attacker’s control.',
                'how_it_works': 'Using impersonation or fraudulent identity documents, the scammer requests a replacement SIM. Once activated, your real phone loses cellular reception completely, and all your incoming calls and SMS 2FA codes are routed directly to the scammer.',
                'real_world_examples': [
                    'Twitter CEO Jack Dorsey’s account was hijacked in 2019 via a SIM swap attack against his phone carrier.',
                    'A victim noticing their mobile network signal suddenly shows "No Service" while thieves reset their crypto and bank passwords.'
                ],
                'warning_signs': [
                    'Your mobile phone suddenly and completely loses cellular service ("No Service" / "Emergency calls only") in an area with normally good coverage.',
                    'Receiving an SMS from your telecom carrier stating: "A SIM replacement request has been initiated for your number."',
                    'Inability to make calls or receive texts unexpectedly.'
                ],
                'who_affected': 'High-profile individuals, cryptocurrency holders, and any user relying exclusively on SMS for Two-Factor Authentication.',
                'consequences': 'Catastrophic loss of bank funds, takeover of email and social accounts, identity impersonation.',
                'prevention': [
                    'Never rely on SMS for 2FA where app-based 2FA (Google Authenticator, Authy, YubiKey) is available.',
                    'Set a secure PIN or verbal password with your mobile telecom carrier for SIM changes.',
                    'Do not publicize your personal phone number on public social media.'
                ],
                'what_to_do': [
                    'If your phone abruptly loses service with no explanation, immediately call your mobile carrier from a landline or family phone.',
                    'Alert your bank immediately to freeze online banking and UPI transactions.',
                    'Log into your primary email from a trusted computer and check for unauthorized password reset requests.'
                ],
                'related_threats': ['vishing', 'account-takeover', 'financial-scams'],
                'quiz': [
                    {
                        'question': 'What is the most secure alternative to SMS-based Two-Factor Authentication (2FA)?',
                        'options': ['Security questions (e.g. mother\'s maiden name)', 'Software authenticator apps (TOTP) or hardware security keys (FIDO2)', 'Writing passwords on sticky notes', 'Receiving codes via postal mail'],
                        'correct_index': 1,
                        'explanation': 'Authenticator apps and hardware keys generate codes locally on your physical device and are completely immune to SIM swapping.'
                    }
                ]
            }
        },

        # --- Financial & Online Scams ---
        {
            'category_slug': 'financial-scams',
            'slug': 'upi-scams',
            'name': 'UPI Payment Scams',
            'short_desc': 'Deceptive payment requests and QR code traps exploiting misunderstandings of UPI mechanics.',
            'risk_category': 'Critical',
            'difficulty': 'Beginner',
            'icon': 'IndianRupee',
            'content': {
                'what_is': 'UPI scams manipulate victims into entering their UPI PIN under the false premise that entering the PIN is required to "receive" a refund, lottery prize, or payment for an item sold online.',
                'how_it_works': 'The scammer sends a "Collect Request" on PhonePe, Google Pay, or Paytm or generates a payment QR code. They instruct the victim: "Scan this QR code and type your 6-digit PIN to receive the ₹15,000 payment." The moment the PIN is entered, money is instantly deducted from the victim’s account.',
                'real_world_examples': [
                    'Selling a sofa on OLX; the buyer claims to be an army officer who can only pay via UPI QR code. Scanning the QR code deducts money.',
                    'Receiving a notification on PhonePe: "Cashback Reward of ₹2,999 waiting. Click here to approve."'
                ],
                'warning_signs': [
                    'Anyone telling you to enter your UPI PIN to RECEIVE money.',
                    'Receiving unsolicited "Collect Requests" or payment links.',
                    'Buyer refusing to meet in person and insisting on immediate advance payment via QR code.'
                ],
                'who_affected': 'Indian smartphone users, sellers on OLX and Facebook Marketplace, college students, and seniors.',
                'consequences': 'Instant, irreversible loss of bank account balance.',
                'prevention': [
                    '**GOLDEN RULE OF UPI:** You **NEVER** need to enter your UPI PIN or scan a QR code to **RECEIVE** money.',
                    'Entering UPI PIN ALWAYS debits money from your account.',
                    'Decline all unsolicited collect requests on UPI apps.'
                ],
                'what_to_do': [
                    'Call the National Cyber Crime Helpline **1930** immediately (within the first 2 hours).',
                    'File a complaint on the official portal at cybercrime.gov.in with transaction UTR numbers.',
                    'Contact your bank immediately to raise a chargeback dispute and freeze the compromised account.'
                ],
                'related_threats': ['qr-code-scams', 'financial-scams', 'vishing'],
                'quiz': [
                    {
                        'question': 'Do you ever need to enter your UPI PIN to RECEIVE money in your bank account?',
                        'options': ['Yes, for transactions above ₹5,000', 'Yes, when receiving money from other states', 'NEVER—entering your PIN ALWAYS sends money OUT', 'Yes, on weekends only'],
                        'correct_index': 2,
                        'explanation': 'Entering your UPI PIN authorizes a DEBIT. Receiving money never requires a PIN or scanning a QR code.'
                    }
                ]
            }
        },
        {
            'category_slug': 'financial-scams',
            'slug': 'digital-arrest-scams',
            'name': 'Digital Arrest Scams',
            'short_desc': 'Extortion scheme where fake police, CBI, or customs officers place victims under simulated "video detention".',
            'risk_category': 'Critical',
            'difficulty': 'Beginner',
            'icon': 'AlertOctagon',
            'content': {
                'what_is': 'Digital Arrest is an organized syndicate scam in India where fraudsters pose as law enforcement officers (CBI, Police, Customs, ED, Telecom Authority) and falsely claim the victim is implicated in money laundering or narcotics trafficking, holding them hostage on continuous Skype/WhatsApp video calls.',
                'how_it_works': 'The victim receives an automated call claiming a parcel sent in their name containing illegal narcotics and fake passports was seized at Mumbai airport. They are transferred to a fake "police station" on video call with actors wearing uniforms and fake Supreme Court logos. They threaten immediate arrest unless the victim transfers their entire life savings to "RBI government verification accounts".',
                'real_world_examples': [
                    'An elderly doctor in Bengaluru kept on video call for 48 hours and coerced into transferring ₹3.5 Crore to fake verification accounts.',
                    'A college student intimidated with fake arrest warrants claiming their Aadhaar was used in human trafficking.'
                ],
                'warning_signs': [
                    'The caller claims you are under "Digital Arrest" and must not turn off your camera.',
                    'Video call showing a background designed to look like a police station or government office.',
                    'Demands to transfer money for "verification" or "safe custody" into private bank accounts.',
                    'Threats not to contact family, lawyers, or local police.'
                ],
                'who_affected': 'Elderly citizens, retirees, doctors, working professionals, and individuals living alone.',
                'consequences': 'Catastrophic loss of life savings, extreme mental and emotional trauma.',
                'prevention': [
                    '**THERE IS NO LEGAL CONCEPT OF "DIGITAL ARREST" UNDER INDIAN LAW.**',
                    'Indian Police and central agencies NEVER arrest people or conduct interrogations over Skype or WhatsApp video calls.',
                    'Government agencies never ask citizens to transfer money to "verification accounts".'
                ],
                'what_to_do': [
                    'Immediately disconnect the video call. Do not be intimidated.',
                    'Walk directly to your nearest local police station or contact trusted family members.',
                    'Dial 1930 immediately if any money was transferred.',
                    'Report the incident and phone numbers on cybercrime.gov.in.'
                ],
                'related_threats': ['vishing', 'impersonation-scams', 'upi-scams'],
                'quiz': [
                    {
                        'question': 'Can Indian Police or CBI place a citizen under "Digital Arrest" via a WhatsApp or Skype video call?',
                        'options': ['Yes, under the New Criminal Code', 'Yes, if authorized by the Telecom Ministry', 'NO—"Digital Arrest" has no legal standing in India and is 100% a criminal scam', 'Only during national holidays'],
                        'correct_index': 2,
                        'explanation': 'The Ministry of Home Affairs and Supreme Court have repeatedly confirmed that "Digital Arrest" does not exist in law. Police never investigate or arrest over video calls.'
                    }
                ]
            }
        },
        {
            'category_slug': 'financial-scams',
            'slug': 'fake-job-offers',
            'name': 'Fake Job & Task Scams',
            'short_desc': 'Scams offering high daily wages for "liking YouTube videos" or doing simple data entry, leading to financial extortion.',
            'risk_category': 'High',
            'difficulty': 'Beginner',
            'icon': 'BadgeDollarSign',
            'content': {
                'what_is': 'Fake job and task scams deceive unemployed individuals and students with lucrative work-from-home offers (such as liking YouTube videos, rating Google Maps hotels, or writing reviews) that escalate into prepaid investment traps.',
                'how_it_works': 'Victims are recruited via WhatsApp or Telegram messages. For the first few simple tasks, the scammers actually send small payouts (₹150 to ₹500) to build trust. Then, the victim is moved to VIP tasks requiring a "security deposit" of ₹5,000 to earn ₹8,000. When larger deposits (₹50,000+) are made, the funds are frozen, and victims are told to pay more to withdraw.',
                'real_world_examples': [
                    'A Telegram group where members share fake screenshots of high earnings for rating hotels, tricking a student into depositing ₹80,000.',
                    'SMS: "Earn ₹2,000 - ₹5,000 daily from home by liking 10 videos. No experience required. Contact HR on WhatsApp."'
                ],
                'warning_signs': [
                    'Unsolicited job offers sent via WhatsApp or Telegram without any formal interview or resume review.',
                    'Requiring you to pay money or a "security deposit" to work or release your earnings.',
                    'Absence of an official company email address or verifiable physical office.'
                ],
                'who_affected': 'College students, homemakers, job seekers, and part-time workers.',
                'consequences': 'Loss of personal savings, borrowed loans, and recruitment into mule account networks.',
                'prevention': [
                    'Legitimate employers **NEVER** ask employees or applicants to pay money for equipment, registration, or task deposits.',
                    'Be skeptical of any job promising high guaranteed daily pay for trivial tasks.',
                    'Verify job vacancies on official corporate career portals directly.'
                ],
                'what_to_do': [
                    'Stop sending money immediately. Do not pay any "tax" or "clearance fee" to retrieve deposited funds.',
                    'Preserve all Telegram chat histories, transaction receipts, and UPI IDs.',
                    'File a complaint immediately at 1930 and cybercrime.gov.in.'
                ],
                'related_threats': ['upi-scams', 'financial-scams', 'social-engineering'],
                'quiz': [
                    {
                        'question': 'A recruiter on Telegram promises ₹3,000 daily for liking videos, but requires a ₹1,000 refundable security deposit. Is this legitimate?',
                        'options': ['Yes, all modern remote jobs require deposits', 'No, legitimate companies never ask job seekers to pay money to work', 'Yes, as long as it is refundable', 'Yes, if they have a Telegram channel'],
                        'correct_index': 1,
                        'explanation': 'Any job that requires upfront payments, deposits, or cryptocurrency transfers is guaranteed to be a fraudulent scam.'
                    }
                ]
            }
        },

        # --- Emerging Threats ---
        {
            'category_slug': 'emerging-threats',
            'slug': 'deepfake-scams',
            'name': 'Deepfake Scams & Synthetic Media',
            'short_desc': 'AI-generated video and audio impersonating trusted friends, celebrities, or company executives.',
            'risk_category': 'High',
            'difficulty': 'Intermediate',
            'icon': 'Sparkles',
            'content': {
                'what_is': 'Deepfakes utilize advanced artificial intelligence and deep neural networks to generate hyper-realistic fabricated video and audio recordings that make a person appear to say or do things they never did.',
                'how_it_works': 'Attackers train generative models on publicly available photos, social media videos, and voice clips of a target. They use real-time face swapping during video calls or generate cloned audio to deceive victims into authorizing financial transfers.',
                'real_world_examples': [
                    'A finance employee at a multinational firm in Hong Kong transferred $25 Million after attending a video conference where all other participants were real-time deepfakes.',
                    'AI-generated deepfake videos of celebrities promoting fake high-yield investment schemes on YouTube and Facebook.'
                ],
                'warning_signs': [
                    'Unnatural facial movements, unnatural blinking, or glitches around the mouth and jawline during video calls.',
                    'Audio that sounds robotic, flat, or lacks natural breathing and emotional modulation.',
                    'Requests during video calls to make urgent, unverified financial transfers.'
                ],
                'who_affected': 'Executives, family members of travelers, social media users, investors.',
                'consequences': 'Severe monetary fraud, corporate espionage, reputational damage, and non-consensual imagery.',
                'prevention': [
                    'Establish a unique family or corporate **Safe Word** that must be spoken verbally during any emergency financial request.',
                    'Ask the caller during a video call to wave their hand across their face or turn their head sideways (real-time face-swap models often glitch on occlusion).',
                    'Always verify instructions through a known secondary communication channel.'
                ],
                'what_to_do': [
                    'Hang up immediately if an emergency video or voice call feels unnatural.',
                    'Contact the person on their known physical phone number.',
                    'Report synthetic fraudulent videos to the hosting platform and cyber authorities.'
                ],
                'related_threats': ['ai-voice-impersonation', 'impersonation-scams', 'phishing'],
                'quiz': [
                    {
                        'question': 'How can you quickly test if a caller in a live video call might be a real-time deepfake face-swap?',
                        'options': ['Ask them to turn up their volume', 'Ask them to wave their hand in front of their face or turn their head sideways quickly', 'Ask for their email address', 'Close your eyes and listen'],
                        'correct_index': 1,
                        'explanation': 'Real-time face-swapping algorithms struggle with occlusion and extreme side-profile angles, causing noticeable visual distortion and tearing.'
                    }
                ]
            }
        },
        {
            'category_slug': 'emerging-threats',
            'slug': 'ai-voice-impersonation',
            'name': 'AI Voice Cloning & Audio Impersonation',
            'short_desc': 'Scammers cloning the exact voice of your child or relative using 3 seconds of audio to demand bail money.',
            'risk_category': 'High',
            'difficulty': 'Intermediate',
            'icon': 'Mic2',
            'content': {
                'what_is': 'AI Voice Cloning uses generative voice synthesis software to replicate a person’s exact vocal pitch, accent, tone, and inflection using just a short audio sample extracted from social media videos or voicemail.',
                'how_it_works': 'Criminals extract a 5-second audio clip of a victim’s child or parent from Instagram or TikTok. They feed it into a voice synthesizer and call the parents: "Mom, I had a car accident, the police have me, please wire money right now." The parents hear what sounds exactly like their child in tears.',
                'real_world_examples': [
                    'Parents in the US receiving a call with their daughter’s cloned voice crying that she was kidnapped and demanding $50,000 ransom.',
                    'A CEO’s voice cloned over the phone instructing a subsidiary manager to execute an urgent urgent supplier payment.'
                ],
                'warning_signs': [
                    'Sudden high-stress phone calls from an unfamiliar number claiming a relative is in emergency custody.',
                    'Background sobbing or noise used strategically to mask synthesis imperfections.',
                    'Insistence on payment via instant non-refundable channels (wire, crypto, UPI).'
                ],
                'who_affected': 'Parents, grandparents, family members of college students, and corporate managers.',
                'consequences': 'Extreme emotional trauma and severe financial extortion.',
                'prevention': [
                    'Create an agreed-upon **Family Safe Word** that only your immediate family knows.',
                    'If you receive such a call, remain calm and ask a specific personal question only the real person could answer.',
                    'Hang up and call the family member directly on their known phone number.'
                ],
                'what_to_do': [
                    'Disconnect immediately and contact your family member directly.',
                    'Do not transfer any money.',
                    'Report the extortion attempt to local police and the 1930 Cyber helpline.'
                ],
                'related_threats': ['deepfake-scams', 'vishing', 'impersonation-scams'],
                'quiz': [
                    {
                        'question': 'What is the most effective safeguard against AI voice cloning emergency scams?',
                        'options': ['Never answering phone calls', 'Having a pre-arranged secret Family Safe Word or asking a private question only the real person knows', 'Speaking in whispers', 'Changing phone carriers'],
                        'correct_index': 1,
                        'explanation': 'A secret safe word cannot be generated or predicted by AI synthesizers, immediately exposing an imposter.'
                    }
                ]
            }
        }
    ]

    for t in threats_data:
        cat_id = cat_map.get(t['category_slug'])
        if not cat_id:
            continue
        threat = Threat(
            category_id=cat_id,
            slug=t['slug'],
            name=t['name'],
            short_desc=t['short_desc'],
            risk_category=t['risk_category'],
            difficulty=t['difficulty'],
            icon=t['icon'],
            views_count=120,
            full_content=json.dumps(t['content'])
        )
        db.session.add(threat)

    # 3. Security Tools Metadata
    tools_data = [
        {
            'slug': 'url-checker',
            'name': 'URL Safety Checker',
            'short_desc': 'Analyze suspicious web addresses for lookalike domains, punycode attacks, insecure protocols, and malicious indicators.',
            'icon': 'Globe',
            'route': '/tools/url-checker',
            'badge': 'Heuristic + Threat Intel',
            'features': ['Format validation', 'HTTPS check', 'Punycode & homograph detection', 'Brand spoofing audit', 'Safe Browsing integration']
        },
        {
            'slug': 'password-analyzer',
            'name': 'Password Strength Analyzer',
            'short_desc': 'Test password complexity, entropy bits, and estimated brute-force crack time. Processed 100% locally with zero data transmission.',
            'icon': 'KeyRound',
            'route': '/tools/password-analyzer',
            'badge': '100% Client-Side Private',
            'features': ['Entropy calculation', 'Crack time estimation', 'Pattern & dictionary detection', 'Local evaluation only', 'Zero logging']
        },
        {
            'slug': 'message-analyzer',
            'name': 'Suspicious Message Analyzer',
            'short_desc': 'Scan SMS, email, or WhatsApp messages for urgency tactics, OTP demands, impersonation flags, and deceptive links.',
            'icon': 'MessageSquareWarning',
            'route': '/tools/message-analyzer',
            'badge': 'NLP Threat Heuristics',
            'features': ['Urgency pattern detection', 'OTP & payment triggers', 'Impersonation identification', 'Suspicious URL extraction', 'Actionable advice']
        },
        {
            'slug': 'email-inspector',
            'name': 'Email Security Awareness',
            'short_desc': 'Inspect sender addresses, detect Reply-To mismatches, and understand SPF, DKIM, and DMARC email authentication defenses.',
            'icon': 'MailCheck',
            'route': '/tools/email-inspector',
            'badge': 'Authentication Inspector',
            'features': ['Display name vs RFC sender', 'Reply-to mismatch warning', 'SPF / DKIM / DMARC explainer', 'Attachment risk guide']
        },
        {
            'slug': 'qr-safety',
            'name': 'QR Code Safety Guide',
            'short_desc': 'Safely decode QR code images locally in your browser. Inspect plain text payloads and UPI payment strings before opening.',
            'icon': 'QrCode',
            'route': '/tools/qr-safety',
            'badge': 'Local Safe Decoder',
            'features': ['Local image decoding', 'Plain text preview', 'UPI money-request trap alerts', 'Zero auto-redirect', 'Risk evaluation']
        },
        {
            'slug': 'file-inspector',
            'name': 'File Security Awareness',
            'short_desc': 'Inspect file extensions, detect dangerous double extensions (like invoice.pdf.exe), and learn safe sandbox practices.',
            'icon': 'FileCode2',
            'route': '/tools/file-inspector',
            'badge': 'Metadata & Sandbox Guide',
            'features': ['Double-extension trick detection', 'MIME mismatch checks', 'Executable format flags', 'VirusTotal workflow guide']
        },
        {
            'slug': 'permission-guide',
            'name': 'Privacy & Permission Guide',
            'short_desc': 'Interactive guide simulating camera, microphone, and location permissions across Android, Windows, and web browsers.',
            'icon': 'Sliders',
            'route': '/tools/permission-guide',
            'badge': 'OS Permission Simulator',
            'features': ['Camera & Mic audit', 'Location access breakdown', 'Background activity controls', 'Step-by-step revocation guide']
        },
        {
            'slug': 'browser-privacy',
            'name': 'Browser Privacy Awareness',
            'short_desc': 'Perform a live client-side audit of your current browser configuration, WebRTC IP exposure, and tracking protection.',
            'icon': 'ShieldCheck',
            'route': '/tools/browser-privacy',
            'badge': 'Live Client Audit',
            'features': ['WebRTC IP leak audit', 'Canvas entropy evaluation', 'Cookie & Do-Not-Track status', 'HTTPS inspection']
        }
    ]

    for t in tools_data:
        tool = SecurityTool(
            slug=t['slug'],
            name=t['name'],
            short_desc=t['short_desc'],
            icon=t['icon'],
            route=t['route'],
            badge=t['badge'],
            features_json=json.dumps(t['features'])
        )
        db.session.add(tool)

    # 4. Quizzes (Beginner, Intermediate, Advanced across topics)
    quizzes_data = [
        # Beginner Quizzes
        {
            'category': 'Phishing Awareness',
            'level': 'Beginner',
            'question': 'You receive an email from "Apple Security" stating your account is locked, with a link to "apple-support-verify.net". What is the biggest red flag?',
            'options': ['The email uses Apple’s logo', 'The domain in the link is not apple.com', 'The email was sent at night', 'The font is black on white'],
            'correct_index': 1,
            'explanation': 'Look at the root domain before the final dot. "apple-support-verify.net" is an attacker-registered domain completely unrelated to the official apple.com.'
        },
        {
            'category': 'Financial Scams',
            'level': 'Beginner',
            'question': 'An online buyer on OLX tells you: "Scan this QR code and type your UPI PIN to receive the advance payment." What will happen if you type your PIN?',
            'options': ['You will immediately receive the money', 'Money will be DEDUCTED from your bank account', 'Your bank will verify your name', 'Nothing will happen'],
            'correct_index': 1,
            'explanation': 'Entering your UPI PIN ALWAYS debits money from your account. Receiving funds NEVER requires typing a PIN or scanning a code.'
        },
        {
            'category': 'Account Security',
            'level': 'Beginner',
            'question': 'Which of the following is considered the strongest password?',
            'options': ['Admin@2026', 'Correct-Horse-Battery-Staple-99!', 'qwertyuiop', 'password12345'],
            'correct_index': 1,
            'explanation': 'A long passphrase made of multiple unrelated words with numbers and symbols has high cryptographic entropy and takes centuries to brute force.'
        },
        {
            'category': 'Social Engineering',
            'level': 'Beginner',
            'question': 'A caller claiming to be from your bank asks for the 6-digit OTP sent to your phone to "cancel a fraudulent transaction." What should you do?',
            'options': ['Share it immediately so they can cancel the charge', 'Ask them for their employee badge number and then share it', 'Hang up immediately—banks NEVER ask for OTPs', 'Tell them the OTP backwards'],
            'correct_index': 2,
            'explanation': 'Legitimate bank representatives never ask for OTPs. OTPs are private authentication secrets intended exclusively for you.'
        },
        # Intermediate Quizzes
        {
            'category': 'Malware & Defense',
            'level': 'Intermediate',
            'question': 'You download a file named "Invoice_October2026.pdf.exe". What technique is being used here?',
            'options': ['PDF encryption', 'Double-extension file deception', 'Zip compression', 'Font embedding'],
            'correct_index': 1,
            'explanation': 'Attackers use double extensions knowing Windows hides known extensions by default, tricking users into thinking it is a harmless PDF when it is an executable (.exe).'
        },
        {
            'category': 'Network Security',
            'level': 'Intermediate',
            'question': 'Why is connecting to an unencrypted public Wi-Fi network at an airport risky without a VPN?',
            'options': ['It drains your laptop battery', 'Anyone nearby can capture unencrypted network packets using a packet sniffer', 'It damages your hard drive', 'It slows down your CPU clock'],
            'correct_index': 1,
            'explanation': 'Unencrypted Wi-Fi broadcasts all network frames over the air, allowing adversaries in range to sniff traffic or set up Man-in-the-Middle proxies.'
        },
        {
            'category': 'Account Security',
            'level': 'Intermediate',
            'question': 'What attack vector does SMS-based Two-Factor Authentication remain vulnerable to?',
            'options': ['Rainbow tables', 'SIM Swapping', 'SQL Injection', 'Cross-Site Scripting'],
            'correct_index': 1,
            'explanation': 'SIM swapping allows attackers to convince mobile operators to port the victim’s phone number, intercepting all SMS 2FA messages.'
        },
        # Advanced Quizzes
        {
            'category': 'Email & Web Architecture',
            'level': 'Advanced',
            'question': 'Which email authentication protocol specifies what a recipient mail server should do if SPF and DKIM checks fail?',
            'options': ['SMTP', 'IMAP4', 'DMARC', 'POP3'],
            'correct_index': 2,
            'explanation': 'DMARC (Domain-based Message Authentication, Reporting, and Conformance) defines the enforcement policy (none, quarantine, reject) when SPF and DKIM fail.'
        },
        {
            'category': 'Emerging Threats',
            'level': 'Advanced',
            'question': 'In a suspected real-time AI face-swap deepfake video call, what action often causes the synthetic overlay to glitch or reveal artifacts?',
            'options': ['Increasing the monitor contrast', 'Having the speaker rapidly wave their hand across their face or turn their head 90 degrees', 'Switching from Wi-Fi to Ethernet', 'Muting your own microphone'],
            'correct_index': 1,
            'explanation': 'Occlusion (hand passing in front of facial landmarks) and extreme profile angles disrupt the tracking keypoints of real-time deepfake models.'
        }
    ]

    for q in quizzes_data:
        question = QuizQuestion(
            category=q['category'],
            level=q['level'],
            question=q['question'],
            options_json=json.dumps(q['options']),
            correct_index=q['correct_index'],
            explanation=q['explanation']
        )
        db.session.add(question)

    # 5. Cyber Alerts & Threat Advisories (Curated trusted sources: CERT-In, CISA, Google Security)
    alerts_data = [
        {
            'title': 'CERT-In Advisory: Surge in "Digital Arrest" Extortion Syndicates Operating via Skype & WhatsApp',
            'source': 'CERT-In (Indian Computer Emergency Response Team)',
            'severity': 'Critical',
            'category': 'Financial Extortion',
            'summary': 'CERT-In and the Ministry of Home Affairs have issued an urgent national advisory regarding international cyber syndicates posing as CBI, ED, and Mumbai Police officers to place victims under fake "Digital Arrest" and extort life savings.',
            'recommended_action': 'Disconnect unsolicited video calls immediately. Indian law enforcement never issues arrest warrants over video call. Report calls to 1930 and cybercrime.gov.in.',
            'original_url': 'https://www.cert-in.org.in/',
            'affected_systems': 'Indian Citizens, Senior Citizens, Mobile & WhatsApp Users',
            'is_active': True
        },
        {
            'title': 'Advisory: Fake Courier & Parcel SMS Campaigns Delivering Trojanized APKs',
            'source': 'CERT-In',
            'severity': 'High',
            'category': 'Android Malware',
            'summary': 'Widespread SMS campaign mimicking FedEx and India Post claiming "Address update required for parcel delivery". Clicking links downloads malicious APK files that intercept banking OTPs.',
            'recommended_action': 'Never install APK files received via SMS. Verify delivery status on official courier apps directly.',
            'original_url': 'https://www.cert-in.org.in/',
            'affected_systems': 'Android Smartphones',
            'is_active': True
        },
        {
            'title': 'CISA Warning: Active Exploitation of Vulnerabilities in SOHO Network Routers',
            'source': 'CISA (Cybersecurity & Infrastructure Security Agency)',
            'severity': 'High',
            'category': 'Network Infrastructure',
            'summary': 'CISA warns that small office and home routers running outdated firmware with default passwords are being incorporated into large-scale proxy botnets used for credential stuffing.',
            'recommended_action': 'Update router firmware immediately, disable remote administration over WAN, and replace default admin passwords.',
            'original_url': 'https://www.cisa.gov/news-events/cybersecurity-advisories',
            'affected_systems': 'Home & Office Wi-Fi Routers',
            'is_active': True
        },
        {
            'title': 'Google Threat Analysis Group: Emerging Trends in AI-Generated Phishing Lures',
            'source': 'Google Security Blog',
            'severity': 'Medium',
            'category': 'AI Threat Intelligence',
            'summary': 'Threat actors are utilizing Large Language Models to generate error-free phishing emails with localized dialects, eliminating traditional spelling and grammar red flags.',
            'recommended_action': 'Rely on cryptographic domain verification, SPF/DKIM alignment, and FIDO2 hardware keys rather than visual grammar inspection alone.',
            'original_url': 'https://blog.google/technology/safety-security/',
            'affected_systems': 'Corporate & Personal Email Inboxes',
            'is_active': True
        },
        {
            'title': 'RBI Alert: Fake Customer Care Numbers Promoted on Search Engine Ads',
            'source': 'Reserve Bank of India (RBI)',
            'severity': 'High',
            'category': 'Banking Fraud',
            'summary': 'Scammers buy sponsored search ads for keywords like "SBI customer care" or "Electricity bill helpline", directing callers to fraudsters who instruct them to install remote access apps.',
            'recommended_action': 'Never search Google for customer support numbers. Check the official helpline printed on your debit card or official monthly statement.',
            'original_url': 'https://rbi.org.in/',
            'affected_systems': 'Retail Banking Customers',
            'is_active': True
        }
    ]

    for a in alerts_data:
        alert = CyberAlert(
            title=a['title'],
            source=a['source'],
            severity=a['severity'],
            category=a['category'],
            summary=a['summary'],
            recommended_action=a['recommended_action'],
            original_url=a['original_url'],
            affected_systems=a['affected_systems'],
            is_active=a['is_active']
        )
        db.session.add(alert)

    db.session.commit()
    print("[+] Successfully seeded REDLINE database with categories, threats, tools, quizzes, and alerts!")
