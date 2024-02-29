import express from "express"
import { createServer } from "http"
import { Server } from "socket.io";
import { resolve } from "path";

const app = express()
const server = createServer(app)

const io = new Server(server);

app.use(express.static(resolve("./client")))

io.on("connection", (socket) => {
    console.log("New user ", socket.id);
    socket.on("user-message", message => {
        console.log(socket.id, message);
        io.emit("message", message, socket.id)
    })
})

app.get("/", (req, res) => {
    res.sendFile("D:/Web development/chat application/client/index.html")
})

server.listen(3000, () => {
    console.log("Server....");
})