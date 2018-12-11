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

function getPartidesData(idNivell, data) {
    console.log("dins de get Partides per data");

    var partida = null;
    var partidas = [];

    var separacionStringPartida = data.split(" ");
    var separacionFecha = separacionStringPartida[1].split("-");

    var any = parseInt(separacionFecha[0]);
    var mes = parseInt(separacionFecha[1]);
    var dia = parseInt(separacionFecha[2]);

    var fechaCompletaInicio;
    var fechaCompletaFin;

//    console.log("soy numero?", typeof any);

    if (Number.isNaN(any) && Number.isNaN(mes) && Number.isNaN(dia)) {
        console.log("No soy un numero :(");
        return null;
        
    } else {
        console.log("Si soy un numeeeero");
        fechaCompletaInicio = new Date(any, mes, dia, 0, 0, 0);
        fechaCompletaFin = new Date(any, mes, dia, 23, 59, 59);
//        console.log("Completita aqui", fechaCompletaInicio.getFullYear(), "-", fechaCompletaInicio.getMonth(), "-",
//                fechaCompletaInicio.getDate(), " AHORA hora ", fechaCompletaInicio.getHours(), ":", fechaCompletaInicio.getMinutes());

var consulta = "SELECT * FROM partides WHERE partides_num_jugadors < 4 AND partides_levels_id = " + idNivell + " AND partides_data BETWEEN '" +
                    fechaCompletaInicio.getFullYear() + "-" + fechaCompletaInicio.getMonth() + "-" + fechaCompletaInicio.getDate() + " " +
                    fechaCompletaInicio.getHours() + ":" + fechaCompletaInicio.getMinutes() + ":" + fechaCompletaInicio.getSeconds() + "' AND '" +
                    fechaCompletaFin.getFullYear() + "-" + fechaCompletaFin.getMonth() + "-" + fechaCompletaFin.getDate() + " " +
                    fechaCompletaFin.getHours() + ":" + fechaCompletaFin.getMinutes() + ":" + fechaCompletaFin.getSeconds()+ "'";
                   
console.log("CONSULTA", consulta);


        return new Promise(resolve => {
            // QUIN NIVELL TE EL USUARI ???
            con.query("SELECT * FROM partides WHERE partides_num_jugadors < 4 AND partides_levels_id = " + idNivell + " AND partides_data BETWEEN '" +
                    fechaCompletaInicio.getFullYear() + "-" + fechaCompletaInicio.getMonth() + "-" + fechaCompletaInicio.getDate() + " " +
                    fechaCompletaInicio.getHours() + ":" + fechaCompletaInicio.getMinutes() + ":" + fechaCompletaInicio.getSeconds() + "' AND '" +
                    fechaCompletaFin.getFullYear() + "-" + fechaCompletaFin.getMonth() + "-" + fechaCompletaFin.getDate() + " " +
                    fechaCompletaFin.getHours() + ":" + fechaCompletaFin.getMinutes() + ":" + fechaCompletaFin.getSeconds()+ "'",
                    function (err, result, fields) {

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


//    SELECT * FROM partides 
//WHERE partides_data BETWEEN  '2018-11-28 00:00:00' AND '2018-11-28 23:59:59' AND partides_levels_id =3 AND partides_num_jugadors < 4
//    





}



// Retorna una partida per id
function getPartidaID(idPartida) {
    console.log("dins de get Partides ID");
    var partida = null;

    return new Promise(resolve => {

        con.query("SELECT * FROM partides WHERE partides_id =" + idPartida, function (err, result, fields) {
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

            });
            resolve(partida);
        });
    });
}

// Busca si eixe usuari ja esta en una partida
function getPartidaUsuarisBYUsuariPartida(usuari, partida) {
    var partides_users = null;

    return new Promise(resolve => {

        var a = "SELECT * FROM partides_users WHERE partides_users_users_id =" + usuari + " AND partides_users_partides_id =" + partida;
        console.log("a" + a);
        con.query("SELECT * FROM partides_users WHERE partides_users_users_id =" + usuari + " AND partides_users_partides_id =" + partida, function (err, result, fields) {
            if (err)
                throw err;
            /// nomdelmetode.responseData() {sdSADDSAASD} 
            Object.keys(result).forEach(function (key) {
                var row = result[key];

                partides_users = {
                    "partides_users_id": row.partides_users_id
                };

            });
            resolve(partides_users);
        });
    });
}






// Actualizar los usuarios de una partida
function updatePartida(idPartida, jugadors) {
    console.log("Actualitzar partida");
    var numJugadors = jugadors + 1;

    var sql = "UPDATE partides SET partides_num_jugadors=" + numJugadors + " WHERE partides_id = " + idPartida;
    con.query(sql, function (err, result) {
        if (err)
            throw err;
    });
}



// Afegir l'usuari a una partida
function afegirPartidesUsers(idPartida, idjugador) {
    console.log("Afegir jugador a partida");
    var sql = "INSERT INTO partides_users(partides_users_id, partides_users_users_id, partides_users_partides_id) VALUES ('" + null + "', '" + idjugador + "', '" + idPartida + "')";
    console.log("HOLA," + sql);
    con.query(sql, function (err, result) {
        if (err)
            throw err;
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
    getPartidesData,
    savePartida,
    resolveAfter2Seconds,
    setLevelByID,
    crearPartida,
    getPartidaID,
    updatePartida,
    afegirPartidesUsers,
    getPartidaUsuarisBYUsuariPartida
//    getMetaData,
//    setCounter,
//    getCounter,
//    getAllCounters,

};
