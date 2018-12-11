const Telegraf = require('telegraf');
const {
    Extra,
    Markup
} = require('telegraf');
const dataService = require('./dataService');
// Service de l'usuari
const usuariService = require('./services/usuariService');
const partidesService = require('./services/partidesService');
//Service Partides
//const pistaService = require('./services/pistaService');





const config = require('./config');
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
const aboutMsg = "Este bot ha sigut creat per @onademar. Espere que siga de la vostra utilitat.";
var user = ["asd"];
var usuariActual;
// Final variables globals



//***------START-----------------------
bot.command('start', ctx => {
    usuariService.getUserByID(ctx.from.id).then(data => {
        if (data === null) { // No te cap nivell
            console.log("No he trobat a cap usuari, vaig a insertar-lo");
            //Insert 
            usuariService.saveUser(ctx.message);
//    
            usuariActual = [{
                    "users_id": ctx.message.from.id,
                    "users_first_name": ctx.message.from.first_name,
                    "users_last_name": ctx.message.from.last_name,
                    "users_username": ctx.message.from.username,
                    "users_levels_id": 0,
                    "users_levels_desc": 'No te nivell'
                }];
//            usuariActual = dadesUserActual[0];
            ctx.reply("Benvingut " + ctx.message.from.first_name + " a GeoPadel. Quin nivell tens? ( /avancat /intermig /principiant ) ");
        } else { // Per obligar l'usuari que es logeje

            usuariActual = data[0];
            //Oblga que no puga veure el menu si no pulsa l'inici
            if (usuariActual.users_levels_id === 0) {
                ctx.reply("Benvingut " + ctx.message.from.first_name + " a GeoPadel. Quin nivell tens? ( /avancat /intermig /principiant ) ");
            } else {
                var nom = ctx.message.from.first_name;
                console.log("Si que he trobat al usuari: ", nom);
                ctx.reply("Benvingut/da de nou, " + nom + ". Qué dessitges fer?\n\
/crearPartida (Crear una nova partida)\n\
/buscarPartida (Buscar una nova partida)\n\
/nivell (Canviar el teu nivell)\n\
/ajuda (Llistat d'ajuda)\n\
/parar (Finalitzar el bot)\n\
");
            }
        }
    });


    /* ===== NIVELLS =====  */
    bot.command(['nivell'], ctx => {
        ctx.reply("Quin nivell tens " + ctx.message.from.first_name + "? ( /avancat /intermig /principiant ) ");
    });


    bot.command(['principiant', 'intermig', 'avancat'], ctx => {
        usuariService.setLevelByID(ctx.from.id, ctx.message.text);
//        // EMPALMAR LAVARIABLE QUE ELL ENS ENVIA
//        usuariActual.users_levels_desc = ctx.message.text;
        ctx.reply("Nivell modificat correctament. Que dessitges fer ara?\n\
\n\
/crearPartida (Crear una nova partida)\n\
/buscarPartida (Buscar una nova partida)\n\
/nivell (Canviar el teu nivell)\n\
/ajuda (Llistat d'ajuda)\n\
/parar (Finalitzar el bot)");
    });

    /* ===== Crear Partida =====  */
    bot.command('crearPartida', ctx => { //Crear una nova partida
        console.log("Vaig a crear una partida");
        usuariService.crearPartida(ctx);
    });

    /* ===== Crear Pista =====  */
    bot.command('crearPista', ctx => { //Crear una nova partida
        console.log("Vaig a crear una pista");
        ctx.reply(" Inserte la descripcion de la pista: (/descripcionPista pista negra Piles)");
        console.log(ctx.message.text);
    });


    /* ===== Buscar Partida =====  */
    bot.command(['buscarPartida'], ctx => {

        ctx.reply("Com dessitges buscar la partida:\n\
Per un dia: /partida any-mes-dia (Ex: /partida 2018-10-13)\n\
Totes les partides: /totesPartides");

        /* ===== Buscar per dia i hora =====  */
        bot.command(['partida'], ctx => {
            console.log("PAAAAAAAAARTIDA" + ctx.message.text);
//            var fechaDividida = ctx.message.text.split(" ", 3);
//            var diaymes = fechaDividida[1].split("-", 3);
//            ctx.reply("Has elegit el dia: " + diaymes[0] + " del mes: " + diaymes[1]);
//            console.log("dia: " + diaymes[0] + "mes: " + diaymes[1]);

            var fechaCompleta = ctx.message.text;

//            console.log("FECHA", fechaCompleta.getDate(), fechaCompleta.getMonth() + 1, fechaCompleta.getFullYear());

            usuariService.getUserByID(ctx.from.id).then(data => {
                partidesService.getPartidesData(data[0].users_levels_id, fechaCompleta).then(data => {

                    if (data.length === 0) { // No tens cap partida amb el teu nivell 
                        ctx.reply("No he trobat cap partida per poder jugar, si vols pots crear una partida:  /crearPartida");
                    } else {
                        var myData = [];
                        for (var i = 0; i < data.length; i++) {
                            var lista = [];
                            var dataArray = [];
                            lista.push(Markup.callbackButton(data[i].partides_desc + " - " + data[i].partides_num_jugadors + " jugadors \n", "partida-" + data[i].partides_id)); // add at the end 
                            myData.push(lista);
                        }

                        ctx.telegram.sendMessage(
                                ctx.from.id,
                                'Ací tens totes les partides disponibles:',
                                Markup.inlineKeyboard(
                                        myData
                                        ).extra()
                                );
                    }

                });
            });




        });

        /* ===== Buscar totes les partides =====  */
        bot.command(['totesPartides'], ctx => {
            usuariService.getUserByID(ctx.from.id).then(data => {

                //Si ho poses recorda comprovar que la data[0] no siga null per que aixo voldra dir que eixe usuari no apretat el starte i  ademes comprova tambe que el data[0].level_id es diferent que 0 si nos voldra dir que eixe usuari esta donat d'alta pero no a selecionat el nivell

                partidesService.getPartides(data[0].users_levels_id).then(data => {
                    if (data.length === 0) { // No tens cap partida amb el teu nivell 
                        ctx.reply("No he trobat cap partida per poder jugar, si vols pots crear una partida:  /crearPartida");
                    } else {

                        var myData = [];
                        for (var i = 0; i < data.length; i++) {
                            var lista = [];
                            var dataArray = [];
                            lista.push(Markup.callbackButton(data[i].partides_desc + " - " + data[i].partides_num_jugadors + " jugadors \n", "partida-" + data[i].partides_id)); // add at the end 
                            myData.push(lista);
                        }

                        ctx.telegram.sendMessage(
                                ctx.from.id,
                                'Ací tens totes les partides disponibles:',
                                Markup.inlineKeyboard(
                                        myData
                                        ).extra()
                                );
                    }
                });
            });
        });
    }); // FINAL BUSCAR PARTIDES




    bot.command('ajuda', ctx => {

        ctx.reply("Ajuda \n\
/crearPartida (Crear una nova partida)\n\
/buscarPartida (Buscar una nova partida)\n\
/nivell (Canviar el teu nivell)\n\
/parar (Finalitzar el bot)\n\
");

    });
}); //***------Final START-----------------------


bot.action(/partida+/, (ctx, next) => {
//    return ctx.reply(ctx.callbackQuery.data);
    partidaSeleccionada(ctx, ctx.callbackQuery.data);
});



function partidaSeleccionada(ctx, data) {
    var codiPartida = data.split("-", 3);
    console.log("EL codi de la partida" + codiPartida);




    partidesService.getPartidaID(codiPartida[1]).then(data => {
        console.log("DATA GENT PARTIDA ID", data);
        var descripcionPartida = data.partides_desc;
        var numJugadors = data.partides_num_jugadors;
        var fechaPartida = data.partides_data;


        var nuevaFecha = new Date(data.partides_data);

        var diaComplet = "" + nuevaFecha.getDate() + "-" + (nuevaFecha.getMonth() + 1) + "-" + nuevaFecha.getFullYear();

        var horaCompleta = "" + nuevaFecha.getHours() + ":" + nuevaFecha.getMinutes() + "";





        // Comprove que l'usuari no existeix en eixa partida
        // partidesUsuaris tindre que fer un select amb l'id del usuari i la partida
        partidesService.getPartidaUsuarisBYUsuariPartida(ctx.from.id, codiPartida[1]).then(data => {

            if (data === null) { // No estas en eixa partida aixi que vaig afegirte
                partidesService.updatePartida(codiPartida[1], numJugadors); //Actualitza en la taula partida i suma un jugador         
                partidesService.afegirPartidesUsers(codiPartida[1], ctx.from.id); //Afegisc l'usuari i la partida en la taula usuarisPartides
                ctx.editMessageText('Partida seleccionada! 🎉 \n\
            \n\
Descripció de la partida: ' + descripcionPartida + "\n\
Nº Usuaris: " + numJugadors + "\n\
Dia: " + diaComplet + "\n\
Hora: " + horaCompleta);



            } else {
                ctx.editMessageText("No el pots donar d'alta en la partida " + descripcionPartida + ", ja que t'has dona d'alta anteriorment.");
                ctx.reply("Que dessitges fer ara?\n\
/crearPartida (Crear una nova partida)\n\
/buscarPartida (Buscar una nova partida)\n\
/nivell (Canviar el teu nivell)\n\
/ajuda (Llistat d'ajuda)\n\
/parar (Finalitzar el bot)");
            }

        });
    });





}



















bot.command('parar', ctx => { // Finalitzar el bot
//    logMsg(ctx);
    var missatgeParar = "Fins prompte, " + ctx.chat.first_name + ".";
    logOutMsg(ctx, missatgeParar);
    ctx.reply(missatgeParar);
});
bot.command('about', ctx => {
    logMsg(ctx);
    logOutMsg(ctx, aboutMsg);
    ctx.reply(aboutMsg);
});
function logMsg(ctx) {
    var from = userString(ctx);
    console.log('<', ctx.message.text, from)
}

function logOutMsg(ctx, text) {
    console.log('>', {
        id: ctx.chat.id
    }, text);
}


bot.command('inline', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Cokejjjjjjjj', 'Coke'),
            m.callbackButton('Pepkkkkkkkkkkkkksi', 'Pepsi')
        ])))
})

bot.command('simple', (ctx) => {
    return ctx.replyWithHTML('<b>Cokeeeeeeeeeeeeeeee</b> or <i>Pepsieeeeeeeeeeeeeee?</i>', Extra.markup(
            Markup.keyboard(['Coiiiiiiiiiiiiiiiiscfuygfgjhjghjhgfjghfjjjjjjjjjjjjjjdajjjjiiiiiiiiike', 'Pehhhhhhhhhhhhhhhgggggggggggggggggggggggggghhhhhhhhhpsi', 'sadasdadsdasdsa', 'adsdsaads'])
            ))
})

bot.startPolling();
module.exports = {

};





//
//function updateUsuariActual(ctx) {
//    usuariService.getUserByID(ctx.from.id).then(data => {
//        usuariActual = data[0];
//    });











// Cada vegada que necesites saber el id del nivell del usuari hi ha que copiar aquest codi

/*
 usuariService.getUserByID(ctx.from.id).then(data => {
 if (data === null) { // No te cap nivell
 console.log("No he trobat a cap usuari, vaig a insertar-lo");
 //Insert 
 usuariService.saveUser(ctx.message);
 usuariActual = [{
 "users_id": ctx.message.from.id,
 "users_first_name": ctx.message.from.first_name,
 "users_last_name": ctx.message.from.last_name,
 "users_username": ctx.message.from.username,
 "users_levels_id": 0,
 "users_levels_desc": 'No te nivell'
 }];
 ctx.reply("Benvingut " + ctx.message.from.first_name + " a GeoPadel. Quin nivell tens? ( /avancat /intermig /principiant ) ");
 } else { // Per obligar l'usuari que es logeje
 usuariActual = data[0];
 }
 });
 
 */



