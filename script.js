const apiKey = '7affbcf418f470403b77777ddb628b9b'; // Reemplaza con tu API key de GNews
let articles = [];
let currentPage = 1;
const articlesPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-search');
    const modeToggle = document.getElementById('mode-toggle');

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

    modeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    fetchNews(categorySelect.value);
});

async function fetchNews(category) {
    let url;
    if (category === 'education') {
        // Si la categoría seleccionada es "Educación", se usa una búsqueda por palabra clave
        url = `https://gnews.io/api/v4/search?q=education&token=${apiKey}`;
    } else {
        // Para las demás categorías, se utiliza el endpoint estándar de categorías
        url = `https://gnews.io/api/v4/top-headlines?country=us&topic=${category}&token=${apiKey}`;
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${response.statusText}. Detalles: ${errorText}`);
        }

        const data = await response.json();
        articles = data.articles || [];
        displayNews();
        setupPagination();
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        displayNews([]);
    }
}

async function fetchNewsByKeyword(keyword) {
    const url = `https://gnews.io/api/v4/search?q=${keyword}&token=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${response.statusText}. Detalles: ${errorText}`);
        }

        const data = await response.json();
        articles = data.articles || [];
        displayNews();
        setupPagination();
    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        displayNews([]);
    }
}

function displayNews() {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    if (paginatedArticles.length) {
        paginatedArticles.forEach(article => {
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

function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item', i === currentPage ? 'active' : '');
        
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        pageLink.href = '#';
        
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayNews();
            setupPagination();
        });

        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }
}
