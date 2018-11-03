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
    var ret = [];
    //consulta  buscar partides
//    let a = consulta(); // Buca les partides
//    let ab = consulta().toString(); // Buca les partides
//    console.log("a" + a);
//    console.log("b" + ab);
//    ctx.reply("sadassd");
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err)
            throw err;
        
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            console.log(row.nombre);
             ctx.reply("RESULTADO " + row.nombre);
        });


//        else {
//            for (var i of fields) {
////                console.log("dsdas" + i.id_alias);
////                console.log("ttt" + i[0].id_alias);
////                ret.push("Fields" + i);
//                console.log(i);
//            }
//            
//            console.log("*****");
//            for (var a of result) {
////                console.log("dsdas" + i.id_alias);
////                console.log("ttt" + i[0].id_alias);
////                ret.push("Fields" + i);
//                console.log(a);
//            }
//        }

//        console.log("resultado", result);
//        ctx.reply("yeeefdfd" + result.id);
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








