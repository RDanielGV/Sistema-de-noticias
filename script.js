const apiKey = 'TU_API_KEY_AQUI'; // Asegúrate de que tu clave API sea válida
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

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
    const url = `${corsProxy}https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=5&page=1&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Para depuración

        // Asegurarse de que se recibieron artículos
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
    const url = `${corsProxy}https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Para depuración

        // Asegurarse de que se recibieron artículos
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
    if (articles && articles.length) { // Asegúrate de que articles sea un array
        articles.forEach(article => {
            const newsCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${article.urlToImage || 'placeholder.jpg'}" class="card-img-top" alt="Imagen de la noticia">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
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
