import http from "http";
import { Server } from "socket.io";

const PORT =4000;

// 1. Boş bir HTTP sunucusu oluşturuyoruz
const httpServer = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Socket.IO server is running");
});

// 2. Socket.IO sunucusunu httpServer'a bağlıyoruz
const io = new Server(httpServer, {
  cors: {
    origin: "*",        // Geliştirme aşamasında her yerden izin
    methods: ["GET", "POST"]
  },
  transports: ["websocket"]
});

io.on("connection", (socket) => {
  console.log(`🆕 Client connected(server): ${socket.id}`); 
  socket.on("veri",(data)=>{console.log(data)})                               
  socket.emit("geri",[22,1,66,7,70])

 });


// 6. HTTP sunucusunu başlat
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server listening on http://localhost:${PORT}`);
});

// Export io instance is optional, only if you plan to import it elsewhere
export { io };