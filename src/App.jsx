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
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`
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
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
      )
      const data = await response.json()

      if (data.Response === "False") {
        setError(data.Error)
        setMovies([])
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
    <div>
      <h1>Movie Searcher</h1>

      <div>
        <form onSubmit={handleSubmit}>
          <input type="text"
            value={searchTerm}
            placeholder='Enter Movie Title'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Search</button>
        </form>

        <div>
          {
            selectedMovie ? (
              <div>
                <h2>{selectedMovie.Title}</h2>
                <p>{selectedMovie.Genre}</p>
                <p>{selectedMovie.Year}</p>
                <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
                <p>Actors: {selectedMovie.Actors}</p>
                <p>Imdb Rating: {selectedMovie.imdbRating}</p>
              </div>

            ) : (
              movies.map((movie) => (
                <div key={movie.imdbID}>
                  {movie.Poster !== "N/A" ? (
                    <img src={movie.Poster} alt={movie.Title} onClick={() => fetchMovieDetails(movie.imdbID)} />
                  ) : (
                    <p>No Poster Available</p>
                  )}
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  )

}

export default App


// http://www.omdbapi.com/?i=tt3896198&apikey=35937a8d

