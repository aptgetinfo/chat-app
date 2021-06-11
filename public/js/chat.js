const socket=io()
//
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')

socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled','disabled')

    const message=e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message Deliverd')
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Gelocation is not supported by your Browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')

            console.log('Location Shared')
        })
    })
})