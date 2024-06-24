import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeoEditor = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [descriptionPreview, setDescriptionPreview] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleGenerateDescription = async () => {
        if (!selectedCategory) {
            alert('Please select a category first.');
            return;
        }

        try {
            const response = await axios.post('/api/generate-description', { category_name: selectedCategory.name });
            setDescriptionPreview(response.data.choices[0].message.content);
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    return (
        <div>
            <h1>SEO Editor</h1>
            <div>
                <h2>Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id} onClick={() => handleCategoryClick(category)}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Selected Category: {selectedCategory ? selectedCategory.name : 'None'}</h2>
                <button onClick={handleGenerateDescription}>Generate Description</button>
            </div>
            <div>
                <h2>Description Preview</h2>
                <p>{descriptionPreview}</p>
            </div>
        </div>
    );
};

export default SeoEditor;
