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
            ctx.reply("Benvingut " + usuariActual.users_first_name + " a GeoPadel. Quin nivell tens? ( /avancat /intermig /principiant ) ");

        } else { // Per obligar l'usuari que es logeje

            usuariActual = data[0];

            //Oblga que no puga veure el menu si no pulsa l'inici
            if (usuariActual.users_levels_id === 0) {
                ctx.reply("Benvingut " + usuariActual.users_first_name + " a GeoPadel. Quin nivell tens? ( /avancat /intermig /principiant ) ");



            } else {
                var nom = ctx.message.from.first_name;
                console.log("Si que he trobat al usuari: ", nom);
                ctx.reply("Benvingut/da de nou, " + nom + ". Qué dessitges fer?\n\
/crearPartida (Crear una nova partida)\n\
/buscarPartida (Buscar una nova partida)\n\
/nivell (Canviar el teu nivell)\n\
/ajuda (Llistat d'ajuda)\n\
/parar (Finalitzar el bot)\n\
 /botones");
            }
        }
    });

//   bot.command(['botones'],(ctx) => ctx.telegram.sendMessage(
//                    ctx.from.id,
//                    'Ací tens totes les partides disponibles:',
//                    inlineMessageRatingKeyboard)
//        );
//
//        const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
//            Markup.callbackButton('Piles', 'Ppiles'),
//            Markup.callbackButton('Oliva', 'Ooliva')
//        ]).extra();
//
//        bot.action('Ppiles', (ctx) => ctx.editMessageText('🎉 Awesome! 🎉'))
//        bot.action('Ooliva', (ctx) => ctx.editMessageText('okey'))



    bot.command(['nivell'], ctx => {
        ctx.reply("Quin nivell tens? ( /avancat /intermig /principiant ) ");
    });


    bot.command(['principiant', 'intermig', 'avancat'], ctx => {
        usuariService.setLevelByID(ctx.from.id, ctx.message.text);


        // EMPALMAR LAVARIABLE QUE ELL ENS ENVIA
        usuariActual.users_levels_desc = ctx.message.text;



        ctx.reply("Nivell modificat correctament. Que dessitges fer ara?\n\
\n\
/crearPartida (Crear una nova partida)\n\
/buscarPartida (Buscar una nova partida)\n\
/nivell (Canviar el teu nivell)\n\
/ajuda (Llistat d'ajuda)\n\
/parar (Finalitzar el bot)");

    });
    bot.command('crearPartida', ctx => { //Crear una nova partida
        console.log("Vaig a crear una partida");
        usuariService.crearPartida(ctx);
    });
    bot.command('crearPista', ctx => { //Crear una nova partida
        console.log("Vaig a crear una pista");
        ctx.reply(" Inserte la descripcion de la pista: (/descripcionPista pista negra Piles)");
        console.log(ctx.message.text);
    });
    bot.command(['descripcionPista'], ctx => {
    });


    /**--------------BUSCAR PARTIDES--------------------**/
    bot.command(['buscarPartida'], ctx => {
        ctx.reply("Com dessitges buscar la partida:\n\
Per un dia: /partida dia-mes (Ex: /partida 13-10)\n\
Totes les partides: /totesPartides");


        bot.command(['partida'], ctx => {
            console.log("PAAAAAAAAARTIDA" + ctx.message.text);

            var fechaDividida = ctx.message.text.split(" ", 3);
            var diaymes = fechaDividida[1].split("-", 3);

            ctx.reply("Has elegit el dia: " + diaymes[0] + " del mes: " + diaymes[1]);
            console.log("dia: " + diaymes[0] + "mes: " + diaymes[1]);
        });


        bot.command(['totesPartides'], ctx => {

            partidesService.getPartides(usuariActual.users_levels_id).then(data => {
                var myData = [];
                for (var i = 0; i < data.length; i++) {
                    myData.push(Markup.callbackButton(data[i].partides_desc + " - " + data[i].partides_num_jugadors + " jugadors", "partida-" + data[i].partides_id)); // add at the end 
                    bot.action("partida-"+ data[i].partides_id, (ctx) => partidaSeleccionada(ctx, data));
                }
                ctx.telegram.sendMessage(
                        ctx.from.id,
                        'Ací tens totes les partides disponibles:',
                        Markup.inlineKeyboard(
                                [
                                    myData
                                ]
                                ).extra()
                        );
            });
        });

//        bot.action("partida-3", (ctx) => partidaSeleccionada(ctx));


        function partidaSeleccionada(ctx,data) {
//            console.log(data);
            ctx.editMessageText('Partida seleccionada! 🎉')
            console.log("quantes voltes entres bolsa?");
        }

//      

//        bot.command(['totesPartides'], ctx => {
//            ctx.reply("Ara et busque totes les partides");
//
//            partidesService.getPartides().then(data => {
//
//
//                var descripcio;
//                var numJugadors;
//
//
//                for (var i = 0; i < data.length; i++) {
////                    console.log("data", data[i]);
//                    descripcio = data[i].partides_desc;
//                    numJugadors = data[i].partides_num_jugadors;
//
//
//                }
//                bot.action('Ppiles', (ctx) => ctx.editMessageText('🎉 Awesome! 🎉'))
//                bot.action('Ooliva', (ctx) => ctx.editMessageText('okey'))
//
//            });
//
//            ctx.telegram.sendMessage(
//                    ctx.from.id,
//                    'Ací tens totes les partides disponibles:',
//                    inlineMessageRatingKeyboard);
//
//            const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
//                Markup.callbackButton('Piles', 'Ppiles'),
//                Markup.callbackButton('Oliva', 'Ooliva')
//            ]).extra();
//
//        });

        //BOTOOONS QUE FUNCIONEN BEEEEE

//        bot.command(['totesPartides'], (ctx) => ctx.telegram.sendMessage(
//                    ctx.from.id,
//                    'Ací tens totes les partides disponibles:',
//                    inlineMessageRatingKeyboard
//
//
//                    ));

//        const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
//            Markup.callbackButton('Piles', 'Ppiles'),
//            Markup.callbackButton('Oliva', 'Ooliva')
//        ]).extra();








//        bot.action('Ppiles', (ctx) => ctx.editMessageText('🎉 Awesome! 🎉'));
//        bot.action('Ooliva', (ctx) => ctx.editMessageText('okey'));

        // FINAAAAAAL BOTOOONS QUE FUNCIONEN BEEEEE


    }); // FINAL BUSCAR PARTIDES




    bot.command('ajuda', ctx => {
        console.log("Tew", usuariActual);

        var ex = usuariActual.users_first_name;

//        logMsg(ctx);
//        logOutMsg(ctx, helpMsg);
        ctx.reply("Yee ninot ", usuariActual.users_first_name);
        ctx.reply("Yee ninot +" + usuariActual.users_levels_desc);

    });


});//***------Final START-----------------------






















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

bot.startPolling();


module.exports = {

};
