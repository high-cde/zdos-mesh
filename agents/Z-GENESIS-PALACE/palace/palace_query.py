import sqlite3

class PalaceQuery:
    def __init__(self, db="DSN-PALACE.db"):
        self.db = db

    def search_drawers(self, text):
        conn = sqlite3.connect(self.db)
        cur = conn.cursor()
        cur.execute(
            "SELECT id, room_id, content, timestamp FROM drawers WHERE content LIKE ?",
            (f"%{text}%",)
        )
        rows = cur.fetchall()
        conn.close()
        return rows
