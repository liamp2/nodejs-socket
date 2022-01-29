
const Queue = require('./queue.js');

const NUM_PIECES_PER_TYPE = 20;
const NUM_OF_PIECE_TYPES = 5;
const PIECES_PER_HOLDER = 4;

module.exports = class Game {

    constructor() {

        this.pieces = new Queue();
        
        this.active = true;
        this.randomizePieces();
    }

    randomizePieces() {

        
        var pieceTypes = {};
        var pieceNames = ['blue', 'red', 'orange', 'black', 'light-blue'];
        
        pieceNames.forEach(function(name, i)  {

            pieceTypes[name] = NUM_PIECES_PER_TYPE;
        });

        
        do {    

            var i = Math.floor(Math.random() * NUM_OF_PIECE_TYPES);

            var name = pieceNames[i];

            if (pieceTypes[name] > 0) {
                this.pieces.enqueue(name);
                pieceTypes[name] --;
            }

        } while (this.pieces.length() < 100);
        console.log(this);
    }

    
}

// module.export = Game;