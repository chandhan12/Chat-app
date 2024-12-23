import {WebSocketServer,WebSocket} from 'ws'

const wss=new WebSocketServer({port:8080})

interface User{
    socket:WebSocket;
    room:string
}

let allSockets:User[] =[]
let count=0
wss.on("connection",(socket)=>{
    count=count+1
    console.log(`user connected #${count}`)
    socket.on("message",(message)=>{
        //@ts-ignore
        const parsedMessage=JSON.parse(message)
        if(parsedMessage.type=='join'){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type=='chat'){
            const currentUser=allSockets.find((x)=>x.socket==socket)
           
            //@ts-ignore
            const currentRomm=currentUser.room

            allSockets.forEach((item)=>{
                if(item.room==currentRomm){
                    item.socket.send(parsedMessage.payload.message)
                }
            })
        }
    })

})