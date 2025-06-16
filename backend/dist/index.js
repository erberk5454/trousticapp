"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const PORT = 4000;
// 1. Boş bir HTTP sunucusu oluşturuyoruz
const httpServer = http_1.default.createServer((req, res) => {
    res.writeHead(200);
    res.end("Socket.IO server is running");
});
// 2. Socket.IO sunucusunu httpServer'a bağlıyoruz
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // Geliştirme aşamasında her yerden izin
        methods: ["GET", "POST"]
    },
    transports: ["websocket"]
});
exports.io = io;
io.on("connection", (socket) => {
    console.log(`🆕 Client connected(server): ${socket.id}`);
    socket.on("veri", (data) => { console.log(data); });
    socket.emit("geri", [22, 1, 66, 7, 70]);
});
// 6. HTTP sunucusunu başlat
httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.IO server listening on http://localhost:${PORT}`);
});
