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

device_left = ""
device_right = ""
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
    print("F2B_connect")
    device_address = jsonObject["devices"][0]

    # defining where which device is positioned
    if device_address[0] == "L":
        device_left = device_address[1:]
    else:
        device_right = device_address[1:]

    # resetting files
    with open("Backend/Device/devices.json", "w") as file:
        json.dump([], file)

    with open("Backend/Device/data.json", "w") as file:
        json.dump([], file)

    # startin extra python script for connection
    process = subprocess.Popen(
        ["python", "Backend/Device/device.py", device_address[1:], "none"]
    )

    # checking if devices are connected
    while True:
        with open("Backend/Device/devices.json", "r") as file:
            data = json.load(file)

        print(len(data))

        if len(data) > 0:
            emit("B2F_connected")
            break

        socketio.sleep(1)


@socketio.on("F2B_startgame")
def startgame():
    print("game started")

    player1_speeds = []
    player2_speeds = []
    player1_power = []
    player2_power = []

    countdown = 15
    while countdown > 0:
        try:
            speed = read_json_file("speed")

            if speed[0]["device"] == device_left:
                player1.append(speed[0]["value"])
                player2.append(speed[1]["value"])
            else:
                player1.append(speed[1]["value"])
                player2.append(speed[0]["value"])
        except:
            player1.append(get_average(player1_speeds))
            player2.append(get_average(player2_speeds))

        try:
            power = read_json_file("power")

            if power[0]["device"] == device_left:
                player1.append(power[0]["value"])
                player2.append(power[1]["value"])
            else:
                player1.append(power[1]["value"])
                player2.append(power[0]["value"])

        except:
            player1.append(get_average(player1_power))
            player2.append(get_average(player2_power))

        emit(
            "B2F_data",
            {
                "player1": [[player1_speeds][-1], [player1_power][-1]],
                "player1": [[player2_speeds][-1], [player2_power][-1]],
            },
        )

        socketio.sleep(1)
        countdown -= 1

    p1_top_speed = max(player1_speeds)
    p1_dist = get_average(player1_speeds) * 15
    p1_avg_power = get_average(player1_power)

    p2_top_speed = max(player2_speeds)
    p2_dist = get_average(player2_speeds) * 15
    p2_avg_power = get_average(player2_power)

    combined_data["metingen"][0]["maxSnelheid"] = p1_top_speed
    combined_data["metingen"][0]["afstand"] = p1_dist
    combined_data["metingen"][0]["gemVermogen"] = p1_avg_power

    combined_data["metingen"][1]["maxSnelheid"] = p2_top_speed
    combined_data["metingen"][1]["afstand"] = p2_dist
    combined_data["metingen"][1]["gemVermogen"] = p2_avg_power

    db.opslaan_db(combined_data["spelers"], combined_data["metingen"], conn, cursor)

    print("saved db")


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


def get_average(list_of_values):
    return sum(list_of_values) / len(list_of_values)


def read_json_file(filename):
    last_entry_per_device = {}

    with open(f"Backend/Device/{filename}.json", "r") as file:
        data = json.load(file)

    for d in data:
        device_id = d["device"]
        last_entry_per_device[device_id] = d

    return list(last_entry_per_device.values())


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
