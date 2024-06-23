from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Hello, world!"

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = [
        {"id": 1, "name": "Category 1", "subcategories": []},
        {"id": 2, "name": "Category 2", "subcategories": []}
    ]
    return jsonify(categories)

@app.route('/api/generate_seo', methods=['POST'])
def generate_seo():
    data = request.json
    category_name = data.get('name')
    seo_description = f"SEO description for {category_name}"
    return jsonify({"seo_description": seo_description})

if __name__ == '__main__':
    app.run(debug=True)
