// Incluyendo librería
const Telegraf = require('telegraf');
//Obteniendo configuraciones
const config = require('./config.json');

//CONEXION DATABASE

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
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});
//-----------------------------------------------------------




var consulta = function () {
    console.log("entre");
    connection.query("SELECT * FROM users", function (err, result, fields) {
        if (err)
            throw err;
        console.log("resultado", result);
        return result;
    });
};


//Creando bot 
const bot = new Telegraf(config.secret_token);




//comando start
//bot.start((ctx) => ctx.reply("asdas"));

bot.start((ctx) => {
    //consulta  buscar partides
//    let a = consulta(); // Buca les partides
//    let ab = consulta().toString(); // Buca les partides
//    console.log("a" + a);
//    console.log("b" + ab);
//    ctx.reply("sadassd");
    connection.query("SELECT * FROM users", function (err, result, fields) {
        if (err)
            throw err;
//        console.log("resultado", result);
        ctx.reply("yeeefdfd" + result.id);
    });
});




bot.use((ctx, next) => {
    const start = new Date();
    return next(ctx).then(() => {
        const ms = new Date() - start;
        console.log('Response time %sms', ms);
    });
});



bot.on('text', (ctx) => ctx.reply('Hello World'));



// Si nos envia sticket, pulgar arriba
bot.on('sticker', (ctx) => ctx.reply('👍'));


//Empezar
bot.startPolling();








