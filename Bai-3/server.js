var express = require("express");
var app = express();
app.use(express.static("./public")); 
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(2004);

var mangUsers=[];

io.on("connection", function(socket){
    console.log(" Béo đã kết nối " + socket.id)

    socket.on("client-send-Username", function(data){
        if(mangUsers.indexOf(data)>=0){
            socket.emit("server-send-dki-thatbai");
        }else{
            mangUsers.push(data);
            socket.Username = data;
            socket.emit("server-send-dki-thanhcong", data);
            io.sockets.emit("server-send-danhsach-Users", mangUsers);
        }
    });

    socket.on("logout", function(){
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1
        );
            socket.broadcast.emit("server-send-danhsach-Users", mangUsers);
    });

    socket.on("user-send-message", function(data){
        io.sockets.emit("server-send-mesage", {un:socket.Username, nd:data} );
    });

    socket.on("toi dang go chu", function(){
        var s = socket.Username + " dang go chu";
        io.socket.emit("ai-do-dang-go-chu", s);
    });

    socket.on("toi-stop-go-chu", function(){
        io.socket.emit("ai-do-stop-go-chu", s);
    });


});

app.get("/", function(req, res) {
    res.render("trangchu");
})