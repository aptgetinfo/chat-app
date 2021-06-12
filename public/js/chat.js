const socket=io()
//Elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//Tempelates
const messageTempelate=document.querySelector('#message-tempelate').innerHTML
const locationMessageTempelate=document.querySelector('#location-message-tempelate').innerHTML
const sidebarTempelate=document.querySelector('#sidebar-tempelate').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})



socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTempelate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h: mm A')

    })
    $messages.insertAdjacentHTML('beforeend',html)
})
socket.on('locationMessage',(message)=>{
    // console.log(url)
    const html=Mustache.render(locationMessageTempelate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h: mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTempelate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
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

socket.emit('join',{username,room},error=>{
    if(error){
        alert(error)
        location.href='/'
    }
})