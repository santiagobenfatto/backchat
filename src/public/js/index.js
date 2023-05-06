const socket = io()
let user
const chatbox = document.getElementById('chatBox')

Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: ' Ingresa el usuario para identificarte',
    inputValidator: (value) =>{ 
        return !value && "Necesitas escribir un nombre de usuario para comenzar a chatear"
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(result => {
    user = result.value
    socket.emit('authenticated', user)
})


chatbox.addEventListener('keyup', e => {
    if(e.key === 'Enter'){ //El mensaje se enviara cuando el usuario apriete 'Enter
        if(chatbox.value.trim().length>0){ //Validamos que el mensaje no este vacío o solo contenga espacios
            socket.emit('message', {user: user, message:chatbox.value})//emitimos nuestro primer evento
            chatbox.value=''
        }
    }
})

/* 
    ==========  ==========
  Socket Listener Client Side
    ==========  ==========
*/
//Escuchamos el evento 'messageLogs'
socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ""
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message} </br>`
        log.innerHTML = messages
    });
})

socket.on('newUserConnected', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: 'success'

    })
})

// Swal.fire({
//     title:"hi coder",
//     text:"Alerta básica tipo modal SweetAlert2",
//     icon:"success"
// })