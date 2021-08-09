let name;
let player;
let entered = false;
let playerselected = false;
let playertext = "";

const BG_COLOUR = '#231f20';
const PLAYER1_COLOUR = '#ff3030';
const PLAYER2_COLOUR = '#0099ed';

const gameScreen = document.getElementById('gameScreen');
const infoText = document.getElementById('info');

let canvas, ctx;

let gameState = {
    player1 : {
        pos : {
            x : 40,
            y : 3,
        },
        vel : {
            x : 0,
            y : 1,
        },
        snake : [
            {x: 40, y: 0},
            {x: 40, y: 1},
            {x: 40, y: 2},
        ],
    },
    player2 : {
        pos : {
            x : 40,
            y : 77,
        },
        vel : {
            x : 0,
            y : -1,
        },
        snake : [
            {x: 40, y: 80},
            {x: 40, y: 79},
            {x: 40, y: 78},            
        ],
    },
    gridsize: 80,
    go: false,
    stop: false,
}

function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 880;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
}

function paintGame(state){
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;

    paintPlayer(state.player1, size, PLAYER1_COLOUR);
    paintPlayer(state.player2, size, PLAYER2_COLOUR);
}

function paintPlayer(playerState, size, colour){
    const snake = playerState.snake;
    const pos = playerState.pos;
    ctx.fillStyle = colour;
    ctx.fillRect(pos.x * size, pos.y * size, size, size);
    for (let cell of snake){
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
}

function keydown(e){
    console.log(e.keyCode);

    // 1
    if (e.keyCode == 49 && playerselected == false){
        player = 1;
        playerselected = true;
        console.log("Player 1 selected");
        playertext = "PLAYER 1: ";
        infoText.innerHTML = playertext;
    }

    // 2
    if (e.keyCode == 50 && playerselected == false){
        player = 2;
        playerselected = true;
        console.log("Player 2 selected");
        playertext = "PLAYER 2: ";
        infoText.innerHTML = playertext;
    }

    // ENTER
    if (e.keyCode == 13 && entered == false && playerselected){
        name = prompt("NAME");
        playertext = playertext + " " + name;
        infoText.innerHTML = playertext;
        entered = true;
        console.log("name Entered: " + name);
        readyup();
    }
}

async function readyup(){
    const data = {"player" : player}
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };

    const response = await fetch('/playerReady', options);
    const returnData = await response.json();
    console.log(returnData);

    play();
}

async function play(){
    let goStatus = gameState.go;
    let stopStatus = gameState.stop;

    while (stopStatus == false){
        // PRINT CURRENT FRAME
        paintGame(gameState);

        // UPDATE CURRENT FRAME
        if (goStatus){
            movePlayer();
            console.log(gameState);
        }

        // SEND & SAVE CURRENT FRAME (SYNC)
        const data = gameState;
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };

        const response = await fetch('/updateState', options);
        const returnData = await response.json();
        gameState = returnData;

        // UPDATE LOCAL VARS
        goStatus = gameState.go;
        stopStatus = gameState.stop;
    }
}

function movePlayer(){
    if (player == 1){
        v = gameState.player1.vel;
        pos = gameState.player1.pos;
        if (v.x == 1){
            gameState.player1.pos.x = gameState.player1.pos.x + 1;
        }
        else if (v.x == -1){
            gameState.player1.pos.x = gameState.player1.pos.x - 1;
        }
        else if (v.y == 1){
            gameState.player1.pos.y = gameState.player1.pos.y + 1;
        }
        else if (v.y == -1){
            gameState.player1.pos.y = gameState.player1.pos.y - 1;
        }


        gameState.player1.snake.push(pos);
    }
    if (player == 2){

    }
}

init();