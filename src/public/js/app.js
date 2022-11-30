const socket  = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backDone(msg) {
    console.log(`backEnd Done : ${msg}` );
}
function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, backDone) //어떤 event도 전송 가능 , Javasciprt object도 보낼 수 있음 , callback이 가능
    //callback은 server로부터 실행되는 함수
    input.value = "";
}


form.addEventListener("submit", handleRoomSubmit);