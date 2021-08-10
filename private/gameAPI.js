const express = require('express');
const { request, response } = require('express');

let player1ready = false;
let player2ready = false;
let player1name;
let player2name;
let masterState = null;

module.exports = function api(game){
    game.use(express.json({limit: '2mb'}));

    game.post('/playerReady', async (request, response) => {
        const data = request.body;
        if (data.player == 1){
            player1ready = true;
            player1name = data.name;
            console.log("PLAYER 1 READY");
        }
        else if (data.player == 2){
            player2ready = true;
            player2name = data.name;
            console.log("PLAYER 2 READY");
        }
        let status = "RECCEIVED - READY"
        const dataToSend = {"status" : status, "player" : data.player, "player1ready" : player1ready, "player2ready" : player2ready};
        response.send(dataToSend);
    });

    game.post('/updateState', async (request, response) => {
        const recceivedState = request.body;
        
        //IF START
        if (masterState == null){
            masterState = recceivedState;
        }
        else{
            if (recceivedState.go == false && player1ready && player2ready){
                masterState.go = true;
            }
        }

        if (recceivedState.player1.snake.length > masterState.player1.snake.length){
            masterState.player1.snake = recceivedState.player1.snake;
            masterState.player1.pos = recceivedState.player1.pos;
        }

        if (recceivedState.player2.snake.length > masterState.player2.snake.length){
            masterState.player2.snake = recceivedState.player2.snake;
            masterState.player2.pos = recceivedState.player2.pos;
        }

        if (player1name !== masterState.player1.name){
            masterState.player1.name = player1name;
        }

        if (player2name !== masterState.player2.name){
            masterState.player2.name = player2name;
        }

        if (recceivedState.player1.vel !== masterState.player1.vel){
            masterState.player1.vel = recceivedState.player1.vel;
        }
        if (recceivedState.player2.vel !== masterState.player2.vel){
            masterState.player2.vel = recceivedState.player2.vel;
        }

        checkBorder();
        checkCollision();

        await sleep(50);
        response.send(masterState);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function checkBorder(){
    if (masterState.player1.pos.x > masterState.gridsize || masterState.player1.pos.y > masterState.gridsize || masterState.player1.pos.x < 0 || masterState.player1.pos.y < 0){
        masterState.stop = true;
        masterState.winner = player2name;
    }
    if (masterState.player2.pos.x > masterState.gridsize || masterState.player2.pos.y > masterState.gridsize || masterState.player2.pos.x < 0 || masterState.player2.pos.y < 0){
        masterState.stop = true;
        masterState.winner = player1name;
    }
}

function checkCollision(){

}