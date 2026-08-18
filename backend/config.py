import os
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

class Config:
    ENVIRONMENT = os.environ.get("ENVIRONMENT", "development").lower()
    SECRET_KEY = os.environ.get("SECRET_KEY", "")

    DB_HOST = os.environ.get("DB_HOST", "")
    DB_USER = os.environ.get("DB_USER", "")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
    DB_DATABASE = os.environ.get("DB_DATABASE", "")

    PORT = int(os.environ.get("PORT", "5000"))
    DEBUG = os.environ.get("DEBUG", "false").lower() == "true"
    TRUST_PROXY = os.environ.get("TRUST_PROXY", "false").lower() == "true"
    REQUIRE_HTTPS_PAYMENTS = os.environ.get("REQUIRE_HTTPS_PAYMENTS", "false").lower() == "true"
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()

    EXPO_ACCESS_TOKEN = os.environ.get("EXPO_ACCESS_TOKEN", "")
    RAZORPAY_MODE = os.environ.get("RAZORPAY_MODE", "test").lower()
    RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "")

    @classmethod
    def validate(cls):
        required = {"SECRET_KEY": cls.SECRET_KEY, "DB_HOST": cls.DB_HOST, "DB_USER": cls.DB_USER,
                    "DB_PASSWORD": cls.DB_PASSWORD, "DB_DATABASE": cls.DB_DATABASE,
                    "RAZORPAY_KEY_ID": cls.RAZORPAY_KEY_ID, "RAZORPAY_KEY_SECRET": cls.RAZORPAY_KEY_SECRET}
        missing = [name for name, value in required.items() if not value]
        if cls.RAZORPAY_MODE not in {"test", "live"}:
            raise RuntimeError("RAZORPAY_MODE must be 'test' or 'live'")
        if cls.ENVIRONMENT in {"production", "staging"} and missing:
            raise RuntimeError("Missing required production configuration")
        if cls.ENVIRONMENT == "production" and cls.RAZORPAY_MODE != "live":
            raise RuntimeError("Production requires explicit live Razorpay mode")
        return missing
