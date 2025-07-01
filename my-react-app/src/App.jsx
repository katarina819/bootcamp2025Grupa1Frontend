import Movies from './movies';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from './navbar';
import Home from './home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
