const readline = require('readline');
const WebSocket = require('ws');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startClient(url) {
  const name = await new Promise((resolve) => {
    rl.question('Please enter your name: ', (answer) => {
      resolve(answer);
    });
  });

  const ws = new WebSocket(url);

  ws.on('open', () => {
    console.log(`Connected to ${url}`);

    // Start listening for user input
    rl.on('line', (input) => {
      if (input.startsWith('/')) {
        ws.send(input);
      } else {
        ws.send(`${name}: ${input}`);
      }
    });
  });

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Connection closed');
    process.exit(0);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

const args = {
  host: '127.0.0.1', // Change to your host
  port: 5500, // Change to your port
};

const url = `ws://${args.host}:${args.port}/ws`;

console.log(`
  /list       list all available rooms
  /join name  join room, if room does not exist, create new one
  /name name  set session name
  some message    just string, send message to all peers in same room
  ctrl-D to exit
`);

startClient(url);
