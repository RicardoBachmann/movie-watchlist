document.addEventListener("DOMContentLoaded", () => {
  displayWatchlist();

  document
    .getElementById("watchlist-container")
    .addEventListener("click", (e) => {
      // .matches() checks directly if the clicked element matches the selector
      if (e.target.matches("button[data-movie-id]")) {
        handleDeleteMovie(e);
      }
    });
});

function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const watchlistHtml = watchlist
    // use .map() to provide a more concise approach to transform and generating HTML content from an arr
    .map(
      (detailsData) => `
        <div class="movie-card">
                <div class="movie-poster">
                  <img src="${detailsData.Poster}" alt="${detailsData.Title} poster"/>
                  <button class="add-to-watchlist" data-movie-id="${detailsData.imdbID}">
                    <i class="fa-solid fa-circle-minus"></i> Delete 
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

  document.getElementById("watchlist-container").innerHTML = watchlistHtml;
}

function handleDeleteMovie(e) {
  const imdbID = e.target.getAttribute("data-movie-id");

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  e.target.closest(".movie-card").remove();
}
