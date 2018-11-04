//incluyendo mysql	
let mysql = require('mysql');

//Configuracion mysql
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_geopadel'
});


//Metodo conectar bd

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});