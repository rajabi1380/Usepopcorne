import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { cleanup } from "@testing-library/react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
let KEY = "c19b22f2";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  let [selectedId, setSelectedId] = useState(null);
  // const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState("");
  // let tempQuery = "interstellar";

  useEffect(
    function () {
      let controller = new AbortController();
      async function getData() {
        try {
          setIsLoading(true);
          setError("");
          let fetchedData = await fetch(
            ` http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

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

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      HandlerCloseMovie();
      getData();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  function HandlerSelectedId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function HandlerCloseMovie() {
    setSelectedId(null);
  }
  function handlerAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handlerCleanWatched(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }
  return (
    <>
      <NavBar>
        {" "}
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        {" "}
        {/* /* common prop */}
        {/* <Box element={<MoveisList movies={movies} />} />
        <Box
          element={
            isOpen2 && (
              <>
                <Summary watched={watched} />

                <ul className="list">
                  {watched.map((movie) => (
                    <WatchMovie movie={movie} key={movie.imdbID} />
                  ))}
                </ul>
              </>
            )
          }
        /> */}
        {/* children prop👇 */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoveisList onSelectedId={HandlerSelectedId} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
          {/* {isLoading ? <Loader /> : <MoveisList movies={movies} />} */}
        </Box>{" "}
        <Box>
          {" "}
          {selectedId ? (
            <SelectedMovie
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={HandlerCloseMovie}
              onAddWatched={handlerAddWatch}
            />
          ) : (
            <>
              <Summary watched={watched} />

              <ul className="list">
                {watched.map((movie) => (
                  <WatchMovie
                    movie={movie}
                    key={movie.imdbID}
                    onCleanWatched={handlerCleanWatched}
                  />
                ))}
              </ul>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...🙃</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {" "}
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Main({ children }) {
  return <main className="main"> {children}</main>;
}
function MoveisList({ movies, onSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelectedId={onSelectedId} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectedId }) {
  return (
    <li onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchList() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//
//     </div>
//   );
// }
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchMovie({ movie, onCleanWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        onClick={(e) => onCleanWatched(movie.imdbID)}
        className="btn-delete"
      >
        ❌
      </button>
    </li>
  );
}

function SelectedMovie({ selectedId, onCloseMovie, onAddWatched, watched }) {
  let [movie, setMovie] = useState({});
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState("");
  let [userRating, setUserRating] = useState("");
  let isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  let watchUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  let {
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
  useEffect(
    function () {
      async function getMovieDetail() {
        try {
          setIsLoading(true);
          let res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok) {
            throw new Error("somethig is wrong ,please wait");
          }
          let data = await res.json();
          setMovie(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetail();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `movie| ${title}`;
      return function () {
        document.title = "UsePopcorn";
      };
    },
    [title]
  );
  function handelAdd() {
    let newWatchListMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchListMovie);
    onCloseMovie();
  }
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onCloseMovie(null);
        }
      }

      document.addEventListener("keydown", callBack);
      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseMovie]
  );
  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>{" "}
            <img src={poster} alt={`Post of${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>{" "}
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>{" "}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handelAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
