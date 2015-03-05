/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var INIT_SIZE_PARAM = 1;
var INIT_SPEED_ADD_PARAM = 15;
var INIT_SPEED_PARAM = 20;
var INIT_ENERGY_PARAM = 100;
var RESISTANCE_PARAM = 1.1;

function Agent(theWorld, theSize, x, y) {
    this.world = theWorld;
    this.size = theSize || (Math.random() * INIT_SIZE_PARAM + 5);
    if (this.size < 3)
        this.size = 3;
    //this.addSpeed = addSpeed || (Math.random() * INIT_SPEED_ADD_PARAM + 10);
    this.maxSpeed = 1 / this.size * INIT_SPEED_PARAM;

    this.energyLimit = Math.log(this.size) * INIT_ENERGY_PARAM;
    this.energy = this.energyLimit; //full energy first
    this.curDx = 0;
    this.curDy = 0;
    this.curX = x || this.world.height * Math.random();
    this.curY = y || this.world.width * Math.random();
}

Agent.prototype.changeSpeed = function() { //Acceleration
    var accX = this.maxSpeed / 2 - (Math.random() * this.maxSpeed);
    var accY = this.maxSpeed / 2 - (Math.random() * this.maxSpeed);

    this.curDx += accX;
    this.curDy += accY;

    this.energy -= accX * accX + accY * accY;
};

Agent.prototype.move = function() { //Acceleration
    this.curX += this.curDx;
    this.curY += this.curDy;

    if (this.curX > this.world.width) {
        this.curX -= this.world.width;
    } else if (this.curX < 0) {
        this.curX += this.world.width;
    }

    if (this.curY > this.world.height) {
        this.curY -= this.world.height;
    }
    if (this.curY < 0) {
        this.curY += this.world.height;
    }

    this.curDx /= RESISTANCE_PARAM;
    this.curDy /= RESISTANCE_PARAM;
};

Agent.prototype.isLive = function() {
    return this.energy > 0;
};

Agent.prototype.isReproduction = function() {
    if (this.energy > this.energyLimit) {
        this.energy *= 0.8;
        return true;
    }
    return false;
};

Agent.prototype.behave = function() {
    this.changeSpeed();
    this.eat();
    this.move();
    //idle cost
    this.energy -= this.size * this.size / 1000;
};
Agent.prototype.draw = function() {
    var drawPaper = this.world.paper;
    drawPaper.fillStyle = "rgb(" + Math.floor(255 * this.energy / this.energyLimit) + ",0,0)";
    drawPaper.beginPath();
    drawPaper.arc(this.curX, this.curY, this.size, 0, Math.PI * 2, true);
    drawPaper.closePath();
    drawPaper.fill();
};

Agent.prototype.eat = function() {
    var halfSize = this.size / 2;
    var eatX = Math.floor(this.curX - halfSize);
    var eatY = Math.floor(this.curY - halfSize);
    if (eatX < 0)
        eatX = 0;
    if (eatY < 0)
        eatY = 0;

    var endX = eatX + this.size;
    var endY = eatY + this.size;
    if (endX > this.world.width)
        endX = this.world.width;
    if (endY > this.world.height)
        endY = this.world.height;

    for (var i = eatX; i < endX; i++) {
        for (var j = eatY; j < endY; j++) {
            if (this.world.removeFood(i, j)) {
                this.energy += 15;
            }
        }
    }
};