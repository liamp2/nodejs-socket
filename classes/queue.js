class Queue {

    constructor() {
        this.items = [];
        this.tail = 0;
        this.head = 0;
    }
    
    enqueue(item) {
        this.items[this.tail] = item;
        this.tail ++;
    }

    dequeue() {
        
        if (this.tail == this.head) return false;

        var item = this.items[this.head];
        delete this.items[this.head];
        this.head ++;
        return item;
    }

    length() {
        return this.tail - this.head;
    }
}
module.exports = Queue;
console.log('in queue');