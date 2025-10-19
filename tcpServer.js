const net = require('net');
const trackingService = require('./src/services/tracking.services'); 
// 🚨 NO requerimos socketUtil aquí para evitar el error de inicialización.

// 1. Creamos la instancia del servidor
const server = net.createServer((socket) => {
    let hasProcessed = false; 
    let buffer = Buffer.alloc(0);

    socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        const dataString = buffer.toString('ascii').trim();
        
        // Procesamos solo si recibimos el comando "test"
        if (dataString === "test") {
            // Evita el doble procesamiento
            if (hasProcessed) {
                return; 
            }
            hasProcessed = true;

            // SIMULACIÓN DE DATOS GPS (Genera una nueva posición aleatoria)
            const baseLat = 10.00;
            const baseLon = -84.00;
            const offset = (Math.random() * 0.01) - 0.005; 

            const trackingData = {
                vehicleId: 3,
                latitude: (baseLat + offset).toFixed(6), 
                longitude: (baseLon + offset * 1.5).toFixed(6),
                speed: Math.floor(Math.random() * 80), 
                gpsTimestamp: new Date().toISOString()
            };
            
            console.log(`[TCP] Datos Simulados: Lat ${trackingData.latitude}, Lon ${trackingData.longitude}`);

            trackingService.createTrackingRecord(trackingData)
                .then((newRecord) => { 
                    console.log(`[TCP] ✅ Registro GPS guardado para vehículo: ${trackingData.vehicleId}`);
                    
                    // 🚨 CARGA TARDÍA: Obtenemos Socket.io aquí. Esto funciona porque Express ya lo inicializó.
                    // Ajusta esta ruta si tcpServer.js no está en la raíz, pero el default es correcto.
                    const socketUtil = require('./src/utils/socket'); 
                    const io = socketUtil.getIo();
                    
                    // Emitimos la nueva ubicación al frontend
                    io.emit('location_update', {
                        vehicleId: newRecord.vehicleId,
                        latitude: newRecord.latitude, 
                        longitude: newRecord.longitude,
                        speed: newRecord.speed,
                        gpsTimestamp: newRecord.gpsTimestamp
                    });

                    console.log(`[Socket.io] Ubicación de vehículo ${newRecord.vehicleId} emitida.`);
                    socket.write('ACK\r\n'); // Respuesta al cliente TCP (opcional)
                })
                .catch(err => {
                    console.error('[TCP ERROR] Error al guardar registro:', err.message);
                    socket.write('ERROR\r\n');
                });
        }
    });

    socket.on('error', (err) => {
        console.error(`[TCP] Error en la conexión del socket: ${err.message}`);
    });
});

// Exportamos la instancia del servidor para que pueda ser iniciada por server.js
module.exports = server;