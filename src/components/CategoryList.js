import React, { useState, useEffect } from 'react';
import './CategoryList.css';

const CategoryList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                if (response.status === 401) {
                    console.error('Unauthorized access - check your API credentials');
                } else {
                    const data = await response.json();
                    console.log('API response:', data);  // Log the response data for debugging
                    if (data && Array.isArray(data)) {
                        setCategories(data);
                    } else {
                        console.error('Invalid data format received from API', data);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-list">
            {categories.length > 0 ? categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category)}
                    className="category-button"
                >
                    {category.name}
                </button>
            )) : <p>Loading categories...</p>}
        </div>
    );
};

export default CategoryList;
