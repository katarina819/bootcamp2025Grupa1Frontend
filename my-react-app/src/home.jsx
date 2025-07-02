import './home.css'
import {Link} from 'react-router-dom'

export default function Home(){
    return(
        <div className="home-container">
            <div className="buttonas-wrapper">
                <Link to="/movies"><button className="home-page-btn">Movies</button></Link>
                <Link to="/add"><button className="home-page-btn">AddMovie</button></Link>
            </div>
            <input className="search" type="text" placeholder="Search movie..." />
        </div>
    );
}