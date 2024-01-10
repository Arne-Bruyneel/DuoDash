from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
import sqlite3
from contextlib import closing
from datetime import datetime, timedelta
import time
import threading
import subprocess
from Database.Database import get_db_connection, query_db
from Database.Datarepository import Datarepository as dr
import Database.main as db
# import logging
# logging.basicConfig(level=logging.DEBUG)


combined_data = {
    'spelers': [
        {
            "id": 1,
            "achternaam": "Jansen",
            "voornaam": "Jan",
            "email": "jan.jansen@example.com",
            "winnaar": False
        },
        {
            "id": 2,
            "achternaam": "De Vries",
            "voornaam": "Anna",
            "email": "anna.devries@example.com",
            "winnaar": True
        }
    ],
    'metingen': [
        {"speler_id": 1, "maxSnelheid": 25.5, "afstand": 700, "gemVermogen": 200},
        {"speler_id": 2, "maxSnelheid": 22.0, "afstand": 850, "gemVermogen": 220}
    ]
}


game_data = {
    'start_time': None,
    'end_time': None,
    'game_active': False
}

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

@app.route('/startgame')
def startgame():
    countdown()
    return "Game started"
    
# Socket IO Events
@socketio.on('connect')
def initial_connection():
    print('A new client connected')
 

def countdown():
    print('countdown')
    for remaining in range(3, 0, -1):
        socketio.sleep(1)  # Non-blocking sleep
        print(remaining)
    start_game()


def start_game():
    #start de game
    print('start game')

    #start de timer
    game_data['start_time'] = datetime.now()
    game_data['end_time'] = datetime.now() + timedelta(seconds=15)
    print(f'start time: {game_data["start_time"]}')
    print(f'end time: {game_data["end_time"]}')
    game_data['game_active'] = True

    #start de data stream
    threading.Thread(target=data_stream).start()
    
    #start de winnaar functie


def data_stream():
    print('data stream')
    while game_data['game_active']:
        #stuur de data naar de frontend
        socketio.emit('B2F_data', combined_data['metingen'])
        socketio.sleep(0.01)
        current_time = datetime.now()
        if current_time > game_data['end_time']:
            game_data['game_active'] = False
            #start de end of game functie
            end_of_game()
            break

def end_of_game():
    print('end of game')
    #start de data opslaan functie
    db.opslaan_db(combined_data['spelers'], combined_data['metingen'], conn, cursor)



if __name__ == '__main__':

    try:
        print("**** Starting APP ****")
        # socketio.run(app, debug=True)
        app.run(debug=False)
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        print('Einde')

