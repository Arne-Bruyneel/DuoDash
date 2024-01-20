from contextlib import closing
from pysqlcipher3 import dbapi2 as sqlite

def get_db_connection():
    try:
        conn = sqlite.connect("Backend/Database/FietsDb.db", check_same_thread=False)
        return conn
    except sqlite.Error as e:
        print(f"Database connection failed: {e}")
        raise e

def query_db(query, args=(), one=False):
    try:
        with closing(get_db_connection()) as db:
            cursor = db.execute(query, args)
            result = cursor.fetchall()
            return (result[0] if result else None) if one else result
    except sqlite.Error as e:
        print(f"An error occurred while executing SQL: {e}")
        raise e