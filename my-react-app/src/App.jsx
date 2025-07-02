import axios from "axios";
import Movies from "./movies"; // ili './Movies.jsx' ako je točan naziv datoteke
import MovieForm from "./MovieForm.jsx";

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
    <div>
      <Movies />
      <MovieForm
        addMovie={addMovie}
        updateMovie={updateMovie}
        editingMovie={null}
      />
    </div>
  );
}

export default App;
