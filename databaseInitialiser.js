const fs = require('fs'); 
const utils = require('util');
const controller = require('./controller');

const readFile = utils.promisify(fs.readFile);

async function setupDatabase(app) {

    const teamData = await readFile("./data/team.json", 'utf-8')
    await controller.initialiseCollection(app, controller.TEAM_COLLECTION, JSON.parse(teamData))

    const gameData = await readFile("./data/game.json", 'utf-8')
    await controller.initialiseCollection(app, controller.GAME_COLLECTION, JSON.parse(gameData))

    const userData = await readFile("./data/users.json", 'utf-8')
    await controller.initialiseCollection(app, controller.USERS_COLLECTION, JSON.parse(userData))
}

module.exports = {
	setupDatabase
};