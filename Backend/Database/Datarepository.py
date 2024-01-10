def get_speler_id(cursor, speler):
    cursor.execute(
        "SELECT id FROM spelers WHERE achternaam = ? AND voornaam = ? AND email = ?",
        (speler["achternaam"], speler["voornaam"], speler["email"]),
    )
    result = cursor.fetchone()
    return result[0] if result else None

def insert_speler(cursor, speler):
    cursor.execute(
        "INSERT INTO spelers (achternaam, voornaam, email) VALUES (?, ?, ?)",
        (speler["achternaam"], speler["voornaam"], speler["email"]),
    )
    return cursor.lastrowid

def insert_metingen(cursor, speler_id, wedstrijd_id, metingen_data):
    for meting in metingen_data:
        if meting["speler_id"] == speler_id:
            cursor.execute(
                "INSERT INTO metingen (speler_id, wedstrijd_id, maxSnelheid, afstand, gemVermogen) VALUES (?, ?, ?, ?, ?)",
                (speler_id, wedstrijd_id, meting["maxSnelheid"], meting["afstand"], meting["gemVermogen"]),
            )

def update_winnaar(cursor, speler_id, wedstrijd_id):
    cursor.execute(
        "UPDATE wedstrijden SET winnaar = ? WHERE nummer = ?",
        (speler_id, wedstrijd_id),
    )
