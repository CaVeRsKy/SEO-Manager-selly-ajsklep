import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeoEditor.css';  // Importujemy plik CSS

const SeoEditor = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [descriptionPreview, setDescriptionPreview] = useState('');
    const [descriptionGenerated, setDescriptionGenerated] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
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
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/generate-description`, { category_name: selectedCategory.name });
            setDescriptionPreview(response.data.choices[0].message.content);
            setDescriptionGenerated(true);
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    const handleSendDescription = async () => {
        if (!descriptionGenerated) {
            alert('Please generate a description first.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/send-description`, {
                category_id: selectedCategory.id,
                description: descriptionPreview
            });
            alert('Description sent successfully!');
        } catch (error) {
            console.error('Error sending description:', error);
            alert('Failed to send description.');
        }
    };

    return (
        <div className="seo-editor">
            <h1>SEO Editor</h1>
            <div className="categories">
                <h2>Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id} onClick={() => handleCategoryClick(category)} className={selectedCategory && selectedCategory.id === category.id ? 'selected' : ''}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="editor">
                <h2>Selected Category: {selectedCategory ? selectedCategory.name : 'None'}</h2>
                <button onClick={handleGenerateDescription}>Generate Description</button>
                <button onClick={handleSendDescription} disabled={!descriptionGenerated}>Send Description</button>
            </div>
            <div className="preview">
                <h2>Description Preview</h2>
                <p>{descriptionPreview}</p>
            </div>
        </div>
    );
};

export default SeoEditor;
