const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { componentListener } = require('./shop');

const name = "cmd";
const description = "Eval олдж";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["ADMINISTRATOR"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["buttonevents"],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option => 
      option.setName("code").setDescription("JS код").setRequired(true)
    ),

  async execute(client, command) {
    let code = ""
    if(command.content) {
        const message = command
        const prefix = Config.prefix
        const code = message.content.substring(prefix.length+message.command.length+1)
        try {
          eval(code)
        } catch (error) {
          command.reply({
            embeds: [{
                title: "Ошибка",
                color: Config.embeds.color,
                description: `\`\`\`${error}\`\`\``
            }],
            ephemeral: true
          })
        }
    } else {
        const interaction = command
        const code = interaction.options.getString(`code`)
        try {
          eval(code)
        } catch (error) {
          command.reply({
            embeds: [{
                title: "Ошибка",
                color: Config.embeds.color,
                description: `\`\`\`${error}\`\`\``
            }],
            ephemeral: true
          })
        }
    }
  },

  componentListener(client, interaction) {
    if(interaction.customId.startsWith("buttonevents")) {
      const role = interaction.customId.split("_")
      if(interaction.member.roles.cache.get(role[1])) {
          interaction.member.roles.remove(role[1])
          interaction.reply({
              content: `Снял с тебя роль <@&${role[1]}>`,
              ephemeral: true
          })
      } else {
          interaction.member.roles.add(role[1])
          interaction.reply({
              content: `Выдал тебе роль <@&${role[1]}>`,
              ephemeral: true
          })
      }
  }
  }
}
