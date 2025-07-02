import axios from "axios";
import Movies from "./movies"; // ili './Movies.jsx' ako je točan naziv datoteke
import MovieForm from "./MovieForm.jsx";
import Movies from './movies';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from './navbar';
import Home from './home';
import MovieDetails from './details';

function App() {
  const addMovie = async (movie) => {
    try {
      await axios.post("https://localhost:7123/api/Movie/add-movie", movie);
      alert("Movie added successfully!");
    } catch (err) {
      throw new Error(err.response?.data || err.message);
    }
  };

  const updateMovie = async (movie) => {
    try {
      await axios.put("https://localhost:7123/api/Movie/update-movie", movie);
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
          <Route path="movies" element={<Movies/>} />
          <Route path="details/:movieId" element={<MovieDetails/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
