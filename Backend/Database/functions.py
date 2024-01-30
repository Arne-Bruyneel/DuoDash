from Database.Database import get_db_connection
from Database.Datarepository import Datarepository as dr
from pysqlcipher3 import dbapi2 as sqlite

def opslaan_db(spelers_data, metingen_data, conn, cursor, paswoord):
    try:
        # conn = get_db_connection()
        # cursor = conn.cursor()

        with conn:
            try:
                countinsert = 0
                cursor.execute(f"PRAGMA key = '{paswoord}';")
                if paswoord is None:
                    raise EnvironmentError("Database password not set in environment variables")
                cursor.execute("INSERT INTO wedstrijden DEFAULT VALUES")
                wedstrijd_id = cursor.lastrowid

                for speler in spelers_data:
                    speler_id = dr.get_speler_id(cursor, speler, paswoord)
                    if speler_id is None:
                        speler_id = dr.insert_speler(cursor, speler, paswoord)

                    dr.insert_metingen(cursor, speler_id, wedstrijd_id, metingen_data, paswoord, countinsert)

                    countinsert += 1

                    if countinsert > 1:
                        countinsert = 0

                    if speler["winnaar"]:
                        dr.update_winnaar(cursor, speler_id, wedstrijd_id, paswoord)

            except sqlite.Error as e:
                print(f"An error occurred while executing SQL: {e}")
                raise e

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise e

    finally:
        # conn.close()
        print("Spelersdata is succesvol ingevoerd in de database.")



