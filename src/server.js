import express from "express";
import http from "http";
import SocketIO from "socket.io";


const app = express();

app.set("view engine" , "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (_,res)=>res.redirect("/"));

const handelListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
//socket끼리 소통할 수 있는 그룹이 필요함

wsServer.on("connection" , (socket) => {
    socket["nickname"] = "Anon"; //socket의 기본 nickname
    socket.onAny((event)=>{  //front로부터 받은 이벤트 확인
        console.log(`socket Evenet : ${event}`) // event 확인
    })
    socket.on("enter_room", (roomName , enter)=> { //enter_room이란 이벤트를 받으면
        socket.join(roomName); //roomName을 가진 room에 참여
        enter(); //backend에서 실행해주는 function
        socket.to(roomName).emit("welcome" , socket.nickname); //front로 welcome이란 이벤트를 보냄
    });
    socket.on("disconnecting", () => { //disconnceting이란 이벤트를 받으면
        socket.rooms.forEach((room)=> socket.to(room).emit("bye" , socket.nickname)); //socket이 참여한 모든 방에 다가  bye이벤트를 보냄
        //socket이 중복을 허용하지 않는 Array인 자료구조 Set을 사용하기 때문
    })

    socket.on("send_message" , (msg, roomName, done) => { //send_message 이벤트를 받으면 
        socket.to(roomName).emit("send_message", `${socket.nickname} : ${msg}`); //msg를 보낸 roomname을 가진 room으로 send_message 이벤트를 보냄 
        done();
    }) 
    socket.on("nickname", (nick) => (socket["nickname"] = nick)); //nickname 이벤트를 받으면 소켓의 nickname을 nick으로 설정
});

httpServer.listen(3000, handelListen);


/* 
    console.log(socket.rooms); //Set(1) { '8TJbhv9HjHUeEU4JAAAB' } => user.id = room.id why ? 모든 유저는 서버와 private한 room 을 가지고 있음
    console.log(socket.rooms); //Set(2) { '8TJbhv9HjHUeEU4JAAAB', 'enter' } , socket이 어느 room에 들어가 있는지 확인

*/