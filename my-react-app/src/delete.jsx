import axios from 'axios'


const API_URL = import.meta.env.VITE_API_URL;

export async function DeleteMovie(id){
    try {
    await axios.delete(`${API_URL}/api/movie/${id}`);
  } catch (err) {
    throw new Error(err.response?.data || err.message);
  }
}