from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import sqlite3
from contextlib import closing
import datetime
import time
import subprocess
# import logging
# logging.basicConfig(level=logging.DEBUG)

DATABASE = "pad naar database"

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def query_db(query, args=(), one = False):
    with closing(get_db()) as db:
        cursor = db.execute (query, args)
        returnValue = cursor.fetchall()
        cursor.close()
        return (returnValue[0] if returnValue else None) if one else returnValue # if one is true, return the first row, else return all rows


# Flask and SocketIO setup
app = Flask(__name__)
app.config['SECRET_KEY'] = 'HELLOTHISISSCERET'
socketio = SocketIO(app, cors_allowed_origins="*",async_mode='eventlet', ping_interval=0.5) 
CORS(app)


# API Endpoints
@app.route('/')
def hello():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."


# Socket IO Events
@socketio.on('connect')
def initial_connection():
    print('A new client connected')


if __name__ == '__main__':
    try:
        print("**** Starting APP ****")
        socketio.run(app, debug=True)
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        print("finished")
