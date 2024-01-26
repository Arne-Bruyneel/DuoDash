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

combined_data = {}

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

@socketio.on("FT2B_new_game")
def new_game(json=None):
    print("new game")
    emit("B2FS_new_game", broadcast=True)

@socketio.on("FT2B_go_to_instructions")
def go_to_instructions(json=None):
    print("go to instructions")
    emit("B2FS_go_to_instructions", broadcast=True)

@socketio.on("FT2B_leaderboard")
def leaderboard(json=None):
    print("leaderboard pressed")
    emit("B2FS_leaderboard", broadcast=True)

@socketio.on("FS2B_go_to_choice")
def go_to_choice(json=None):
    print("go to choice")
    emit("B2FT_go_to_choice", broadcast=True)

@socketio.on("FT2B_start_countdown")
def start_countdown(json=None):
    print("start countdown")
    emit("B2FS_start_countdown", broadcast=True)


@socketio.on("FT2B_show_map")
def show_map(jsonObject):
    emit("B2FS_show_map", {"data": jsonObject}, broadcast=True)

@socketio.on("FT2B_go_to_countdown")
def go_to_countdown(json=None):
    emit("B2FS_go_to_countdown", broadcast=True)


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
def startgame(jsonObject):
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

        if data_list[0]["side"] == "left":
            player1_speeds.append(data_list[0]["data"]["speed"])
            player1_power.append(data_list[0]["data"]["power"])
            player2_speeds.append(data_list[1]["data"]["speed"])
            player2_power.append(data_list[1]["data"]["power"])
        else:
            player1_speeds.append(data_list[1]["data"]["speed"])
            player1_power.append(data_list[1]["data"]["power"])
            player2_speeds.append(data_list[0]["data"]["speed"])
            player2_power.append(data_list[0]["data"]["power"])

        socketio.sleep(0.1)
        countdown -= 1

    print("done")
    device_data.clear()
    print("cleared")

    p1_top_speed = max(player1_speeds)
    p1_dist = (get_average(player1_speeds) * (1000/3600)) * 15
    p1_avg_power = get_average(player1_power)

    print(p1_top_speed)
    print(p1_dist)
    print(p1_avg_power)

    p2_top_speed = max(player2_speeds)
    p2_dist =  (get_average(player2_speeds) * (1000/3600)) * 15
    p2_avg_power = get_average(player2_power)

    print(p2_top_speed)
    print(p2_dist)
    print(p2_avg_power)

    combined_data = {
    "spelers": [
        {
            "id": 1,
            "achternaam": jsonObject["spelers"][0]["achternaam"],
            "voornaam": jsonObject["spelers"][0]["voornaam"],
            "email": jsonObject["spelers"][0]["email"],
            "winnaar": False,
        },
        {
            "id": 2,
            "achternaam": jsonObject["spelers"][1]["email"],
            "voornaam": jsonObject["spelers"][1]["email"],
            "email": jsonObject["spelers"][1]["email"],
            "winnaar": False,
        },
    ],
    "metingen": [
        {"speler_id": 1, "maxSnelheid": round(p1_top_speed, 2), "afstand": round(p1_dist, 2), "gemVermogen": round(p1_avg_power, 2)},
        {"speler_id": 2, "maxSnelheid": round(p2_top_speed, 2), "afstand": round(p2_dist, 2), "gemVermogen": round(p2_avg_power, 2)},
    ],
    }

    if p1_dist > p2_dist:
        combined_data["spelers"][0]["winnaar"] = True
    else:
        combined_data["spelers"][1]["winnaar"] = True

    db.opslaan_db(combined_data["spelers"], combined_data["metingen"], conn, cursor, paswoord)

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
