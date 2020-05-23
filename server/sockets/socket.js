const {
    io
} = require('../server');
const {
    Usuarios
} = require('../classes/usuarios');
const {crearMensaje} = require('../utils/utils');

const usuarios = new Usuarios();

// Cuando se conecta un cliente al servidor
io.on('connection', (client) => {

    // Se notifica la conexion
    console.log('Un usuario se conecto')

    // Se escucha si se emite el evento entrarChat por parte del servidor
    // Si es asi debe recibirse el nombre del usuario asi como una funcion de callback
    client.on('entrarChat', (data, callback) => {

        // Si no se envia el nombre o la sala
        if (!data.nombre|| !data.sala) {
            // Se retorna un objeto de error al cliente
            return callback({
                error: true,
                mensaje: 'El nombre y la sala es necesario'
            });
        }
        // Conectar a un cliente a una sala especifica 
        client.join(data.sala);

        // Sino se agrega la persona que entro al chat al arreglo de usuarios
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // Emitir todas las personas presentes en el chat a todos los clientes que se encuentren en la misma sala
        // Cuando un cliente se ingresa al chat
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        // Y se retornan las personas al cliente
        callback(usuarios.getPersonasPorSala(data.sala))
    });


    // Cuando un usuario envia un mensaje
    client.on('crearMensaje', (data)=>{
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })

    client.on('disconnect', () => {
        console.log('Cliente desconectado')
        let usuarioBorrado = usuarios.borrarPersona(client.id);

        client.broadcast.to(usuarioBorrado.sala).emit('crearMensaje', crearMensaje('Administrador',`${usuarioBorrado.nombre} se desconecto :(`));

        client.broadcast.to(usuarioBorrado.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuarioBorrado.sala));
    })


    // Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje ));
    

    })
});