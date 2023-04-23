const express= require("express");
const http= require("http");
const socketio= require("socket.io")

const app= express();
const server= http.createServer(app);
const io= socketio(server);

app.use("/", express.static(__dirname + "/public"));

let users={};
let socketMap={};

io.on("connection", (socket)=>{
    console.log(socket.id);

    socket.on("userSet", (data)=>{
        if(users[data.username]){
            socket.emit("setFailed", data);
        }
        else{
            socket.join(data.username);
            users[data.username]= data.password;
            socket.join(data.username);
            socketMap[socket.id]= data.username;

            socket.emit("setSucceed", data);
            io.emit("listUsers", {names: Object.keys(users), added: data.username});
        }
    });

    socket.on("userCheck", (data)=>{
        if(users[data.username] == data.password){
            socket.join(data.username);
            socketMap[socket.id]= data.username;

            socket.emit("checkSucceed", data);
            io.emit("listUsers", {names: Object.keys(users)});
        }
        else{
            socket.emit("checkFailed", data);
        }
    });

    socket.on("msg_send", (data)=>{
        data.from= socketMap[socket.id];
        if(data.to=='All'){
            io.emit("msg_rcvd", data);
        }
        else{
            io.to(data.to).to(data.from).emit("msg_rcvd", data);
        }
    })
});

server.listen(80, ()=>{console.log("Server running on http://localhost:80");});