import { useEffect, useState } from "react";
import "./movies.css";
import { DeleteMovie } from "./delete";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;

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
    fetch(`${API_URL}/api/Movie/get-movies-sorted?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}${genreQuery}`)

      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setMovies(data.items || []);
        setTotalCount(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sortBy, sortOrder, page, pageSize, selectedGenreId]);

  useEffect(() => {
    fetch(`${API_URL}/api/Genres`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch genres');
        return res.json();
      })
      .then(data => setGenres(data))
      .catch(err => console.error(err));
  }, []);

  const handleDeleteMovie = async (movieId) => {
  try {
    
    await DeleteMovie(movieId);

    
    const genreQuery = selectedGenreId ? `&genreId=${selectedGenreId}` : '';
    const response = await fetch(
  `${API_URL}/api/Movie/get-movies-sorted?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}${genreQuery}`
);


    if (!response.ok) throw new Error("Failed to refetch movies.");

    const data = await response.json();
    const newTotalCount = data.totalCount;
    const newTotalPages = Math.max(1, Math.ceil(newTotalCount / pageSize));

    
    if (data.items.length === 0 && page > 1) {
      setPage(page - 1); 
    } else {
      setMovies(data.items);
      setTotalCount(newTotalCount);
    }
  } catch (err) {
    console.error("Error deleting movie:", err);
    alert("Failed to delete movie. Please try again.");
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
          {movies.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                No movies found.
              </td>
            </tr>
          ) : (
            movies.map((movie) => (
              <tr key={movie.id} onClick={() => navigate(`/details/${movie.id}`)}>
                <td>{movie.name}</td>
                <td>{movie.duration}</td>
                <td>{movie.rating}</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.genres ? movie.genres.join(' , ') : 'N/A'}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/add-movie', { state: { editingMovie: movie } });}}
                    >
                    Edit
                    </button>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMovie(movie.id);}}>Delete Movie</button>
                </td>
              </tr>
          )))}
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

