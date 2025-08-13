import axios from "axios";
import { AUTH_SERVICE } from "./api";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

const refresh = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}${AUTH_SERVICE}/auth/refresh`, {}, {
        withCredentials: true
    })
}

//This is used when "self" route fails because of expired accessToken so we intercept this response and refresh the tokens and then again send the request.
api.interceptors.response.use((response) => response,
    async (error) => {
        try {
            const originalRequest = error.config
            if (error.response.status === 401 && !originalRequest._isRetry) {
                originalRequest._isRetry = true
                await refresh()
                return await axios(originalRequest)
            }
        } catch (error) {
            return Promise.reject(error)
        }

        return Promise.reject(error)
    }
)


export default api