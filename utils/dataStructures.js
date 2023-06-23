class Queue{
    constructor(){
        this.elements={};
        this.head=0;
        this.tail=0;
    }
    enqueue(element){
        this.elements[this.tail]=element;
        this.tail++;
    }
    dequeue(){
        const item = this.elements[this.head];
        if(this.length()>0){
            delete this.elements[this.head];
            this.head++;
            return item;
        }
        else return undefined;
    }
    peak(){
        if(this.length()>0)
            return this.elements[this.head];
        else return undefined;
    }
    length(){
        return this.tail -  this.head;
    }
    isEmpty(){
        return this.length == 0;
    }
}

class Stack{
    constructor(){
        this.elements={};
        this.point=-1;
    }
    push(element){
        this.elements[++this.point]=element;
    }
    pop(){
        let element = this.elements[this.point];
        delete this.elements[this.point--];
        return element;
    }
    top(){
        return this.elements[this.point];
    }
    isEmpty(){
        return this.point==-1;
    }
    size(){
        return this.point;
    }
}

module.exports = {Queue, Stack};