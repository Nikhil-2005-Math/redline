import json
from app import app
from models import ThreatCategory, Threat, SecurityTool, QuizQuestion, CyberAlert

with app.app_context():
    cats = [c.to_dict() for c in ThreatCategory.query.order_by(ThreatCategory.display_order).all()]
    threats = [t.to_dict(include_full=True) for t in Threat.query.all()]
    tools = [s.to_dict() for s in SecurityTool.query.all()]
    quizzes = [q.to_dict(include_answer=True) for q in QuizQuestion.query.all()]
    alerts = [a.to_dict() for a in CyberAlert.query.all()]

    data = {
        'categories': cats,
        'threats': threats,
        'tools': tools,
        'quizzes': quizzes,
        'alerts': alerts
    }

    out_path = r'C:\Users\NIKHIL MATHEW\OneDrive\Desktop\sec\frontend\src\data\initialData.ts'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('// Pre-seeded offline data exported from REDLINE core database\n')
        f.write('import { ThreatCategory, Threat, SecurityTool, CyberAlert } from \'../types\';\n\n')
        f.write('export interface FullQuizQuestion {\n  id: number;\n  category: string;\n  level: string;\n  question: string;\n  options: string[];\n  correct_index: number;\n  explanation: string;\n}\n\n')
        f.write('export interface SeedData {\n  categories: ThreatCategory[];\n  threats: Threat[];\n  tools: SecurityTool[];\n  quizzes: FullQuizQuestion[];\n  alerts: CyberAlert[];\n}\n\n')
        f.write('export const INITIAL_DATA: SeedData = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n')

    print(f'Successfully wrote initialData.ts: {len(threats)} threats, {len(alerts)} alerts, {len(quizzes)} quizzes')
