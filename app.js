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
app.use(express.static(path.join(__dirname, 'public/images')));

app.get('/', (req,res) => {
    console.log('working');
});




http.listen(3000, () =>{
   console.log('Listening on port 3000')
});



io.on('connection', (socket) => {
    console.log('connected by socket')
    //let data = "dfsdf";
    connection.query("SELECT * FROM warehouse;",function(err, results, fields) {
        let guitars = JSON.stringify(results);
        let content=JSON.parse(guitars);
        socket.emit('data', content);
    });

    socket.on('add_guitar', function (data) {
        let model = data[0];
        let guitar_id = data[2];
        let amount = data[1];
        let img_src = data[3];
        if (img_src !== null){
            let array = img_src.split('\\');
            img_src = array[array.length - 1];
        }
        let data2 = [guitar_id, model, amount, img_src];
        let obj = {guitar_id: guitar_id, guitar_name: model, img_src: img_src, amount_in_stock: amount};
        let sql = "INSERT INTO warehouse VALUES (?,?,?,?)";
        connection.query(sql,data2, function (err, results) {
            if (!err)
                socket.emit('guitar_added', obj)
        });
    });

    socket.on('delete_guitar', function(guitar_id){
        console.log(guitar_id);
    });

    socket.on('login', function (login, password) {
        console.log(login + "  " + password);
        let user=new User(login,password,null);
        let passwordDB ;
        let sql="SELECT password FROM user WHERE login = ?";
        connection.query(sql, user.username,function (err,result) {
            let results = JSON.stringify(result);
            if (result.length>0) {
                let temp = JSON.parse(results);
                passwordDB = temp[0].password;
                if (bcrypt.compareSync(password, passwordDB)) {
                    const expiresIn = 60 * 60;
                    const accessToken = jwt.sign({login: login}, process.env.SECRET_KEY, {expiresIn: expiresIn});
                    res.setHeader('Set-Cookie', 'token=' + accessToken + '; expires = '+ setExpiringTime()+';Secure, HttpOnly');
                    res.status(200).send();
                } else {
                    res.status(401);
                }
            }else{
                res.status(401).send();
            }
        });
    })
});


function deleteGuitar(guitar_id){
    let id = req.params.id;
    let token =req.cookies.token;
    if (token === undefined)
        res.status(401).send();
    else if (verifyToken(req.cookies.token)){
        connection.query("DELETE FROM warehouse WHERE guitar_id = ?",guitar_id,function (err,results) {
            if (err)
                console.log(err);
            else {
                console.log("Data Deleted");
                res.send(id);
            }
        });
    }else {
        res.send();
    }
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}


function User(username,password,email) {
    this.username=username;
    this.password= password;
    this.email=email;
}

function setExpiringTime() {
    let currentTime = new Date();
    let time = currentTime.getTime();
    let expireTime = time + 1000*3600;
    currentTime.setTime(expireTime);
    return currentTime.toUTCString();
}

process.on("SIGINT",()=>{
    connection.end();
    process.exit();
});
