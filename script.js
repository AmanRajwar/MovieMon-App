const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navMenu');
const movies = [];
const favourites = [];
const suggestionsList = document.getElementById('suggestions');
const addPoster = document.querySelector('.wrapper');

console.log('working');

// Handles clicks on the hamburger button at the top right corner of the screen
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Adds home and favorites button inside the hamburger menu
document.querySelectorAll('.nav-links').forEach(n => {
  n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Used when input field is in use (if someone is typing something there)
const searchInput = document.getElementById('renderSuggestions');
searchInput.addEventListener('input', getMovies);

// Just to remove the by default search action provided by bootstrap
const s = document.getElementById('searchInput');
s.addEventListener('keypress', function(event) {
  if (event.keyCode === 13) {
    // Check if the Enter key is pressed (key code 13)
    event.preventDefault();
  }
});

// Fetches the movie from the OMDB API
async function getMovies(event) {
  const query = event.target.value;
  suggestionsList.innerHTML = '';

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=9fa57ecd&s=${query}`);

    const data = await response.json();

    if (data.Response === 'True') {
      movies.length = 0;
      movies.push(...data.Search);
    }
  } catch (error) {
    console.log(error);
  }

  // Show suggestions only if there are more than 2 letters in the input field
  if (query.length > 2) {
    renderList();
  }
}

// Renders the suggestions list to provide suggestions
function renderList() {
  suggestionsList.innerHTML = '';
  movies.forEach(movie => {
    const suggestionItem = document.createElement('li');
    suggestionItem.id = movie.imdbID;
    suggestionItem.classList.add('suggestionItem');
    suggestionItem.textContent = movie.Title;
    suggestionsList.appendChild(suggestionItem);
  });
}

// Handles the search button action
const search = document.querySelector('.btn');
search.addEventListener('click', () => {
  showResults(movies, false);
});

// Renders the results when the search button is pressed
function showResults(element, isFavoritePage) {
  suggestionsList.innerHTML = '';
  addPoster.innerHTML = '';

  element.forEach(movie => {
    renderMovieItem(movie, isFavoritePage);
  });

  if (isFavoritePage) {
    saveFavorites(); // Save favorites after rendering the favorite list
  }
}

// Renders a movie item with either a like or delete button
function renderMovieItem(movie, isFavoritePage) {
  const posterLink = movie.Poster;
  const title = movie.Title;
  const type = movie.Type;
  const year = movie.Year;

  const posterContainer = document.createElement('div');
  posterContainer.classList.add('pstr-container');
  posterContainer.id = movie.imdbID;

  const imgContainer = document.createElement('img');
  imgContainer.src = posterLink;

  const buttonContainer = document.createElement('span');
  buttonContainer.classList.add('like');
  buttonContainer.innerHTML = isFavoritePage ? '<i class="fa-solid fa-trash"></i>' : '<i class="fa-solid fa-heart"></i>';

  const movieInfo = document.createElement('div');
  movieInfo.classList.add('movieInfo');
  movieInfo.innerHTML = `<p>Title: ${title}</p><p>Type: ${type}</p><p>Year: ${year}</p>`;

  buttonContainer.addEventListener('click', () => {
    if (isFavoritePage) {
      removeFromFavorites(movie.imdbID);
    } else {
      buttonContainer.classList.add('active')
      addToFavorites(movie);
    }
  });

  posterContainer.appendChild(imgContainer);
  posterContainer.appendChild(buttonContainer);
  posterContainer.appendChild(movieInfo);
  addPoster.appendChild(posterContainer);
}



document.addEventListener('click', (event) => {
  const target = event.target;

  //checks if  clicked on the search results or not 
  if (target.className == 'movieInfo') {
    const id = target.parentElement.id;
    localStorage.setItem('id', id);
    renderMovieDetails();

  }

  //checks if clicked on suggestion list 
  if (target.className == 'suggestionItem') {
    const id = target.id;
    localStorage.setItem('id', id);//local storage to sava the id in browser as it is required to fetch movie details in movie.html
    renderMovieDetails();
  }

});

// takes us to the movie.html page 
function renderMovieDetails() {
  window.location.href = 'movie.html';
}


// Adds movies to the favorites when the like button is clicked
function addToFavorites(movie) {
  const grandparentId = movie.imdbID;

  // Checks for duplicates in the favorites movies list
  const isDuplicate = favourites.some(movie => movie.imdbID === grandparentId);

  // If no duplicates, add the movie to the list
  if (!isDuplicate) {
    favourites.push(movie);
    saveFavorites(); // Save favorites after adding a movie
  }
}

// Removes a movie from the favorites
function removeFromFavorites(imdbID) {
  const index = favourites.findIndex(movie => movie.imdbID === imdbID);
  if (index !== -1) {
    favourites.splice(index, 1);
    showResults(favourites, true);
    saveFavorites(); // Save favorites after removing a movie
  }
}

// Function to load favorites from localStorage
function loadFavorites() {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favourites.push(...JSON.parse(storedFavorites));
  }
}

// Function to save favorites to localStorage
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favourites));
}

// Function to initialize the app
function initializeApp() {
  loadFavorites();
  showResults(movies, false);
}

// Load favorites and initialize the app
initializeApp();

// ...

const homeButton = document.getElementById('home');
const favButton = document.getElementById('favourites');

// Renders the favorites list when the favorites button is clicked
favButton.addEventListener('click', () => {
  favButton.classList.add('activeLink');
  homeButton.classList.remove('activeLink');
  showResults(favourites, true);
});

// Renders the home page
homeButton.addEventListener('click', () => {
  favButton.classList.remove('activeLink');
  homeButton.classList.add('activeLink');
  showResults(movies, false);
});

















