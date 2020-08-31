class WebSocketService {
    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    connect() {
        const path = "ws://127.0.0.1:8000/ws/chat/test";
        this.socketRef = new WebSocket(path);

        this.socketRef.onopen = () => {
            console.log("Websocket open");
        };

        this.socketRef.onmessage = (e) => {
            // send socket message
        };

        this.socketRef.onerror = (e) => {
            console.log(e.message);
        };

        this.socketRef.onclose = () => {
            console.log("Websocket is closed");
            this.connect();
        };
    }

    socketNewMessage(data) {
        const parseData = JSON.parseData(data);
        const command = parseData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === "messages") {
            this.callbacks[command](parseData.messages);
        }
        if (command === "new_message") {
            this.callbacks[command](parseData.message);
        }
    }

    fetchMessages(username) {
        this.sendMessage({ command: "fetch_message", username: username });
    }

    newChatMessage(message) {
        this.sendMessage({
            command: "new_message",
            from: message.from,
            message: message.content,
        });
    }

    addCallbacks(messageCallback, newMessageCallback) {
        this.callbacks["messages"] = messageCallback;
        this.callbacks["new_message"] = newMessageCallback;
    }

    sendMessage(data) {
        try {
            this.socketRef.send(JSON.stringify({ ...data }));
        } catch (err) {
            console.log(err.message);
        }
    }

    waitForSocketConnections(callback) {
        const socket = this.socketRef;
        const recursion = this.waitForSocketConnections;
        setTimeout(function () {
            if (socket.readyState === 1) {
                console.log("connection is secure");
                if (callback != null) {
                    callback();
                }
                return;
            } else {
                console.log("Waiting for conenction...");
                recursion(callback);
            }
        }, 1);
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
