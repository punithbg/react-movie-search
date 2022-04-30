import React, { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieListHeading from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import AddFavourites from "./components/AddFavourites";
import RemoveFavourites from "./components/RemoveFavourites";
import Loadings from "./components/Loadings";
import Error from "./components/Error";



const App = () => {
  function makeDelay(ms) {
  var timer = 0;
  return function (callback) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
}
const delay = makeDelay(500);
  
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [favourite, setFavourite] = useState([]);

  const [pageNo, setPageNo] = useState(0);
  const [isPageNextShown, setIsPageNextShown] = useState(false);

  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getMovies = async (searchValue, pageNo) => {
    if (!searchValue) {
      return;
    }
    setLoad(true);
    const url = `https://www.omdbapi.com/?s=${searchValue}&page=${pageNo}&apikey=4e077ff7`;
    const response = await fetch(url);
    const responseJson = await response.json();
    if (responseJson.Response === "False") {
      setError(true);
      setErrorMessage(responseJson.Error);
    }
    if (responseJson.Search) {
      setError(false);
      setIsPageNextShown(true);
      setLoad(false);
      setMovies(responseJson.Search);
    }
  };

  const fun = () => {
    getMovies(searchValue, pageNo);
  };

  useEffect(() => {
    setPageNo(1);
    delay(fun);
  }, [searchValue]);

  useEffect(() => {
    const favouriteMovies = JSON.parse(
      localStorage.getItem("favourite-movies")
    );
    if (favouriteMovies) {
      setFavourite(favouriteMovies);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("favourite-movies", JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const findMovie = favourite.find((mov) => mov.imdbID === movie.imdbID);
    if (!findMovie) {
      const newFavouriteList = [...favourite, movie];
      setFavourite(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
    }
  };

  //imdbID

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourite.filter(
      (mov) => mov.imdbID !== movie.imdbID
    );
    setFavourite(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const handleNext = () => {
    console.log("prev " + pageNo);
    setPageNo(pageNo + 1);
    console.log("updated " + pageNo);
    getMovies(searchValue, pageNo);
  };

  const handlePrevious = () => {
    console.log("prev " + pageNo);
    setPageNo(pageNo - 1);
    console.log("updated " + pageNo);
    getMovies(searchValue, pageNo);
  };

  return (
    <div className="container-fluid movie-app">
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Movies" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="row">
        {error ? (
          <Error message={errorMessage} />
        ) : load ? (
          <Loadings />
        ) : (
          <MovieList
            movies={movies}
            favouriteComponent={AddFavourites}
            handleFavouritesClick={addFavouriteMovie}
          />
        )}
      </div>
      <div className="nav-btn">
        {!load && pageNo > 1 && (
          <button className="btn-prev" onClick={handlePrevious}>
            Previous
          </button>
        )}

        {!load && isPageNextShown && (
          <button className="btn-next" onClick={handleNext}>
            Next
          </button>
        )}
      </div>

      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Favourite" />
      </div>
      <div className="row">
        <MovieList
          movies={favourite}
          favouriteComponent={RemoveFavourites}
          handleFavouritesClick={removeFavouriteMovie}
        />
      </div>
    </div>
  );
};

export default App;
