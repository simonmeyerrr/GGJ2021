const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8080;

const express = require('express');
const expressWs = require('express-ws');

const game = require('./src/game');

const app = express();
expressWs(app);

app.post('/api/game', game.createGameHandler);
app.ws('/api/game/:id', game.gameWsHandler);

app.get('/', (req, res) => res.sendFile(__dirname + '/public/menu.html'));
app.get('/:id', (req, res) => res.sendFile(__dirname + '/public/game.html'));
app.use('/public', express.static('public'));

// Start server
app.listen(port, host, () => {
    console.log(`Server started on ${host} ${port}`);
});
