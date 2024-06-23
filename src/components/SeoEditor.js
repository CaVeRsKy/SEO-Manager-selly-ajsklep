import React, { useState, useEffect } from 'react';
import './SeoEditor.css';

const SeoEditor = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [generatedDescription, setGeneratedDescription] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                if (response.status === 401) {
                    console.error('Unauthorized access - check your API credentials');
                } else {
                    const data = await response.json();
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const generateDescription = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/generate-description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: selectedCategory.name }),
            });

            const data = await response.json();
            setGeneratedDescription(data.description);
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    return (
        <div className="seo-editor">
            <h1>SEO Editor</h1>
            <div>
                <select onChange={(e) => setSelectedCategory(categories.find(cat => cat.id === e.target.value))}>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedCategory && (
                <div>
                    <h2>{selectedCategory.name}</h2>
                    <button onClick={generateDescription}>Generate Description</button>
                    {generatedDescription && <p>{generatedDescription}</p>}
                </div>
            )}
        </div>
    );
};

export default SeoEditor;
