import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SELY_CLIENT_ID = os.getenv('SELY_CLIENT_ID')
SELY_CLIENT_SECRET = os.getenv('SELY_CLIENT_SECRET')
SELY_API_BASE_URL = 'https://ajsklep.pl/api'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return "SEO Manager for Selly"

@app.route('/api/categories', methods=['GET'])
def get_categories():
    url = f"{SELY_API_BASE_URL}/categories"
    headers = {
        'Authorization': f'Bearer {SELY_CLIENT_ID}',
        'Content-Type': 'application/json'
    }
    data = {
        'client_id': SELY_CLIENT_ID,
        'client_secret': SELY_CLIENT_SECRET,
        'scope': 'READWRITE'
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch categories'}), response.status_code

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    category_id = request.json.get('categoryId')

    openai_url = "https://api.openai.com/v1/engines/gpt-4o/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "prompt": f"Generate a detailed description for the category with ID: {category_id}",
        "max_tokens": 150
    }

    response = requests.post(openai_url, headers=headers, json=data)
    if response.status_code == 200:
        description = response.json().get('choices', [{}])[0].get('text', '')
        return jsonify({'description': description})
    else:
        return jsonify({'error': 'Failed to generate description'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
