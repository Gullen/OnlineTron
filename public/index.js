let name;
let player;
let entered = false;
let playerselected = false;
let namesUpdated = false;
let playertext = "";

let player1vx = 0;
let player1vy = 1;
let player2vx = 0;
let player2vy = -1;

const BG_COLOUR = '#231f20';
const PLAYER1_COLOUR = '#ff3030';
const PLAYER2_COLOUR = '#0099ed';

const gameScreen = document.getElementById('gameScreen');
const p1infoText = document.getElementById('p1info');
const p2infoText = document.getElementById('p2info');

let canvas, ctx;

let gameState = {
    player1 : {
        pos : {
            x : 40,
            y : 2,
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
        name : ""
    },
    player2 : {
        pos : {
            x : 40,
            y : 78,
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
        name : ""
    },
    gridsize: 80,
    go: false,
    stop: false,
    winner: "",
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
        p1infoText.innerHTML = playertext;
    }

    // 2
    if (e.keyCode == 50 && playerselected == false){
        player = 2;
        playerselected = true;
        console.log("Player 2 selected");
        playertext = "PLAYER 2: ";
        p2infoText.innerHTML = playertext;
    }

    // ENTER
    if (e.keyCode == 13 && entered == false && playerselected){
        name = prompt("NAME");
        playertext = playertext + " " + name;
        if (player == 1){p1infoText.innerHTML = playertext; gameState.player1.name = name;}
        if (player == 2){p2infoText.innerHTML = playertext; gameState.player2.name = name;}
        entered = true;
        console.log("name Entered: " + name);
        readyup();
    }

    // UP
    if (e.keyCode == 38 && gameState.go){
        if (player == 1){
            player1vx = 0;
            player1vy = -1;
        }

        if (player == 2){
            player2vx = 0;
            player2vy = -1;
        }
    }

    // DOWN
    if (e.keyCode == 40 && gameState.go){
        if (player == 1){
            player1vx = 0;
            player1vy = 1;
        }

        if (player == 2){
            player2vx = 0;
            player2vy = 1;
        }
    }

    // LEFT
    if (e.keyCode == 37 && gameState.go){
        if (player == 1){
            player1vx = -1;
            player1vy = 0;
        }

        if (player == 2){
            player2vx = -1;
            player2vy = 0;
        }
    }

    // RIGHT
    if (e.keyCode == 39 && gameState.go){
        if (player == 1){
            player1vx = 1;
            player1vy = 0;
        }

        if (player == 2){
            player2vx = 1;
            player2vy = 0;
        }
    }

    // R
    if (e.keyCode == 82 && gameState.stop){
        //reset();
    }
}

async function readyup(){
    const data = {"player" : player, "name" : name}
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
            if (gameState.player1.name !== "" || gameState.player2.name !== ""){
                if (namesUpdated == false){
                    p1infoText.innerHTML = "PLAYER 1: " + gameState.player1.name;
                    p2infoText.innerHTML = "PLAYER 2: " + gameState.player2.name;
                    namesUpdated = true;
                    console.log("UPDATED NAMES");
                }
            }
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
    if (gameState.winner == gameState.player1.name){
        p1infoText.style.color="lightgreen";
        alert(gameState.player1.name + " WINS!");
    } else {
        p2infoText.style.color="lightgreen";
        alert(gameState.player2.name + " WINS!");
    }
}

function movePlayer(){
    if (player == 1){
        gameState.player1.vel.x = player1vx;
        gameState.player1.vel.y = player1vy;
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
        gameState.player2.vel.x = player2vx;
        gameState.player2.vel.y = player2vy;
        v = gameState.player2.vel;
        pos = gameState.player2.pos;
        if (v.x == 1){
            gameState.player2.pos.x = gameState.player2.pos.x + 1;
        }
        else if (v.x == -1){
            gameState.player2.pos.x = gameState.player2.pos.x - 1;
        }
        else if (v.y == 1){
            gameState.player2.pos.y = gameState.player2.pos.y + 1;
        }
        else if (v.y == -1){
            gameState.player2.pos.y = gameState.player2.pos.y - 1;
        }
        gameState.player2.snake.push(pos);
    }
}

async function reset(){
    gameState = {
        player1 : {
            pos : {
                x : 40,
                y : 2,
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
            name : ""
        },
        player2 : {
            pos : {
                x : 40,
                y : 78,
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
            name : ""
        },
        gridsize: 80,
        go: false,
        stop: false,
        winner: "",
    }

    name = null;
    player = null;
    entered = false;
    playerselected = false;
    namesUpdated = false;
    playertext = "";

    player1vx = 0;
    player1vy = 1;
    player2vx = 0;
    player2vy = -1;

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
    };

    const response = await fetch('/reset', options);
    const returnData = await response.json();
    gameState = returnData;
    p2infoText.style.color="black";
    p2infoText.style.color="black";
    init();
}

init();