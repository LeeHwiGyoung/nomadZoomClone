const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCamera() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentSelectCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera=> {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentSelectCamera.label == camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch (e) {
        console.log(e);
    }

}
async function getMedia(deviceId) {
    const initialConstraints = {
        audio : true,
        video : {facingMode: "user" },
    }

    const cameraConstraints = {
        audio : true,
        video : { deviceId : { exact: deviceId }},
    };

    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
        myFace.srcObject = myStream;
        await getCamera();

    } catch (e) {
        console.log(e);
    }
}

getMedia();
function handelMuteBtnClick() {
    myStream
     .getAudioTracks()
     .forEach((track)=> (track.enabled = !track.enabled))
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraBtnClick() {
    myStream
     .getVideoTracks()
     .forEach((track)=> (track.enabled =! track.enabled))
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }
    else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}
muteBtn.addEventListener("click", handelMuteBtnClick);
cameraBtn.addEventListener("click", handleCameraBtnClick);
camerasSelect.addEventListener("input", handleCameraChange);