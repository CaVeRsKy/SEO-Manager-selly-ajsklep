import React, { useEffect, useState } from 'react';

const SeoEditor = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(response => {
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error('Error fetching categories: Expected an array but got', typeof response);
        setCategories([]);
      }
    }).catch(error => {
      console.error('Error fetching categories:', error);
      setCategories([]);
    });
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  return (
    <div>
      <h1>SEO Editor</h1>
      {categories.length === 0 ? (
        <p>Loading categories...</p>
      ) : (
        <ul>
          {categories.map(category => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeoEditor;
