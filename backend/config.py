import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "redline-cyber-defense-key-2026-sec-ecosystem")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 72))
    
    # Database config: Supports MySQL with automatic graceful fallback to SQLite
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB = os.getenv("MYSQL_DB", "redline_db")
    
    # If MYSQL_URL is defined explicitly or DB_ENGINE is mysql
    if os.getenv("DB_ENGINE") == "mysql" or os.getenv("MYSQL_URL"):
        SQLALCHEMY_DATABASE_URI = os.getenv(
            "MYSQL_URL",
            f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
        )
    else:
        # Default zero-setup SQLite database file located in backend directory
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "redline.db")
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # AI and Intelligence APIs
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    SAFE_BROWSING_API_KEY = os.getenv("SAFE_BROWSING_API_KEY", "")
    VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY", "")
