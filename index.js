const express = require('express');
const game = express();

require('./private/gameAPI')(game);

game.listen(3000, () => console.log('listening on 3000'));
game.use(express.static('public'));
game.use(express.json({lmit: '2mb'}));
