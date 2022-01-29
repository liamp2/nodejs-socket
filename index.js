const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
var users = 0;

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

// var activeRooms = [];
const NUM_OF_PIECES_TYPE = 20;
const NUM_PIECE_TYPES = 5;
const PIECES_PER_HOLDER = 4;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charsLen = characters.length;
const MAX_ROOM_SIZE = 4;
generateRoomCode = function() {

    var length = 6;
    roomCode = '';

    for (var i = 0; i < length; i ++){
        roomCode += characters.charAt(Math.floor(Math.random() * charsLen));
    }
    
    return roomCode;
}


Room = function() {

    console.log('room constructor');
    this.code = generateRoomCode();
    this.numPlayers = 0;
    this.open = true;

   

    this.addPlayer = function() {
        console.log('adding player');
        if (this.open) {

            this.numPlayers ++;
            this.open = (this.numPlayers < MAX_ROOM_SIZE);
            return true;

        } else {

            return false;
        }
        console.log(this);
    }
}

ActiveRooms = function() {

    this.rooms = {};

    this.checkRoomCode = function(code) {
        console.log('check room code');
        console.log(code);
        var valid = false;
        console.log(this.rooms);
        console.log(this.rooms.hasOwnProperty(code));
        return this.rooms.hasOwnProperty(code);
    }

    this.addRoom = function(room) {


        if (!this.checkRoomCode(room.code)) {
            this.rooms[room.code] = room;
        }
    }

    this.isRoomOpen = function(code) {
        
        return (rooms[code].open);
    }

    this.addPlayer = function(roomCode) {
        console.log('active rooms adding players')
        if (this.checkRoomCode(roomCode)) {
            console.log('good room');
            return this.rooms[roomCode].addPlayer();
        }
        return false;
    }
}

var activeRooms = new ActiveRooms();

// tech namespace
const tech = io.of('/tech');


// io.on('connection', (socket) =>{
//     socket.on('createRoom', (data) => {
//         console.log('create room');
            
//         var room = new Room();
//         activeRooms.addRoom(room);
//         activeRooms.addPlayer(room.code);
                
//         socket.emit('roomCreated', room.code);
//     });
    
// });

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


    // socket.on('createRoom', (data) => {
        
        
    //     var room = new Room();
    //     activeRooms.addRoom(room);
    //     activeRooms.addPlayer(room.code);
             
    //     socket.emit('roomCreated', room.code);
    // });

    socket.on('joinRoom', (roomCode) => {
      
        if (activeRooms.addPlayer(roomCode)) {
            console.log('added plater to room');
            console.log(activeRooms);
            socket.emit('joinedRoom');
        } else {
            tech.emit('roomFull', activeRooms[roomCode]);
        }
    });

    socket.on('askHost', (roomCode) => {
        console.log('asking host');
        socket.emit('alertHost', roomCode);
        tech.in(roomCode).emit('alertHost');
    });

    // socket.on('message', (data) => {
    //     console.log(`message: ${data.msg}`);
    //     tech.in(data.room).emit('message', data.msg);
    // });

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


