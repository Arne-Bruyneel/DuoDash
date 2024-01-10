from Database import get_db_connection
from Datarepository import Datarepository as dr
import sqlite3

spelers_data = [
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
]

metingen_data = [
    {"speler_id": 1, "maxSnelheid": 25.5, "afstand": 700, "gemVermogen": 200},
    {"speler_id": 2, "maxSnelheid": 22.0, "afstand": 850, "gemVermogen": 220},
]

def main():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        with conn:
            try:
                cursor.execute("INSERT INTO wedstrijden DEFAULT VALUES")
                wedstrijd_id = cursor.lastrowid

                for speler in spelers_data:
                    speler_id = dr.get_speler_id(cursor, speler)
                    if speler_id is None:
                        speler_id = dr.insert_speler(cursor, speler)

                    dr.insert_metingen(cursor, speler_id, wedstrijd_id, metingen_data)

                    if speler["winnaar"]:
                        dr.update_winnaar(cursor, speler_id, wedstrijd_id)

            except sqlite3.Error as e:
                print(f"An error occurred while executing SQL: {e}")
                raise e

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise e

    finally:
        if conn:
            conn.close()

    print("Spelersdata is succesvol ingevoerd in de database.")

if __name__ == "__main__":
    main()
