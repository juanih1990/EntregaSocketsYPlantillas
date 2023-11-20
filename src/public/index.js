let socket
let user = sessionStorage.getItem('user') || ''
if(user){
    document.querySelector('#username').innerHTML = user + ': '
    initIo()
}
else{
    swal.fire({
        title: 'Autenticacion',
        input: 'text',
        text: 'Ingrese su nombre',
        inputValidator: value => {
            return !value.trim() && 'Por fabor ingrese su nombre'
        },
        allowOutsideClick: false
    }).then(result =>{
        user = result.value
        sessionStorage.setItem('user' , user)
        document.querySelector('#username').innerHTML = user + ': '
        initIo()
    })
}

 
const input = document.querySelector('#chatinput')
input.addEventListener('keyup', event => {
    if(event.key === 'Enter' && event.currentTarget.value.trim().length > 0 ) {
        sendMessage(event.currentTarget.value)
        
    }
})

document.querySelector('#send').addEventListener('click', event => {sendMessage(input.value)})

function sendMessage(message){
   if(message.trim().length > 0){
    //aca tengo q llamar al metodo post.
    fetch(`/productos/chat`, {  method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, message }), })
    .then(() => {
        console.log("Post Exitoso")
       // document.location.href = '/productos/chat';
    })
    .catch(e => {
        alert('No se puede enviar el mensaje');
    });
    //esto estaba
    socket.emit('message',{user,message} )
   } 
}

function initIo(){
    socket = io()
    socket.on('logs' , messages => {
        const box = document.querySelector('#chatbox')
        let html = ''
        messages.reverse().forEach(message => {
            html += `<p><i>${message.user}</i> : ${message.message}</p>`
        })
        box.innerHTML = html
    })
}
