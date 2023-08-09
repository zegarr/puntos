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
        const playerName = prompt('Enter player name:');
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
        const score = parseInt(prompt(`Enter score for ${playerName}:`));
        if (!isNaN(score)) {
            updatePlayerScore(playerName, score);
            checkWin();
        }
    });

    $(document).on('click', '.showHistory', function () {
        const playerName = $(this).data('player');
        const player = players.find(p => p.name === playerName);
        if (player) {
            const historyModal = $('.modalHistorial');
            const modalBody = historyModal.find('.modal-body');
            modalBody.empty();
            player.history.forEach(entry => {
                modalBody.append(`<p>${entry}</p>`);
            });
        }
    });

    function updatePlayerList() {
        $('#playerList').empty();
        players.forEach(function (player) {
            $('#playerList').append(`<li id="li_${player.name}" class="list-group-item d-flex align-items-center justify-content-between"><span>${player.name}: <b> ${player.score} </b></span><div class='d-flex'><button class="btn btn-success btn-sm d-flex align-items-center justify-content-between me-1 addScore" data-player="${player.name}">+P</button><button class="btn btn-light btn-sm showHistory" data-bs-toggle="modal" data-bs-target="#modalHistorial" data-player="${player.name}"><i class='fa fa-list'></button></div></li>`);
        });
    }

    function updatePlayerScore(playerName, score) {
        const player = players.find(p => p.name === playerName);
        if (player) {
            player.score += score;
            player.history.push(`Added ${score} points`);
            savePlayersToLocalStorage();
            updatePlayerList();
        }
    }

    function checkWin() {
        players.forEach(function (player) {
            let pm = $("#puntaje-maximo").val();

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
        if (confirm('Are you sure you want to reset all players?')) {
            players = [];
            savePlayersToLocalStorage();
            updatePlayerList();
        }
    });
});
