const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.argv[2] || 80
// let's import our chat's database, it's a json file so we need to add ./
// before the name so that node knows this is a file in the same directory as
// our server, and not a library inside of our node_modules folder
const db = require('./chat-db.json')
// here we import the file system module, so that we can re-write our json
// file (ie. the database file on our harddive) whenever we make changes
// to it in memory here in our server app
const fs = require('fs')
// here we'll import the request module/library we installed, this allows our
// server to make requests to other servers (specifically we'll be using it to
// request data from REST APIs )
const req = require('request')
// this file contains our API keys, it's being "ignored" via our .gitignore
// so u'll have to create your own ( once u register keys ), it will look like:
// {
//      "ipstack":"YOUR_IPSTACK_KEY",
//      "darksky":"YOUR_DARKSKY_KEY",
// }
// to get your api keys to to: https://ipstack.com/ and https://darksky.net/dev
//const keys = require('./keys.json')

app.use( express.static(__dirname+'/www') )


function updateDataBase(data){
    db.chats.push(data)
    let dbtext = JSON.stringify(db, null, 4)
    fs.writeFile( './chat-db.json', dbtext, function(err){
        if(err){
            console.log(err)
        } else {
            console.log('database was updated!')
        }
    })
}

function loadPreviousChats(socket){
    for (let i = 0; i < db.chats.length; i++) {
        socket.emit('new-msg', db.chats[i])
    }
}

/*function ipToGeo(ip,callback){
    let url = `http://api.ipstack.com/${ip}?access_key=${keys.ipstack}`
    req(url, {json:true}, function(err,res,json){
        if(err){
            console.log(err)
        } else {
            let info = {
                city: json.city,
                country: json.country_name,
                zip:json.zip,
                lat:json.latitude,
                lon:json.longitude
            }
            callback(info)
        }
    })
}*/

/*function geoToWeather(lat,lon,callback){
    let url = `https://api.darksky.net/forecast/${keys.darksky}/${lat},${long}`
    req(url, {json:true}, function(err,res,json){
        if(err){
            console.log(err)
        } else {
            let temp = json.currently.temperature
            callback(temp)
        }
    })
}

function addMetaData(data,socket,callback){
    // add time of message
    data.date = Date.now()
    // add user's ip address
    let ip = socket.handshake.address
    ip = ip.replace('::ffff:','')
    data.ip = ip
    // get location
    ipToGeo(ip,function(info){
        data.location = info
        geoToWeather(info.lat,info.lon,function(temp){
            data.temperature = temp
            // return new augmented data object
            callback(data)
        })
    })
}*/

io.on('connection',function(socket){
    console.log('new user!')

    // now that we've got a chat database, we can send all the previous chats
    // to any newly connected user as soon as they log on
    loadPreviousChats(socket)

    socket.on('enter-click',function(data){
        // we can also now use our APIs to create "meta-data" about our user's
        // conversations and augment the chat data object with this info before
        // storying it in our database
        addMetaData(data,socket,function(data){
            updateDataBase(data)
        })
        socket.broadcast.emit('new-msg',data)
    })

    socket.on('disconnect',function(){
        console.log('user left :(')
    })
})


http.listen( port, function(err){
    if(err){ // if there's an error, log it to terminal
        console.log(err)
    } else { // otherwise, log the following...
        console.log(`server is listening, visit http://localhost:${port}`)
    }
})
