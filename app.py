import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SELY_CLIENT_ID = os.environ.get('SELY_CLIENT_ID')
SELY_CLIENT_SECRET = os.environ.get('SELY_CLIENT_SECRET')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the SEO Selly API!", 200

def get_selly_access_token():
    url = 'https://ajsklep.pl/api/auth/access_token'
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        'client_id': SELY_CLIENT_ID,
        'client_secret': SELY_CLIENT_SECRET,
        'scope': 'READWRITE'
    }
    response = requests.post(url, json=data, headers=headers)
    app.logger.info(f"Response from Selly API: {response.json()}")
    response.raise_for_status()
    access_token = response.json().get('access_token')
    if not access_token:
        app.logger.error(f"Invalid response from Selly API: {response.json()}")
        raise ValueError("Failed to retrieve access token from Selly API")
    return access_token

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        access_token = get_selly_access_token()
        url = 'https://ajsklep.pl/api/categories'
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Log the fetched categories
        app.logger.info(response.json())
        
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error fetching categories: {str(e)}")
        return jsonify({'error': str(e)}), 401

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    try:
        data = request.json
        if data is None:
            raise ValueError("Request JSON is None")
        category_name = data.get('category_name')
        if not category_name:
            return jsonify({'error': 'Category name is required'}), 400

        prompt = f"Generate a product description for the category: {category_name}"
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'gpt-4',
                'messages': [{'role': 'system', 'content': 'You are a helpful assistant.'},
                             {'role': 'user', 'content': prompt}]
            }
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error generating description: {str(e)}")
        return jsonify({'error': str(e)}), 401
    except ValueError as ve:
        app.logger.error(f"Value error: {str(ve)}")
        return jsonify({'error': str(ve)}), 400

if __name__ == '__main__':
    app.run(debug=True)
