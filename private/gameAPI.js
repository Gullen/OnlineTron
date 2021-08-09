const express = require('express');
const { request, response } = require('express');

let player1ready = false;
let player2ready = false;

module.exports = function api(game){
    game.use(express.json({limit: '2mb'}));

    // TEST API
    game.post('/testAPI', async (request, response) => {
        console.log("Test call reccieved");
        const data = request.body;
        console.log(data.salt)
        let melon = 32;
        const testData = {"melon" : melon};
        response.send(testData);
    });

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
        const reccievedState = request.body;
    });
}
