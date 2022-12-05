const socket  = io();
const room = document.getElementById("room");
const welcome = document.getElementById("welcome");
const lobyForm = welcome.querySelector("form");


room.hidden = true; 

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
}

function showRoom(name) { 
    welcome.hidden = true;
    room.hidden = false;
    const h3Name = room.querySelector("h3");
    h3Name.innerText = `Room : ${roomName}`;
    const roomForm  = room.querySelector("#msg");
    const nickForm = room.querySelector("#nick");
    nickForm.addEventListener("submit", handleNickSubmit);
    roomForm.addEventListener("submit", handleMessageSubmit);
}

function handleNickSubmit(evnet) {
    evnet.preventDefault();
    const input = room.querySelector("#nick input")
    socket.emit("nickname", input.value);
}
 
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("send_message" , input.value , roomName , () => {
        addMessage(`You : ${value}`);
    });
    input.value = "";
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = lobyForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom); //어떤 event도 전송 가능 , Javasciprt object도 보낼 수 있음 , callback이 가능
    //callback은 server로부터 실행되는 함수
    roomName = input.value;
    input.value = "";
}

socket.on("welcome" , (user, newCount) => { //server로부터 welcome이란 이벤트를 받았을 때  
    const h3Name = room.querySelector("h3");
    h3Name.innerText = `Room : ${roomName} (${newCount})`;
    addMessage(`${user} joined`);
})

socket.on("bye", (user, newCount) => { //server로부터 bye라는 이벤트를 받았을 때
    const h3Name = room.querySelector("h3");
    h3Name.innerText = `Room : ${roomName} (${newCount})`;
    addMessage(`${user} someone left`);
})

socket.on("send_message" , addMessage); //server로부터 send_message를 받았을 때

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        roomList.innerHTML = "";
        return;
    }
    rooms.forEach((room)=> {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});

lobyForm.addEventListener("submit", handleRoomSubmit);