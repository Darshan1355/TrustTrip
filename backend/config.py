import os
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "trusttrip-secret-key-12345")
    
    # Database configuration parameters
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_USER = os.environ.get("DB_USER", "root")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "manager")
    DB_DATABASE = os.environ.get("DB_DATABASE", "trusttrip")
    
    # Server configuration
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = os.environ.get("DEBUG", "True").lower() == "true"
    
    # Expo Push Notifications configuration
    EXPO_ACCESS_TOKEN = os.environ.get("EXPO_ACCESS_TOKEN", "")
