var socket = io();
// Se revisan los parametros que llegan de la URL
var params = new URLSearchParams(window.location.search);

// Si no llega un parametro nombre
if(!params.has('nombre') || !params.has('sala')){
    // Regresar al index
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

// Escuchar cuando me conecto
socket.on('connect', function() {
    // Informar que me conecte
    console.log('Conectado al servidor');

    // Emitir el evento 'entrarChat'
    socket.emit('entrarChat',
    // Enviar el nombre del usuario
    usuario , 
    // Recibir la respuesta del usuario y mostrarla
    function(resp){
        console.log('Usuarios conectados', resp);
    });
});

// Escuchar si me desconecto
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar mensaje de abandono de chat
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// Escuchar entradas o salidas de usuarios
socket.on('listaPersona', function(personas) {
    console.log(personas);
});

// Mensaje privado
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado: ', mensaje)
})