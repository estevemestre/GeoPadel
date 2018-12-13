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



function getPartidasByUser(users_id) {
    return new Promise(resolve => {
       var sql="SELECT p.*, pu.* FROM `partides` p, partides_users pu WHERE p.partides_id = pu.partides_users_partides_id AND pu.partides_users_users_id =" + users_id; 
       
       var partidas = [];
        
        con.query(sql, function (err, result, fields) {
            if (err)
                throw err;
            /// nomdelmetode.responseData() {sdSADDSAASD} 
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                partidaUser = 
                    {
                       "partides_id": row.partides_id,
                       "partides_descripcio": row.partides_desc,
                       "partides_num_jugadors": row.partides_num_jugadors,
                       "partides_data": row.partides_data
                    }
                 partidas.push(partidaUser);
            });
            
            resolve(partidas);
           
        });
    });
}


function borrarPartida(user_id, partida_id) {
   console.log("borrarPartoda");
      var sql="DELETE FROM partides_users WHERE partides_users_users_id = '"+user_id+"' AND partides_users_partides_id = '"+partida_id+"'"; 
       
      con.query(sql, function (err, result) {
        if (err)
            throw err;
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
    getPartidasByUser,
    saveUser,
    borrarPartida,
    setLevelByID,
    crearPartida
};
