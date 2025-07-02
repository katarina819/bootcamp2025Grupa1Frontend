import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './details.css'

export default function MovieDetails() {
    const [movie, setMovie] = useState([]);
    const [error, setError] = useState(null);
    const {movieId} = useParams();

    useEffect(() => {
        if (!movieId) return;
        setMovie(null);
        setError(null);
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7123/api/Movie/${movieId}`);
                setMovie(response.data);
            } catch (err) {
                setError(err?.message || 'Unknown error');
            }
        };
        fetchMovieDetails();
    }, [movieId]);
    if (error) return <Error message={error} />;
    if (!movie) return (
            <p>Loading movie...</p>
    );

    return(
        <div className="content">
            <div className="details-container">
                <div>
                    <h1 className="movie-title">{movie.name}</h1>
                    <div className="under-title">
                        <p>Year: {movie.releaseYear}</p>
                        <p>{movie.duration}min</p>
                        <p>Rating: {movie.rating}</p>
                    </div>
                </div>
                <div className="inline-container">
                    <h3>Director: </h3>
                    <p>{movie.directorName}</p>
                </div>
                <div className="inline-container">
                    <h3>Genres: </h3>
                    <ul>
                        {movie.genres?.map((g, index) => (
                            <li key={index}>{g}</li>
                        ))}
                    </ul>
                </div>
                <div className="inline-container">
                    <h3>Languages: </h3>
                    <ul>
                        {movie.languages?.map((l, index) => (
                            <li key={index}>{l}</li>
                        ))}
                    </ul>
                </div>
                <div className="inline-container">
                    <h3>Description: </h3>
                    <p>{movie.description}</p>
                </div>
            </div>
        </div>
    );
}