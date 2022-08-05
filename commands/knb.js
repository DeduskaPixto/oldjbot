const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "кнб";
const description = "Камень, Ножницы, Бумага";

module.exports = {
  name: name, // имя команды
  types: ["SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["stone_", "scissors_", "paper_"],
  slash: new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addUserOption(option =>
    option.setName("user")
    .setDescription("Пользователь для игры")
    .setRequired(true)
  )
  .addStringOption((option) => 
      option.setName("choice")
      .setRequired(true)
      .setDescription("Выберите предмет")
      .addChoices(
        {
            name: "Камень",
            value: "Камень"
        },
        {
            name: "Ножницы",
            value: "Ножницы"
        },
        {
            name: "Бумага",
            value: "Бумага"
        }
      )
  ),

  async execute(client, command) {
    let user = command.options.getUser("user")
    var item = command.options.getString("choice")
    var btn = {}

    if(user.id == command.member.id) return command.reply({
        content: "зоч с самим собой играешь ??",
        ephemeral: true
    })
    
    if(user.id == command.member.id) return command.reply({
        content: "зоч с самим собой играешь ??",
        ephemeral: true
    })
    
    //SELECT * FROM `knb` WHERE `ID` = '324535423254'
    //DELETE FROM `knb` WHERE `knb`.`ID` = '324535423254';
    //INSERT INTO `knb` (`ID`, `item`) VALUES ('324535423254', 'Камень');
    let messageId = ""
    let messageChannel = ""
    client.db.query("SELECT * FROM `knb` WHERE `ID` = '"+user+"'", function(error, results) {
        if(results[0] != undefined) return command.reply({
            content: "Прошлая игра не закончена!",
            ephemeral: true
        })
        command.channel.send({
            content: `<@${user.id}>`,
            embeds: [{
                title: `Игра "Камень, Ножницы, Бумага"`,
                description: `<@${command.member.id}> хочет сыграть с <@${user.id}> в игру\n\n*У вас есть 1 минута на действие.*`,
                color: Config.embeds.color
            }],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`stone_${user.id}_${command.member.id}`).setStyle("SECONDARY").setLabel("Камень").setEmoji("🪨"),
                    new MessageButton().setCustomId(`scissors_${user.id}_${command.member.id}`).setStyle("SECONDARY").setLabel("Ножницы").setEmoji("✂"),
                    new MessageButton().setCustomId(`paper_${user.id}_${command.member.id}`).setStyle("SECONDARY").setLabel("Бумага").setEmoji("📄")
                )
            ]
        }).then ((message) => {
            messageId = message.id
            messageChannel = message.channel.id
            btn = message
        })
        client.db.query("INSERT INTO `knb` (`ID`, `ID2`, `item`) VALUES ('"+user.id+"', '"+command.member.id+"', '"+item+"');", async function (error, results) { 
            if(error) console.log(error)
          })
        command.reply({
            content: "Игра отправлена!",
            ephemeral: true
        })
        setTimeout(() => {
            client.db.query("SELECT * FROM `knb` WHERE `ID` = '"+user.id+"'", function(error, results) {
                if(error) return console.log(error)
                if(results[0]) {
                    client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user.id+"';", function(error) {
                        if(error) return console.log(error)
                    })
                    btn.edit({
                        embeds: [{
                            title: `Игра "Камень, Ножницы, Бумага"`,
                            description: `<@${user.id}> проигнорил...`,
                            color: Config.embeds.color
                        }],
                        components: []
                    })
                }
            })
        }, 60000);
    })
  },

  componentListener(client, interaction) {
    if(interaction.customId.startsWith("stone_")) {
        let user1 = interaction.customId.split("_")[1]
        let user2 = interaction.customId.split("_")[2]
        if(user1 != interaction.member.id) return interaction.deferUpdate()
        client.db.query("SELECT * FROM `knb` WHERE `ID` = '"+user1+"'", function(error, results) {
            if(results[0] == undefined) return
            var item = results[0]["item"]
            if(item == "Камень") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `**Ничья**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Камень`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
            if(item == "Ножницы") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `<@${user1}> **победил**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Камень`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
            if(item == "Бумага") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `<@${user2}> **победил**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Камень`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
        })
    }
    if(interaction.customId.startsWith("scissors_")) {
        let user1 = interaction.customId.split("_")[1]
        let user2 = interaction.customId.split("_")[2]
        if(user1 != interaction.member.id) return interaction.deferUpdate()
        client.db.query("SELECT * FROM `knb` WHERE `ID` = '"+user1+"'", function(error, results) {
            if(results[0] == undefined) return
            var item = results[0]["item"]
            if(item == "Камень") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `<@${user2}> **победил**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Ножницы`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
            if(item == "Ножницы") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `**Ничья**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Ножницы`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
            if(item == "Бумага") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `<@${user1}> **победил**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Ножницы`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
        })
    }
    if(interaction.customId.startsWith("paper_")) {
        let user1 = interaction.customId.split("_")[1]
        let user2 = interaction.customId.split("_")[2]
        if(user1 != interaction.member.id) return interaction.deferUpdate()
        client.db.query("SELECT * FROM `knb` WHERE `ID` = '"+user1+"'", function(error, results) {
            if(results[0] == undefined) return
            var item = results[0]["item"]
            if(item == "Камень") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `<@${user1}> **победил**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Бумага`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
            if(item == "Ножницы") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `<@${user2}> **победил**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Бумага`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
            if(item == "Бумага") {
                interaction.update({
                    embeds: [{
                        title: `Игра "Камень, Ножницы, Бумага"`,
                        description: `**Ничья**`,
                        color: Config.embeds.color,
                        fields: [
                            {
                                name: `Бумага`,
                                value: `> <@${user1}>`,
                                inline: true
                            },
                            {
                                name: `${item}`,
                                value: `> <@${user2}>`,
                                inline: true
                            }
                        ]
                    }],
                    components: []
                })
                client.db.query("DELETE FROM `knb` WHERE `knb`.`ID` = '"+user1+"';")
            }
        })
    }
  }
}