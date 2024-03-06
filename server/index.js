import express from "express"
import { createServer } from "http"
import { Server } from "socket.io";


const app = express()
const server = createServer(app)

const io = new Server(server);



io.on("connection", (socket) => {
    console.log("New user ", socket.id);
    socket.on("user-message", message => {
        console.log(socket.id, message);
        io.emit("message", message, socket.id)
    })
})

app.get("/", (req, res) => {
    res.redirect("https://chat-application-dlhg.onrender.com/")
})

server.listen(3000, () => {
    console.log("Server....");
})