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
    timer: 1500,
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
});

function nuevoJugador() {
    let nom = $("#txtNom").val();
    if ((nom.length >= 3 && nom.length < 15)) {
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
    ret += '<td class="align-middle text-center"><span class="badge badge-sm text-lg">' + puntaje + '</span></td>';
    ret += '<td class="text-sm text-end font-weight-semibold text-dark"><button class="btn btn-white btn-icon m-0 px-3 ' + datosBtn.claseEvento + '" idJugador="' + datosBtn.idJugador + '"><i class="fa ' + datosBtn.icono + '"></i></button></td></tr>';
    return ret;
}

function borrarTodo() {
    //borrar jugadores
    localStorage.setItem("jugadores", JSON.stringify([]));
    //borrar rondas
    localStorage.setItem("rondas", JSON.stringify([]));
    Toast.fire({
        icon: 'info',
        title: "Todos los jugadores fueron eliminados."
    });
    actualizarLista();
}

function cargarHistorial() {
    //
}

function cargarNuevaRonda() {
    //obtener los jugadores de localStorage, mostrarlos en el modal para que el usuario ponga los puntajes de cada uno para esa ronda
    let jugadores = localStorage.getItem("jugadores");
    jugadores = JSON.parse(jugadores);
    jugadores.sort((a, b) => {
        return b.puntos - a.puntos;
    });
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
    var jugadores = localStorage.getItem("jugadores");
    var jugadoresSuperaronPuntajeMaximo = [];
    //recorrer los inputJugadorRonda
    $(".inputJugadorRonda").each(function () {
        let idJugador = $(this).attr("idJugador");
        let puntos = parseInt($(this).val());
        //si el valor del input es mayor al puntaje maximo, agregar el idJugador a un array
        if (puntos > puntajeMaximo) {
            jugadoresSuperaronPuntajeMaximo.push(idJugador);
        }
        //crear una ronda con el idJugador y el puntaje que ingreso el usuario
        let ronda = {
            "idJugador": idJugador,
            "puntaje": puntos,
            "alcanzoPuntajeMaximo": puntos >= puntajeMaximo ? true : false,
        };

        //guardar la ronda en localStorage
        let rondas = localStorage.getItem("rondas");
        rondas = JSON.parse(rondas);
        rondas.push(ronda);
        localStorage.setItem("rondas", JSON.stringify(rondas));
        //sumar el puntaje de la ronda al jugador
        jugadores = JSON.parse(jugadores);
        jugadores[ronda.idJugador].puntos += parseInt(ronda.puntaje);
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    });
    //actualizar la lista de jugadores
    actualizarLista();
}