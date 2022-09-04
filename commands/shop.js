const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "магазин";
const description = "Магазин ОЛДЖа";

module.exports = {
  name: name, // имя команды
  types: ["SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["shop", "scroll", "buy_", "addrole", "deleterole"],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description),

  async execute(client, command) {
    client.db.query("SELECT * FROM `shop` ORDER BY `price` DESC", async function (error, results) {
        if(error) return console.log(error)
        var scrolled = 14
        var shopDescription = ""
        var shopSelectMenu = []
        for (let i = 0; results.length && i < scrolled; i++) {
            if(results[i] == undefined) break
            shopDescription += `${Config.shop.emoji} ${results[i]["price"]} — <@&${results[i]["ID"]}>\n\n`
             console.log(results[i]["ID"])
            shopSelectMenu.push({
                label: `${results[i]["name"]}`,
			    description: `${results[i]["description"]}`,
			    value: `${results[i]["ID"]}`,
            })
        }
        if(results.length == 0) {
            shopDescription = "Нету ролей в магазине"
        }
        var row = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu().setCustomId('shop').setPlaceholder("Ничего не выбрано").addOptions(shopSelectMenu)
            )
        ]
        if(command.member.permissions.has("ADMINISTRATOR")) row.push(
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('addrole').setLabel("Добавить роль").setStyle("PRIMARY"),
                new MessageButton().setCustomId('deleterole').setLabel("Удалить роль").setStyle("PRIMARY"),
            )
        )
        if(results.length >= 14) row.push(
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('scroll').setLabel("Листать дальше").setStyle("PRIMARY")
            )
        )
        command.reply({
            embeds: [{
                title: "Магазин ОЛДЖа",
                description: shopDescription,
                color: Config.embeds.color
            }],
            components: row,
            ephemeral: true
        })
    })
  },

  componentListener(client, interaction) {
    if(interaction.customId == "scroll") {
        var scr = scrolled+14
        for (let i = scr; results.length && i < scr; i++) {
            if(results[i] == undefined) break
            shopDescription += `${Config.shop.emoji} ${results[i]["price"]} — <@&${results[i]["ID"]}>\n\n`
            shopSelectMenu.push({
                label: `${results[i]["name"]}`,
			    description: `${results[i]["description"]}`,
			    value: `${results[i]["ID"]}`,
            })
        }
        var row = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu().setCustomId('shop').setPlaceholder("Ничего не выбрано").addOptions(shopSelectMenu)
            )
        ]
        if(command.member.permissions.has("ADMINISTRATOR")) row.push(
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('addrole').setLabel("Добавить роль").setStyle("PRIMARY"),
                new MessageButton().setCustomId('deleterole').setLabel("Удалить роль").setStyle("PRIMARY"),
            )
        )
        if(results.length >= scr) row.push(
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('scroll').setLabel("Листать дальше").setStyle("PRIMARY")
            )
        )
        command.update({
            embeds: [{
                title: "Магазин ОЛДЖа",
                description: shopDescription,
                color: Config.embeds.color
            }],
            components: row,
            ephemeral: true
        })
    }
    if(interaction.customId == "addrole") {
        const modal = new Modal()
        .setCustomId('addroleModal')
        .setTitle('Добавить роль в магазин');
        const id = new TextInputComponent()
        .setCustomId('id')
        .setLabel("ID роли")
        .setRequired(true)
        .setStyle('SHORT');
        const name = new TextInputComponent()
        .setCustomId('name')
        .setLabel("Имя роли")
        .setRequired(true)
        .setStyle('SHORT');
        const description = new TextInputComponent()
        .setCustomId('description')
        .setLabel("Описание роли")
        .setRequired(true)
        .setStyle('SHORT');
        const price = new TextInputComponent()
        .setCustomId('price')
        .setLabel("Цена")
        .setRequired(true)
        .setStyle('SHORT');

        modal.addComponents(
            new MessageActionRow().addComponents(id),
            new MessageActionRow().addComponents(description),
            new MessageActionRow().addComponents(price),
            new MessageActionRow().addComponents(name)

        );
        interaction.showModal(modal); 
    }
    if(interaction.customId == "deleterole") {
        const modal = new Modal()
        .setCustomId('deleteroleModal')
        .setTitle('Удалить роль из магазина');
        const id = new TextInputComponent()
        .setCustomId('id')
        .setLabel("ID роли")
        .setRequired(true)
        .setStyle('SHORT');
        
        modal.addComponents(
            new MessageActionRow().addComponents(id)
        );
        interaction.showModal(modal); 
    }
    if(interaction.customId == "addroleModal") {
        var id = interaction.fields.getTextInputValue('id')
        var description = interaction.fields.getTextInputValue('description')
        var price = interaction.fields.getTextInputValue('price')
        var name = interaction.fields.getTextInputValue('name')


                if(name) {
            client.db.query("INSERT INTO `shop` (`ID`, `name`, `description`, `price`) VALUES ('"+id+"', '"+name+"', '"+description+"', '"+price+"');", async function (error, results) {
                if(error) console.log(error) 
                 console.log(role) 
                 return;
            })
            return interaction.reply({
                embeds: [{
                    color: Config.embeds.color,
                    description: "Роль добавлена в магазин"
                }],
                ephemeral: true
            })
        }
    }
    if(interaction.customId == "deleteroleModal") {
        var id = interaction.fields.getTextInputValue('id')

        client.db.query("SELECT * FROM `shop` WHERE `ID` = '"+id+"'", async function (error, results) {
            if(results[0] != undefined) {
                client.db.query("DELETE FROM `shop` WHERE `shop`.`ID` = '"+id+"';", async function (error, results) {
                    if(error) return console.log(error)
                })
                return interaction.reply({
                    embeds: [{
                        color: Config.embeds.color,
                        description: "Роль удалена из магазина"
                    }],
                    ephemeral: true
                })
            } else {
                return interaction.reply({
                    embeds: [{
                        color: Config.embeds.color,
                        description: "Роли с таким ID нету в магазине"
                    }],
                    ephemeral: true
                })
            }
        })
    }
    if(interaction.customId == "shop") {
        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+interaction.member.id+"'", async function (error, results) {
            if(error) return console.log(error)
            if(results[0] == undefined) {
                client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+interaction.member.id+"');")
            }
        })

        client.db.query("SELECT * FROM `shop` WHERE `ID` = '"+interaction.values[0]+"'", async function (error, results) {
            if(error) return console.log(error)
            interaction.reply({
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
                        new MessageButton().setCustomId(`buy_${interaction.values[0]}`).setLabel("Купить").setStyle("PRIMARY")
                    )
                ],
                ephemeral: true
            })
        })
    }
    if(interaction.customId.startsWith("buy_")) {
        var role = interaction.customId.split("_")[1]

        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+interaction.member.id+"'", async function (error, results) {
            if(error) return console.log(error)
            if(results[0]["buyroles"]?.includes(role)) {
                return interaction.reply({
                    embeds: [{
                        description: `У вас уже есть <@&${role}>`,
                        color: Config.embeds.color
                    }],
                    ephemeral: true
                })
            }
            if(results[0] == undefined) {
                client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+interaction.member.id+"');")
                return interaction.reply("Ошибка! Повторите попытку ещё раз!")
            }
            
            var cash = results[0]["cash"]
            var br = results[0]["buyroles"]
            client.db.query("SELECT * FROM `shop` WHERE `ID` = '"+role+"'", async function (error, results) {
                var price = results[0]["price"]
                if(br == null || br == "") {
                    br = `${results[0]["ID"]}`
                }
                else {
                    br = `${br},${results[0]["ID"]}`
                }

                if(cash >= price) {
                    let cp = cash-price
                    client.db.query("UPDATE `users` SET `cash` = '"+cp+"' WHERE `users`.`ID` = '"+interaction.member.id+"';"), async function (error, results) {
                        if(error) console.log(error)
                    }
                    client.db.query("UPDATE `users` SET `buyroles` = '"+br+"' WHERE `users`.`ID` = '"+interaction.member.id+"';"), async function (error, results) {
                        if(error) console.log(error)
                    }
                    interaction.member.roles.add(role)
                    interaction.update({
                        embeds: [{
                            description: `Вы купили <@&${role}>`,
                            color: Config.embeds.color
                        }],
                        components: []
                    })
                } else {
                    interaction.reply({
                        embeds: [{
                            description: `Вам не хватает ${Config.shop.emoji} ${price-cash}`,
                            color: Config.embeds.color
                        }],
                        ephemeral: true
                    })
                }
            })
        })
    }
  }
}
