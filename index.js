const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const Queue = require('./classes/queue.js');
const Game = require('./classes/game.js');

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
    // this.code = 'LIAM';
    this.numPlayers = 0;
    this.open = true;
    this.active = true;
    // this.socket = io.of('/'+this.code);
   

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

    this.closeRoom = function() {

        this.open = false;
        return true;
    }

    
}

ActiveRooms = function() {

    this.rooms = {};

    this.checkRoomCode = function(code) {
        
        var valid = false;
        // console.log(this.rooms);
        // console.log(this.rooms.hasOwnProperty(code));
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
        
        if (this.checkRoomCode(roomCode)) {
        
            return this.rooms[roomCode].addPlayer();
        }
        return false;
    }

    this.closeRoom = function(roomCode) {

        if (this.checkRoomCode(roomCode)) {
            
            return this.rooms[roomCode].closeRoom();
        }
    }

    this.getRoom = function(roomCode) {

        if (this.checkRoomCode(roomCode)) {
            
            return this.rooms[roomCode];
        }
    }
}



var activeRooms = new ActiveRooms();
var game = new Game();
// namespace
const azul = io.of('/azulHome');
const tech = io.of('/tech');

azul.on('connection', (socket) =>{

    socket.on('createRoom', (data) => {
            
        var room = new Room();
        activeRooms.addRoom(room);
        activeRooms.addPlayer(room.code);
        socket.join(room.code);
        socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (roomCode) => {
      
        if (activeRooms.addPlayer(roomCode)) {
            
            console.log(activeRooms);
            socket.join(roomCode);
            azul.in(roomCode).emit('joinedRoom', activeRooms.rooms[roomCode]);

        } else {

            socket.emit('roomFull', activeRooms[roomCode]);
        }
    });

    socket.on('askHost', (roomCode) => {
        console.log('asking host');
        socket.emit('alertHost', roomCode);
        socket.in(roomCode).emit('alertHost');
    });
    

    socket.on('initGame', (room) =>{

        activeRooms.closeRoom(room.code);

        var data = {room: activeRooms.getRoom(room.code), game: new Game()};

        azul.in(room.code).emit('initComplete', data);

    });
});

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

    // socket.on('joinRoom', (roomCode) => {
      
    //     if (activeRooms.addPlayer(roomCode)) {
    //         console.log('added plater to room');
    //         console.log(activeRooms);
    //         socket.emit('joinedRoom');
    //     } else {
    //         tech.emit('roomFull', activeRooms[roomCode]);
    //     }
    // });

    

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


