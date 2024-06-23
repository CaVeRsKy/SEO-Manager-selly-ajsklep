from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import openai
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Ładuje wartości z pliku .env

app = Flask(__name__)

# Konfiguracja CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Konfiguracja kluczy API
openai.api_key = os.getenv('OPENAI_API_KEY')
selly_api_base = 'https://ajsklep.pl/api'
selly_client_id = os.getenv('SELLY_CLIENT_ID')
selly_client_secret = os.getenv('SELLY_CLIENT_SECRET')

# Funkcja do uzyskiwania tokenu dostępu
def get_access_token():
    auth_url = f"{selly_api_base}/auth/access_token"
    payload = {
        'grant_type': 'client_credentials',
        'scope': 'READWRITE',
        'client_id': selly_client_id,
        'client_secret': selly_client_secret
    }
    response = requests.post(auth_url, json=payload)
    response_data = response.json()

    if 'access_token' in response_data:
        return response_data['access_token']
    else:
        raise Exception(f"Failed to get access token: {response_data}")

# Funkcja do generowania opisów i meta danych
def generate_seo_data(category_name):
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Generate a detailed description and meta description for the category: {category_name}"}
        ],
        max_tokens=150
    )
    return response.choices[0].message['content'].strip()

# Rekurencyjna funkcja do znajdowania kategorii bez opisów
def find_categories_without_descriptions(categories):
    categories_without_descriptions = []
    for category in categories:
        if not category.get('description'):
            categories_without_descriptions.append(category)
        if 'subcategories' in category and category['subcategories']:
            categories_without_descriptions.extend(find_categories_without_descriptions(category['subcategories']))
    return categories_without_descriptions

# Pobieranie kategorii bez opisów i meta danych
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        access_token = get_access_token()
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f'{selly_api_base}/categories', headers=headers)
        categories = response.json()['data']
        filtered_categories = find_categories_without_descriptions(categories)
        resp = make_response(jsonify(filtered_categories))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return resp
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Aktualizacja kategorii z opisami i meta danymi
@app.route('/api/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        access_token = get_access_token()
        data = request.json
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.put(f'{selly_api_base}/categories/{category_id}', headers=headers, json=data)
        resp = make_response(jsonify(response.json()))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return resp
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Generowanie danych SEO dla danej kategorii
@app.route('/api/generate_seo', methods=['POST'])
def generate_seo():
    try:
        category = request.json
        seo_data = generate_seo_data(category['name'])
        resp = make_response(jsonify({'description': seo_data, 'meta_description': seo_data}))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return resp
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
