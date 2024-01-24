from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS
from contextlib import closing
from datetime import datetime, timedelta
from Database.Database import get_db_connection, query_db
from Database.Datarepository import Datarepository as dr
import Database.functions as db
import time
import asyncio
import json
import threading
from bleak import BleakScanner, BleakClient
from dotenv import load_dotenv
import os

# import logging
# logging.basicConfig(level=logging.DEBUG)

device_left = ""
characteristic_speed = "00002ad2-0000-1000-8000-00805f9b34fb"
characteristic_power = "00002a63-0000-1000-8000-00805f9b34fb"
device_data = {}

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
load_dotenv()
paswoord = os.getenv("DB_PWD")

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


@app.route("/api/v1/leaderboard", methods=["GET"])
def leaderboard():
    if request.method == "GET":
        result = jsonify(dr.get_leaderboard(conn, paswoord))
        # print(f'leaderboard: {result}')
        return result


@app.route("/api/v1/results", methods=["GET"])
def results():
    if request.method == "GET":
        try:
            return combined_data
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Method not allowed"}), 405


# Socket IO Events
@socketio.on("connect")
def initial_connection():
    print("A new client connected")


##test
@socketio.on("test_getresults")
def get_results(json=None):
    print("socket_showresults")
    emit("B2FS_show_result", {"data": combined_data}, broadcast=True)


# test


@socketio.on("FT2B_start_countdown")
def start_countdown(json=None):
    print("start countdown")
    emit("B2FS_start_countdown", broadcast=True)


@socketio.on("FT2B_show_map")
def show_map(jsonObject):
    emit("B2FS_show_map", {"data": jsonObject}, broadcast=True)


@socketio.on("FT2B_show_player1_setup")
def show_player1(jsonObject):
    print("show player 1")
    emit("B2FS_show_player1_setup", {"data": jsonObject}, broadcast=True)


@socketio.on("FT2B_show_player2_setup")
def show_player2(jsonObject):
    emit("B2FS_show_player2_setup", {"data": jsonObject}, broadcast=True)


@socketio.on("FT2B_show_player_setup")
def show_player(jsonObject):
    emit("B2FS_show_player_setup", {"data": jsonObject}, broadcast=True)


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
    global device_left
    print("F2B_connect")
    device_address1 = jsonObject["devices"][0]
    device_address2 = jsonObject["devices"][1]

    # defining where which device is positioned
    if device_address1[0] == "L":
        device_left = device_address1[1:]
    else:
        device_left = device_address2[1:]

    thread1 = start_bleak_thread(device_address1[1:])
    thread2 = start_bleak_thread(device_address2[1:])

    connection_count = len(device_data)
    while connection_count < 2:
        connection_count = len(device_data)
        socketio.sleep(1.0)

    emit("B2F_connected", broadcast=True)


@socketio.on("FS2B_start_game")
def startgame(json=None):
    print("game started")

    global device_left

    player1_speeds = []
    player2_speeds = []
    player1_power = []
    player2_power = []

    countdown = 150
    while countdown > 0:
        data_list = [
            {
                "side": "left" if identifier == device_left else "right",
                "data": data,
            }
            for identifier, data in device_data.items()
        ]

        emit("B2F_data", data_list, broadcast=True)

        socketio.sleep(0.1)
        countdown -= 1

    print("done")
    device_data.clear()
    print("cleared")

    # p1_top_speed = max(player1_speeds)
    # p1_dist = get_average(player1_speeds) * 15
    # p1_avg_power = get_average(player1_power)

    # p2_top_speed = max(player2_speeds)
    # p2_dist = get_average(player2_speeds) * 15
    # p2_avg_power = get_average(player2_power)

    # combined_data["metingen"][0]["maxSnelheid"] = p1_top_speed
    # combined_data["metingen"][0]["afstand"] = p1_dist
    # combined_data["metingen"][0]["gemVermogen"] = p1_avg_power

    # combined_data["metingen"][1]["maxSnelheid"] = p2_top_speed
    # combined_data["metingen"][1]["afstand"] = p2_dist
    # combined_data["metingen"][1]["gemVermogen"] = p2_avg_power

    # db.opslaan_db(combined_data["spelers"], combined_data["metingen"], conn, cursor)

    # print("saved db")


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


def process_bytes(data):
    received_bytes = data[2:4]
    int_value = int.from_bytes(received_bytes, "little", signed=False)
    return int_value


def create_notification_handler(device_identifier):
    async def notification_handler(sender, data):
        if len(data) > 8:
            power = process_bytes(data)
            device_data[device_identifier] = device_data.get(device_identifier, {})
            device_data[device_identifier]["power"] = power
        else:
            speed = process_bytes(data)
            speed /= 100
            device_data[device_identifier] = device_data.get(device_identifier, {})
            device_data[device_identifier]["speed"] = speed

        device_data[device_identifier]["time"] = time.time()

    return notification_handler


async def connect_and_run(address):
    for attempt in range(1, 10):
        try:
            async with BleakClient(address) as client:
                if client.is_connected:
                    print(f"connected {address}")

                    device_handler = create_notification_handler(address)

                    await client.start_notify(characteristic_speed, device_handler)
                    await client.start_notify(characteristic_power, device_handler)

                    while True:
                        await asyncio.sleep(1)

        except:
            pass

        print(f"attempt {attempt + 1} {address}")
        await asyncio.sleep(1)


def run_bleak(address):
    asyncio.run(connect_and_run(address))


def start_bleak_thread(address):
    thread = threading.Thread(target=run_bleak, args=(address,))
    thread.start()
    return thread


def get_average(list_of_values):
    return sum(list_of_values) / len(list_of_values)


def check_heartbeat():
    while True:
        print("checking heartbeat")

#         if len(device_data) > 0:
#             for device_identifier, data in device_data.items():
#                 timestamp = data["time"]
#                 current_time = time.time()
#                 seconds_ago = current_time - timestamp

#                 if int(seconds_ago) < 5:
#                     print("emit")
#                     socketio.emit("B2F_heartbeat", broadcast=True)

#         time.sleep(5)


# threading.Timer(5, check_heartbeat).start()

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
