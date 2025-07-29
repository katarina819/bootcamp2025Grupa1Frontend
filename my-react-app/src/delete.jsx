import axios from 'axios'

export async function DeleteMovie(id){
    try {
    await axios.delete(`${API_URL}/Movie/${id}`);
  } catch (err) {
    throw new Error(err.response?.data || err.message);
  }
}