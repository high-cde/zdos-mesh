import sqlite3
from datetime import datetime

class PalaceIndexer:
    def __init__(self, db="DSN-PALACE.db"):
        self.db = db

    def add_drawer(self, room_id, content):
        conn = sqlite3.connect(self.db)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO drawers(room_id, content, timestamp) VALUES (?, ?, ?)",
            (room_id, content, datetime.utcnow().isoformat())
        )
        conn.commit()
        conn.close()
