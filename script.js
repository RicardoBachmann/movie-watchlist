const API_KEY = "ff2c7e65";
const API_URL = "http://www.omdbapi.com/";

async function getMovieData(searchTerm) {
  try {
    // using encodeURIComponent to make sure that the search term is correctly formatted for the API request
    const response = await fetch(
      `${API_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    const data = await response.json();
    let movieHtml = "";

    if (data.Response === "True") {
      // promise.all to fetch details for multiple movies concurrently, improving performance by making parallel requests instead of serially
      const movies = await Promise.all(
        data.Search.map(async (movie) => {
          const detailsResponse = await fetch(
            `${API_URL}?i=${movie.imdbID}&apikey=${API_KEY}`
          );
          return detailsResponse.json();
        })
      );

      movieHtml = movies
        .map(
          (detailsData) => `
            <div class="movie-card">
                <div class="movie-poster">
                  <img src="${detailsData.Poster}" alt="${detailsData.Title} poster"/>
                  <button class="add-to-watchlist" data-movie-id="${detailsData.imdbID}">
                    <i class="fa-solid fa-circle-plus"></i> Watchlist 
                  </button>
              </div>
                <div class="movie-card-info">
                <div class="movie-card-header">
                    <h1>${detailsData.Title}</h1>
                    <p>&#11088 ${detailsData.imdbRating}</p>
                </div>
                <div class="movie-card-header_sub">
                    <p>${detailsData.Runtime}</p>
                    <p>${detailsData.Genre}</p>
                </div>
                <p>${detailsData.Plot}</p>
                </div>
                <hr>
            </div>
        `
        )
        .join("");
    } else {
      movieHtml = `<p>No movies found for "${searchTerm}".</p>`;
    }

    const container = document.getElementById("movie-container");
    container.innerHTML = movieHtml;
    // Attach event listeners to the newly created buttons
    container.querySelectorAll(".add-to-watchlist").forEach((button) => {
      button.addEventListener("click", handleAddToWatchlist);
    });
  } catch (error) {
    console.error("Error fetching movie data:", error);
    document.getElementById(
      "movie-container"
    ).innerHTML = `<p>Error fetching movie data.</p>`;
  }
}

// This function manages the process of adding a movie to the watchlist by first retrieving the movie's details and then invoking the function to add it to local storage
async function handleAddToWatchlist(e) {
  const imdbID = e.target.getAttribute("data-movie-id");
  // Add error to catch potential issues
  try {
    const movie = await findMovieById(imdbID);
    if (movie) addMovieToWatchlist(movie);
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
  }
}

// Fetches detailed information about a movie using its IMDd ID and returns the movie data if found
async function findMovieById(imdbID) {
  try {
    const response = await fetch(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Response === "True") return data;
    throw new Error(`Movie not found: ${imdbID}`);
  } catch (error) {
    console.error("Error finding movie by ID", error);
  }
}

// Adds the movie to watchlist atored in local storage if its not already there and provides feedback to the user
function addMovieToWatchlist(movie) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  // Checks if the movie already exists in the watchlist
  if (!watchlist.some((m) => m.imdbID === movie.imdbID)) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Movie added to watchlist!");
  } else {
    alert("Movie already in watchlist.");
  }
}

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  //.trim() remove whitespace from both ends of a string
  const searchTerm = document.getElementById("input-title").value.trim();
  if (searchTerm) {
    getMovieData(searchTerm);
  }
});
