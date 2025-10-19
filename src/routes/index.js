const express = require('express');
const userRouter = require('./user.router');
const vehicleRouter = require('./vehicle.router');
const trackingRouter = require('./tracking.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', userRouter)
router.use('/vehicles', vehicleRouter)
router.use('/trackings', trackingRouter)


module.exports = router;
