const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen('http://nodejs-chatter-test.herokuapp.com/',  () =>{
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/php', (req, res) => {
    res.sendFile(__dirname + '/public/php.html');
});

app.get('/html', (req, res) => {
    res.sendFile(__dirname + '/public/html.html');
});
// tech namespace
const tech = io.of('/tech');


tech.on('connection', (socket) => {
    
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
    });


    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
       
        tech.emit('message', 'user disconnected');
    });

});