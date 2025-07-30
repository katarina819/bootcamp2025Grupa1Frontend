import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./MovieForm.css";


const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL is", API_URL);

function MovieForm({ addMovie, updateMovie }) {
  const location = useLocation();
  const navigate = useNavigate(); 
  const editingMovie = location.state?.editingMovie;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    duration: "",
    releaseYear: "",
    rating: "",
    description: "",
    directorName: "",
    genres: "",
    languages: "",
  });

  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  const genreDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  
    useEffect(() => {
    const fetchGenreAndLanguage = async () => {
      try {
        const genreResponse = await axios.get(`${API_URL}/api/genres`);
        setAvailableGenres(genreResponse.data.items || genreResponse.data);
        const languageResponse = await axios.get(`${API_URL}/api/language`);
        setAvailableLanguages(
          languageResponse.data.items || languageResponse.data
        );
      } catch (error) {
        console.error("Error fetching genres or languages:", error);
        setError("Failed to load genres or languages.");
      }
    };
    fetchGenreAndLanguage();
  }, []);

  
  useEffect(() => {
    if (editingMovie) {
      const genres = editingMovie.genres || [];
      const languages = editingMovie.languages || [];
      const genreIds = genres
        .map(
          (name) =>
            availableGenres.find(
              (g) => g.name.toLowerCase() === name.toLowerCase()
            )?.id
        )
        .filter((id) => id);
      const languageIds = languages
        .map(
          (name) =>
            availableLanguages.find(
              (l) => l.name.toLowerCase() === name.toLowerCase()
            )?.id
        )
        .filter((id) => id);

      setSelectedGenreIds(genreIds);
      setSelectedLanguageIds(languageIds);
      setFormData({
        id: editingMovie.id || "",
        name: editingMovie.name || "",
        duration: editingMovie.duration ? editingMovie.duration.toString() : "",
        releaseYear: editingMovie.releaseYear
          ? editingMovie.releaseYear.toString()
          : "",
        rating: editingMovie.rating ? editingMovie.rating.toFixed(1) : "",
        description: editingMovie.description || "",
        directorName: editingMovie.directorName || "",
        genres: genres.join(", "),
        languages: languages.join(", "),
      });
    } else {
      setSelectedGenreIds([]);
      setSelectedLanguageIds([]);
      setFormData({
        id: "",
        name: "",
        duration: "",
        releaseYear: "",
        rating: "",
        description: "",
        directorName: "",
        genres: "",
        languages: "",
      });
    }
  }, [editingMovie, availableGenres, availableLanguages]);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target)
      ) {
        setIsGenreDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenreChange = (genreId, genreName) => {
    const updatedGenreIds = selectedGenreIds.includes(genreId)
      ? selectedGenreIds.filter((id) => id !== genreId)
      : [...selectedGenreIds, genreId];
    setSelectedGenreIds(updatedGenreIds);
    const genreNames = updatedGenreIds
      .map((id) => availableGenres.find((g) => g.id === id)?.name)
      .filter((name) => name);
    setFormData({
      ...formData,
      genres: genreNames.join(", "),
    });
  };

  const handleLanguageChange = (languageId, languageName) => {
    const updatedLanguageIds = selectedLanguageIds.includes(languageId)
      ? selectedLanguageIds.filter((id) => id !== languageId)
      : [...selectedLanguageIds, languageId];
    setSelectedLanguageIds(updatedLanguageIds);
    const languageNames = updatedLanguageIds
      .map((id) => availableLanguages.find((l) => l.id === id)?.name)
      .filter((name) => name);
    setFormData({
      ...formData,
      languages: languageNames.join(", "),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "rating" && value
          ? parseFloat(parseFloat(value).toFixed(1)).toString()
          : value,
    });
  };

  const toggleGenreDropdown = () => {
    setIsGenreDropdownOpen(!isGenreDropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const movie = {
      id: editingMovie ? formData.id : uuidv4(),
      name: formData.name,
      duration: parseInt(formData.duration) || 0,
      releaseYear: parseInt(formData.releaseYear) || 0,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      description: formData.description || "",
      directorName: formData.directorName,
      genres: selectedGenreIds,
      languages: selectedLanguageIds,
    };
    try {
      setError(null);
      if (editingMovie && formData.id) {
        await updateMovie(movie);
      } else {
        await addMovie(movie);
      }
      
      setFormData({
        id: "",
        name: "",
        duration: "",
        releaseYear: "",
        rating: "",
        description: "",
        directorName: "",
        genres: "",
        languages: "",
      });
      setSelectedGenreIds([]);
      setSelectedLanguageIds([]);
      
      navigate("/movies");
    } catch (error) {
      console.error("Error submitting movie:", error);
      setError(
        "Failed to submit movie: " + (error.response?.data || error.message)
      );
    }
  };

  const handleCancel = () => {
    
    setFormData({
      id: "",
      name: "",
      duration: "",
      releaseYear: "",
      rating: "",
      description: "",
      directorName: "",
      genres: "",
      languages: "",
    });
    setSelectedGenreIds([]);
    setSelectedLanguageIds([]);
    
    navigate("/movies");
  };

  return (
    <div>
      <h2>{editingMovie ? "Edit Movie" : "Add Movie"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="movie-form">
        <label htmlFor="name">Title:</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength="100"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter movie title"
          autoComplete="off"
        />
        <label htmlFor="duration">Duration (minutes):</label>
        <input
          id="duration"
          name="duration"
          type="number"
          min="1"
          max="600"
          value={formData.duration}
          onChange={handleChange}
          required
          placeholder="Enter duration of a movie"
          autoComplete="off"
        />
        <label htmlFor="rating">Rating:</label>
        <input
          id="rating"
          name="rating"
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Enter movie rating"
          autoComplete="off"
        />
        <label htmlFor="releaseYear">Year:</label>
        <input
          id="releaseYear"
          name="releaseYear"
          type="number"
          min="1888"
          max="2100"
          value={formData.releaseYear}
          onChange={handleChange}
          required
          placeholder="Enter release year"
          autoComplete="off"
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          maxLength="1000"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter movie description"
          autoComplete="off"
        />
        <label htmlFor="directorName">Director:</label>
        <input
          id="directorName"
          name="directorName"
          type="text"
          maxLength="100"
          value={formData.directorName}
          onChange={handleChange}
          required
          placeholder="Enter director name"
          autoComplete="off"
        />
        <span className="label-text">Genres:</span>
        <div className="multi-select-dropdown" ref={genreDropdownRef}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={toggleGenreDropdown}
          >
            {selectedGenreIds.length > 0
              ? selectedGenreIds
                  .map((id) => availableGenres.find((g) => g.id === id)?.name)
                  .filter((name) => name)
                  .join(", ")
              : "Select genres"}
          </button>
          {isGenreDropdownOpen && (
            <div className="dropdown-menu">
              {availableGenres.map((genre) => (
                <label
                  key={genre.id}
                  className="checkbox-label"
                  htmlFor={`genre-${genre.id}`}
                >
                  <input
                    type="checkbox"
                    id={`genre-${genre.id}`}
                    value={genre.id}
                    checked={selectedGenreIds.includes(genre.id)}
                    onChange={() => handleGenreChange(genre.id, genre.name)}
                  />
                  {genre.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <span className="label-text">Languages:</span>
        <div className="multi-select-dropdown" ref={languageDropdownRef}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={toggleLanguageDropdown}
          >
            {selectedLanguageIds.length > 0
              ? selectedLanguageIds
                  .map(
                    (id) => availableLanguages.find((l) => l.id === id)?.name
                  )
                  .filter((name) => name)
                  .join(", ")
              : "Select languages"}
          </button>
          {isLanguageDropdownOpen && (
            <div className="dropdown-menu">
              {availableLanguages.map((language) => (
                <label
                  key={language.id}
                  className="checkbox-label"
                  htmlFor={`language-${language.id}`}
                >
                  <input
                    type="checkbox"
                    id={`language-${language.id}`}
                    value={language.id}
                    checked={selectedLanguageIds.includes(language.id)}
                    onChange={() =>
                      handleLanguageChange(language.id, language.name)
                    }
                  />
                  {language.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="submit">
          {editingMovie ? "Update Movie" : "Add Movie"}
        </button>
        {editingMovie && (
          <button
            type="button"
            className="cancel"
            onClick={handleCancel} 
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default MovieForm;
