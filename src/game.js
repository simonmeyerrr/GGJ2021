const uuid = require('uuid');

const games = {};

const gameWsHandler = (ws, req) => {
    ws.on('message', (msg) => {
        console.log("message", msg);
    });

    ws.on('error', (e) => {
        console.log("error", e);
    });

    ws.on('close', (msg) => {
        console.log("close");
    });
};

const createGameHandler = (req, res) => {
    const gameId = uuid.v4();
    if (games.hasOwnProperty(gameId)) {
        throw "Game already exists";
    } else {
        games[gameId] = {};
    }
    return res.json({
        id: gameId,
    })
};

module.exports = {
    gameWsHandler,
    createGameHandler
};
