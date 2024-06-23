import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Pobieranie danych uwierzytelniających z zmiennych środowiskowych
CLIENT_ID = os.getenv('SELLY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SELLY_CLIENT_SECRET')

def get_access_token():
    url = "https://ajsklep.pl/api/v2/auth/login"
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": "READWRITE"
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    response_data = response.json()
    return response_data['access_token']

@app.route('/')
def home():
    return "Hello, this is the Selly API integration!"

@app.route('/api/category')
def get_category():
    access_token = get_access_token()
    url = "https://ajsklep.pl/api/v2/category"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
