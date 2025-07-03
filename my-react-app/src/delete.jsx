import axios from 'axios'

export async function DeleteMovie(id){
    try {
    await axios.delete(`https://localhost:7123/api/Movie/${id}`);
  } catch (err) {
    throw new Error(err.response?.data || err.message);
  }
}