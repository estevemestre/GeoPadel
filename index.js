// Incluyendo librería
const Telegraf = require('telegraf')


//Obteniendo configuraciones
const config = require('./config.json');

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


var usuarios;

var consulta = function(){
	console.log("entre");

	connection.query("SELECT * FROM users", function (err, result, fields) {
  	if (err) throw err;
    console.log("resultado", result);

  	return result;
   
});
	

  }


//Creando bot 
const bot = new Telegraf(config.secret_token);

//comando start
bot.start((ctx) => ctx.reply(consulta() + ""))

// Si nos envia sticket, pulgar arriba
bot.on('sticker', (ctx) => ctx.reply('👍'))


//Empezar
bot.startPolling()








