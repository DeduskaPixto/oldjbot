const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "перевести";
const description = "Перевести олдж";

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
    .setDescription(description)
    .addUserOption(option =>
      option.setName("user")
      .setDescription("Пользователь")
      .setRequired(true)
    )
    .addIntegerOption(option => 
      option.setName("number")
      .setDescription("Размер перевода")  
      .setRequired(true)
    ),

  async execute(client, command) {
    let user = ""
    var moneyUser1 = 0
    var moneyUser2 = 0
    var money = 0

    if(command.content) {
       user = command.mentions.members.first()
       money = command.content.replace(/[^0-9]/g,"")
    } else {
       user = command.options.getUser("user")
       money = command.options.getInteger("number")
    }

    if(Math.sign(money) == -1) {
      return command.reply({
        embeds: [{
          color: Config.embeds.color,
          description: `А ты хитрый олдж`
        }],
        ephemeral: true
      })
    }

    if(user.id == command.member.id) {
      return command.reply({
        embeds: [{
          color: Config.embeds.color,
          description: `Зачем самому себе переводишь олдж?`
        }]
      })
    }
    
    if(user.bot == true) {
      return command.reply({
        embeds: [{
          color: Config.embeds.color,
          description: `Боту не нужны ОЛДЖи`
        }],
        ephemeral: true
      })
    }

    client.db.query("SELECT * FROM `users` WHERE `ID` = '"+command.member.id+"'", async function (error, results) {
      if(error) return console.log(error)        
      if(results == undefined) {
        client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+command.member.id+"');", async function (error, results) { 
          if(error) console.log(error)
        })
          client.db.query("SELECT * FROM `users` WHERE `ID` = '"+command.member.id+"'", async function (error, results) {   
            moneyUser1 = results["cash"];
          })
      } else {
        moneyUser1 = results[0]["cash"];
        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+user.id+"'", async function (error, results) {                  
          if(results == undefined) {
            client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+user.id+"');")
              client.db.query("SELECT * FROM `users` WHERE `ID` = '"+user.id+"'", async function (error, results) {   
                moneyUser2 = results["cash"];
              })
          } else {
            moneyUser2 = results[0]["cash"];
          }
        })
        moneyUser1 = moneyUser1-money;
        moneyUser2 = moneyUser1+money;
    
        if(moneyUser1 < 0) {
          return command.reply({
            embeds: [{
              color: Config.embeds.color,
              description: `Недоступная сумма олдж`
            }],
            ephemeral: true
          })
        }
    
        client.db.query("UPDATE `users` SET `cash` = '"+moneyUser1+"' WHERE `users`.`ID` = '"+command.member.id+"';"), async function (error, results) {
          if(error) console.log(error)
        }
        client.db.query("UPDATE `users` SET `cash` = '"+moneyUser2+"' WHERE `users`.`ID` = '"+user.id+"';"), async function (error, results) {
          if(error) console.log(error)
        }
    
        command.reply({
          embeds: [{
            color: Config.embeds.color,
            title: "Перевод",
            description: `Перевод с <@${command.member.id}> на <@${user.id}> олдж\n\nСумма — ${Config.shop.emoji} ${money}`
          }]
        })
      }
    })
  },

  componentListener(client, interaction) {
    // do nothing
  }
}