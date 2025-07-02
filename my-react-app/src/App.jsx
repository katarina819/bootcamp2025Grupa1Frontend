import Movies from './movies';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from './navbar';
import Home from './home';
import MovieDetails from './details';

function App() {
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
