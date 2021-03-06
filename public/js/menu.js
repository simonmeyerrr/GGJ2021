const createGame = async () => {
    const res = await fetch("/api/game", {method: "POST"});
    if (!res.ok) throw '[Api] Invalid response status: ' + res.status.toString();
    const body = await res.json();
    return body.id;
};

const gameExists = async (gameId) => {
    const res = await fetch("/api/game/" + gameId, {method: "GET"});
    return res.ok && res.status === 200;
};

const redirectToGame = (gameId) => {
    window.location.pathname = "/" + gameId;
};

const setDisabledAll = (disabled) => {
    $('#btn-create').prop('disabled', disabled);
    $('#btn-join').prop('disabled', disabled);
    $('#input-game-id').prop('disabled', disabled);
};

$('#btn-create').on('click', function() {
    const $this = $(this);
    $this.button('loading');
    setDisabledAll(true);
    window.dispatchEvent(new Event('soundButton'));
    createGame()
        .then(redirectToGame)
        .catch((err) => {
            $this.button('reset');
            setDisabledAll(false);
        });
});

$('#btn-join').on('click', function() {
    const $this = $(this);
    $this.button('loading');
    setDisabledAll(true);
    const gameId = $('#input-game-id').val();
    gameExists(gameId)
        .then((exists) => {
            if (exists)
                redirectToGame(gameId);
            else
                throw "This game does not exists";
        })
        .catch((err) => {
            $this.button('reset');
            setDisabledAll(false);
        });
});

$('#input-game-id').on('input', function() {
    const $this = $(this);
    if ($this.val() === "" && !$('#btn-join').prop("disabled")) {
        $('#btn-join').prop("disabled", true);
    } else if ($this.val() !== "" && $('#btn-join').prop("disabled")) {
        $('#btn-join').prop("disabled", false);
    }
});

if ($('#input-game-id').val() === "") {
    $('#btn-join').prop("disabled", true);
}
