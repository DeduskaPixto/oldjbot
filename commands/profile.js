const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "профиль";
const description = "Профиль пользователя";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["editDesc"],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addUserOption(option =>
      option.setName("user")
      .setDescription("Пользователь")
    ),

  async execute(client, command) {
    let user = {}

    if(command.content) {
       user = command.mentions.members.first() ?? command.member
    } else {
       user = command.options.getUser("user") ?? command.member
    }
    if(user.bot == true) {
      return command.reply({
        content: "Нельзя посмотреть профиль ботов!",
        ephemeral: true
      })
    }
    client.db.query("SELECT * FROM `users` WHERE `ID` = '"+user+"'", async function (error, results) {
      let timestamp;        
      if(results == null) {
        client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+command.member.id+"');")
        return command.reply({
          content: "Ошибка! Повторите попытку ещё раз!",
          ephemeral: true
        })
      }
      if (results[0]["voice"] != undefined) {
       timestamp = results[0]["voice"];
      }
      else {
       client.db.query("UPDATE `users` SET `voice` = 0 WHERE `users`.`ID` = '"+command.member.id+"';"), async function (error, results) {
        if(error) console.log(error)
        return command.reply({
          content: "Мы видим вас впервые! Повторите попытку ещё раз, чтобы бот загрузил информацию о вас!",
          ephemeral: true
        })
       }
      }
      let hours = Math.floor(timestamp / 60 / 60);
      let minutes = Math.floor(timestamp / 60) - (hours * 60);
      let seconds = timestamp % 60;
      var voice = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
      let roles = ""
      let rolesArray = results[0]["buyroles"]?.split(",")
      let description = results[0]["description"]
      if(description == null) {
        description = "Пустое описание"
      }
      if(rolesArray == null || rolesArray == "") {
        roles = "```Нет купленных ролей```"
      } else {
        roles = `<@&${rolesArray[0]}>`
        for (let i = 1; i < rolesArray.length; i++) {
          if(rolesArray[i] == undefined) break
          roles += `, <@&${rolesArray[i]}>`
        }
      }
      let username = user.username ?? user.user.username
      let msg = {
        embeds: [{
          color: Config.embeds.color,
          title: `Профиль ${username}`,
          description: `${description}`,
          thumbnail: {
            url: `${user.displayAvatarURL({dynamic: true})}`
          },
          fields: [
            {
              name: `> ${Config.shop.emoji} ОЛДЖи`,
              value: `\`${results[0]["cash"]}\``,
              inline: true
            },
            {
              name: "> Сообщения",
              value: `\`${results[0]["messages"]}\``,
              inline: true
            },
            {
              name: "> Войсы",
              value: `\`${voice}\``,
              inline: true
            },
            {
              name: "> Купленные роли",
              value: `${roles}`,
              inline: false
            }
          ]
        }],
        components: []
      }

      if(command.member.id == user.id) {
        msg.components.push(
            new MessageActionRow().addComponents(
              new MessageButton().setCustomId(`editDesc`).setLabel("Изменить описание").setStyle("PRIMARY")
            )
        )
      }

      command.reply(msg)

    })
  },

  componentListener(client, interaction) {
    if(interaction.customId == "editDesc") {
      let user = interaction.customId.split("_")[1]
      const modal = new Modal()
      .setCustomId('editDescModal')
      .setTitle('Изменить описание');
      const desc = new TextInputComponent()
      .setCustomId('description')
      .setLabel("Описание")
      .setPlaceholder("ОЛДЖ круче ФЫВА !!!")
      .setRequired(true)
      .setMaxLength(600)
      .setStyle('SHORT');
      const ActionRow = new MessageActionRow().addComponents(desc);
      modal.addComponents(ActionRow);
      interaction.showModal(modal);
    }
    if(interaction.customId == "editDescModal") {
      const description = interaction.fields.getTextInputValue('description')
      client.db.query("UPDATE `users` SET `description` = '"+description+"' WHERE `users`.`ID` = '"+interaction.member.id+"';"), async function (error, results) {
        if(error) console.log(error)
      }
      interaction.reply({
        content: "Описание изменено!",
        ephemeral: true
      })
    }
  },

}