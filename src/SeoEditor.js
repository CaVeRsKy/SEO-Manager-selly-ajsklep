import React, { useState, useEffect } from 'react';

const SeoEditor = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/api/categories');
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            <h1>SEO Editor</h1>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SeoEditor;
