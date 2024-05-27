import axios from "axios";

const baseUrl = "api/notes";

let token = null;

function setToken(newToken) {
    token = `Bearer ${newToken}`;
}

async function getAll() {
    const response = await axios.get(baseUrl);
    return response.data;
}

async function create(newNote) {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newNote, config);
    return response.data;
}

export default {
    getAll, create, setToken
}
