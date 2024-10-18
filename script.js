const apiKey = '327b70c2db6418df97ab90b69666df61'; // Reemplaza con tu API key de GNews
const corsProxy = 'https://thingproxy.freeboard.io/fetch/'; // Proxy para evitar problemas de CORS

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-search');

    categorySelect.addEventListener('change', () => {
        fetchNews(categorySelect.value);
    });

    searchButton.addEventListener('click', () => {
        fetchNewsByKeyword(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchNewsByKeyword(searchInput.value);
        }
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        fetchNews(categorySelect.value);
    });

    // Llamada inicial
    fetchNews(categorySelect.value);
});

async function fetchNews(category) {
    const url = `${corsProxy}https://gnews.io/api/v4/top-headlines?country=us&topic=${category}&token=${apiKey}`;
    console.log("Fetching news from:", url);
    try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles);
        } else {
            console.error("No se encontraron artículos.");
            displayNews([]); // Llamar a displayNews con un array vacío
        }
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        displayNews([]); // Llamar a displayNews con un array vacío en caso de error
    }
}

async function fetchNewsByKeyword(keyword) {
    const url = `${corsProxy}https://gnews.io/api/v4/search?q=${keyword}&token=${apiKey}`;
    console.log("Fetching news by keyword from:", url);
    try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles);
        } else {
            console.error("No se encontraron artículos.");
            displayNews([]); // Llamar a displayNews con un array vacío
        }
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        displayNews([]); // Llamar a displayNews con un array vacío en caso de error
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas noticias
    if (articles && articles.length) {
        articles.forEach(article => {
            const newsCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${article.image || 'placeholder.jpg'}" class="card-img-top" alt="Imagen de la noticia">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description || 'Sin descripción.'}</p>
                            <a href="${article.url}" class="btn btn-primary" target="_blank">Leer más</a>
                        </div>
                    </div>
                </div>
            `;
            newsContainer.innerHTML += newsCard;
        });
    } else {
        newsContainer.innerHTML = '<p>No se encontraron noticias.</p>';
    }
}
