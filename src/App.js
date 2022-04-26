import React, { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import MovieListHeading from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import AddFavourites from "./components/AddFavourites"
import RemoveFavourites from "./components/RemoveFavourites"


const App = () => {

  const [movies,setMovies]=useState([])
  const [searchValue,setSearchValue]=useState("")
  const [favourite,setFavourite]=useState([])

  const getMovies =async (searchValue)=>{
      const url=`https://www.omdbapi.com/?s=${searchValue}&apikey=4e077ff7`
      const response=await fetch(url)
      const responseJson= await response.json()
      if(responseJson.Search){
        setMovies(responseJson.Search)
      }
      
  }
  useEffect(()=>{
    getMovies(searchValue)
  },[searchValue])

  useEffect(()=>{
    const favouriteMovies=JSON.parse(localStorage.getItem("favourite-movies"))
    if(favouriteMovies){
       setFavourite(favouriteMovies)
    }
  },[])

  const saveToLocalStorage = (items) => {
    localStorage.setItem("favourite-movies",JSON.stringify(items))
  }


  
  
  const addFavouriteMovie = (movie) => {
     const findMovie=favourite.find(mov => mov.imdbID===movie.imdbID)
     if(!findMovie){
		   const newFavouriteList = [...favourite, movie];
       setFavourite(newFavouriteList);
       saveToLocalStorage(newFavouriteList)
     }
	};

  //imdbID

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourite.filter(mov => mov.imdbID!==movie.imdbID)
    setFavourite(newFavouriteList);
    saveToLocalStorage(newFavouriteList)
 };

  return (
      <div className='container-fluid movie-app'>
        <div className='row d-flex align-items-center mt-4 mb-4'>
          <MovieListHeading heading="Movies"/>
          <SearchBox 
            searchValue={searchValue} 
            setSearchValue={setSearchValue}
          />
        </div>
        <div className='row'>
          <MovieList 
            movies={movies} 
            favouriteComponent={AddFavourites}
            handleFavouritesClick={addFavouriteMovie}
          />
        </div>
        <div className='row d-flex align-items-center mt-4 mb-4'>
          <MovieListHeading heading="Favourite"/>
        </div>
        <div className='row'>
        <MovieList 
            movies={favourite} 
            favouriteComponent={RemoveFavourites}
            handleFavouritesClick={removeFavouriteMovie}
          />
        </div>
      </div>
  )
}

export default App
