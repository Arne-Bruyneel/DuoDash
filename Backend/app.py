from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS
import sqlite3
from contextlib import closing
from datetime import datetime, timedelta
from Database.Database import get_db_connection, query_db
from Database.Datarepository import Datarepository as dr
import Database.functions as db
import time
import subprocess
import asyncio
import subprocess
import json
from threading import Thread
from bleak import BleakScanner

# import logging
# logging.basicConfig(level=logging.DEBUG)


combined_data = {
    "spelers": [
        {
            "id": 1,
            "achternaam": "Jansen",
            "voornaam": "Jan",
            "email": "jan.jansen@example.com",
            "winnaar": False,
        },
        {
            "id": 2,
            "achternaam": "De Vries",
            "voornaam": "Anna",
            "email": "anna.devries@example.com",
            "winnaar": True,
        },
    ],
    "metingen": [
        {"speler_id": 1, "maxSnelheid": 25.5, "afstand": 700, "gemVermogen": 200},
        {"speler_id": 2, "maxSnelheid": 22.0, "afstand": 850, "gemVermogen": 220},
    ],
}


game_data = {"start_time": None, "end_time": None, "game_active": False}

conn = get_db_connection()
cursor = conn.cursor()

# Flask and SocketIO setup
app = Flask(__name__)
app.config["SECRET_KEY"] = "HELLOTHISISSCERET"
socketio = SocketIO(
    app, cors_allowed_origins="*", async_mode="eventlet", ping_interval=0.5
)
CORS(app)


# API Endpoints
@app.route("/")
def hello():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."


@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    if request.method == "GET":
        result = jsonify(dr.get_leaderboard(conn))
        # print(f'leaderboard: {result}')
        return result


# Socket IO Events
@socketio.on("connect")
def initial_connection():
    print("A new client connected")


@socketio.on("F2B_start_bluetooth_scan")
def start_bluetooth_scan():
    print("starting bluetooth scan")
    discovered_devices = asyncio.run(scan_for_ble_devices())

    devices = []

    for device in discovered_devices:
        if "KICKR BIKE" in device["name"]:
            devices.append(device)

    emit("B2F_devices", {"devices": devices})

    print("emitjes gedaan")


@socketio.on("F2B_connect")
def handle_connect(jsonObject):
    print("submit")
    device_address = jsonObject["devices"][0]

    with open("Backend/Device/devices.json", "w") as file:
        json.dump([], file)

    with open("Backend/Device/data.json", "w") as file:
        json.dump([], file)

    process = subprocess.Popen(
        ["python", "Backend/Device/device.py", device_address, "none"]
    )

    print("ran second script")

    while True:
        with open("Backend/Device/devices.json", "r") as file:
            data = json.load(file)

        print(len(data))

        if len(data) > 0:
            emit("B2F_connected")
            break

        socketio.sleep(1)

    print("connected status send to frontend")


@socketio.on("F2B_startgame")
def startgame():
    # game_data["start_time"] = datetime.now()

    print("game started")

    countdown = 15
    while countdown > 0:
        with open("Backend/Device/data.json", "r") as file:
            data = json.load(file)

        most_recent_data = data[-1]

        print("sent data")
        emit("B2F_data", {"data": most_recent_data})

        socketio.sleep(1)
        countdown -= 1

    print("game stopped")

    # game_data["end_time"] = datetime.now()

    # print(f'start time: {game_data["start_time"]}')
    # print(f'end time: {game_data["end_time"]}')
    # game_data["game_active"] = True


async def scan_for_ble_devices():
    devices = []

    async def on_discovered(device, advertisement_data):
        if device not in devices:
            devices.append(device)

    scanner = BleakScanner()
    scanner.register_detection_callback(on_discovered)

    try:
        await scanner.start()
        await asyncio.sleep(10)
    finally:
        await scanner.stop()

    unique_devices = []
    seen_addresses = set()

    for device in devices:
        address = device.address
        if address not in seen_addresses:
            seen_addresses.add(address)
            unique_devices.append(device)

    ble_devices = []

    for device in unique_devices:
        ble_devices.append({"name": str(device), "address": device.address})

    return ble_devices


# def data_stream():
#     print("data stream")
#     while game_data["game_active"]:
#         # stuur de data naar de frontend
#         socketio.emit("B2F_data", combined_data["metingen"])
#         socketio.sleep(0.1)
#         current_time = datetime.now()
#         if current_time > game_data["end_time"]:
#             game_data["game_active"] = False
#             # start de end of game functie
#             end_of_game()
#             break


# def end_of_game():
#     print("end of game")
#     # start de data opslaan functie
#     db.opslaan_db(combined_data["spelers"], combined_data["metingen"], conn, cursor)


if __name__ == "__main__":
    try:
        print("**** Starting APP ****")
        # socketio.run(app, debug=True)
        socketio.run(app, debug=False, host="0.0.0.0")
    except KeyboardInterrupt:
        print("KeyboardInterrupt exception is caught")
    finally:
        print("Einde")
        conn.close()
