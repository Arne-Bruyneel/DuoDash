import asyncio
import sys
import json
from bleak import BleakClient

device1 = sys.argv[1]
device2 = sys.argv[2]

conencted1 = False
connected2 = False

characteristic_speed = "00002ad2-0000-1000-8000-00805f9b34fb"
characteristic_power = "00002a63-0000-1000-8000-00805f9b34fb"


def process_bytes(data):
    received_bytes = data[2:4]
    int_value = int.from_bytes(received_bytes, "little", signed=False)
    return int_value


def write_to_json(filename, value):
    deviceName = ""

    if conencted1:
        deviceName = device1
    elif conencted2:
        deviceName = device2

    with open(f"Backend/Device/{filename}.json", "r") as file:
        data = json.load(file)

    data.append({"device": deviceName, "value": value})

    with open(f"Backend/Device/{filename}.json", "w") as file:
        json.dump(data, file)


async def notification_handler(sender, data):
    if len(data) > 8:
        power = process_bytes(data)
        write_to_json("power", power)
    else:
        speed = process_bytes(data)
        speed /= 100
        write_to_json("speed", speed)


async def conenct_to_device(device_address):
    global conencted1
    global connected2

    for attempt in range(1, 4):
        try:
            async with BleakClient(device_address) as client:
                if client.is_connected:
                    if not conencted1:
                        conencted1 = True
                    else:
                        connected2 = True

                    await client.start_notify(
                        characteristic_speed, notification_handler
                    )
                    await client.start_notify(
                        characteristic_power, notification_handler
                    )

                    print("Notification started")

                    with open("Backend/Device/devices.json", "r") as file:
                        data = json.load(file)

                    data.append(device_address)

                    with open("Backend/Device/devices.json", "w") as file:
                        json.dump(data, file)

                    while True:
                        await asyncio.sleep(0.5)

                else:
                    print(f"Failed to connect to {device_address}")
        except:
            pass

        print(f"attempt {attempt + 1}")
        await asyncio.sleep(1)


async def connect_2devices(address1, address2):
    device1_handle = asyncio.create_task(conenct_to_device(address1))
    # debugevice2_handle = asyncio.create_task(device2(address2))

    # await asyncio.gather(device1_handle, device2_handle)
    await asyncio.gather(device1_handle)


asyncio.run(connect_2devices(device1, device2))
