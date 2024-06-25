import React, { useEffect, useState } from 'react';

const SeoEditor = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(response => {
      // Załóżmy, że response.data zawiera dane kategorii
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Error fetching categories: Expected an array but got', typeof response.data);
        setCategories([]);
      }
    }).catch(error => {
      console.error('Error fetching categories:', error);
      setCategories([]);
    });
  }, []);

  const fetchCategories = async () => {
    // Tutaj umieść swój kod do pobierania kategorii, np. za pomocą fetch
    const response = await fetch('/api/categories');
    return await response.json();
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
