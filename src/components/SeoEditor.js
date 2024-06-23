import React, { useState, useEffect } from 'react';
import './SeoEditor.css';

const SeoEditor = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const generateDescription = async (categoryId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/generate-description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryId }),
            });
            const data = await response.json();
            alert(`Generated description: ${data.description}`);
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    return (
        <div>
            <h2>SEO Editor</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        {category.name}
                        {!category.description && (
                            <button onClick={() => generateDescription(category.id)}>
                                Generate Description
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeoEditor;
