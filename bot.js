const Telegraf = require('telegraf');
const {
    Extra,
    Markup
} = require('telegraf');

const config = require('./config');
const dataService = require('./dataService');
// Service de l'usuari
const usuariService = require('./services/usuariService');



const bot = new Telegraf(config.botToken);

const helpMsg = `Ajuda:
/start - Inici del bot
/user - Informació usuari
/setuser - Modificar informació del usuari
/partides - Numero de partides creades que hi han
/crear - Crear una nova partida
/parar - Finalitzar el bot`;

const inputErrMsg = `💥 BOOM... 🔩☠🔧🔨⚡️
Hm, that wasn't supposed to happen. You didn't input invalid characters, did you?
The usage for this command is \"/set x\", where x is a number.
At the moment, I can only count integers, if you want to add your own number system, please feel free to do so. Just click here: /about `;

const incNMsg = `To use multiple counters, simply put the number of the counter you want to increase directly after the command like so:
/inc1 <- this will increment counter 1
/inc  <- this will increment the default counter (0)
This does also work with other commands like /dec1 /reset1 /set1 /get1`;


const esteve = `MANOLO`;

const aboutMsg = "Este bot ha sigut creat per @onademar. Espere que siga de la vostra utilitat.";

var user = ["asd"];

function getRegExp(command) {
    return new RegExp("/" + command + "[0-9]*\\b");
}

//get username for group command handling
bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
    console.log("Initialized", botInfo.username);
});

dataService.loadUsers();

function userString(ctx) {
    return JSON.stringify(ctx.from.id == ctx.chat.id ? ctx.from : {
        from: ctx.from,
        chat: ctx.chat
    });
}

function logMsg(ctx) {
    var from = userString(ctx);
    console.log('<', ctx.message.text, from)
}

function logOutMsg(ctx, text) {
    console.log('>', {
        id: ctx.chat.id
    }, text);
}

bot.command('broadcast', ctx => {
    if (ctx.from.id == config.adminChatId) {
        var words = ctx.message.text.split(' ');
        words.shift(); //remove first word (which ist "/broadcast")
        if (words.length == 0) //don't send empty message
            return;
        var broadcastMessage = words.join(' ');
        var userList = dataService.getUserList();
        console.log("Sending broadcast message to", userList.length, "users:  ", broadcastMessage);
        userList.forEach(userId => {
            console.log(">", {id: userId}, broadcastMessage);
            ctx.telegram.sendMessage(userId, broadcastMessage);
        });
    }
});

//bot.command('start', ctx => {
//    logMsg(ctx);
//    dataService.registerUser(ctx);
//    dataService.setCounter(ctx.chat.id, '0', 0);
//    
//    //Si el usuari no ha iniciat mai el bot:
//    
//    
//    //Si l'usuari ja ha iniciat el bot alguna vegada:
//    
//    var m = "Hola "+ ctx.chat.first_name+"! Que dessitges fer?\n\/crear (Crear una nova partida)\n\/partides (Veure les partides disponibles)\n\/ajuda\n\/parar";
//    ctx.reply(m);
//    
//    
//    logOutMsg(ctx, m);
//    setTimeout(() => {
////        ctx.reply(0);
//        logOutMsg(ctx, 0)
//    }, 50); //workaround to send this message definitely as second message
//});


//bot.command('getall', ctx => {
//    logMsg(ctx);
//    counters = dataService.getAllCounters(ctx.chat.id);
//    msg = "";
//    Object.keys(counters).forEach(counterId => {
//        msg += '[' + counterId + '] ' + counters[counterId].value + "\n";
//    });
//    logOutMsg(ctx, msg);
//    ctx.reply(msg);
//});





bot.command(['principiant', 'intermig', 'avancat'], ctx => {
    console.log("yee");
    ctx.reply("yeeeee");
    
    usuariService.setLevelByID(ctx.from.id);
    
     
    
    // Sempre que entra aci actualitzar del  i damunt de tot aso ho tindras ja implementat per si un usuari vol modificar un nivell .
    // buscar l'usuari despres guardar l'usuari en la base de dades 
});



bot.command('start', ctx => {
    
    
    
    
    
    usuariService.getUserByID(ctx.from.id).then(data => {
//        console.log("DAta" + data);
        if (data === null) { // Vol dir que no hi ha cap usuari
            // Jo no 
        
            console.log("No he trobat");
            
            //Insert 
            
            usuariService.saveUser(ctx.message);
            
            ctx.reply("Quin nivell eres? /avancat /intermig /principiant ");
            console.log("JWJWJWJWJJWJWJW");


        } else {
            var nom = data[0].users_first_name;
            console.log("SI que he trobat ", nom);

            ctx.reply("Benvingutss: " + nom + "\crearPartida " + " VOls modificar el teu nivell " );
        }
//        ctx.reply("Benvingut", nom);
    });



//    console.log("USUARI", a);
//
//    console.log("CONSOLE:LOG", a);
//    ctx.reply("TELEGRAM", a);


//     esteve  = usuariService.getUserByID(ctx.from.id); 
//        
//        console.log("adEEE" + "AU");

//    aa = usuariService.getUser(ctx.from.id);
//
//
//
////
    setTimeout(function () {

//        console.log(a);
//        console.log("aaaaa", a.PromiseValue[0].users_first_name);
//        console.log("telegram", a[0].users_first_name);
//        ctx.reply("telegram", a);
//        ctx.reply("telegram", a[0].users_first_name);

    }, 3000);


//    usuariService.getUser(ctx.from.id).then(function (env) {cacasa
//        console.log("333333333333333");
//    });



//    console.log("Aquest es l''usuari que acaba d'introduir /Start" + usuariService.getUser(ctx.from.id));
});

















bot.command('parar', ctx => { // Finalitzar el bot
    logMsg(ctx);
    var missatgeParar = "Fins prompte, " + ctx.chat.first_name + ".";
    logOutMsg(ctx, missatgeParar);
    ctx.reply(missatgeParar);
});

bot.command(['incx', 'decx', 'getx', 'setx', 'resetx'], ctx => {
    logMsg(ctx);
    logOutMsg(ctx, incNMsg);
    ctx.reply(incNMsg);
});

bot.command('ajuda', ctx => {
    logMsg(ctx);
    logOutMsg(ctx, helpMsg);
    ctx.reply(helpMsg);
});

bot.command('about', ctx => {
    logMsg(ctx);
    logOutMsg(ctx, aboutMsg);
    ctx.reply(aboutMsg);
});

//bot.command('getall', ctx => {
//    logMsg(ctx);
//    counters = dataService.getAllCounters(ctx.chat.id);
//    msg = "";
//    Object.keys(counters).forEach(counterId => {
//        msg += '[' + counterId + '] ' + counters[counterId].value + "\n";
//    });
//    logOutMsg(ctx, msg);
//    ctx.reply(msg);
//});

bot.hears(getRegExp('inc'), ctx => {
    logMsg(ctx);
    currentCommand = 'inc';
    var m = ctx.message.text.match(getRegExp(currentCommand))[0]; //filter command
    var counterId = m.substring(m.indexOf(currentCommand) + currentCommand.length) || 0; //get id of command, return 0 if not found

    var delta = 1;
    params = ctx.message.text.split(" ");
    if (params.length == 2 && !isNaN(params[1])) {
        delta = Math.floor(params[1]);
    }

    var val = +dataService.getCounter(ctx.chat.id, counterId);
    val += delta;
    dataService.setCounter(ctx.chat.id, counterId, val);

    var printCounterId = counterId ? "[" + counterId + "] " : "";
    val = printCounterId + val;
    logOutMsg(ctx, val);
    ctx.reply(val);
});

bot.hears(getRegExp('dec'), ctx => {
    logMsg(ctx);
    currentCommand = 'dec';
    var m = ctx.message.text.match(getRegExp(currentCommand))[0]; //filter command
    var counterId = m.substring(m.indexOf(currentCommand) + currentCommand.length) || 0; //get id of command, return 0 if not found

    var delta = 1;
    params = ctx.message.text.split(" ");
    if (params.length == 2 && !isNaN(params[1])) {
        delta = Math.floor(params[1]);
    }

    var val = +dataService.getCounter(ctx.chat.id, counterId);
    val -= delta;
    dataService.setCounter(ctx.chat.id, counterId, val);

    var printCounterId = counterId ? "[" + counterId + "] " : "";
    val = printCounterId + val;
    logOutMsg(ctx, val);
    ctx.reply(val);
});

bot.hears(getRegExp('reset'), ctx => {
    logMsg(ctx);
    currentCommand = 'reset';
    var m = ctx.message.text.match(getRegExp(currentCommand))[0]; //filter command
    var counterId = m.substring(m.indexOf(currentCommand) + currentCommand.length) || 0; //get id of command, return 0 if not found

    var val = 0;
    dataService.setCounter(ctx.chat.id, counterId, val);

    var printCounterId = counterId ? "[" + counterId + "] " : "";
    val = printCounterId + val;
    logOutMsg(ctx, val);
    ctx.reply(val);
});

bot.hears(getRegExp('get'), ctx => {
    logMsg(ctx);
    currentCommand = 'get';
    var m = ctx.message.text.match(getRegExp(currentCommand))[0]; //filter command
    var counterId = m.substring(m.indexOf(currentCommand) + currentCommand.length) || 0; //get id of command, return 0 if not found

    var val = +dataService.getCounter(ctx.chat.id, counterId);

    var printCounterId = counterId ? "[" + counterId + "] " : "";
    val = printCounterId + val;
    logOutMsg(ctx, val);
    ctx.reply(val);
});

bot.hears(getRegExp('set'), ctx => {
    logMsg(ctx);
    currentCommand = 'set';
    var m = ctx.message.text.match(getRegExp(currentCommand))[0]; //filter command
    var counterId = m.substring(m.indexOf(currentCommand) + currentCommand.length) || 0; //get id of command, return 0 if not found

    params = ctx.message.text.split(" ");
    if (params.length == 2 && !isNaN(params[1])) {
        var val = Math.floor(params[1]);
        dataService.setCounter(ctx.chat.id, counterId, val);
        var printCounterId = counterId ? "[" + counterId + "] " : "";
        val = printCounterId + val;
    } else {
        val = inputErrMsg;
    }

    logOutMsg(ctx, val);
    ctx.reply(val);
});


bot.startPolling();


module.exports = {

};
