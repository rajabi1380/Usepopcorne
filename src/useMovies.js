import { useState, useEffect } from "react";
let KEY = "c19b22f2";
function useMovies(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState("");
  useEffect(
    function () {
      callBack?.();
      let controller = new AbortController();
      async function getData() {
        const normalizedQuery = query.trim();
        const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(
          normalizedQuery
        )}`;
        try {
          setIsLoading(true);
          setError("");
          // Use https to avoid mixed-content errors on production.
          let fetchedData = await fetch(url, { signal: controller.signal });

          if (!fetchedData.ok) {
            throw new Error("something went wrong with fetch movies");
          }

          let obj = await fetchedData.json();
          if (obj.Response === "False") {
            throw new Error("move not found");
          }
          setMovies(obj.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.trim().length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      getData();
      return function () {
        controller.abort();
      };
    },
    [query, callBack]
  );
  return { error, isLoading, movies };
}
export default useMovies;
