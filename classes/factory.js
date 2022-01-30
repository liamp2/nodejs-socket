

module.exports = class Factory {


    constructor() {

        this.tiles = [];
        
    }

    addTile(tile) {

        if (this.tiles.length < 4){

            this.tiles.push(tile);
            return true;
        } else {
            return false;
        }
        
    } 
}