from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

CLIENT_ID = os.getenv('SELLY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SELLY_CLIENT_SECRET')
API_URL = 'https://ajsklep.pl/api/'

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        response = requests.get(f'{API_URL}/categories', headers={
            'Client-ID': CLIENT_ID,
            'Client-Secret': CLIENT_SECRET,
            'scope': 'READWRITE'
        })
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    data = request.get_json()
    category_id = data.get('categoryId')
    try:
        # Integrate with your GPT-4o model or similar service here
        description = generate_description_for_category(category_id)
        return jsonify({'description': description})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_description_for_category(category_id):
    # Placeholder for actual description generation logic
    return f'Description for category {category_id}'

if __name__ == '__main__':
    app.run(debug=True)
