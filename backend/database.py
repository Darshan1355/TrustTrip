# database.py

import mysql.connector.pooling
from config import Config

# Create a connection pool that reuses connections efficiently
db_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="trusttrip_pool",
    pool_size=10,  # Max 10 connections in pool
    host=Config.DB_HOST,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    database=Config.DB_DATABASE
)

def get_db_connection():
    """Returns a connection from the pool."""
    return db_pool.get_connection()