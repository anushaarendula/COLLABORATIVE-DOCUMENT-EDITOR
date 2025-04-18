let socket;
let username = '';

function joinChat() {
    username = document.getElementById('username').value.trim();
    if (!username) return alert('Please enter your name.');

    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'block';

    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: 'join',
            user: username
        }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const chatBox = document.getElementById('chat-box');
        const messageDiv = document.createElement('div');

        if (data.type === 'system') {
            messageDiv.classList.add('system');
            messageDiv.textContent = data.msg;
        } else if (data.type === 'message') {
            messageDiv.innerHTML = `<b>${data.user}:</b> ${data.msg}`;
        }

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };
}

function sendMessage() {
    const messageInput = document.getElementById('message');
    const msg = messageInput.value.trim();
    if (!msg || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
        type: 'message',
        user: username,
        msg
    }));

    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<b>You:</b> ${msg}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    messageInput.value = '';
}

document.getElementById('message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});
