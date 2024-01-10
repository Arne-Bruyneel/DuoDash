import sqlite3
from contextlib import closing

def get_db_connection():
    try:
        conn = sqlite3.connect("Backend/Database/FietsDb.db", check_same_thread=False)
        return conn
    except sqlite3.Error as e:
        print(f"Database connection failed: {e}")
        raise e

def query_db(query, args=(), one=False):
    try:
        with closing(get_db_connection()) as db:
            cursor = db.execute(query, args)
            result = cursor.fetchall()
            return (result[0] if result else None) if one else result
    except sqlite3.Error as e:
        print(f"An error occurred while executing SQL: {e}")
        raise e