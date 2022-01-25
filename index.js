const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
var users = 0;

const NUM_OF_PIECES_TYPE = 20;
const NUM_PIECE_TYPES = 5;
const PIECES_PER_HOLDER = 4;

server.listen(port,  () =>{
    console.log('listening');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/azul', (req, res) => {
    res.sendFile(__dirname + '/public/azul.html');
});

app.get('/html', (req, res) => {
    res.sendFile(__dirname + '/public/html.html');
});
// tech namespace
const tech = io.of('/tech');


tech.on('connection', (socket) => {
    
    socket.on('join', (data) => {

        if (data.room == 'azul') users ++;
        console.log(users);
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`);

        if (users == 1) tech.emit('host');
        if (users >= 2 && users <= 4) tech.emit('enableStartGame');

        tech.emit('initComplete', {users});
    });


    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        users --;
        console.log(users);
        tech.emit('message', 'user disconnected');
    });

    socket.on('initGame', () =>{

        var data = {users};

        tech.emit('initComplete', data);

    });

});