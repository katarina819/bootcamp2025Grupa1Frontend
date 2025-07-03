import React, { useEffect, useState } from "react";
import "./movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [activeButton, setActiveButton] = useState({ movieId: null, type: null });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState (0); 

  useEffect(() => {
<<<<<<< HEAD
    fetch("https://localhost:7123/api/Movie/get-all-movies")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
=======
    setLoading(true);
    fetch(`https://localhost:7123/api/Movie/get-all-movies?page=${page}&pageSize=${pageSize}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
>>>>>>> 3a545a9 (Dorada movie list - paginacija)
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
  }, [page, pageSize]);

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

      const updatedMovies = movies.filter(movie => movie.id !== movieId);
    setMovies(updatedMovies);

    const newTotalCount = totalCount - 1;
    setTotalCount(newTotalCount);

    const newTotalPages = Math.ceil(newTotalCount / pageSize);
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
    } catch (error) {
      alert('Error deleting movie: ' + error.message);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;
  const emptyRowsCount = pageSize - movies.length;

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
<<<<<<< HEAD
          {movies.map((movie) => (
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
=======
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
      <td className="action-buttons">
        {editingMovieId === movie.id ? (
          <>
            <button
              className={activeButton.movieId === movie.id && activeButton.type === 'update' ? 'button-active' : ''}
              onClick={() => handleUpdateMovie(movie.id)}
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
            <button onClick={() => handleDeleteMovie(movie.id)}>Delete<br / >Movie</button>
          </>
        )}
      </td>
    </tr>
  ))}
>>>>>>> 3a545a9 (Dorada movie list - paginacija)

  {/* Dodaj prazne redove da tablica uvijek ima isti broj redova */}
  {emptyRowsCount > 0 && [...Array(emptyRowsCount)].map((_, idx) => (
    <tr key={`empty-${idx}`} className="empty-row">
      <td colSpan="6">&nbsp;</td>
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

}
export default Movies;

