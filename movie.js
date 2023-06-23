const movieLink = localStorage.getItem('data');
const movieId = localStorage.getItem('id');
const poster = document.getElementById('image');
const title = document.getElementById('title');
const language = document.getElementById('language')
const releaseDate = document.getElementById('releaseDate')
const genre = document.getElementById('genre');
const description = document.getElementById('description')

async function getMovie() {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=9fa57ecd&i=${movieId}`);
        const data = await response.json();

        if (data.Response === 'True') {
            renderMovie(data);
            console.log(data)
        }
    } catch (error) {
        console.log(error);
    }

}

function renderMovie(data) {
    const imgUrl = data.Poster;
    poster.src = imgUrl;
    const titleName = document.createElement('p');
    titleName.innerHTML=`${data.Title}`;
    title.appendChild(titleName);

    const langContent = document.createElement('p');
    langContent.innerHTML=`${data.Language}`;
    language.appendChild(langContent);

    const genreContent = document.createElement('p');
    genreContent.innerHTML=`${data.Genre}`;
    genre.appendChild(genreContent);

    const release = document.createElement('p');
    release.innerHTML=`${data.Released}`;
    releaseDate.appendChild(release);

    const plot = document.createElement('p');
    plot.innerHTML=`${data.Plot}`;
    description.appendChild(plot);
}

getMovie();