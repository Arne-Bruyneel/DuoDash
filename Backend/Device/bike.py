import asyncio
import sys
import json
import time
from bleak import BleakClient

device1 = sys.argv[1]
device2 = sys.argv[2]

conencted1 = False
connected2 = False

characteristic_uuid = "00002ad2-0000-1000-8000-00805f9b34fb"


async def notification_handler(sender, data):
    if len(data) >= 6:
        speed_bytes = data[2:4]
        instant_speed = int.from_bytes(speed_bytes, "little", signed=False)
        instant_speed /= 100

        deviceName = ""

        if conencted1:
            deviceName = device1
        elif conencted2:
            deviceName = device2

        with open("data.json", "r") as file:
            data = json.load(file)

        data.append({"device": deviceName, "time": time.time(), "value": instant_speed})

        with open("data.json", "w") as file:
            json.dump(data, file)

    else:
        print("Data is too short.")


async def conenct_to_device(device_address):
    global conencted1
    global connected2

    async with BleakClient(device_address) as client:
        if client.is_connected:
            if not conencted1:
                conencted1 = True
            else:
                connected2 = True

            await client.start_notify(characteristic_uuid, notification_handler)
            print("Notification started")

            with open("devices.json", "r") as file:
                data = json.load(file)

            if len(data) < 2:
                data.append(device_address)

                with open("devices.json", "w") as file:
                    json.dump(data, file)

            while True:
                await asyncio.sleep(0.1)

        else:
            print(f"Failed to connect to {device_address}")


async def connect_2devices(address1, address2):
    with open("devices.json", "w") as file:
        json.dump([], file)

    with open("data.json", "w") as file:
        json.dump([], file)

    device1_handle = asyncio.create_task(conenct_to_device(address1))
    # debugevice2_handle = asyncio.create_task(device2(address2))

    # await asyncio.gather(device1_handle, device2_handle)
    await asyncio.gather(device1_handle)


asyncio.run(connect_2devices(device1, device2))
