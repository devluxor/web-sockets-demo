### Node.js Server

The server is divided into two main parts:

1. **Express Server**: This listens for HTTP POST requests.
2. **WebSocket Server**: This listens for WebSocket connections.

Here's a detailed breakdown:

#### Express Server

1. **Dependencies**:
   - `WebSocket` for WebSocket communication.
   - `express` for handling HTTP requests.
   - `bodyParser` for parsing JSON bodies of HTTP requests.

2. **Configuration**:
   - The server uses `bodyParser.json()` to parse incoming JSON requests.
   - `clients` is an object to store connected WebSocket clients.

3. **HTTP POST Endpoint**:
   - Listens on the root (`/`) endpoint.
   - When a POST request is received, it logs the received message.
   - If a client with `id1` is connected, it sends the received message to that client.
   - Sends a response back to the HTTP client indicating success.

```js
app.post('/', (req, res) => {
  console.log('message received: '+ req.body.data);

  if (clients["id1"]) {
    console.log('sending it to client id1');
    clients["id1"].send(`${req.body.data}`);
  }
  res.send('Cool thanks'); // 200 ok back to postman
})
```

4. **Listening for HTTP Requests**:
   - The server listens on port `3000` for HTTP requests.

```js
app.listen(port, () => {
  console.log(`server listening for notifications on port ${port}`);
})
```

#### WebSocket Server

1. **Configuration**:
   - The WebSocket server listens on port `8888`.

2. **Connection Handling**:
   - When a client connects, it logs the connection and stores the WebSocket object in the `clients` object under the key `id1`.

```js
wss.on("connection", (ws, req) => {
  console.log("Client connected: " + req);
  clients["id1"] = ws;

  ws.on("close", () => {
    delete clients["id1"];
    console.log("client disconnected");
  })
})
```

### HTML Client

1. **WebSocket Connection**:
   - The client establishes a WebSocket connection to `ws://localhost:8888`.

2. **Event Listeners**:
   - `open` event: Logs when the connection is successfully established.
   - `message` event: When a message is received, it creates a new `div` element with the class `raindrop`, sets its text content to the message data, and appends it to the `raindrops` div. It also logs that a message was received.

```html
<script>
  const ws = new WebSocket("ws://localhost:8888");

  ws.addEventListener("open", () => {
    console.log("We are connected!")
  })

  ws.addEventListener("message", (e) => {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';
    raindrop.textContent = e.data;
    document.getElementById('raindrops').append(raindrop);
    console.log('message received');
  })
</script>
```

### Workflow Summary

1. **Client Connection**:
   - The client (HTML) connects to the WebSocket server.

2. **Sending Data**:
   - An HTTP POST request is sent to the Express server with some data.
   - The Express server logs the message and forwards it to the WebSocket client if connected.

3. **Receiving Data**:
   - The WebSocket client receives the message and displays it on the web page.

This setup allows for real-time communication where the server can push updates to connected clients via WebSockets (instead of them having to query the server for new messages every x amount of time - polling), and clients can react to these updates immediately by updating the DOM (Document Object Model).
