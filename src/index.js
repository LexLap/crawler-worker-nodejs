const express = require('express');
const cors = require('cors');
const { socket } = require('./sockets/socket-client');
require('./sockets/socket-client')

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log("Server connected, port:", port));