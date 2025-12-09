document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('hero-video');
  const videoBtn = document.getElementById('toggle-video');

  function playPauseVideo(){
    if (video.paused) {
      video.play();
      videoBtn.textContent = 'Pause Video';
    } else {
      video.pause();
      videoBtn.textContent = 'Play Video';
    }
  };

  videoBtn.addEventListener('click',playPauseVideo);

  // Handle Audio Play/Pause Here
  const audioBtn= document.getElementById('toggle-audio');
  const audio = document.getElementById('sample-audio');

  audioBtn.addEventListener('click',()=>{
    if(audio.paused){
        audio.play();
        audioBtn.textContent='Paue Audio';
    }else{
        audio.pause();
        audioBtn.textContent="Play Audio";
    }


  });

  const canvas = document.getElementById('drawing-canvas');
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#000000';

  document.querySelectorAll('.color-picker button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentColor = e.target.dataset.color;
      ctx.strokeStyle = currentColor;
    });
  });

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.strokeStyle = currentColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });

  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);


  document.getElementById('clear-canvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  
  // Add Card when Button is Pressed
});
=======
const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');
let allMovies = []; 

function renderMovies(moviesToDisplay) {
  movieListDiv.innerHTML = '';
  if (moviesToDisplay.length === 0) {
    movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
    return;
  }
  moviesToDisplay.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-item');
    movieElement.innerHTML = `
      <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
      <button onclick="editMoviePrompt('${movie.id}', '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
      <button onclick="deleteMovie('${movie.id}')">Delete</button>
    `;
    movieListDiv.appendChild(movieElement);
  });
}

function fetchMovies() {
  fetch(API_URL)
    .then(response => response.json())
    .then(movies => {
      allMovies = movies; 
      renderMovies(allMovies); 
    })
    .catch(error => console.error('Error fetching movies:', error));
}
fetchMovies(); 

searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredMovies = allMovies.filter(movie => {
    const titleMatch = movie.title.toLowerCase().includes(searchTerm);
    const genreMatch = movie.genre.toLowerCase().includes(searchTerm);
    return titleMatch || genreMatch;
  });
  renderMovies(filteredMovies);
});

// Add new movie
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const newMovie = {
    title: document.getElementById('title').value,
    genre: document.getElementById('genre').value,
    year: parseInt(document.getElementById('year').value)
  };
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMovie),
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to add movie');
    return response.json();
  })
  .then(() => {
    this.reset();
    fetchMovies(); 
  })
  .catch(error => console.error('Error adding movie:', error));
});

// Edit movie prompt
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
  const newTitle = prompt('Enter new Title:', currentTitle);
  const newYearStr = prompt('Enter new Year:', currentYear);
  const newGenre = prompt('Enter new Genre:', currentGenre);
  if (newTitle && newYearStr && newGenre) {
    const updatedMovie = {
      id: id,
      title: newTitle,
      year: parseInt(newYearStr),
      genre: newGenre
    };
    updateMovie(id, updatedMovie);
  }
}

function updateMovie(movieId, updatedMovieData) {
  fetch(`${API_URL}/${movieId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedMovieData),
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to update movie');
    return response.json();
  })
  .then(() => {
    fetchMovies(); 
  })
  .catch(error => console.error('Error updating movie:', error));
}

function deleteMovie(movieId) {
  fetch(`${API_URL}/${movieId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to delete movie');
    fetchMovies(); 
  })
  .catch(error => console.error('Error deleting movie:', error));
}
