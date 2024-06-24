import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeoEditor.css'

const SeoEditor = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                setCategories(response.data);
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
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/generate-description`, {
                category_name: selectedCategory.name,
            });
            setDescription(response.data.choices[0].message.content);
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    const handleSubmitDescription = async () => {
        // Implement the function to submit the description to Selly
    };

    return (
        <div>
            <h1>SEO Editor</h1>
            <div>
                {categories.map((category) => (
                    <div key={category.category_id} onClick={() => handleCategoryClick(category)}>
                        {category.name}
                    </div>
                ))}
            </div>
            {selectedCategory && (
                <div>
                    <h2>{selectedCategory.name}</h2>
                    <button onClick={handleGenerateDescription}>Generate Description</button>
                </div>
            )}
            {description && (
                <div>
                    <h3>Generated Description</h3>
                    <p>{description}</p>
                    <button onClick={handleSubmitDescription}>Submit Description</button>
                </div>
            )}
        </div>
    );
};

export default SeoEditor;
