const TicketControl = require('../models/ticket-control');


const ticketControl = new TicketControl();


const socketController = (socket) => {
    

    // socket.on('disconnect', () => {
    //     console.log('Cliente desconectado', socket.id );
    // });

    //Todos estos eventos se disparan cuando un nuevo cliente se conecta
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit( 'estado-actual', ticketControl.ultimos4 );
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length );

    // estos son observables van a estar pendientes de lo que este sucediendo en esta parte del servidor
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
       const siguiente = ticketControl.siguiente();
       callback( siguiente );
       socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length );

    });

    socket.on( 'atender-ticket', ( { escritorio }, callback ) => {
        if( !escritorio ){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        // agregure las validaciones de ticket aqui para que no haga el sonido cuando no hay tickets
        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
           console.log('entro');
           return;
        }
        else{
            callback({
                ok: true,
                ticket
            })
        }

        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length );
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length );
        console.log(ticket)
       
    });

}



module.exports = {
    socketController
}

