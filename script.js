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
      // .Search for accessing the API data
      data.Search.forEach((movie) => {
        movieHtml += `
                <h1>${movie.Title}</h1>
                <img src=${movie.Poster}/>
            `;
      });
    } else {
      movieHtml = `<p>No movies found for "${searchTerm}".</p>`;
    }
    document.getElementById("movie-container").innerHTML = movieHtml;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    document.getElementById(
      "movie-container"
    ).innerHTML = `<p>Error fetching movie data.</p>`;
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
