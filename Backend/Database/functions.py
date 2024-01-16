from Database.Database import get_db_connection
from Database.Datarepository import Datarepository as dr
import sqlite3

def opslaan_db(spelers_data, metingen_data, conn, cursor):
    try:
        # conn = get_db_connection()
        # cursor = conn.cursor()

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
        # conn.close()
        print("Spelersdata is succesvol ingevoerd in de database.")



