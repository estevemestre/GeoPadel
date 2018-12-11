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





// Retorna el usuari;  Busca usuari per id
function getUserByID(users_id) {

    var user = null;

    return new Promise(resolve => {
        con.query("SELECT * FROM users WHERE users_id =" + users_id, function (err, result, fields) {
            if (err)
                throw err;
            /// nomdelmetode.responseData() {sdSADDSAASD} 
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                user = [
                    {
                        "users_id": users_id,
                        "users_first_name": row.users_first_name,
                        "users_last_name": row.users_last_name,
                        "users_username": row.users_username,
                        "users_levels_id": row.users_levels_id
                    }
                ];

                // Cridara a un metodo per a que responguera 
//                return user;
            });
            if (user === null) {
                resolve(user);
            } else {
                // A este usuari que si que ha trobat ens dira que te el nivell XXXX
                
                resolve(user);
                
                
             
            }
        });
    });
}

function saveUser(usuari) {
    console.log("entrem en guardar usuari");

    var sql = "INSERT INTO users (users_id, users_first_name, users_last_name, users_username) VALUES ('" + usuari.from.id + "', '" + usuari.from.first_name + "', '" + usuari.from.last_name + "', '" + usuari.from.username + "')";

    con.query(sql, function (err, result) {
        if (err)
            throw err;
    });
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



//function getLevelByUserID(users_id) {





function crearPartida(ctx) {
    console.log("En crear partida");
//    ctx.reply("Descripció de ");
//    var sql;
//    con.query(sql, function (err, result) {
//        if (err)
//            throw err;
//    });
}


// Crear un metode que ens retorne la ID del nivell + la descripcio es adir un objecte nivell.descripcio nivell.id  ['nuvell',nivell]



module.exports = {
    getUserByID,
    saveUser,
    setLevelByID,
    crearPartida
};
