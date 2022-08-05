const { Client, Collection } = require("discord.js");

const client = new Client({
  intents: 32767
});
require("dotenv").config()

client.commands = new Collection();
client.commandsArray = [];
client.guildCommandsArray = [];
client.snipes = new Collection()
client.voices = new Collection()
global.Config = require('./jsons/config.json')

var mysql = require('mysql');
client.db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.USER,
    password: process.env.PASSWORD
});

client.db.query("set session wait_timeout=28800;", function(error) {
  if(error) return console.log(error)
})

require('./handlers/events.js').init(client);
client.login(process.env.TOKEN);

client.on('error', console.log);
client.on('warn', console.log);
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

module.exports = client;