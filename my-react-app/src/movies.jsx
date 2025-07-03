import { useEffect, useState } from "react";
import "./movies.css";
import { DeleteMovie } from "./delete";
import { useNavigate } from "react-router-dom";

const Movies = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState (0); 

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');

  useEffect(() => {
    setLoading(true);
    const genreQuery = selectedGenreId ? `&genreId=${selectedGenreId}` : '';
    fetch(`https://localhost:7123/api/Movie/get-movies-sorted?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}${genreQuery}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setMovies(data.items);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sortBy, sortOrder, page, pageSize, selectedGenreId]);

  useEffect(() => {
    fetch('https://localhost:7123/api/Genres')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch genres');
        return res.json();
      })
      .then(data => setGenres(data))
      .catch(err => console.error(err));
  }, []);

  const handleDeleteMovie = async (movieId) => {
    const updatedMovies = movies.filter((movie) => movie.id !== movieId);
    const newTotalCount = totalCount - 1;
    const newTotalPages = Math.ceil(newTotalCount / pageSize);

    let filledMovies = [...updatedMovies];

    if (page < newTotalPages) {
      try {
        const genreQuery = selectedGenreId ? `&genreId=${selectedGenreId}` : '';
        const res = await fetch(
          `https://localhost:7123/api/Movie/get-movies-sorted?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page + 1}&pageSize=1${genreQuery}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.items.length > 0) {
            filledMovies.push(data.items[0]);
          }
        }
      } catch (err) {
        console.error("Error pulling next movie:", err);
      }
  }

  setMovies(filledMovies);
  setTotalCount(newTotalCount);

  if (page > newTotalPages) {
    setPage(newTotalPages);
  }
};

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
  <div className="movies-container">
    <div className="movies-header">
      <h2>Movies List</h2>
      <div className="sort-controls">
        <label>Sort by: </label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="duration">Duration</option>
          <option value="rating">Rating</option>
          <option value="releaseyear">ReleaseYear</option>
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <label>Genre: </label>
  <select value={selectedGenreId} onChange={e => setSelectedGenreId(e.target.value)}>
    <option value="">All genres</option>
    {genres.map(g => (
      <option key={g.id} value={g.id}>{g.name}</option>
    ))}
  </select>
      </div>
    </div>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration (min)</th>
            <th>Rating</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{movie.duration}</td>
              <td>{movie.rating}</td>
              <td>{movie.releaseYear}</td>
              <td>{movie.genres ? movie.genres.join(' | ') : 'N/A'}</td>
              <td>
                <button
                  onClick={() => navigate('/add-movie', { state: { editingMovie: movie } })}
                  >
                  Edit
                  </button>
                  <button onClick={() => {
                    DeleteMovie(movie.id);
                    handleDeleteMovie(movie.id);}}>Delete Movie</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
      <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>
        Previous
      </button>
      <span>Page {page} of {Math.ceil(totalCount / pageSize)}</span>
      <button
        disabled={page >= Math.ceil(totalCount / pageSize)}
        onClick={() => setPage(prev => prev + 1)}
      >
        Next
      </button>
    </div>
    </div>
  );
};


export default Movies;

