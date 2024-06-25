import React, { useEffect, useState } from 'react';

const SeoEditor = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(response => {
      console.log('API response:', response); // Logowanie całej odpowiedzi
      if (response && Array.isArray(response.categories)) {
        setCategories(response.categories);
      } else {
        console.error('Error fetching categories: Expected an array but got', response ? typeof response.categories : 'undefined');
        setCategories([]);
      }
    }).catch(error => {
      console.error('Error fetching categories:', error);
      setCategories([]);
    });
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [] }; // Zwróć pustą tablicę w polu categories w przypadku błędu
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