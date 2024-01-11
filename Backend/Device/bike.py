import asyncio
import struct

device_address = "E3:B4:38:07:DA:17"
characteristic_uuids = {
    "speed": "00002ad2-0000-1000-8000-00805f9b34fb",
    "power": "00002a63-0000-1000-8000-00805f9b34fb",
}


async def notification_handler(
    sender, data, characteristic, speed_values, power_values, elapsed_time
):
    """Callback for handling notifications."""
    if len(data) >= 4:
        value_bytes = data[2:4]
        value = int.from_bytes(value_bytes, "little", signed=False)
        if characteristic == "speed":
            value /= 100
            speed_values.append(value)
            print(f"Instant Speed: {value} km/h")

            # socketio.emit("live_speed", value)

        elif characteristic == "power":
            power_values.append(value)
            print(f"Instantaneous Power: {value} Watts")

            # socketio.emit("live_power", value)

    else:
        print(f"{characteristic.capitalize()} data is too short.")

    elapsed_time += 1


async def main():
    async with BleakClient(device_address) as client:
        if client.is_connected:
            speed_values = []
            power_values = []

            elapsed_time = 0

            await client.start_notify(
                characteristic_uuids["speed"],
                lambda sender, data: notification_handler(
                    sender, data, "speed", speed_values, power_values, elapsed_time
                ),
            )
            await client.start_notify(
                characteristic_uuids["power"],
                lambda sender, data: notification_handler(
                    sender, data, "power", speed_values, power_values, elapsed_time
                ),
            )
            print("Notifications started. Press Ctrl+C to stop...")

            try:
                # Countdown for 15 seconds
                countdown = 15
                while countdown > 0:
                    print(f"Countdown: {countdown} seconds remaining...")
                    await asyncio.sleep(1)
                    countdown -= 1

                # Run for 15 seconds and collect data
                for _ in range(15):
                    await asyncio.sleep(1)

                # Calculate max speed, total distance, and average power for the 15-second interval
                max_speed = max(speed_values)
                total_distance = (
                    sum(speed_values) * 15 / 3600
                )  # Calculate total distance in km
                average_power = sum(power_values) / len(power_values)
                print(f"Max Speed: {max_speed} km/h")
                print(f"Total Distance: {total_distance} km")
                print(f"Average Power: {average_power} Watts")

                # Emit the calculated values here

                print("Stopping notifications...")
                await client.stop_notify(characteristic_uuids["speed"])
                await client.stop_notify(characteristic_uuids["power"])
            except KeyboardInterrupt:
                print("Stopping notifications...")
                await client.stop_notify(characteristic_uuids["speed"])
                await client.stop_notify(characteristic_uuids["power"])
        else:
            print(f"Failed to connect to {device_address}")


if __name__ == "__main__":
    # Flask-SocketIO app here
    asyncio.run(main())
