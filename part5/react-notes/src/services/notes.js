import axios from "axios";

const baseUrl = "api/notes";

async function getAll() {
    const response = await axios.get(baseUrl);
    return response.data;
}

async function create(newNote) {
    const response = await axios.post(baseUrl, newNote);
    return response.data;
}

export default {
    getAll, create
}
