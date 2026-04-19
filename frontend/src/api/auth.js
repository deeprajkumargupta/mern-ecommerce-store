import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:5000/api/v1/auth",
    withCredentials: true  //Browser, automatically attach cookies with request
});   //creates a custom axios instance

// APIs
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const logoutUser = () => API.post("/logout");

// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });   //This runs before every request, Axios interceptor attaches the token to requests

// Response interceptor
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || "";

        // Auto refresh logic
        const shouldSkipRefresh =
            requestUrl.includes("/login") ||
            requestUrl.includes("/register") ||
            requestUrl.includes("/refresh-token") ||
            requestUrl.includes("/logout");

        if (error.response?.status === 401 && !originalRequest?._retry && !shouldSkipRefresh) {
            originalRequest._retry = true;

            try {
                await API.post("/refresh-token");
                return API(originalRequest); // retry original request
            } catch (err) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export const getProfile = () => API.get("/profile");





// fetch("http://localhost:5000/api/v1/auth/login", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify(data)
// })
