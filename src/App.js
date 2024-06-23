const backendUrl = "https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com";

async function fetchCategories() {
    try {
        const response = await fetch(`${backendUrl}/api/categories`);
        const data = await response.json();
        if (response.ok) {
            // Handle the data
        } else {
            console.error("Error fetching categories:", data.error);
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function generateSEO(categoryName) {
    try {
        const response = await fetch(`${backendUrl}/api/generate_seo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: categoryName }),
        });
        const data = await response.json();
        if (response.ok) {
            // Handle the data
        } else {
            console.error("Error generating SEO:", data.error);
        }
    } catch (error) {
        console.error("Error generating SEO:", error);
    }
}