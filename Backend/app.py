from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
import sqlite3
from contextlib import closing
import datetime
import time
import subprocess
from Database.Database import get_db_connection, query_db
from Database.Datarepository import Datarepository as dr

# import logging
# logging.basicConfig(level=logging.DEBUG)

conn = get_db_connection()
cursor = conn.cursor()

# Flask and SocketIO setup
app = Flask(__name__)
app.config['SECRET_KEY'] = 'HELLOTHISISSCERET'
socketio = SocketIO(app, cors_allowed_origins="*",async_mode='eventlet', ping_interval=0.5) 
CORS(app)


# API Endpoints
@app.route('/')
def hello():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    if request.method == 'GET':
        result = jsonify(dr.get_leaderboard(conn))
        # print(f'leaderboard: {result}')
        return result
    
# Socket IO Events
@socketio.on('connect')
def initial_connection():
    print('A new client connected')

#socketio voor constante data stream -> tijdens het fietsen

# @socketio.on('RaceStart')
# def race_data():
#     pass
    

if __name__ == '__main__':
    try:
        print("**** Starting APP ****")
        socketio.run(app, debug=True)
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        print("finished")
