# Running it
- run `npm install` in the `server` directory
- run `node server.js` to run both express and web socket server
- Open `client.html` in a new browser (just drag the html file to a browser)
- Confirm you see `We are connected` in the browser dev console
- Use postman to send a `POST` request to `localhost:3000` with a json body `"data": "i am an iguana"`
- Data should appear on the website

# Resources
- based off of this video: https://www.youtube.com/watch?v=FduLSXEHLng

# Web Socket Code:
On Server:
```js
const wss = new WebSocket.Server({port: 8888});

wss.on("connection", (ws, req) => {
  console.log("Client connected: " + req);
  clients["id1"] = ws;

  ws.on("close", () => {
    delete clients["id1"];
    console.log("client disconnected");
  })
})
```
On client:
```js
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
```
