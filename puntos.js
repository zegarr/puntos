$(document).ready(function () {
    let players = [];

    function loadPlayersFromLocalStorage() {
        const storedPlayers = JSON.parse(localStorage.getItem('players'));
        if (storedPlayers) {
            players = storedPlayers;
            updatePlayerList();
        }
    }

    function savePlayersToLocalStorage() {
        localStorage.setItem('players', JSON.stringify(players));
    }

    loadPlayersFromLocalStorage();

    $('#addPlayer').click(function () {
        const playerName = prompt('Nombre del nuevo jugador:');
        if (playerName) {
            const newPlayer = {
                name: playerName,
                score: 0,
                history: []
            };
            players.push(newPlayer);
            savePlayersToLocalStorage();
            updatePlayerList();
        }
    });

    $(document).on('click', '.addScore', function () {
        const playerName = $(this).data('player');
        const score = parseInt(prompt(`Ingresar puntaje para: ${playerName}:`));
        if (!isNaN(score)) {
            updatePlayerScore(playerName, score);
            checkWin();
        }
    });

    $(document).on('click', '.showHistory', function () {
        const playerName = $(this).data('player');
        const player = players.find(p => p.name === playerName);
        if (player) {
            const historyModal = $('#modalHistorial');
            const modalBody = historyModal.find('.modal-body');
            modalBody.empty();
            //mostar historial en una tabla, en le primer td mostrar un numero incremental desde 1, en el otro mostrar un texto que diga cuanto sumo o resto, si no hay historial mostrar un mensaje que diga que no hay historial
            if (player.history.length > 0) {
                //armar la tabla para poner los tr  y td
                modalBody.append(`<table class="table table-striped table-hover"><thead><tr><th scope="col">#</th><th scope="col">Historial</th></tr></thead><tbody></tbody></table>`)
                //recorrer el historial y agregar los tr y td
                player.history.forEach(function (history, index) {
                    modalBody.find('tbody').append(`<tr><th scope="row">${index + 1}</th><td>${history}</td></tr>`);
                });
            }
            else {
                modalBody.append(`<tr><td>No hay historial</td></tr>`);
            }

        }
    });

    function updatePlayerList() {
        $('#playerList').empty();
        players.forEach(function (player) {
            $('#playerList').append(`<li id="li_${player.name}" class="list-group-item d-flex align-items-center justify-content-between">
            <span>${player.name}: <b> ${player.score} </b></span>
            <div class='d-flex'>
                <button class="btn btn-success btn-sm d-flex align-items-center justify-content-between me-1 addScore" data-player="${player.name}">+P</button>
                <button class="btn btn-light btn-sm showHistory" data-bs-toggle="modal" data-bs-target="#modalHistorial" data-player="${player.name}"><i class='fa fa-list'></i></button>
                <button class="btn btn-light btn-sm text-danger deletePlayer" data-player="${player.name}"><i class="fa fa-trash"></i></button>
            </div>
            </li>`);
        });
    }

    function updatePlayerScore(playerName, score) {
        const player = players.find(p => p.name === playerName);
        if (player) {
            player.score += score;
            player.history.push(`Se agregaron ${score} puntos, total: ${player.score}`);
            savePlayersToLocalStorage();
            updatePlayerList();
        }
    }

    function checkWin() {
        players.forEach(function (player) {
            const pm = JSON.parse(localStorage.getItem('puntaje-maximo'));
            if (player.score >= pm) {
                const playerElement = $(`#li_${player.name}`);
                playerElement.addClass('text-danger');
                player.history.push('Perdió!');
                alert(`${player.name} llegó o pasó los ${pm} puntos.`);
                savePlayersToLocalStorage();
            }
        });
    }

    $('#resetPlayers').click(function () {
        if (confirm('Estás seguro de borrar todos los registros?')) {
            players = [];
            savePlayersToLocalStorage();
            updatePlayerList();
        }
    });

    $(document).on('click', '.deletePlayer', function () {
        const playerName = $(this).data('player');
        if (confirm(`Estás seguro que queres eliminar a ${playerName}?`)) {
            players = players.filter(p => p.name !== playerName);
            savePlayersToLocalStorage();
            updatePlayerList();
        }
    });

    //cuando puntaje-maximo cambia, actualizar el valor en el localstorage y actualizar players
    $("#puntaje-maximo").change(function () {
        localStorage.setItem('puntaje-maximo', JSON.stringify($(this).val()));
        updatePlayerList();
    });
});
