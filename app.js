let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let fs = require("fs");
let busboy = require ("connect-busboy");


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY="j,]trn148fhvfnf";

let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    console.log('working');
    //res.sendFile('index.html')
    //res.sendFile(__dirname +"/public/index.html")
});



http.listen(3000, () =>{
   console.log('Listening on port 3000')
});

io.on('connection', (socket) => {
    console.log('connected by socket')
    let data = "dfsdf"
    socket.emit('data', data);
})

