const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "работать";
const description = "Задержка бота олдж";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: [""],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description),

  async execute(client, command) {
    let random = Math.floor(Math.random() * 10);
    let cashrandom = Math.floor(Math.random() * 25 + 1);
    client.db.query("SELECT * FROM `users` WHERE `ID` = '"+command.member.id+"'", async function (error, results) {   
      if(error) return console.log(error)
        if(results == undefined) {
            client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+command.member.id+"');")
            return command.reply({
              content: "Ошибка! Повторите попытку ещё раз!",
              ephemeral: true
            })
        }
        var lastwork = Number(results[0]["lastwork"])
        var newDate = Math.floor(Date.now()/1000)
        if(!lastwork) lastwork = 301
        var ln = newDate-lastwork
        console.log(ln)
        if(ln >= 300) {
            if(random <= 8) {
                client.db.query("SELECT * FROM `users` WHERE `ID` = '"+command.member.id+"'", async function (error, results) {     
                    if(results == null) {
                      client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+command.member.id+"');")
                      return command.reply({
                        content: "Ошибка! Повторите попытку ещё раз!",
                        ephemeral: true
                      })
                    }
                    let cashdb = results[0]["cash"]
                    let cash = cashrandom+cashdb
                    client.db.query("UPDATE `users` SET `cash` = '"+cash+"' WHERE `users`.`ID` = '"+command.member.id+"';"), async function (error, results) {
                        if(error) console.log(error)
                    }
                    client.db.query("UPDATE `users` SET `lastwork` = '"+newDate+"' WHERE `users`.`ID` = '"+command.member.id+"';"), async function (error, results) {
                        if(error) console.log(error)
                    }
                    return command.reply({
                        embeds: [{
                            color: Config.embeds.color,
                            title: "Работа на ОЛДЖа",
                            description: `Урооо олдж восстановился на ${Config.shop.emoji} ${cashrandom}`
                        }]
                    })
                })
            } else {
                client.db.query("UPDATE `users` SET `lastwork` = '"+newDate+"' WHERE `users`.`ID` = '"+command.member.id+"';"), async function (error, results) {
                    if(error) console.log(error)
                }
                return command.reply({
                    embeds: [{
                        color: Config.embeds.color,
                        title: "Работа на ОЛДЖа",
                        description: `Ыы обвалился олдж плачем`
                    }]
                })
            }
        } else {
            let minutes = Math.floor(5-(ln/60));
            let seconds = Math.floor(60 - ln % 60);
            var time = [
              minutes.toString().padStart(2, '0'),
              seconds.toString().padStart(2, '0')
            ].join(':');
            return command.reply({
                embeds: [{
                    color: Config.embeds.color,
                    title: "ОЛДЖ отдыхает",
                    description: `Подожди ещё \`${time}\` олдж`
                }]
            })
        }
    })
  },

  componentListener(client, interaction) {
    // do nothing
  }
}