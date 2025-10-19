const { Server } = require('socket.io');

// Almacena la instancia de Socket.io
let io;

module.exports = {
    // Inicializa Socket.io envolviendo el servidor HTTP
    init: (httpServer) => {
        
        // 🚨 OPCIONES DE CONFIGURACIÓN AÑADIDAS 🚨
        io = new Server(httpServer, {
            
            // 1. CONFIGURACIÓN DE HEARTBEAT (Ping/Pong)
            // Estos valores fuerzan a que el servidor y el cliente se comuniquen más a menudo.
            pingInterval: 10000, // Envía un ping al cliente cada 10 segundos
            pingTimeout: 5000,   // Si no responde en 5 segundos, se considera desconectado

            // 2. CONFIGURACIÓN DE CORS
            cors: {
                // ✅ IMPORTANTE: Si vas a producción, cambia localhost:5173 por la URL de tu dominio (ej: https://tusitio.com)
                origin: ["http://localhost:5173"], 
                methods: ["GET", "POST"],
                credentials: true 
            }
        });
        return io;
    },
    
    // Devuelve la instancia 'io' para usarla en tcpServer.js
    getIo: () => {
        if (!io) {
            throw new Error("Socket.io no está inicializado. Ejecute init(httpServer) primero.");
        }
        return io;
    }
};


// const { Server } = require('socket.io');

// // Almacena la instancia de Socket.io
// let io;

// module.exports = {
//     // Inicializa Socket.io envolviendo el servidor HTTP
//     init: (httpServer) => {
//         // Configuraciones de CORS que ya tienes en app.js (repetimos para el socket)
//         io = new Server(httpServer, {
//             cors: {
//                 origin: ["http://localhost:5173"], // 🚨 Ajusta si tu frontend cambia
//                 methods: ["GET", "POST"],
//                 credentials: true // Necesario si tus sockets usan cookies o autenticación
//             }
//         });
//         return io;
//     },
    
//     // Devuelve la instancia 'io' para usarla en tcpServer.js
//     getIo: () => {
//         if (!io) {
//             throw new Error("Socket.io no está inicializado. Ejecute init(httpServer) primero.");
//         }
//         return io;
//     }
// };