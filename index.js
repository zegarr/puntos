let errores = {
    cantMaxNombre: "Nombre entre 3 y 15 caracteres",
    debeSerNumero: "Tenés que ingresar un numero.",
};

const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true
});

$(document).ready(function () {
    //si no hay registro de jugadores en localStorage, lo creo vacio
    if (localStorage.getItem("jugadores") === null) {
        localStorage.setItem("jugadores", JSON.stringify([]));
    }
    //si no hay registro de rondas en localStorage, lo creo vacio
    if (localStorage.getItem("rondas") === null) {
        localStorage.setItem("rondas", JSON.stringify([]));
    }
    //si no hay puntaje maximo en localStorage, lo creo en 500
    if (localStorage.getItem("puntajeMaximo") === null) {
        localStorage.setItem("puntajeMaximo", 500);
    }
    //mostrar puntaje maximo en el input
    $("#puntajeMaximo").val(localStorage.getItem("puntajeMaximo"));
    //cuando se cambie el puntaje maximo, guardarlo en localStorage
    $("#puntajeMaximo").on("change", function () {
        localStorage.setItem("puntajeMaximo", parseInt($(this).val()));
        actualizarLista();
    });
    //actualizar la lista de jugadores
    actualizarLista();
    $("#btnAgregarJugador").on("click", nuevoJugador);
    $("#btnBorrarTodo").on("click", borrarTodo);
    $("#btnCargarHistorial").on("click", cargarHistorial);
    $("#btnCargarNuevaRonda").on("click", cargarNuevaRonda);
    $("#btnGuardarRonda").on("click", guardarRonda);
    $("#btnDivAgregarCollapse").on("click", function () {
        $("#txtNom").focus();
    });
    $("#txtNom").on("keypress", function (e) {
        if (e.which == 13) {
            nuevoJugador();
        }
    })
});

function nuevoJugador() {
    let nom = $("#txtNom").val().trim();
    if ((nom.length >= 3 && nom.length <= 15)) {
        //agregar jugador a localStorage
        let jugadores = localStorage.getItem("jugadores");
        jugadores = JSON.parse(jugadores);
        jugadores.push({
            "nombre": nom,
            "puntos": 0
        });
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        Toast.fire({
            icon: 'success',
            title: "Jugador agregado"
        });
        actualizarLista();
    } else {
        Toast.fire({
            icon: 'error',
            title: errores.cantMaxNombre
        });
    }
    $("#txtNom").val("");
    $("#txtNom").focus();
}

function eliminarJugador() {
    let idJugador = $(this).attr('idJugador');
    let jugadores = localStorage.getItem("jugadores");
    jugadores = JSON.parse(jugadores);
    jugadores.splice(idJugador, 1);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    Toast.fire({
        icon: 'success',
        title: "Jugador eliminado"
    });
    actualizarLista();
}

function actualizarLista() {
    $("#jugadores").html("");
    //obtener jugadores de localStorage
    let jugadores = localStorage.getItem("jugadores");
    jugadores = JSON.parse(jugadores);

    jugadores.sort((a, b) => {
        return b.puntos - a.puntos;
    });
    jugadores.forEach(function (jugador, idJugador) {
        let datosBtn = {
            "idJugador": idJugador,
            "claseEvento": "eliminarJugador",
            "icono": "fa-trash"
        }
        let html = generarLinea(jugador.nombre, jugador.puntos, datosBtn);
        $("#jugadores").append(html);
    });
    $(".eliminarJugador").on("click", eliminarJugador);
}

function generarLinea(nombre, puntaje, datosBtn) {
    let ret = '<tr><td><span class="text-sm"><b>' + nombre + '</b></span></td>';
    var llegoMaximo = '';
    ret += '<td class="align-middle text-center"><span class="badge badge-light badge-sm text-lg">' + puntaje + '</span></td>';
    if (puntaje >= parseInt(localStorage.getItem("puntajeMaximo"))) {
        var llegoMaximo = '<span class="badge badge-warning badge-sm text-xs me-3">Límite</span>';
    }
    ret += '<td class="text-sm text-end font-weight-semibold text-dark">' + llegoMaximo + '<button class="btn btn-white btn-icon m-0 px-3 ' + datosBtn.claseEvento + '" idJugador="' + datosBtn.idJugador + '"><i class="fa ' + datosBtn.icono + '"></i></button></td></tr>';
    return ret;
}

function borrarTodo() {
    //borrar jugadores
    localStorage.setItem("jugadores", JSON.stringify([]));
    //borrar rondas
    localStorage.setItem("rondas", JSON.stringify([]));
    Toast.fire({
        icon: 'info',
        title: "Todos los datos fueron eliminados."
    });
    actualizarLista();
}

function cargarNuevaRonda() {
    //obtener los jugadores de localStorage, mostrarlos en el modal para que el usuario ponga los puntajes de cada uno para esa ronda
    let jugadores = localStorage.getItem("jugadores");
    jugadores = JSON.parse(jugadores);
    $("#contenidoNuevaRonda").html("");
    jugadores.forEach(function (jugador, idJugador) {
        let html = generarLineaRonda(jugador.nombre, idJugador);
        $("#contenidoNuevaRonda").append(html);
    });
}

function generarLineaRonda(nombre, idJugador) {
    let ret = '<div class="mb-3 d-flex justify-content-between align-items-center">';
    ret += '<span class="text-sm"><b>' + nombre + '</b></span>';
    ret += '<input class="form-control w-25 inputJugadorRonda" idJugador="' + idJugador + '" type="number">';
    ret += '</div>';
    return ret;
}

function guardarRonda() {
    //obtener el puntaje maximo de localStorage
    let puntajeMaximo = parseInt(localStorage.getItem("puntajeMaximo"));
    //recorrer los inputJugadorRonda
    let inputs = $(".inputJugadorRonda");
    //chequear que no haya 2 input vacios, solo debe haber 1 en otra funcion
    let ronda = [];
    if (chequearInputsVacios(inputs)) {
        inputs.each(function () {
            let idJugador = $(this).attr("idJugador");
            //valuePuntos pasar a int, si viene vacio poner 
            let valuePuntos = $(this).val().trim() === "" ? 0 : $(this).val();

            //sumar el puntaje de la ronda al jugador
            let jugadores = localStorage.getItem("jugadores");
            jugadores = JSON.parse(jugadores);
            jugadores[idJugador].puntos += parseInt(valuePuntos);
            localStorage.setItem("jugadores", JSON.stringify(jugadores));

            let llegoPuntajeMaximo = jugadores[idJugador].puntos >= puntajeMaximo;
            //crear una ronda con el idJugador y el puntaje que ingreso el usuario
            let registro_ronda = {
                "idJugador": idJugador,
                "nombreJugador": obtenerJugador(idJugador).nombre, //nombre del jugador
                "puntaje": valuePuntos,
                "alcanzoPuntajeMaximo": llegoPuntajeMaximo,
            };
            ronda.push(registro_ronda);
        });
        if (ronda.length > 0) {
            //obtener las rondas de localStorage
            let rondasLS = localStorage.getItem("rondas");
            rondasLS = JSON.parse(rondasLS);
            //agregar la ronda a las rondas de localStorage
            rondasLS.push(ronda);
            localStorage.setItem("rondas", JSON.stringify(rondasLS));
            Toast.fire({
                icon: 'success',
                title: "Ronda guardada"
            });
        } else {
            Toast.fire({
                icon: 'error',
                title: "No se puede guardar una ronda vacia."
            });
        }
        //actualizar la lista de jugadores
        actualizarLista();
        //cerrar el modal
        $("#modalNuevaRonda").modal("hide");
    } else {
        Toast.fire({
            icon: 'error',
            title: "Solo puede cortar un jugador por ronda."
        });
    }
}

function chequearInputsVacios(inputs) {
    let inputsVacios = inputs.filter(function () {
        return $(this).val() === "" || $(this).val() === "0" || $(this).val() === 0 || $(this).val() === null || $(this).val() === undefined;
    }).length;
    return inputsVacios <= 1;
}

function cargarHistorial() {
    //obtener las rondas de localStorage
    let rondasLS = localStorage.getItem("rondas");
    rondasLS = JSON.parse(rondasLS);
    //ordenar las rondas de la ultima a la primera
    rondasLS.reverse();
    $("#contenidoHistorial").html("");
    let idRonda = rondasLS.length;
    rondasLS.forEach(function (ronda) {
        let html = `
        <div class="col-12">
                  <ul class="list-group">
                    <li class="list-group-item border-warning mb-3 border-radius-md shadow-xs p-3 py-2">
                      <h6 class="mb-1 mt-0 text-sm text-warning">Ronda ${idRonda}</h6>
                      <div class="row">${generarItemsRonda(ronda)}</div>
                    </li>
                  </ul>
                </div>`;
        idRonda--;
        $("#contenidoHistorial").append(html);
    });
}

function generarItemsRonda(ronda) {
    let itemsRonda = "";
    ronda.forEach(function (item) {
        let puntaje = item.puntaje == 0 ||  item.puntaje == "" ? '<span class="badge badge-warning badge-sm text-xs py-1">Cortó</span>' : item.puntaje;
        let nombreJugador = obtenerJugador(item.idJugador) != undefined ? obtenerJugador(item.idJugador).nombre : item.nombreJugador;
        itemsRonda += `
    <div class="col-6 mb-2">
        <ul class="list-group">
        <li
            class="list-group-item border-info mb-0 border-radius-md shadow-xs p-2">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0 text-sm text-info">${nombreJugador}</h6>
                <span class="text-sm text-info">${puntaje}</span>
            </div>
        </li>
        </ul>
    </div>`;
    });
    return itemsRonda;
}

function obtenerJugador(idJugador) {
    let jugadores = localStorage.getItem("jugadores");
    jugadores = JSON.parse(jugadores);
    return jugadores[idJugador];
}