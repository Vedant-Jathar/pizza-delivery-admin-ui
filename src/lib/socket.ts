import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_SOCKET_SERVICE_URL)

socket.on("connect", () => {
    console.log("Socket connected", socket.id);
})

socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
})

export default socket

