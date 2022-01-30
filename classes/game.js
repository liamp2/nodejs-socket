
const Queue = require('./queue.js');
const Factory = require('./factory.js');

const NUM_PIECES_PER_TYPE = 20;
const NUM_OF_PIECE_TYPES = 5;
const PIECES_PER_FACTORY = 4;

module.exports = class Game {

    constructor(room) {
        console.log('constructing game');
        console.log(room);
        this.pieces = new Queue();
        
        this.active = true;
        this.randomizePieces();
        this.numFactories = (room.numPlayers * 2) + 1;

        this.factories = [];

        for (var i = 0; i < this.numFactories; i ++) {
            this.factories[i] = new Factory();
        }
        console.log(this.factories);
        this.fillFactories();
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



    fillFactories() {
        
        var self = this;

        this.factories.forEach(function(factory, i) {
            
            for (var i = 0; i < PIECES_PER_FACTORY; i ++){
                var tile = self.pieces.dequeue()

                if (tile) {


                    factory.addTile(tile);

                } else {

                    throw 'Bag is empty';
                    return false; 
                }
            }
        });

        console.log(this);
    }    
}

// module.exports = Game;