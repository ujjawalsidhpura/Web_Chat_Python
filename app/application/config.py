from dotenv import load_dotenv
from pathlib import Path
import os

# Load .ENV
env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)
