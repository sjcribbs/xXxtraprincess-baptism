const socket = io()
const enter = document.querySelector('#enter')
const utxt = document.querySelector('#usertext')
const uname = document.querySelector('#username')


function addNewTextBox(name,txt){
    let div = document.createElement('div')
    div.innerHTML = `<b>${name}</b>: ${txt}`
    document.body.appendChild(div)
}

enter.addEventListener('click',function(){
    addNewTextBox( uname.value, utxt.value )

    socket.emit('enter-click',{
        name:uname.value,
        text:utxt.value
    })
})

socket.on('new-msg',function(data){
    addNewTextBox(data.name,data.text)
})
