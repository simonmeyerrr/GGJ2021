const MAX_GAMES = parseInt(process.env.MAX_GAMES) || 10;

const uuid = require('uuid');
const { Game } = require('./game');

const games = {};

const gameWsHandler = (ws, req) => {
    const gameId = req.params.id;
    ws.uuid = uuid.v4();
    ws.username = null;

    ws.sendMessage = (type, data) => {
        ws.send(JSON.stringify({type, data}));
    };

    ws.sendError = (message, fatal = false) => {
        ws.sendMessage("error", {message});
        if (fatal) ws.close();
    };

    ws.on('message', (msg) => {
        msg = JSON.parse(msg);

        if (msg.type === "join" && !ws.username) {
            ws.username = msg.data.username;
            if (games.hasOwnProperty(gameId))
                games[gameId].addPlayer(ws);
            else
                ws.sendError("La partie n'existe pas/plus", true);
        } else if (ws.username) {
            games[gameId].messageReceived(ws, msg);
        } else {
            ws.sendError("Vous devez rejoindre la partie", true);
        }
    });

    ws.on('error', (err) => {
        ws.close();
    });

    ws.on('close', () => {
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

const createGameInfoHandler = (req, res) => {
    const gameId = req.params.id;
    if (games.hasOwnProperty(gameId)) {
        return res.json({
            id: gameId,
            started: games[gameId].started,
            players: games[gameId].players.length,
        })
    } else {
        return res.status(404).send();
    }
};

setInterval(() => {
    const now = Date.now();
    const closeGame = (uuid) => {
        games[uuid].close();
        delete games[uuid];
    };
    for (const uuid in games) {
        if (!games[uuid].started) {
            if (games[uuid].players.length === 0 && games[uuid].created < now - 1000 * 30) {
                closeGame(uuid);
            } else if (games[uuid].created < now - 1000 * 300) {
                closeGame(uuid);
            }
        } else if (games[uuid].started) {
            const connected = games[uuid].players.reduce((prev, player) => {
                return prev + (!!player.ws ? 1 : 0);
            }, 0);
            if (connected <= 1) closeGame(uuid);
        }
    }
}, 5000);

module.exports = {
    gameWsHandler,
    createGameHandler,
    createGameInfoHandler
};
