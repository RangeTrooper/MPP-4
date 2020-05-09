let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let fs = require("fs");
let busboy = require ("connect-busboy");
const WebSocket = require('ws');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: process.env.DATABASE,
    password: process.env.PASSWORD
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    console.log('working');
    //res.sendFile('index.html')
    //res.sendFile(__dirname +"/public/index.html")
});

//const server = new WebSocket.Server({port: 3020});


/*server.on('connection', socket => {
    server.on('message', message =>{
        console.log('receiver message => ${message}')
        server.se
    })
});*/

/*io.on('connection', function (client) {
    console.log('Connected')

    /!*client.on('join', function(data){
        console.log(data)
    })*!/
});*/



http.listen(3000, () =>{
   console.log('Listening on port 3000')
});



io.on('connection', (socket) => {
    console.log('connected by socket')
    let data = "dfsdf"
    socket.emit('data', data);
});

process.on("SIGINT",()=>{
    connection.end();
    process.exit();
});
