import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import Header from './Header';
import CategoryList from './CategoryList';
import SeoEditor from './SeoEditor';

const backendUrl = "https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/";
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seoData, setSeoData] = useState({ description: '', meta_description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Wystąpił błąd podczas pobierania kategorii!", error);
    }
  };

  const generateSeo = async (category) => {
    try {
      const response = await axios.post('http://localhost:8000/api/generate_seo', category);
      setSeoData(response.data);
      setSelectedCategory(category);
    } catch (error) {
      console.error("Wystąpił błąd podczas generowania danych SEO!", error);
    }
  };

  const saveSeoData = async () => {
    try {
      await axios.put(`http://localhost:8000/api/categories/${selectedCategory.id}`, seoData);
      fetchCategories();
      setSelectedCategory(null);
      setSeoData({ description: '', meta_description: '' });
    } catch (error) {
      console.error("Wystąpił błąd podczas zapisywania danych SEO!", error);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setSeoData({ description: '', meta_description: '' });
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container>
        {!selectedCategory ? (
          <CategoryList categories={categories} onSelect={generateSeo} />
        ) : (
          <SeoEditor
            category={selectedCategory}
            seoData={seoData}
            onGenerate={generateSeo}
            onSave={saveSeoData}
            onCancel={handleCancel}
            onChange={setSeoData}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
