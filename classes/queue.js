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
        var item = this.items[this.head];
        delete this.items[this.head];
        this.head ++;
    }

    length() {
        return this.tail - this.head;
    }
}
module.exports = Queue;