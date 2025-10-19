const app = require('./app'); // Tu aplicación Express
const http = require('http'); 
const socketUtil = require('./utils/socket'); 
// 🚨 Requerimos el servidor TCP. Asegúrate que la ruta '../tcpServer' sea correcta.
const tcpServer = require('../tcpServer'); 

const PORT = process.env.PORT || 8088;
const TCP_PORT = process.env.TCP_PORT || 5000; 

// 1. Crear el servidor HTTP base que Express envuelve
const httpServer = http.createServer(app); 

// 2. Inicializar Socket.io y adjuntarlo al servidor HTTP
const io = socketUtil.init(httpServer); 

// Lógica de conexión de Socket.io
io.on('connection', (socket) => {
    console.log(`[Socket.io] Cliente conectado: ${socket.id}`);
});

const main = async() => {
    try {
        // 3. Iniciar el servidor HTTP/WebSocket (Puerto 8080)
        httpServer.listen(PORT, '::', () => { 
            console.log(`👉 Server Express running on port ${PORT}`);
            console.log(`👉 Link http://localhost:${PORT}`);
            console.log(`⚡ WebSocket Server running on port ${PORT}`);

            // 4. BLOQUE CRUCIAL: Iniciar el servidor TCP (Puerto 5000) DESPUÉS de Socket.io
            tcpServer.listen(TCP_PORT, () => {
                console.log(`📡 Servidor TCP de Rastreo escuchando en el puerto ${TCP_PORT}`);
            });
        });
    } catch(error){
        console.log(error);
    }
}

main();