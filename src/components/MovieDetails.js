import { useEffect, useState } from "react";
import { AiOutlineLeft } from "react-icons/ai";

import StarRating from "./StarRating";
import Loader from "./Loader";

const KEY = process.env.REACT_APP_API_KEY;

export default function MovieDetails({
  selectedId,
  onCloseMovieDetail,
  onAddWatched,
  watched,
  userRating,
  setUserRating,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedMovieUserRating = watched
    .filter((movie) => movie.imdbID === selectedId)
    ?.at(0)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleWatched() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newMovie);
    onCloseMovieDetail();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
      );

      if (!res.ok) {
        throw new Error("Something went wrong while fetching movies");
      }

      const data = await res.json();

      if (data.Response === "False") {
        throw new Error(data.Error);
      }

      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  // change page title based on selected movie in the movie list, to do this the plan is to use effect on mount of the movie details component

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  //useEffect also commonly referred to as escape hatch , as it allows react developers to easily DOM manipulate directly
  useEffect(() => {
    
    const callback = (e) => {
      if (e.code === "Escape") {
        onCloseMovieDetail();
      }
    };

    document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovieDetail]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovieDetail}>
              <AiOutlineLeft />
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!selectedMovieUserRating ? (
                <>
                  <StarRating
                    size={20}
                    maxRating={10}
                    key={title}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => handleWatched(movie)}
                    >
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated the movie with {selectedMovieUserRating}
                  <span> ⭐'s</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
