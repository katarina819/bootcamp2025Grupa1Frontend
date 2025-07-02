import './home.css'
import {Link, useNavigate } from 'react-router-dom'
import {useState, useEffect} from 'react'
import axios from 'axios'

export default function Home(){
    async function fetchMoviesByName(query) {
        const response = await axios.get(`https://localhost:7123/api/Movie/search?filter=${encodeURIComponent(query)}`);
        return response.data;
}
    return(
        <div className="home-container">
            <div className="buttonas-wrapper">
                <Link to="/movies"><button className="home-page-btn">Movies</button></Link>
                <Link to="/add"><button className="home-page-btn">AddMovie</button></Link>
            </div>
            <Searchbar onSearch={fetchMoviesByName}/>
        </div>
    );
}

function Searchbar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(query.length === 0){
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            const movies = await onSearch(query);
            setResults(movies);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    },[query]);



    function handleSelect(movieId) {
        navigate(`/details/${movieId}`);
    }

    return (
        <div>
            <input type="text" 
            className="search"
            placeholder="Search movie..."
            value = {query}
            onChange={e => setQuery(e.target.value)}/>
            {results.length > 0 && (
                <ul>
                    {results.map(movie => (
                        <li key={movie.id} onClick={() => handleSelect(movie.id)}
                        onMouseDown={e => e.preventDefault()}>{movie.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}