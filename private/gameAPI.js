const express = require('express');
const { request, response } = require('express');

let player1ready = false;
let player2ready = false;
let masterState = null;

module.exports = function api(game){
    game.use(express.json({limit: '2mb'}));

    game.post('/playerReady', async (request, response) => {
        const data = request.body;
        if (data.player == 1){
            player1ready = true;
            console.log("PLAYER 1 READY");
        }
        else if (data.player == 2){
            player2ready = true;
            console.log("PLAYER 2 READY");
        }
        let status = "RECCEIVED - READY"
        const dataToSend = {"status" : status, "player" : data.player, "player1ready" : player1ready, "player2ready" : player2ready};
        response.send(dataToSend);
        player1ready = true;
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

        await sleep(100);
        response.send(masterState);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }