// Incluyendo librería
const Telegraf = require('telegraf');
//Obteniendo configuraciones
const config = require('./config.json');

//CONEXION DATABASE

//incluyendo mysql	
let mysql = require('mysql');

//Configuracion mysql
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_geopadel'
});


//Metodo conectar bd
con.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});
//-----------------------------------------------------------




var consulta = function () {
    console.log("entre");
    con.query("SELECT * FROM users", function (err, result, fields) {
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
    
    

//    console.log("ctx", ctx);
//    console.log("********************");
//    console.log("ctx message ", ctx.message);

    const chatId = ctx.chat.id;
    console.log("Id usuario:", chatId);

    const chatNombre = ctx.chat.username;
    console.log("Nombre usuario:", chatNombre);


    var ret = [];
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err)
            throw err;

        Object.keys(result).forEach(function (key) {
            var row = result[key];
            console.log(row.nombre);
            ctx.reply("RESULTADO " + row.nombre);
        });
    });
});


// Crear Partida

bot.crear((ctx) => {
    // tens aquestes partides per jugar segur que vols crearne una ? ?????      
    //Data, lloc, nivell.
    
    
    

});




//Jugar








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








