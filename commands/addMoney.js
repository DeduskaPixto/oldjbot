const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "пополнить";
const description = "Пополнить счёт";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["ADMINISTRATOR"], // требуемые права для пользователя
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
      .setDescription("Размер пополнения")  
      .setRequired(true)
    ),

  async execute(client, command) {
    let user = ""
    let money = 0

    if(command.content) {
       user = command.mentions.members.first()
       money = command.content.replace(/[^0-9]/g,"")
    } else {
       user = command.options.getUser("user")
       money = command.options.getInteger("number")
    }

    client.db.query("SELECT * FROM `users` WHERE `ID` = '"+user+"'", async function (error, results) {
                  
      if(results == undefined) {
        client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+command.member.id+"');")
        return command.reply({
          content: "Ошибка! Повторите попытку ещё раз!",
          ephemeral: true
        })
      }
      var cash = results[0]["cash"]
      let cp = cash+money
      console.log(cp)
      client.db.query("UPDATE `users` SET `cash` = '"+cp+"' WHERE `users`.`ID` = '"+user+"';"), async function (error, results) {
          if(error) console.log(error)
      }
      return command.reply({
        embeds: [{
          title: "Пополнение",
          description: `Пополнено у <@${user.id}> на ${Config.shop.emoji} ${money}`,
          color: Config.embeds.color
        }],
        ephemeral: true
      })
    })
  },

  componentListener(client, interaction) {
    // do nothing
  }
}