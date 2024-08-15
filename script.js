fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=ff2c7e65`)
  .then((res) => res.json())
  .then((data) => console.log(data));
