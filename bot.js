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
         ctx.reply("Vas a crear una nova partida, per a fer-ho has de fer-ho de la següent manera:\n\
 \n\
 /novaPartida *Descripcio partida *data i hora\n\
\n\
Exemple:\n\
\n\
/novaPartida *Partida Gandia *2018-12-5 17:30");
        
         
          bot.command(['novaPartida'], ctx => {
              usuariService.getUserByID(ctx.from.id).then(data => {
                console.log("dins de nova partida i l'usuari ha dit:", ctx.message.text); 
                
               
                var nivellUsuari = data[0].users_levels_id;
                
                var contestacioUsuari= ctx.message.text;
                var tallarContestacio = contestacioUsuari.split("*");
                
                var descripcioPartida = tallarContestacio[1];
                var dataPartida = tallarContestacio[2];
                
                console.log("Descripcio partida: ", descripcioPartida, " data: " , dataPartida);
                
                
                partidesService.crearPartida(descripcioPartida, dataPartida, nivellUsuari).then(data => {
                    
                });
                
            });
             
          });

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
            var fechaCompleta = ctx.message.text;

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
    partidaSeleccionada(ctx, ctx.callbackQuery.data);
});



function partidaSeleccionada(ctx, data) {
    var codiPartida = data.split("-", 3);


    partidesService.getPartidaID(codiPartida[1]).then(data => {
        var descripcionPartida = data.partides_desc;
        var numJugadors = data.partides_num_jugadors;
        var fechaPartida = data.partides_data;

       
        
        
        var nuevaFecha = new Date(data.partides_data);
        var diaComplet = "" + nuevaFecha.getDate() + "-" + (nuevaFecha.getMonth() + 1) + "-" + nuevaFecha.getFullYear();
        var horaCompleta = "" + nuevaFecha.getHours() + ":" + nuevaFecha.getMinutes() + ":" + nuevaFecha.getSeconds();




        // Comprove que l'usuari no existeix en eixa partida
        // partidesUsuaris tindre que fer un select amb l'id del usuari i la partida
        partidesService.getPartidaUsuarisBYUsuariPartida(ctx.from.id, codiPartida[1]).then(data => {

            if (data === null) { // No estas en eixa partida aixi que vaig afegirte
                partidesService.updatePartida(codiPartida[1], numJugadors); //Actualitza en la taula partida i suma un jugador         
                partidesService.afegirPartidesUsers(codiPartida[1], ctx.from.id); //Afegisc l'usuari i la partida en la taula usuarisPartides
               var actualitzarNumusers = numJugadors + 1;
                ctx.editMessageText('Partida seleccionada! 🎉 \n\
            \n\
Descripció de la partida: ' + descripcionPartida + "\n\
Nº Usuaris: " + actualitzarNumusers + "\n\
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





//bot.command('parar', ctx => { // Finalitzar el bot
//    var missatgeParar = "Fins prompte, " + ctx.chat.first_name + ".";
//    logOutMsg(ctx, missatgeParar);
//    ctx.reply(missatgeParar);
//});


//bot.command('about', ctx => {
//    logMsg(ctx);
//    logOutMsg(ctx, aboutMsg);
//    ctx.reply(aboutMsg);
//});




bot.startPolling();
module.exports = {

};
