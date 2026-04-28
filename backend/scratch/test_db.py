import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

user = os.getenv("POSTGRES_USER", "postgres")
password = os.getenv("POSTGRES_PASSWORD", "password")
host = os.getenv("POSTGRES_HOST", "localhost")
port = os.getenv("POSTGRES_PORT", "5432")
db = os.getenv("POSTGRES_DB", "parcial_db")

url = f"postgresql://{user}:{password}@{host}:{port}/{db}"
print(f"Testing connection to: {url}")

try:
    conn = psycopg2.connect(url)
    print("Connection successful!")
    conn.close()
except UnicodeDecodeError as ude:
    try:
        print(f"Error decoded with cp1252: {ude.object.decode('cp1252')}")
    except:
        print("Failed to decode even with cp1252.")
except Exception as e:
    print(f"General Error: {e}")
