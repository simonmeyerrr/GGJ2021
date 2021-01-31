const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8080;

const express = require('express');
const expressWs = require('express-ws');

const handler = require('./src/handler');

const app = express();
expressWs(app);

app.post('/api/game', handler.createGameHandler);
app.get('/api/game/:id', handler.createGameInfoHandler);

app.ws('/api/ws/:id', handler.gameWsHandler);

app.get('/', (req, res) => res.sendFile(__dirname + '/public/menu.html'));
app.get('/favicon.ico', (req, res) => res.sendFile(__dirname + '/public/favicon.ico'));
app.get('/:id', (req, res) => res.sendFile(__dirname + '/public/game.html'));
app.use('/public', express.static('public'));

// Start server
app.listen(port, host, () => {
    console.log(`Server started on ${host} ${port}`);
});
