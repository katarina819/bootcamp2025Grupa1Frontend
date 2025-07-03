import axios from 'axios'

export async function DeleteMovie(id){
    const response = await axios.delete(`https://localhost:7123/api/Movie/${id}`);
}