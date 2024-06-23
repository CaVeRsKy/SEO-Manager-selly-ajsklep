import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const generateDescription = async (categoryId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/generate-description`, { categoryId });
        return response.data;
    } catch (error) {
        console.error('Error generating description:', error);
        throw error;
    }
};
