import sqlite3


def get_speler_id(cursor, speler):
    cursor.execute(
        "SELECT id FROM spelers WHERE achternaam = ? AND voornaam = ? AND email = ?",
        (speler["achternaam"], speler["voornaam"], speler["email"]),
    )
    resultaat = cursor.fetchone()
    return resultaat[0] if resultaat else None


# Veronderstel dat dit de data is die je hebt verzameld
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

# Database connectie
conn = sqlite3.connect("FietsDb.db")
cursor = conn.cursor()

# Data in de database invoegen
with conn:
    cursor.execute("INSERT INTO wedstrijden DEFAULT VALUES")
    wedstrijd_id = cursor.lastrowid

    for speler in spelers_data:
        speler_id = get_speler_id(cursor, speler)
        if speler_id is None:
            cursor.execute(
                "INSERT INTO spelers (achternaam, voornaam, email) VALUES (?, ?, ?)",
                (speler["achternaam"], speler["voornaam"], speler["email"]),
            )
            speler_id = cursor.lastrowid  # Haal de nieuwe ID op

        for meting in metingen_data:
            if meting["speler_id"] == speler_id:
                cursor.execute(
                    "INSERT INTO metingen (speler_id, wedstrijd_id, maxSnelheid, afstand, gemVermogen) VALUES (?, ?, ?, ?, ?)",
                    (
                        speler_id,
                        wedstrijd_id,
                        meting["maxSnelheid"],
                        meting["afstand"],
                        meting["gemVermogen"],
                    ),
                )

        if speler["winnaar"]:
            cursor.execute(
                "UPDATE wedstrijden SET winnaar = ? WHERE nummer = ?",
                (speler_id, wedstrijd_id),
            )

    conn.commit()

print("Spelersdata is succesvol ingevoerd in de database.")
