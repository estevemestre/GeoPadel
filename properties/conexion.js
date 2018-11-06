//incluyendo mysql	
let mysql = require('mysql');

//incluyendo mysql	
let db = require('./properties');

var urlBd= db.geopadel.db;


//Configuracion mysql
let con = mysql.createConnection({
    host: urlBd.host,
    user: urlBd.user,
    password: urlBd.password,
    database: urlBd.database
});


//Metodo conectar bd

con.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});