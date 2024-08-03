const WebSocket = require("ws");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000; // port for express server

app.use(bodyParser.json());

// an object to store connected WebSocket clients.
let clients = {};

// Express Server: This listens for HTTP POST requests.
// server that listens for requests from notifier a.k.a postman
// Listens on the root (/) endpoint.
// When a POST request is received, it logs the received message.
// If a client with id1 is connected, it sends the received message to that client.
// Sends a response back to the HTTP client indicating success.
app.post('/', (req, res) => {
  console.log('message received: '+ req.body.data);

  if (clients["id1"]) {
    console.log('sending it to client id1');
    clients["id1"].send(`${req.body.data}`);
  }
  res.send('Cool thanks'); // 200 ok back to postman
})


// WebSocket Server: This listens for WebSocket connections.
// web socket server that connects to clients
// NOTE port is different than express server port
const wss = new WebSocket.Server({port: 8888});

// When a client connects, it logs the connection and stores the WebSocket 
// object in the clients object under the key id1.
wss.on("connection", (ws, req) => {
  console.log("Client connected: " + req);
  clients["id1"] = ws;
  
  ws.on("close", () => {
    delete clients["id1"];
    console.log("client disconnected");
  })
})

app.listen(port, () => {
  console.log(`server listening for notifications on port ${port}`);
})