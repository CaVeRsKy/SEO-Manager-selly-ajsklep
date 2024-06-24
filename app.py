import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SELY_CLIENT_ID = os.environ.get('SELY_CLIENT_ID')
SELY_CLIENT_SECRET = os.environ.get('SELY_CLIENT_SECRET')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

def get_selly_access_token():
    url = 'https://ajsklep.pl/api/auth/access_token'
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        'grant_type': 'client_credentials',
        'scope': 'READWRITE',
        'client_id': SELY_CLIENT_ID,
        'client_secret': SELY_CLIENT_SECRET
    }
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()['access_token']

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
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error getting categories: {str(e)}")
        return jsonify({'error': str(e)}), 401

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    try:
        data = request.json
        category_name = data.get('category_name')
        if not category_name:
            return jsonify({'error': 'Category name is required'}), 400

        prompt = f"Generate a product description for the category: {category_name}"
        response = requests.post(
            'https://api.openai.com/v1/engines/gpt-4/completions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json',
            },
            json={
                'prompt': prompt,
                'max_tokens': 150,
            }
        )
        if response.status_code == 400:
            return jsonify({'error': 'Bad Request to OpenAI'}), 400
        response.raise_for_status()
        generated_text = response.json()['choices'][0]['text']
        return jsonify({'description': generated_text.strip()})
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error generating description: {str(e)}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/env', methods=['GET'])
def get_env():
    return jsonify({
        'SELY_CLIENT_ID': SELY_CLIENT_ID,
        'SELY_CLIENT_SECRET': SELY_CLIENT_SECRET,
        'OPENAI_API_KEY': OPENAI_API_KEY
    })

if __name__ == '__main__':
    app.run(debug=True)
