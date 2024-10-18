const apiKey = '327b70c2db6418df97ab90b69666df61'; // Reemplaza con tu API key de GNews

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-search');

    // Maneja el cambio de categoría
    categorySelect.addEventListener('change', () => {
        fetchNews(categorySelect.value);
    });

    // Maneja la búsqueda al hacer clic en el botón de búsqueda
    searchButton.addEventListener('click', () => {
        fetchNewsByKeyword(searchInput.value);
    });

    // Maneja la búsqueda al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchNewsByKeyword(searchInput.value);
        }
    });

    // Reinicia la búsqueda
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        fetchNews(categorySelect.value);
    });

    // Llamada inicial
    fetchNews(categorySelect.value);
});

// Función para obtener noticias por categoría
async function fetchNews(category) {
    const url = `https://gnews.io/api/v4/top-headlines?country=us&topic=${category}&token=${apiKey}`;
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${response.statusText}. Detalles: ${errorText}`);
        }

        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles);
        } else {
            console.error("No se encontraron artículos.");
            displayNews([]);
        }
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        displayNews([]);
    }
}

// Función para obtener noticias por palabra clave
async function fetchNewsByKeyword(keyword) {
    const url = `https://gnews.io/api/v4/search?q=${keyword}&token=${apiKey}`;
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${response.statusText}. Detalles: ${errorText}`);
        }

        const data = await response.json();

        if (data.articles && Array.isArray(data.articles)) {
            displayNews(data.articles);
        } else {
            console.error("No se encontraron artículos.");
            displayNews([]);
        }
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        displayNews([]);
    }
}

// Función para mostrar noticias
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
