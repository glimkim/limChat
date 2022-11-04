'use strict'
const socket = io();

const loader = document.querySelector('.loader');

const select01 = document.querySelector('.select01');
const nickname = document.querySelector('#nickname');
const nextButton01 = document.querySelector('#next01');

const select02 = document.querySelector('.select02');
const myPicture = document.querySelector('.myPicture'); 
const nextButton02 = document.querySelector('#next02');
       
const chatRoom = document.querySelector('.chatRoom');
const displayContainer = document.querySelector('.displayContainer');
const chatList = document.querySelector('.chatList');
const message = document.querySelector('#message');
const sendButton = document.querySelector('#send');

chatRoom.style.display = 'none';
select02.style.display = 'none';

window.onload = setTimeout(function(){
    loader.style.top = '-120%';
}, 2000);

const param = {}
nextButton01.addEventListener('click', () => {
    if(nickname.value == ''){
        alert('Please enter your nickname.');
        nickname.focus();
    }else{
        param.name = nickname.value;
        socket.emit('inAlert', param);
        select01.style.display = 'none';
        select02.style.display = 'block';
    }
});
nickname.addEventListener('keypress', (e) => {
    if(e.keyCode === 13 && e.keyCode != 16){
        param.name = nickname.value;
        socket.emit('inAlert', param);
        select01.style.display = 'none';
        select02.style.display = 'block';
    }
});

const setProfile = (e) => {
    const figure = document.querySelector('.profilePicture');
    var reader = new FileReader();
    reader.onload = (e) => {
        var img = document.querySelector('.myPicture');
        img.src = e.target.result;
        figure.append(img);
    }
    reader.readAsDataURL(e.target.files[0]);
}
nextButton02.addEventListener('click', () => {
    param.img = myPicture.src;
    socket.emit('profile', param);
    select02.style.display = 'none';
    chatRoom.style.display = 'block';
});

socket.on('inAlert', (data) => {
    const inAlert = document.createElement('li');
    inAlert.classList.add('inAlert');
    inAlert.innerText = `'${data.name}' joined`;
    chatList.appendChild(inAlert);
});

sendButton.addEventListener('click', () => {
    param.msg = message.value;
    socket.emit('chatting', param);
    message.value = '';
});
message.addEventListener('keypress', (e) => {
    if(e.keyCode === 13 && e.keyCode != 16){
        param.msg = message.value;
        socket.emit('chatting', param);
        message.value = '';
    }
});

function LiModel(name, msg, img, time){
    this.name = name;
    this.msg = msg;
    this.img = img;
    this.time = time;

    this.makeLi = () => {
        const li = document.createElement('li');
        li.classList.add(nickname.value==this.name?'sent':'received');
        const dom = 
        `
        <div class="profile">
            <span class="user">${this.name}</span>
            <figure>
                <img src="${img}" alt="any image">
            </figure>
        </div>
        <div class="message">
            <span class="contents">${this.msg}</span>
            <span class="time">${this.time}</span>
        </div>
        `;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}

socket.on('chatting', (data) => {
    const {name, msg, img, time} = data;
    const aMessage = new LiModel(name, msg, img, time);
    aMessage.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});