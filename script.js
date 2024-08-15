async function getMovieData() {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?i=tt3896198&apikey=ff2c7e65`
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    console.log(data);
    let movieHtml = `
            <h1>${data.Title}</h1>
            <p>${data.Plot}</p>
        `;
    document.getElementById("movie-container").innerHTML = movieHtml;
  } catch (error) {
    alert(error);
  }
}

getMovieData();
