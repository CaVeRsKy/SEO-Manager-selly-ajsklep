import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const backendUrl = "https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [seoPreview, setSeoPreview] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/categories`);
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setCategories(data);
            } else {
                console.error("Error fetching categories:", data.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSEO = async (categoryName) => {
        try {
            const response = await fetch(`${backendUrl}/api/generate-description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category_name: categoryName }),
            });
            const data = await response.json();
            if (response.ok) {
                setSeoPreview(data.seo_description);
            } else {
                console.error("Error generating SEO:", data.error);
            }
        } catch (error) {
            console.error("Error generating SEO:", error);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        generateSEO(category.name);
    };

    const renderCategories = (categories) => {
        return (
            <List>
                {categories.map((category) => (
                    <div key={category.id}>
                        <ListItem button onClick={() => handleCategoryClick(category)}>
                            <ListItemText primary={category.name} />
                        </ListItem>
                        {category.subcategories && renderCategories(category.subcategories)}
                    </div>
                ))}
            </List>
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista kategorii
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                renderCategories(categories)
            )}
            {selectedCategory && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        Podgląd SEO dla: {selectedCategory.name}
                    </Typography>
                    <Typography variant="body1">{seoPreview}</Typography>
                </div>
            )}
        </Container>
    );
};

export default CategoryList;
