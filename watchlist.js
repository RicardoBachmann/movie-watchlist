document.addEventListener("DOMContentLoaded", () => {
  displayWatchlist();

  document
    .getElementById("watchlist-container")
    .addEventListener("click", function (e) {
      if (
        e.target &&
        e.target.tagName === "BUTTON" &&
        e.target.hasAttribute("data-movie-id")
      ) {
        handleDeleteMovie(e);
      }
    });
});

function displayWatchlist() {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  let watchlistHtml = "";
  for (const movie of watchlist) {
    watchlistHtml += `
              <div class="movie-card">
        <div class="movie-poster">
          <img src="${movie.Poster}" alt=""/>
        </div>
        <div class="movie-card-info">
          <div class="movie-card-header">
            <h1>${movie.Title}</h1>
            <p>&#11088 ${movie.imdbRating}</p>
          </div>
          <div class="movie-card-header_sub">
            <p>${movie.Runtime}</p>
            <p>${movie.Genre}</p>
            <button data-movie-id="${movie.imdbID}">Delete from Watchlist</button>
          </div>
          <p>${movie.Plot}</p>
        </div>
        <hr>
      </div>
        `;
  }
  document.getElementById("watchlist-container").innerHTML = watchlistHtml;
}

function handleDeleteMovie(e) {
  const imdbID = e.target.getAttribute("data-movie-id");

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  e.target.closest(".movie-card").remove();
}
