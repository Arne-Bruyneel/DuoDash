import asyncio
from bleak import BleakClient

device_address = "E3:B4:38:07:DA:17"
characteristic_uuid = "00002ad2-0000-1000-8000-00805f9b34fb"


async def notification_handler(sender, data):
    """Callback for handling notifications."""
    if len(data) >= 6:
        speed_bytes = data[2:4]
        instant_speed = int.from_bytes(speed_bytes, "little", signed=False)
        instant_speed /= 100  # Scale to km/h
        print(f"Instant Speed: {instant_speed} km/h")
    else:
        print("Data is too short.")


async def main():
    async with BleakClient(device_address) as client:
        if client.is_connected:
            await client.start_notify(characteristic_uuid, notification_handler)
            print("Notification started. Press Ctrl+C to stop...")
            try:
                while True:
                    await asyncio.sleep(1)
            except KeyboardInterrupt:
                print("Stopping notifications...")
                await client.stop_notify(characteristic_uuid)
        else:
            print(f"Failed to connect to {device_address}")


if __name__ == "__main__":
    asyncio.run(main())
