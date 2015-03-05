/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(function () {
    var extinct = 0;
    var worldCanvas = document.getElementById("worldCanvas");
    var FOOD_SIZE = 5000;
    var theWorld = {
        paper: worldCanvas.getContext("2d"),
        width: worldCanvas.width,
        height: worldCanvas.height,
        map: []
    };

    theWorld.init = function () {
        for (var i = 0; i < this.width; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.map[i][j] = {hasFood: false};
            }
        }
        this.initFood();
    };

    theWorld.insertFood = function () {
        var notInsert = true;
        while (notInsert) {
            var randomX = Math.floor(this.width * Math.random());
            var randomY = Math.floor(this.height * Math.random());
            if (!this.map[randomX][randomY].hasFood)
                notInsert = false;
            this.map[randomX][randomY].hasFood = true;
        }

    };

    theWorld.initFood = function () {
        for (var i = 0; i < FOOD_SIZE; i++) {
            theWorld.insertFood();
            /*
             var randomX = Math.floor(this.width * Math.random());
             var randomY = Math.floor(this.height * Math.random());
             if (this.map[randomX][randomY].hasFood)
             i--;
             this.map[randomX][randomY].hasFood = true;*/
        }
    };


    theWorld.drawFood = function () {
        this.paper.fillStyle = "#00FF00";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.map[i][j].hasFood)
                    this.paper.fillRect(i, j, 5, 5);
            }
        }
    };

    theWorld.removeFood = function (x, y) {
        if (this.map[x][y].hasFood) {
            this.map[x][y].hasFood = false;
            setTimeout(function () {
                theWorld.insertFood();
            }, Math.floor(10000 * Math.random()) + 10000);

            return true;
        }
        return false;
    };


    theWorld.init();

    var agentCount = 10;
    var agentArr = [];

    for (var i = 0; i < agentCount; i++) {
        agentArr[i] = new Agent(theWorld);
    }

    setInterval(function () {
        worldCanvas.width = worldCanvas.width;
        theWorld.drawFood();

        for (var i = 0; i < agentArr.length; i++) {
            if (agentArr[i].isLive()) {
                agentArr[i].behave();
                if (agentArr[i].isReproduction()) {
                    agentArr[agentArr.length] = new Agent(theWorld, agentArr[i]);
                }
                agentArr[i].draw();
            } else {
                agentArr.splice(i, 1);
                i--;
            }
        }
        var sum = 0;
        for (var i = 0; i < agentArr.length; i++) {
            sum += agentArr[i].size;
        }

        $("#avgSizeLabel").text("Average Size: " + (sum / agentArr.length));
        $("#countLabel").text("life Count: " + agentArr.length);
        $("#extinctLabel").text("extinct Times: " + extinct);

        if (agentArr.length === 0) {
            extinct++;
            theWorld.init();
            agentCount = 10;
            for (var i = 0; i < agentCount; i++) {
                agentArr[i] = new Agent(theWorld);
            }
        }

    }, 1);


});
