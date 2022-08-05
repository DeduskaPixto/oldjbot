const fs = require('fs')
const { guildCommandsArray } = require('..')

module.exports.init = async (client) => {
  console.log("Хандлер команд запущен.")

  fs.readdirSync("./commands").filter(s => s.endsWith('.js') && !s.startsWith("_")).forEach(file => {
    const cmd = require(`../commands/${file}`)
    if(cmd.types.includes("SLASH_GLOBAL")) client.commandsArray.push(cmd.slash.toJSON())
    if(cmd.types.includes("SLASH")) client.guildCommandsArray.push(cmd.slash.toJSON())
    client.commands.set(cmd.name, cmd)
    console.log(`Команда ${cmd.name} загружена.`);
  })

  client.application.commands.set(client.commandsArray);
  client.guilds.cache.get(Config.server).commands.set(client.guildCommandsArray)
}
