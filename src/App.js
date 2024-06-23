document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('seo-form');
  
  form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => data[key] = value);
  
      try {
          const response = await fetch('https://murmuring-retreat-22519-82cce4da63ef.herokuapp.com/api/categories', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          const result = await response.json();
          console.log(result);
          // Here you can update the DOM or perform any actions with the received data
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
      }
  });
});
