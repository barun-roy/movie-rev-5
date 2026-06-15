import { useState } from "react";

import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import NumResults from "./components/NumResults";
import Main from "./components/Main";
import Box from "./components/Box";
import Loader from "./components/Loader";
import MovieList from "./components/MovieList";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMovieList from "./components/WatchedMovieList";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [userRating, setUserRating] = useState("");
  const { movies, isLoading, errorMessage } = useMovies(
    query,
    // handleCloseMovieDetail,
  );
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleMovieDetail(id) {
    setSelectedId((prev) => (prev === id ? null : id));
    setUserRating("");
  }

  function handleCloseMovieDetail() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !errorMessage && (
            <MovieList movies={movies} onSelectedMovie={handleMovieDetail} />
          )}
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovieDetail={handleCloseMovieDetail}
              onAddWatched={handleAddWatched}
              watched={watched}
              userRating={userRating}
              setUserRating={setUserRating}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
