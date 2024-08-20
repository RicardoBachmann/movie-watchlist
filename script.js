async function getMovieData(searchTerm) {
  try {
    // using encodeURIComponent to make sure that the search term is correctly formatted for the API request
    const response = await fetch(
      `http://www.omdbapi.com/?s=${encodeURIComponent(
        searchTerm
      )}&apikey=ff2c7e65`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    const data = await response.json();
    let movieHtml = "";
    console.log(data);
    if (data.Response === "True") {
      //Loop through the search results
      for (const movie of data.Search) {
        const movieDetails = await fetch(
          `http://www.omdbapi.com/?i=${movie.imdbID}&apikey=ff2c7e65`
        );
        const detailsData = await movieDetails.json();

        movieHtml += `
            <div class="movie-card">
                <div class="movie-poster">
                    <img src="${detailsData.Poster}" alt=""/>
                </div>
                <div class="movie-card-info">
                <div class="movie-card-header">
                    <h1>${detailsData.Title}</h1>
                    <p>&#11088 ${detailsData.imdbRating}</p>
                </div>
                <div class="movie-card-header_sub">
                    <p>${detailsData.Runtime}</p>
                    <p>${detailsData.Genre}</p>
                    <button class="add-to-watchlist" data-movie-id="${detailsData.imdbID}">Add to Watchlist</button>
                </div>
                <p>${detailsData.Plot}</p>
                </div>
                <hr>
            </div>
        `;
      }
    } else {
      movieHtml = `<p>No movies found for "${searchTerm}".</p>`;
    }
    document.getElementById("movie-container").innerHTML = movieHtml;
    // Attach event listeners to the newly created buttons
    document.querySelectorAll(".add-to-watchlist").forEach((button) => {
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
function handleAddToWatchlist(e) {
  const imdbID = e.target.getAttribute("data-movie-id");
  findMovieById(imdbID).then((movie) => {
    if (movie) {
      addMovietoWatchlist(movie);
    }
  });
}

// Fetches detailed information about a movie using its IMDd ID and returns the movie data if found
function findMovieById(imdbID) {
  return fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=ff2c7e65`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        return data;
      } else {
        throw new Error(`Movie not found: ${imdbID}`);
      }
    })
    .catch((error) => {
      console.error("Error finding movie by ID:", error);
    });
}

// Adds the movie to watchlist atored in local storage if its not already there and provides feedback to the user
function addMovietoWatchlist(movie) {
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
  let searchTerm = document.getElementById("input-title").value.trim();
  if (searchTerm) {
    getMovieData(searchTerm);
  }
});
