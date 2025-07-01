import React, { useEffect, useState } from 'react';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [activeButton, setActiveButton] = useState({ movieId: null, type: null });

  useEffect(() => {
    fetch('https://localhost:7123/api/Movie/get-all-movies')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setMovies(data.items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const startEditing = (movie) => {
    setEditingMovieId(movie.id);
    setEditedName(movie.name);
    setActiveButton({ movieId: movie.id, type: 'edit' });
  };

  const cancelEditing = () => {
    setEditingMovieId(null);
    setEditedName('');
    setActiveButton({ movieId: null, type: null });
  };

  const handleUpdateMovie = async (movieId) => {
    try {
      const movieToUpdate = movies.find(m => m.id === movieId);
      const updatedMovie = { ...movieToUpdate, name: editedName };

      const response = await fetch(`https://localhost:7123/api/Movie/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie),
      });

      if (!response.ok) throw new Error('Failed to update movie');

      setMovies(movies.map(m => (m.id === movieId ? updatedMovie : m)));
      setEditingMovieId(null);
      setEditedName('');
      setActiveButton({ movieId: null, type: null });
    } catch (error) {
      alert('Error updating movie: ' + error.message);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await fetch(`https://localhost:7123/api/Movie/${movieId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete movie');

      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      alert('Error deleting movie: ' + error.message);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div className="movies-container">
      <h2>Movies List</h2>
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
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>
                {editingMovieId === movie.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                  />
                ) : (
                  movie.name
                )}
              </td>
              <td>{movie.duration}</td>
              <td>{movie.rating}</td>
              <td>{movie.releaseYear}</td>
              <td>{movie.genres ? movie.genres.join(' | ') : 'N/A'}</td>
              <td>
                {editingMovieId === movie.id ? (
                  <>
                    <button
                      className={activeButton.movieId === movie.id && activeButton.type === 'update' ? 'button-active' : ''}
                      onClick={() => {
                        handleUpdateMovie(movie.id);
                      }}
                    >
                      Update Movie
                    </button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      className={activeButton.movieId === movie.id && activeButton.type === 'edit' ? 'button-active' : ''}
                      onClick={() => startEditing(movie)}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteMovie(movie.id)}>Delete Movie</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
