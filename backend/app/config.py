import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("Missing SUPABASE_URL environment variable")

if not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_KEY environment variable")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
