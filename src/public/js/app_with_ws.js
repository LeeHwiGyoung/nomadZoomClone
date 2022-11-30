const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); //socket 연결된 서버

function makeMessage(type, payload ){
    const msg = {type, payload};
    return JSON.stringify(msg);
}
socket.addEventListener("open", ()=>{
    console.log("Connected to Server");
})

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

socket.addEventListener("close", () => {
    console.log("disconnected to Server");
})

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message",input.value));
    const li = document.createElement("li");
    li.innerText = `You : ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const nickinput = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", nickinput.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);