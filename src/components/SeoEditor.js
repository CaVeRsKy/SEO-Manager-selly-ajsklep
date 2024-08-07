import React, { useEffect, useState } from 'react';

const SeoEditor = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [descriptions, setDescriptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories(page, limit);
  }, [page, limit]);

  const fetchCategories = async (page, limit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/api/categories?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);

      if (data && data.categories && data.total) {
        setCategories(data.categories);
        setTotalPages(Math.ceil(data.total / limit));
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/api/generate-description`, {
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
      console.log(`Description generated for ${category.name}:`, data.choices[0].message.content);
      setDescriptions((prevDescriptions) => ({ ...prevDescriptions, [category.id]: data.choices[0].message.content }));
    } catch (error) {
      console.error('Error generating description:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>SEO Editor</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                {category.name}
                <button onClick={() => handleGenerateDescription(category)}>Generate Description</button>
                {descriptions[category.id] && <p>Generated description: {descriptions[category.id]}</p>}
              </li>
            ))}
          </ul>
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SeoEditor;
