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

                // Cridara a un metodo per a que responguera 
//                return user;
            });
            if (partida === null) {
                console.log("No hi ha partida");
                resolve(partidas);


            } else {
                console.log("Si hi ha partida ");
                resolve(partidas);
            }






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
    
    switch(missatge){
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
    var sql = "UPDATE users SET users_levels_id='"+nivell+"' WHERE users_id = '"+users_id+"'";   
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

function saveUsers() {
    if (!fileLocked) {
        fileLocked = true;
        var json = JSON.stringify(users);
        fs.writeFile(usrFileName, json, 'utf8', function (err) {
            if (err)
                throw err;
            fileLocked = false;
        });
    }
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

function getMetaData(uid, key) {
    return users[uid].data[key];
}

function assertCounter(uid, id) {
    if (users[uid]) {
        if (users[uid].counter) {
            if (users[uid].counter[id]) {
                if ("value" in users[uid].counter[id]) {
                    return true;
                } else {
                    users[uid].counter[id].value = 0;
                }
            } else {
                users[uid].counter[id] = {};
                users[uid].counter[id].value = 0;
                saveUsers();
            }
        } else {
            users[uid].counter = {};
            if (users[uid].count && id == '0') {//old counter detected, migrate count
                users[uid].counter[id] = {value: users[uid].count};
                delete users[uid].count;
            } else {
                users[uid].counter[id] = {};
                users[uid].counter[id].value = 0;
            }
            saveUsers();
        }
    } else {
        //console.log("[ERROR] User ID", uid, "does not exist in database");
        var usr = {enabled: true, data: {from: undefined, chat: undefined, error: "user was not initialized properly"}, counter: {"0": {"value": 1}}};
        users[uid] = usr;
        saveUsers();
    }
}

function setCounter(uid, id, val) {
    assertCounter(uid, id);
    users[uid].counter[id].value = val;
    saveUsers();
}

function getCounter(uid, id) {
    assertCounter(uid, id);
    return users[uid].counter[id].value;
}

function getAllCounters(uid) {
    assertCounter(uid, '0');
    return users[uid].counter;
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
