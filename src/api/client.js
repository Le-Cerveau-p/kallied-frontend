import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000",
// });

const api = axios.create({
    baseURL: "https://kallied-backend-production.up.railway.app",
});

export default api;