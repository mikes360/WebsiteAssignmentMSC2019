const controller = require("./controller");

function startGame(app) {
    // this needs to be set from the database 
    // get the upcoming game and set a timer to go off when the games all start 

    //let game = await controller.getGame(app); 

    setTimeout(gameLogic, 1000 * 10, app);
}

async function gameLogic(app) {
    let users = await controller.getUsers(app);
    let game = await controller.getGame(app);

    // create random scores 
    console.log("gameLogic - Executed")

}

module.exports = { startGame };



