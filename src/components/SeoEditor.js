import React, { useState } from 'react';
import './SeoEditor.css';
import CategoryList from './CategoryList';

const SeoEditor = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [generatedDescription, setGeneratedDescription] = useState('');

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

            const data = await response.json();
            if (data && data.description) {
                setGeneratedDescription(data.description);
            } else {
                console.error('Invalid data format received from API', data);
            }
        } catch (error) {
            console.error('Error generating description:', error);
        }
    };

    return (
        <div className="seo-editor">
            <h1>SEO Editor</h1>
            <CategoryList onSelectCategory={setSelectedCategory} />
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
