const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "продать";
const description = "Продать роль";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["sellrole", "sell_", "shopbutton_"],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description),

  async execute(client, command) {
    if(command.content) {
        return command.reply({
            content: "Продажа ролей",
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`shopbutton_${command.member.id}`).setLabel("Открыть список").setStyle("PRIMARY")
                )
            ]
        })
    } 
    client.db.query("SELECT * FROM `users` WHERE `ID` = '"+command.member.id+"'", async function (error, results) {     
        if(results[0] == undefined) {
            client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+command.member.id+"');")
            return command.reply({
              content: "У вас нет купленных ролей",
              ephemeral: true
            })
        }
        let rolesArray = results[0]["buyroles"]?.split(",")
        let shopSelectMenu = [];
        if(!rolesArray || rolesArray == "") return command.reply({
            embeds: [{
                color: Config.embeds.color,
                description: "У вас нету купленных ролей"
            }],
            ephemeral: true
        })

        for (let i = 0; rolesArray.length && i < 24; i++) {
            if(results[i] == undefined) break
            let namerole = command.guild.roles.cache.get(rolesArray[i]).name
            shopSelectMenu.push({
                label: namerole,
			    value: `${rolesArray[i]}`,
            })
        }
        if(rolesArray.length == 0) {
            return command.reply({
                embeds: [{
                    color: Config.embeds.color,
                    description: "У вас нету купленных ролей"
                }]
            })
        }
        var row = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu().setCustomId('sellrole').setPlaceholder("Ничего не выбрано").addOptions(shopSelectMenu)
            )
        ]
        command.reply({
            embeds: [{
                title: "Ваши купленные роли",
                color: Config.embeds.color
            }],
            components: row,
            ephemeral: true
        })

    })
  },

  componentListener(client, interaction) {
    if(interaction.customId.startsWith("shopbutton_")) {
        let user = interaction.customId.split("_")[1]
        if(user == interaction.member.id) {
            client.db.query("SELECT * FROM `users` WHERE `ID` = '"+interaction.member.id+"'", async function (error, results) {     
                if(results[0] == undefined) {
                    client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+interaction.member.id+"');")
                    return interaction.reply({
                      content: "У вас нет купленных ролей",
                      ephemeral: true
                    })
                }
                let rolesArray = results[0]["buyroles"]?.split(",")
                let shopSelectMenu = [];
                if(!rolesArray || rolesArray == "") return interaction.reply({
                    embeds: [{
                        color: Config.embeds.color,
                        description: "У вас нету купленных ролей"
                    }],
                    ephemeral: true
                })
        
                for (let i = 0; rolesArray.length && i < 24; i++) {
                    if(results[i] == undefined) break
                    let namerole = interaction.guild.roles.cache.get(rolesArray[i]).name
                    shopSelectMenu.push({
                        label: namerole,
                        value: `${rolesArray[i]}`,
                    })
                }
                if(rolesArray.length == 0) {
                    return interaction.reply({
                        embeds: [{
                            color: Config.embeds.color,
                            description: "У вас нету купленных ролей"
                        }]
                    })
                }
                var row = [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu().setCustomId('sellrole').setPlaceholder("Ничего не выбрано").addOptions(shopSelectMenu)
                    )
                ]
                interaction.reply({
                    embeds: [{
                        title: "Ваши купленные роли",
                        color: Config.embeds.color
                    }],
                    components: row,
                    ephemeral: true
                })
        
            })
        } else {
            interaction.deferUpdate()
        }
    }
    if(interaction.customId == "sellrole") {
        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+interaction.member.id+"'", async function (error, results) {
            if(error) return console.log(error)
            if(results[0] == undefined) {
                client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+interaction.member.id+"');")
            }
        })

        client.db.query("SELECT * FROM `shop` WHERE `ID` = '"+interaction.values[0]+"'", async function (error, results) {
            if(error) return console.log(error)
            interaction.update({
                embeds: [{
                    title: `${results[0]["name"]}`,
                    description: `${results[0]["description"]}`,
                    fields: [{
                        name: "Цена",
                        value: `${Config.shop.emoji} ${results[0]["price"]}`
                    }],
                    color: Config.embeds.color
                }],
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setCustomId(`sell_${interaction.values[0]}`).setLabel("Продать").setStyle("PRIMARY")
                    )
                ]
            })
        })
    }
    if(interaction.customId.startsWith("sell_")) {
        var role = interaction.customId.split("_")
        role = role[1]

        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+interaction.member.id+"'", async function (error, results) {
            if(error) return console.log(error)
            
            if(results[0] == undefined) {
                client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+interaction.member.id+"');")
                return interaction.reply("Ошибка! Повторите попытку ещё раз!")
            }
            
            var cash = results[0]["cash"]
            var br = results[0]["buyroles"]

            client.db.query("SELECT * FROM `shop` WHERE `ID` = '"+role+"'", async function (error, results) {
                var price = results[0]["price"]
                var cp = cash+price

                br = br.replace(`${role}`, "")
                br = br.replace(`,${role}`, "")
                br = br.replace(`${role},`, "")

                client.db.query("UPDATE `users` SET `buyroles` = '"+br+"' WHERE `users`.`ID` = '"+interaction.member.id+"';"), async function (error, results) {
                    if(error) console.log(error)
                }
                client.db.query("UPDATE `users` SET `cash` = '"+cp+"' WHERE `users`.`ID` = '"+interaction.member.id+"';"), async function (error, results) {
                    if(error) console.log(error)
                }

                interaction.member.roles.remove(role)

                return interaction.reply({
                    content: "Роль продана!",
                    ephemeral: true
                })
            })
        })
    }
  }
}