const express = require('express');
const { request, response } = require('express');

module.exports = function api(game){
    game.use(express.json({limit: '2mb'}));

    // TEST API
    game.post('/testAPI', async (request, response) => {
        console.log("Test call reccieved");
        response.send("HELLO WORLD");
    });
}
