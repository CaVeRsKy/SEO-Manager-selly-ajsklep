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
                    const responseData = await response.json();
                    console.log('API response:', responseData);  // Log the response data for debugging
                    if (responseData && responseData.data && Array.isArray(responseData.data)) {
                        setCategories(responseData.data);
                    } else {
                        console.error('Invalid data format received from API', responseData);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const generateDescription = async () => {
        if (!selectedCategory) {
            console.error('No category selected');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/generate-description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: selectedCategory.name }),
            });

            const responseData = await response.json();
            if (responseData && responseData.description) {
                setGeneratedDescription(responseData.description);
            } else {
                console.error('Invalid data format received from API', responseData);
            }
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    return (
        <div className="seo-editor">
            <h1>SEO Editor</h1>
            <div className="category-list">
                {categories.length > 0 ? categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category)}
                        className="category-button"
                    >
                        {category.name}
                    </button>
                )) : <p>Loading categories...</p>}
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
