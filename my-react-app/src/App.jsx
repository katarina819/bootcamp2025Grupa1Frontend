import axios from "axios";
import Movies from "./movies.jsx"; 
import MovieForm from "./MovieForm.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Home from "./home";
import MovieDetails from "./details";


const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const addMovie = async (movie) => {
    try {
      await axios.post(`${API_URL}/api/movie/add-movie`, movie);
      alert("Movie added successfully!");
    } catch (err) {
      throw new Error(err.response?.data || err.message);
    }
  };

  const updateMovie = async (movie) => {
    try {
      await axios.put(`${API_URL}/api/movie/update-movie`, movie);
      alert("Movie updated successfully!");
    } catch (err) {
      throw new Error(err.response?.data || err.message);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="details/:movieId" element={<MovieDetails />} />
          <Route
            path="add-movie"
            element={
              <MovieForm addMovie={addMovie} updateMovie={updateMovie} />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
