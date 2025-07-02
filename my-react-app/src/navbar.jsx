import {NavLink, Outlet} from "react-router-dom"
import './navbar.css'

export default function Navbar() {
    return(
        <>
            <nav>
                <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
                <NavLink to="/movies" className={({ isActive }) => isActive ? "active" : ""}>Movies</NavLink>
                <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>Add Movie</NavLink>
            </nav>
            <Outlet />
        </>
    );
}