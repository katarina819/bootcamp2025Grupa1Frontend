import React, { useEffect, useState } from 'react';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      <h2>Movies List</h2>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration (min)</th>
            <th>Rating</th>
            <th>Year</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{movie.duration}</td>
              <td>{movie.rating}</td>
              <td>{movie.releaseYear}</td>
              <td>{movie.genres ? movie.genres.join(', ') : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
