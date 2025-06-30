import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

const refresh = async () => {
    await axios.post("http://localhost:5501/auth/refresh", {}, {
        withCredentials: true
    })
}

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