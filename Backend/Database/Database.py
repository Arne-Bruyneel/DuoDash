import sqlite3

def get_db_connection():
    try:
        conn = sqlite3.connect("Backend/Database/FietsDb.db")
        return conn
    except sqlite3.Error as e:
        print(f"Database connection failed: {e}")
        raise e
