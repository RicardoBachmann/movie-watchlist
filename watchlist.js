document.addEventListener("DOMContentLoaded", () => {
  displayWatchlist();
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
          </div>
          <p>${movie.Plot}</p>
        </div>
        <hr>
      </div>
        `;
  }
  document.getElementById("watchlist-container").innerHTML = watchlistHtml;
}
