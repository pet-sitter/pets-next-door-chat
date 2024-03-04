document.addEventListener('DOMContentLoaded', function() {
    const app = {
        ws: null,
        serverUrl: "ws://localhost:8080/ws",
        messages: [],
        newMessage: "",

        init: function() {
            this.cacheDom();
            this.connectToWebsocket();
            this.bindEvents();
        },

        cacheDom: function() {
            this.$messagesContainer = document.getElementById('messages');
            this.$newMessageInput = document.getElementById('messageInput');
            this.$sendButton = document.getElementById('sendButton');
        },

        bindEvents: function() {
            this.$sendButton.addEventListener('click', () => this.sendMessage());
            this.$newMessageInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    this.sendMessage();
                }
            });
        },

        connectToWebsocket: function() {
            this.ws = new WebSocket(this.serverUrl);
            this.ws.addEventListener('open', () => this.onWebsocketOpen());
            this.ws.addEventListener('message', (event) => this.handleNewMessage(event));
        },

        onWebsocketOpen: function() {
            console.log("Connected to WS!");
        },

        handleNewMessage: function(event) {
            let data = event.data;
            if (data.trim() !== "") {
                // Assuming the server sends one JSON object per message, not using split(/\r?\n/)
                let msg = JSON.parse(data);
                this.displayMessage(msg);
            }
        },

        displayMessage: function(msg) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('d-flex', 'justify-content-start', 'mb-4');
            const msgContainer = document.createElement('div');
            msgContainer.classList.add('msg_cotainer');
            msgContainer.textContent = msg.message; // Assuming the message structure includes a 'message' field
            messageElement.appendChild(msgContainer);
            this.$messagesContainer.appendChild(messageElement);
        },

        sendMessage: function() {
            this.newMessage = this.$newMessageInput.value.trim();
            if (this.newMessage !== "") {
                this.ws.send(JSON.stringify({message: this.newMessage}));
                this.$newMessageInput.value = "";
            }
        }
    };

    app.init();
});