const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const path = require('path');
const moment = require('moment-timezone');

const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'src')));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {console.log(`Server is running at ${PORT}`)});

io.on('connection', (socket) => { 
    socket.on('inAlert', (data) => {
        const { name } = data;
        io.emit('inAlert', {
            name
        });
    }); 
    socket.on('profile', (data) => {
        const { img } = data;
        io.emit('profile', {
            img
        });
    }); 
    socket.on('chatting', (data) => {
        const { name, msg, img } = data;
        io.emit('chatting', {
            name,
            msg,
            img,
            time: moment(new Date()).tz("Asia/Seoul").format('h:mm A')
        });
    }); 
});