import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["https://caversky.github.io"])

SELY_CLIENT_ID = os.environ.get('SELY_CLIENT_ID')
SELY_CLIENT_SECRET = os.environ.get('SELY_CLIENT_SECRET')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

if not SELY_CLIENT_ID or not SELY_CLIENT_SECRET or not OPENAI_API_KEY:
    raise ValueError("Environment variables SELY_CLIENT_ID, SELY_CLIENT_SECRET, and OPENAI_API_KEY must be set")

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
        'grant_type': 'client_credentials',
        'scope': 'READWRITE'
    }
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    access_token = response.json().get('access_token')
    if not access_token:
        raise ValueError("Failed to retrieve access token from Selly API")
    return access_token

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        access_token = get_selly_access_token()
        if access_token is None:
            return jsonify({'error': 'Failed to retrieve access token'}), 401
        url = 'https://ajsklep.pl/api/categories'
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Log the parameters for debugging
        app.logger.info(f"Fetching categories with page: {page}, limit: {limit}")
        
        response = requests.get(url, headers=headers, params={'page': page, 'limit': limit})
        response.raise_for_status()

        data = response.json()
        categories_data = data.get('data')
        total = data.get('total')
        if categories_data is None or total is None:
            return jsonify({'error': 'Invalid data format'}), 400

        def parse_categories(categories):
            parsed_categories = []
            for category in categories:
                parsed_categories.append({
                    'id': category.get('category_id'),
                    'name': category.get('name'),
                    'subcategories': parse_categories(category.get('subcategories', []))
                })
            return parsed_categories

        parsed_categories = parse_categories(categories_data)
        return jsonify({'categories': parsed_categories, 'total': total})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Error fetching categories', 'message': str(e)}), 500
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except KeyError as ke:
        return jsonify({'error': 'Invalid data format', 'message': str(ke)}), 500

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Request JSON is None")
        category_id = data.get('categoryId')
        if not category_id:
            return jsonify({'error': 'Category ID is required'}), 400

        prompt = f"Generate a product description for the category with ID: {category_id}"
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
        return jsonify({'error': 'Error generating description', 'message': str(e)}), 500
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except KeyError as ke:
        return jsonify({'error': 'Invalid data format', 'message': str(ke)}), 500

if __name__ == '__main__':
    app.run(debug=True)
