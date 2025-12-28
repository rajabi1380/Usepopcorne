import { useState, useEffect } from "react";

let KEY = "c19b22f2";

function useMovies(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const normalizedQuery = query.trim();

    // ✅ برای query های خیلی کوتاه اصلاً سرچ نکن
    if (normalizedQuery.length < 3) {
      setMovies([]);
      setError("");
      setIsLoading(false);
      return;
    }

    // ✅ فقط وقتی سرچ واقعی شروع شد، فیلم انتخاب‌شده رو ببند
    callBack?.();

    const controller = new AbortController();

    async function getData() {
      const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(
        normalizedQuery
      )}`;

      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error("Something went wrong while fetching movies.");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error(data.Error || "Movie not found.");
        }

        setMovies(data.Search || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    getData();

    return () => controller.abort();
  }, [query, callBack]);

  return { error, isLoading, movies };
}

export default useMovies;
