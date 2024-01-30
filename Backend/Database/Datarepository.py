class Datarepository:
    def get_speler_id(cursor, speler, paswoord):
        cursor.execute(f"PRAGMA key = '{paswoord}';")
        cursor.execute(
            "SELECT id FROM spelers WHERE achternaam = ? AND voornaam = ? AND email = ?",
            (speler["achternaam"], speler["voornaam"], speler["email"]),
        )
        result = cursor.fetchone()
        return result[0] if result else None

    def insert_speler(cursor, speler, paswoord):
        cursor.execute(f"PRAGMA key = '{paswoord}';")
        cursor.execute(
            "INSERT INTO spelers (achternaam, voornaam, email) VALUES (?, ?, ?)",
            (speler["achternaam"], speler["voornaam"], speler["email"]),
        )
        return cursor.lastrowid

    def insert_metingen(cursor, speler_id, wedstrijd_id, metingen_data, paswoord):
        for meting in metingen_data:
            if meting["speler_id"] == speler_id:
                cursor.execute(f"PRAGMA key = '{paswoord}';")
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

    def update_winnaar(cursor, speler_id, wedstrijd_id, paswoord):
        cursor.execute(f"PRAGMA key = '{paswoord}';")
        cursor.execute(
            "UPDATE wedstrijden SET winnaar = ? WHERE nummer = ?",
            (speler_id, wedstrijd_id),
        )

    def get_leaderboard(cursor, paswoord):
        cursor.execute(f"PRAGMA key = '{paswoord}';")
        query = """
        SELECT 
            s.id, 
            s.voornaam, 
            s.achternaam, 
            MAX(m.afstand) AS max_afstand,
            MAX(m.maxSnelheid) AS max_snelheid
        FROM 
            spelers s
        JOIN 
            metingen m ON s.id = m.speler_id
        GROUP BY 
            s.id, s.voornaam, s.achternaam
        ORDER BY 
            max_afstand DESC
        LIMIT 11;
        """
        players = cursor.execute(query).fetchall()
        return players

    def get_all_players(cursor, paswoord):
        cursor.execute(f"PRAGMA key = '{paswoord}';")
        query = """
        SELECT 
            s.id, 
            s.voornaam, 
            s.achternaam, 
            MAX(m.afstand) AS max_afstand,
            MAX(m.maxSnelheid) AS max_snelheid
        FROM 
            spelers s
        JOIN 
            metingen m ON s.id = m.speler_id
        GROUP BY 
            s.id, s.voornaam, s.achternaam
        ORDER BY 
            max_afstand DESC
        """
        players = cursor.execute(query).fetchall()
        return players

    def get_best_player(cursor, paswoord):
        cursor.execute(f"PRAGMA key = '{paswoord}';")
        query = """
        SELECT 
            s.id, 
            s.voornaam, 
            s.achternaam, 
            MAX(m.afstand) AS max_afstand,
            MAX(m.maxSnelheid) AS max_snelheid
        FROM 
            spelers s
        JOIN 
            metingen m ON s.id = m.speler_id
        GROUP BY 
            s.id, s.voornaam, s.achternaam
        ORDER BY 
            max_afstand DESC
        LIMIT 11;
        """
        players = cursor.execute(query).fetchall()
        return players
