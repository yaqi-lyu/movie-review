import React, { useEffect, useState } from "react";
import Header from "./Header";
import Movie from "./Movie.jsx";
import UserMovieList from "./UserMovieList";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

export default function Home() {
    const[popularMovies, setPopularMovies] = useState([]);
    const[topMovies, settopMovies] = useState([]);
    const[trendingMovies, setTrendingMovies] = useState([]);

    useEffect(() => {
      fetch("https://api.themoviedb.org/3/movie/popular?api_key=f699b890c77dbed8ae7006e0ec924d1d&language=en-US")
      .then(res => res.json())
      .then(data => setPopularMovies(data.results.slice(0, 10)))

      fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=f699b890c77dbed8ae7006e0ec924d1d&language=en-US")
      .then(res => res.json())
      .then(data => settopMovies(data.results.slice(0, 10)))

      fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=f699b890c77dbed8ae7006e0ec924d1d&language=en-US")
      .then(res => res.json())
      .then(data => setTrendingMovies(data.results.slice(0, 10)))
    
    },[])

    const addMovieToDatabase = (moviesList) => {
      if (moviesList.length > 0) {
        moviesList.forEach((movie) => {
          const movieAdd = {
            tmdbID: movie.id,
            title: movie.original_title,
            year: movie.release_date,
            poster: movie.poster_path,
            plot: movie.overview,
            tmdbRating: movie.vote_average,
          };
  
          fetch(`http://localhost:8000/details`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(movieAdd),
          })
            .then((response) => {
              console.log("Movie added to the database:", response);
            })
            .catch((error) => {
              console.error("Error adding movie to the database:", error);
            });
        });
      }
    }

    useEffect(() => {
      addMovieToDatabase(popularMovies)
    }, [popularMovies]);  

    useEffect(() => {
      addMovieToDatabase(topMovies)
    }, [topMovies]);

    useEffect(() => {
      addMovieToDatabase(trendingMovies)
    }, [trendingMovies]);

    return (
      <div>
        <Header />
        <div className="slide">
          <Carousel showThumbs={false} autoPlay={true} transitionTime={3} infiniteLoop={true} showStatus={false}>
            {
              popularMovies.map(movie => (
                <Link key={movie.id} to={`/details/${movie.id}`}>
                  <div className="largePoster">
                      <img alt="movie poster" src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} />
                  </div>
                  <div className="movieInfo">
                      <div>{movie ? movie.original_title: ""}</div>
                      <div>{movie ? movie.release_date : ""}</div>
                  </div>
                </Link>
              ))
            }
          </Carousel>
        </div>
        <Movie list={topMovies}/>
        <Movie list={trendingMovies}/>
        <UserMovieList />
      </div>
  );
}