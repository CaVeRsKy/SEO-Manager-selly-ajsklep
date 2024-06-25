import React, { useEffect, useState } from 'react';
import './SeoEditor.css';

const SeoEditor = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Ustawienie limitu na 10 kategorii na stronę
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories(page, limit);
  }, [page, limit]);

  const fetchCategories = async (page, limit) => {
    try {
      const response = await fetch(`https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/api/categories?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setCategories(data.categories);
      setTotalPages(Math.ceil(data.total / limit)); // Ustawienie total pages na podstawie total records
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleGenerateDescription = async (category) => {
    try {
      const response = await fetch(`https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/generate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId: category.id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Description generated for ${category.name}:`, data.description);
      // Tutaj można zaktualizować stan kategorii z nowym opisem, jeśli to konieczne
    } catch (error) {
      console.error('Error generating description:', error);
    }
  };

  return (
    <div>
      <h1>SEO Editor</h1>
      {categories.length === 0 ? (
        <p>Loading categories...</p>
      ) : (
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              {category.name}
              <button onClick={() => handleGenerateDescription(category)}>Generate Description</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default SeoEditor;
