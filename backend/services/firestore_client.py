import os
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import Client

_CRED_PATH = os.path.join(
    os.path.dirname(__file__), '..', '..', 'majuai-firebase-adminsdk.json'
)
_DATABASE = 'majuai-db'

if not firebase_admin._apps:
    firebase_admin.initialize_app(credentials.Certificate(_CRED_PATH))

db: Client = firestore.client(database_id=_DATABASE)
