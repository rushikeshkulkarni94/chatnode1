var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);
users=[];
connections=[];

server.listen(process.env.PORT||3000);
console.log("server running");

app.get('/',function(req,res){
    res.sendFile(__dirname +"/"+"index.html");

});

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log("Connected:%s connected",connections.length);
socket.on('disconnect',function(data){

users.splice(users.indexOf(socket.username),1);
updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log("DISConnected:%s connected",connections.length);
});
socket.on('send message',function(data){
  
io.sockets.emit('new message',{msg:data},{user:socket.username});
});

socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
    updateUsernames();

});
socket.on('get users',function(data){
    var html='';
    for(i=0;i<data.length;i++){
        html=html+'<li class="list-group-item">'+data[i]+'</li>';

    }
    $users.html(html);
});

function   updateUsernames(){
    io.sockets.emit('get users',users);
}

});