from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    token = get_selly_token()
    if not token:
        return jsonify({"error": "Unable to fetch Selly API token"}), 500
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    response = requests.get("https://ajsklep.pl/api/categories", headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Unable to fetch categories"}), 500

    categories = response.json()
    categories_without_description = []

    def find_categories_without_description(categories):
        for category in categories:
            if not category.get("description") or not category.get("description2"):
                categories_without_description.append(category)
            if "subcategories" in category:
                find_categories_without_description(category["subcategories"])

    find_categories_without_description(categories)

    return jsonify(categories_without_description)

@app.route('/api/generate_seo', methods=['POST'])
def generate_seo():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    prompt = f"Generate a SEO description for category: {data['name']}"
    
    try:
        response = openai.Completion.create(
            model="gpt-4o",
            prompt=prompt,
            max_tokens=150
        )
    except openai.error.OpenAIError as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "description": response.choices[0].text.strip(),
        "meta_description": response.choices[0].text.strip()  # Placeholder; you can customize this
    })

def get_selly_token():
    payload = {
        "grant_type": "client_credentials",
        "scope": "READWRITE",
        "client_id": os.getenv("SELLY_CLIENT_ID"),
        "client_secret": os.getenv("SELLY_CLIENT_SECRET")
    }

    response = requests.post("https://ajsklep.pl/api/auth/access_token", json=payload)

    if response.status_code != 200:
        return None

    return response.json().get("access_token")

if __name__ == '__main__':
    app.run(debug=True)