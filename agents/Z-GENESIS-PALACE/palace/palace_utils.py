import sqlite3

def init_db(db="DSN-PALACE.db", schema="palace/schema.sql"):
    conn = sqlite3.connect(db)
    with open(schema, "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
