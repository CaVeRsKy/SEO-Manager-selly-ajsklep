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
                const data = await response.json();
                if (response.status !== 200 || !data.categories) {
                    console.error('Invalid data format received from API', data);
                } else {
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
            if (response.status !== 200 || !data.choices) {
                console.error('Invalid data format received from API', data);
            } else {
                setGeneratedDescription(data.choices[0].message.content);
            }
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    const renderCategories = (categories) => {
        return (
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        <button onClick={() => setSelectedCategory(category)}>{category.name}</button>
                        {category.subcategories.length > 0 && renderCategories(category.subcategories)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="seo-editor">
            <h1>SEO Editor</h1>
            <div>
                {categories.length > 0 ? (
                    renderCategories(categories)
                ) : (
                    <p>Loading categories...</p>
                )}
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
