// const express = require('express');
// const createHttpError = require('http-errors');
// const cors = require('cors');
// const cloudinary = require('cloudinary').v2;
// const {Server} = require('socket.io');
// const http = require('http'); 

// const carRoutes = require('./api/routes/carRoutes');
// const userRoutes = require('./api/routes/userRoutes');
// const reviewRoutes = require('./api/routes/reviewRoutes');
// const webhookRoutes = require('./api/routes/webhookRoutes');
// const adminRoutes = require('./api/routes/adminRoutes')
// const adminUserRoutes = require('./api/routes/adminUserRoutes')
// const stripeRoutes = require('./api/routes/stripeRoutes')
// const orderRoutes = require('./api/routes/orderRoutes')

// const app = express();
// const server = http.createServer(app); 

// cloudinary.config({
//     secure: true
// });

// app.use(cors());
// app.use(express.static('public'));
// app.use(
//     express.urlencoded({
//         extended: true,
//     })
// )

// const io = new Server(server,{
//     cors:{
//         origin:"http://localhost:3000",
//         methods:["GET","POST"]
//     }
// })

// io.on("connection", (socket)=>{
//     console.log("connected",socket.id)

//     socket.on("disconnect",()=>{
//         console.log("disconnect",socket.id)
//     })
// })

// app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
// app.use(express.json()); // to process JSON in request body
// app.use('/api/admin/', adminUserRoutes);
// app.use('/api', carRoutes);
// app.use('/api', userRoutes);
// app.use('/api', reviewRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/pay', stripeRoutes)
// app.use('/api/orders', orderRoutes)



// app.use(function (req, res, next) {
//     return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
// });


// app.use(function (err, req, res, next) {
//     return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
// });

// module.exports = app;
const express = require('express');
const createHttpError = require('http-errors');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { Server } = require('socket.io');
const http = require('http');

const carRoutes = require('./api/routes/carRoutes');
const userRoutes = require('./api/routes/userRoutes');
const reviewRoutes = require('./api/routes/reviewRoutes');
const webhookRoutes = require('./api/routes/webhookRoutes');
const adminRoutes = require('./api/routes/adminRoutes');
const adminUserRoutes = require('./api/routes/adminUserRoutes');
const stripeRoutes = require('./api/routes/stripeRoutes');
const orderRoutes = require('./api/routes/orderRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        // Broadcast the message to all clients in the room except the sender
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});


cloudinary.config({
    secure: true
});

app.use(cors());
app.use(express.static('public'));
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
app.use(express.json()); // to process JSON in request body
app.use('/api/admin/', adminUserRoutes);
app.use('/api', carRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pay', stripeRoutes);
app.use('/api/orders', orderRoutes);

app.use(function (req, res, next) {
    return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});

app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
});

module.exports = { app, server };
