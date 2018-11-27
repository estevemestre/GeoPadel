const fs = require('fs');
var usrFileName = "./users.json";

var users = {};
var fileLocked = false;


//-------------------------------DEURIA DE ESTAR EN EL FITXER  DE CONEXIo-----------------------------------------

////incluyendo mysql	
let db = require('../properties/properties');


var urlBd = db.geopadel.db;
let mysql = require('mysql');

const bot = require('../bot');


let con = mysql.createConnection({
    host: urlBd.host,
    user: urlBd.user,
    password: urlBd.password,
    database: urlBd.database
});
//Metodo conectar bd

con.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});
//---------------------------------------------------------------------------------------------------------




// Retorna totes les partides
function getPartides(idNivell) {
    console.log("dins de get Partides");
    var partida = null;
    var partidas = [];


    return new Promise(resolve => {

        // QUIN NIVELL TE EL USUARI ???

        con.query("SELECT * FROM partides WHERE partides_num_jugadors < 4 AND partides_levels_id = " + idNivell, function (err, result, fields) {
            if (err)
                throw err;
            /// nomdelmetode.responseData() {sdSADDSAASD} 
            Object.keys(result).forEach(function (key) {
                var row = result[key];

                partida = {
                    "partides_id": row.partides_id,
                    "partides_desc": row.partides_desc,
                    "partides_num_jugadors": row.partides_num_jugadors,
                    "partides_pistes_id": row.partides_pistes_id,
                    "partides_levels_id": row.partides_levels_id,
                    "partides_data": row.partides_data
                };
                partidas.push(partida);
            });
            resolve(partidas);
        });
    });



}

function savePartida(ctx) {
    console.log(ctx.message.text);
    var descripcion = ctx.message.text;
    var alias = ctx.from.username;
//    var sql = "INSERT INTO users (users_id, users_first_name, users_last_name, users_username) VALUES ('" + usuari.from.id + "', '" + usuari.from.first_name + "', '" + usuari.from.last_name + "', '" + usuari.from.username + "')";
//   
//    con.query(sql, function (err, result) {
//        if (err)
//            throw err;
//    });
}

function setLevelByID(users_id, missatge) {
    var nivell;

    switch (missatge) {
        case "/principiant":
            nivell = 3;
            break;
        case "/intermig":
            nivell = 2;
            break;
        case "/avancat":
            nivell = 1;
            break;
    }
    var sql = "UPDATE users SET users_levels_id='" + nivell + "' WHERE users_id = '" + users_id + "'";
    con.query(sql, function (err, result) {
        if (err)
            throw err;
    });
}

function crearPartida(ctx) {
    console.log("En crear partida");
//    ctx.reply("Descripció de ");
//    var sql;
//    con.query(sql, function (err, result) {
//        if (err)
//            throw err;
//    });
}



function loadUsers() {
    fs.readFile(usrFileName, (err, data) => {
        if (err)
            throw err;
        users = JSON.parse(data);
    });
}


function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}


function registerUser(msg) {
    var uid = msg.chat.id;
    var usr = {enabled: true, data: {from: msg.from, chat: msg.chat}};
    users[uid] = usr;
    saveUsers();
}

//function getUser(uid) {
//    return users[uid];
//}

function getUserList() {
    return Object.keys(users);
}

function setMetaData(uid, key, val) {
    users[uid].data[key] = val;
    saveUsers();
}



module.exports = {
//    loadUsers,
//    registerUser,
//    getUserList,
//    setMetaData,
    getPartides,
    savePartida,
    resolveAfter2Seconds,
    setLevelByID,
    crearPartida
//    getMetaData,
//    setCounter,
//    getCounter,
//    getAllCounters,

};
