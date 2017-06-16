"use strict";

function Snake(config) {
    config = config || {};
    config.size = config.size || {};
    
    this.snakePosition = [];
    this.pointPosition = {};

    this.vector = 'down';
    this.speed = config.speed || 1;
    this.snakeLength = config.snakeLength || 5;
    this.sizeG = config.size.g || 50;
    this.sizeV = config.size.v || 50;
    this.gameZoneArr = this.createGameArr();
    

    this.score = 0;
    this.level = 'worm';

    this.timer;
}

Snake.prototype.createGameArr = function () {
    var arr = [];

    for(var a = 0; a < this.sizeV; a+=1){
        arr[a] = [];
        for(var b = 0; b < this.sizeG; b+=1){
            arr[a][b] = 0;
        }
    }
    // add Snake
    for(var a = this.snakeLength-1; a > -1; a-=1){
        this.snakePosition.push({
            y: a,
            x: 0
        })
    }

    return arr;
}

Snake.prototype.showIn = function (selector) {
    selector = selector || 'body';
    
    var container = document.querySelector(selector);
    this.gameZone = document.createElement('div');
    this.gameZone.classList.add('tetris');
    container.prepend(this.gameZone);
    this.addControls(container);
    this.addInfo(container);
    this.addPoint();

    this.render();
    this.start();
}

Snake.prototype.addInfo = function(container){
    var infoBlock = document.createElement('div');
    var info = document.createElement('div');
    
    var infoText = document.createElement('span');
    infoText.innerText = 'Score:'

    var text = document.createElement('div');
    text.innerText = 'DRAG HERE';
    text.classList.add('text');

    this.scoreBlock = document.createElement('span');
    this.scoreBlock.innerText = this.score;
    
    info.appendChild(infoText);
    info.appendChild(this.scoreBlock);

    infoBlock.appendChild(text);
    infoBlock.appendChild(info);
    
    infoBlock.classList.add('info');


    container.prepend(infoBlock);
}

Snake.prototype.addPoint = function(){
    var SIZE = this.sizeG < this.sizeV ? this.sizeG : this.sizeV;
    SIZE-=1;
    this.pointPosition = {
        y: randomInteger(0, SIZE),
        x: randomInteger(0, SIZE)
    };
    this.scoreBlock.innerText = this.score;
    function randomInteger(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
}

Snake.prototype.render = function () {
    // clear game zone
    this.gameZone.innerText = '';
    for(var i = 0; i < this.gameZoneArr.length; i+=1){
        for(var b = 0; b < this.gameZoneArr[i].length; b+=1){
            
            var div = document.createElement('div');
            var className = '';

            // clear array
            this.gameZoneArr[i][b] = 0;

            // add point to arr

            if(i === this.pointPosition.y && b === this.pointPosition.x){
                this.gameZoneArr[i][b] = 2;
            }

            // add snake to arr

            for(var num = 0; num < this.snakePosition.length; num+=1){
                if(this.snakePosition[num].y === i && this.snakePosition[num].x === b){
                    this.gameZoneArr[i][b] = 1;
                }
            }
            //add snake and point to gameZone
            if(this.gameZoneArr[i][b] === 1)
            {
                className = 'snake';
            }
            else if(this.gameZoneArr[i][b] === 2){
                className = 'point';
            }

            if(className){
                div.classList.add(className)
            };

            this.gameZone.appendChild(div);
        }
    }
}

Snake.prototype.addControls = function(gameZone){
    gameZone = gameZone || document.body;
    var _this = this;
    var controls = ['left', 'up', 'right', 'down'];

    var container = document.createElement('div');
    container.classList.add('controls');

    controls.forEach(function(item){
        var control = document.createElement('button');
        control.classList.add('control-'+ item)
        control.innerText = item;
        container.appendChild(control);
        control.addEventListener('click', function(){
            if((_this.vector === 'up' && item != 'down') ||
            (_this.vector === 'down' && item != 'up') ||
            (_this.vector === 'left' && item != 'right') ||
            (_this.vector === 'right' && item != 'left')){
                _this.vector = item;
            }
        })
    });
    gameZone.appendChild(container);
    this.addEvents();
}

Snake.prototype.moveSnake = function(){
    for(var i = this.snakePosition.length-1; i > 0; i-=1){
        this.snakePosition[i].y = this.snakePosition[i-1].y;
        this.snakePosition[i].x = this.snakePosition[i-1].x;
    }
    if(this.vector === 'down'){
        this.snakePosition[0].y+=1;
    }else if(this.vector === 'right'){
        this.snakePosition[0].x+=1;     
    }else if(this.vector === 'left'){
        this.snakePosition[0].x-=1;
    }else if(this.vector === 'up'){
        this.snakePosition[0].y-=1;
    }
    this.checkNextStep(this.snakePosition[0].y, this.snakePosition[0].x);
}

Snake.prototype.addEvents = function(){
    var _this = this;
    this.gameZone.addEventListener('click', 
        function(e){
            _this.checVector(e);
        });
}

Snake.prototype.checVector = function(e){
    if(this.vector === 'start'){
        this.vector = 'down';
    }else if(this.vector === 'down' || this.vector === 'up'){
        if(e.layerX < 250){
            this.vector = 'left';
        }else if(e.layerX > 250){
            this.vector = 'right';
        }
    }else if(this.vector === 'left' || this.vector === 'right'){
        if(e.layerY < 250){
            this.vector = 'up';
        }else if(e.layerY > 250){
            this.vector = 'down';
        }
    }
    console.log('e->', e);
}

Snake.prototype.checkNextStep = function(y,x){
    if(x > this.sizeG-1 || x < 0 || y > this.sizeV-1 || y < 0 || this.gameZoneArr[y][x] === 1){
        alert('end((');
        clearInterval(this.timer);
    }
    else if(this.gameZoneArr[y][x] === 2){
            this.gameZoneArr[y][x] = 0;
            this.speed+=1;
            this.score+=1;
            clearInterval(this.timer);
            this.addSnakeLenght()
            this.start();
            this.addPoint();
        }
}

Snake.prototype.addSnakeLenght = function (argument) {
    this.snakePosition.push({
        x:this.gameZoneArr.length,
        y:this.gameZoneArr.length
    })
}

Snake.prototype.start = function(){
    var _this = this;
    this.timer = setInterval(function(){
        _this.moveSnake();
        _this.render();
    }, this.getSpeed());
}

Snake.prototype.getSpeed = function () {
    return 1000/this.speed;
}