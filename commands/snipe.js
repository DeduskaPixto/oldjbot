const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

// олдж
const name = "с";
const description = "Восстановить удалённое сообщение олдж";

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
    .addNumberOption(option => 
      option.setName("number").setDescription("Откат на * сообщений")
    ),

  async execute(client, command) {
    const snipes = client.snipes.get(command.channel.id)
    if(!snipes) return command.reply("Я не видел последнего удалённого сообщения.")

    let snipe = 0

    if(command.content) {
        snipe = +command.args[0] || 0
    } else {
        snipe = command.options.getNumber('number') ?? 0
    }

    if(snipe == 42) {
        return command.reply({
            files: [{
                attachment: "https://cdn.discordapp.com/attachments/939983826208313365/1000484173489897484/980150760660697098.png"
            }]
        })
    }

    if(snipe > snipes.length) return command.reply(`Я не видел удалённого сообщения с таким номером.`)
    if(!snipes[snipe]){
        return command.reply(`Я не видел удалённого сообщения с таким номером.`).catch(e => console.log(e))
    }

    const { msg, time, url, type } = snipes[snipe]
    msg.content = msg.content.replace(/[`]/gi, "");
    
    if(!url) {
        return command.reply({
            embeds: [{
                author: {
                    name: msg.author.tag,
                    icon_url: msg.author.avatarURL({dynamic: true})
                },
                description: msg.content,
                timestamp: time
            }]
        })
    } else {
        command.reply({
            embeds: [{
                author: {
                    name: msg.author.tag,
                    icon_url: msg.author.avatarURL({dynamic: true})
                },
                description: msg.content,
                timestamp: time
            }],
            files: [{
                attachment: url
            }]
        })
    }
  },

  componentListener(client, interaction) {
    // do nothing
  }
}
