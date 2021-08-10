const express = require('express');
const game = express();

require('./private/gameAPI')(game);

game.listen(80, () => console.log('listening on 80'));
game.use(express.static('public'));
game.use(express.json({lmit: '2mb'}));