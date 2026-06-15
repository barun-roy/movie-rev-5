import { useEffect, useState } from "react";

const KEY = process.env.REACT_APP_API_KEY;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    function () {
    //   callback?.();

      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok) {
            throw new Error("Something went wrong while fetching movies");
          }
          const data = await res.json();

          if (data.Response === "False") {
            throw new Error(data.Error);
          }

          setMovies(data.Search);
          setErrorMessage("");
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log(error.message);
            setErrorMessage(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setErrorMessage("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return { movies, isLoading, errorMessage };
}
