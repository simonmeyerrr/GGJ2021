const MAX_GAMES = parseInt(process.env.MAX_GAMES) || 10;

const uuid = require('uuid');
const { Game } = require('./game');

const games = {};

const gameWsHandler = (ws, req) => {
    const gameId = req.params.id;
    ws.uuid = uuid.v4();
    ws.username = null;
    console.log("[+] Connection", {gameId, uuid: ws.uuid});

    ws.sendMessage = (type, data) => {
        ws.send(JSON.stringify({type, data}));
    };

    ws.sendError = (message, fatal = false) => {
        ws.sendMessage("error", {message});
        if (fatal) ws.close();
    };

    ws.on('message', (msg) => {
        console.log("[*] Message", {gameId, uuid: ws.uuid, msg});
        msg = JSON.parse(msg);

        if (msg.type === "join" && !ws.username) {
            ws.username = msg.data.username;
            if (games.hasOwnProperty(gameId))
                games[gameId].addPlayer(ws);
            else
                ws.sendError("game does not exists", true);
        } else if (ws.username) {
            games[gameId].messageReceived(ws, msg);
        } else {
            ws.sendError("you have to join the game", true);
        }
    });

    ws.on('error', (err) => {
        console.log("[!] Error", {gameId, uuid: ws.uuid, err});
        ws.close();
    });

    ws.on('close', () => {
        console.log("[-] Connection", {gameId, uuid: ws.uuid});
        if (ws.username && games.hasOwnProperty(gameId)) games[gameId].removePlayer(ws);
    });
};

const createGameHandler = (req, res) => {
    const gameId = uuid.v4();
    if (Object.keys(games).length > MAX_GAMES) {
        return res.status(500).json({
            error: "too many games",
        });
    } else {
        games[gameId] = new Game(gameId);
        return res.json({
            id: gameId,
        })
    }
};

module.exports = {
    gameWsHandler,
    createGameHandler
};
