import { useState } from 'react'
import './App.css'

function App() {

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY


  const [searchTerm, setSearchTerm] = useState("")
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`
      )
      const data = await response.json()

      if (data.Response === "False") {
        setError(data.Error)
        setMovies([])
        return
      }
      setMovies(data.Search)
      setSelectedMovie(null)

    } catch (error) {
      console.error("search error:", error)
      setError("Something went wrong, Please try again.")
    } finally {
      setLoading(false)
      setSearchTerm('')

    }


  }

  const fetchMovieDetails = async (imdbID) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
      )
      const data = await response.json()

      if (data.Response === "False") {
        setError(data.Error)

        return
      }
      setSelectedMovie(data)
    } catch (error) {
      setError("Something went wrong loading movie details")
    } finally {
      setLoading(false)
    }
  }



  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Discover your next favorite</p>
        <h1>Movie Searcher</h1>
        <p className="hero-description">
          Search for movies and explore their cast, genre, ratings, and more.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            placeholder="Enter a movie title"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button disabled={loading || !searchTerm.trim()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </header>

      <section className="content">
        {error && <p className="error-message">{error}</p>}

        {loading && <p className="loading-message">Loading...</p>}

        {!loading && selectedMovie ? (
          <article className="movie-details">
            <button
              type='button'
              className="back-button"
              onClick={() => setSelectedMovie(null)}
            >
              ← Back to results
            </button>

            <div className="details-layout">
              <div className="details-poster">
                {selectedMovie.Poster !== "N/A" ? (
                  <img
                    src={selectedMovie.Poster}
                    alt={`${selectedMovie.Title} poster`}
                  />
                ) : (
                  <div className="poster-placeholder">
                    No Poster Available
                  </div>
                )}
              </div>

              <div className="details-information">
                <p className="movie-type">{selectedMovie.Type}</p>

                <h2>{selectedMovie.Title}</h2>

                <div className="movie-meta">
                  <span>{selectedMovie.Year}</span>
                  <span>{selectedMovie.Runtime}</span>
                  <span>{selectedMovie.Rated}</span>
                </div>

                <p className="movie-plot">{selectedMovie.Plot}</p>

                <div className="detail-row">
                  <span>Genre</span>
                  <p>{selectedMovie.Genre}</p>
                </div>

                <div className="detail-row">
                  <span>Actors</span>
                  <p>{selectedMovie.Actors}</p>
                </div>

                <div className="detail-row">
                  <span>Director</span>
                  <p>{selectedMovie.Director}</p>
                </div>

                <div className="rating">
                  <strong>IMDb</strong>
                  <span>{selectedMovie.imdbRating} / 10</span>
                </div>
              </div>
            </div>
          </article>
        ) : (
          !loading &&
          movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <article
                  className="movie-card"
                  key={movie.imdbID}
                  onClick={() => fetchMovieDetails(movie.imdbID)}
                >
                  <div className="poster-container">
                    {movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={`${movie.Title} poster`}
                      />
                    ) : (
                      <div className="poster-placeholder">
                        No Poster Available
                      </div>
                    )}
                  </div>

                  <div className="movie-card-content">
                    <p className="movie-type">{movie.Type}</p>
                    <h2>{movie.Title}</h2>
                    <p className="movie-year">{movie.Year}</p>
                  </div>
                </article>
              ))}
            </div>
          )
        )}
      </section>
    </main>
  )

}

export default App


// http://www.omdbapi.com/?i=tt3896198&apikey=35937a8d

