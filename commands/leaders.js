const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "лидеры";
const description = "Лидеры по сообщениям";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["mscrollLeft_", "mscrollRight_", "vscrollRight_", "vscrollLeft_", "oscrollLeft_", "oscrollRight_"],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => 
        option.setName("type")
        .setRequired(true)
        .setDescription("Лидеры по")
        .addChoices(
            {
                name: "сообщения",
                value: "сообщения"
            },
            {
                name: "войсы",
                value: "войсы"
            },
            {
                name: "олджи",
                value: "олджи"
            }
        )
    ),

  async execute(client, command) {
    let type = "сообщения"
    if(command.content) {
        if(command.content.includes("сообщения")) {
            type = "сообщения"
        }
        if(command.content.includes("войсы")) {
            type = "войсы"
        }
        if(command.content.includes("олджи")) {
            type = "олджи"
        }
    } else {
        type = command.options.getString("type")
    }
    if(type == "сообщения") {
        client.db.query("SELECT * FROM `users` ORDER BY `messages` DESC", async function (error, results) {
            if(error) return console.log(error)
            var scrolled = 10
            var leadersDescription = ""
    
            for (let i = 0; i < results.length && i < scrolled; i++) {
                if(results[i] == undefined) break
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${results[i]["messages"]}** сообщений\n\n`
            }
    
            var row = []
    
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`mscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`mscrollRight_${scrolled}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
    
            command.reply({
                embeds: [{
                    title: "Лидеры по сообщениям",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row,
            })
        })
    }
    if(type == "войсы") {
        client.db.query("SELECT * FROM `users` ORDER BY `voice` DESC", async function (error, results) {
            if(error) return console.log(error)
            var scrolled = 10
            var leadersDescription = ""
    
            for (let i = 0; i < results.length && i < scrolled; i++) {
                if(results[i] == undefined) break
                let timestamp = results[i]["voice"];
                let hours = Math.floor(timestamp / 60 / 60);
                let minutes = Math.floor(timestamp / 60) - (hours * 60);
                let seconds = timestamp % 60;
                var voice = [
                  hours.toString().padStart(2, '0'),
                  minutes.toString().padStart(2, '0'),
                  seconds.toString().padStart(2, '0')
                ].join(':');
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${voice}** войсов\n\n`
            }
    
            var row = []
    
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`vscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`vscrollRight_${scrolled}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
    
            command.reply({
                embeds: [{
                    title: "Лидеры по войсам",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
    if(type == "олджи") {
        client.db.query("SELECT * FROM `users` ORDER BY `cash` DESC", async function (error, results) {
            if(error) return console.log(error)
            var scrolled = 10
            var leadersDescription = ""
    
            for (let i = 0; i < results.length && i < scrolled; i++) {
                if(results[i] == undefined) break
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${results[i]["cash"]}** ОЛДЖов\n\n`
            }
    
            var row = []
    
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`oscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`oscrollRight_${scrolled}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
    
            command.reply({
                embeds: [{
                    title: "Лидеры по ОЛДЖам",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
  },

  componentListener(client, interaction) {
    if(interaction.customId.startsWith("mscrollRight_")) {
        var scrolled = Number(interaction.customId.split("_")[1])
        var scr = scrolled+10
        var leadersDescription = ""
        client.db.query("SELECT * FROM `users` ORDER BY `messages` DESC", async function (error, results) {
            if(scrolled == 0) return interaction.deferUpdate()
            if(results[scrolled] == undefined) return interaction.deferUpdate()

            for (let i = scrolled; i < results.length && i < scr; i++) {
                if(results[i] == undefined) break
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${results[i]["messages"]}** сообщений\n\n`
            }
            var row = []
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`mscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`mscrollRight_${scr}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
            interaction.update({
                embeds: [{
                    title: "Лидеры по сообщениям",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
    if(interaction.customId.startsWith("mscrollLeft_")) {
        var scrolled = Number(interaction.customId.split("_")[1])
        var scr = scrolled+10
        var leadersDescription = ""
        client.db.query("SELECT * FROM `users` ORDER BY `messages` DESC", async function (error, results) {
            if(scr == 0) return interaction.deferUpdate()
            if(results[scrolled] == undefined) return interaction.deferUpdate()

            for (let i = scrolled; i < results.length && i < scr; i++) {
                if(results[i] == undefined) break
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${results[i]["messages"]}** сообщений\n\n`
            }
            var row = []
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`mscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`mscrollRight_${scr}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
            interaction.update({
                embeds: [{
                    title: "Лидеры по сообщениям",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
    if(interaction.customId.startsWith("vscrollRight_")) {
        var scrolled = Number(interaction.customId.split("_")[1])
        var scr = scrolled+10
        var leadersDescription = ""
        client.db.query("SELECT * FROM `users` ORDER BY `voice` DESC", async function (error, results) {
            if(scrolled == 0) return interaction.deferUpdate()
            if(results[scrolled] == undefined) return interaction.deferUpdate()

            for (let i = scrolled; i < results.length && i < scr; i++) {
                if(results[i] == undefined) break
                let timestamp = results[i]["voice"];
                let hours = Math.floor(timestamp / 60 / 60);
                let minutes = Math.floor(timestamp / 60) - (hours * 60);
                let seconds = timestamp % 60;
                var voice = [
                  hours.toString().padStart(2, '0'),
                  minutes.toString().padStart(2, '0'),
                  seconds.toString().padStart(2, '0')
                ].join(':');
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${voice}** войсов\n\n`
            }
            var row = []
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`vscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`vscrollRight_${scr}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
            interaction.update({
                embeds: [{
                    title: "Лидеры по войсам",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
    if(interaction.customId.startsWith("vscrollLeft_")) {
        var scrolled = Number(interaction.customId.split("_")[1])
        var scr = scrolled+10
        var leadersDescription = ""
        client.db.query("SELECT * FROM `users` ORDER BY `voice` DESC", async function (error, results) {
            if(scr == 0) return interaction.deferUpdate()
            if(results[scrolled] == undefined) return interaction.deferUpdate()

            for (let i = scrolled; i < results.length && i < scr; i++) {
                if(results[i] == undefined) break
                let timestamp = results[i]["voice"];
                let hours = Math.floor(timestamp / 60 / 60);
                let minutes = Math.floor(timestamp / 60) - (hours * 60);
                let seconds = timestamp % 60;
                var voice = [
                  hours.toString().padStart(2, '0'),
                  minutes.toString().padStart(2, '0'),
                  seconds.toString().padStart(2, '0')
                ].join(':');
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${voice}** войсов\n\n`
            }
            var row = []
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`vscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`vscrollRight_${scr}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
            interaction.update({
                embeds: [{
                    title: "Лидеры по войсам",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
    if(interaction.customId.startsWith("oscrollRight_")) {
        var scrolled = Number(interaction.customId.split("_")[1])
        var scr = scrolled+10
        var leadersDescription = ""
        client.db.query("SELECT * FROM `users` ORDER BY `cash` DESC", async function (error, results) {
            if(scrolled == 0) return interaction.deferUpdate()
            if(results[scrolled] == undefined) return interaction.deferUpdate()
            for (let i = scrolled; i < results.length && i < scr; i++) {
                if(results[i] == undefined) break
            
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${results[i]["cash"]}** ОЛДЖов\n\n`
            }
            var row = []
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`oscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`oscrollRight_${scr}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
            interaction.update({
                embeds: [{
                    title: "Лидеры по ОЛДЖам",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
    if(interaction.customId.startsWith("oscrollLeft_")) {
        var scrolled = Number(interaction.customId.split("_")[1])
        var scr = scrolled+10
        var leadersDescription = ""
        client.db.query("SELECT * FROM `users` ORDER BY `cash` DESC", async function (error, results) {
            if(scr == 0) return interaction.deferUpdate()
            if(results[scrolled] == undefined) return interaction.deferUpdate()

            for (let i = scrolled; i < results.length && i < scr; i++) {
                if(results[i] == undefined) break
                leadersDescription += `**${Number(i+1)}.** <@${results[i]["ID"]}> — **${results[i]["cash"]}** ОЛДЖов\n\n`
            }
            var row = []
            if(results.length > scrolled) row.push(
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId(`oscrollLeft_${scrolled-10}`).setEmoji("⬅").setStyle("PRIMARY"),
                    new MessageButton().setCustomId(`oscrollRight_${scr}`).setEmoji("➡").setStyle("PRIMARY")
                )
            )
            interaction.update({
                embeds: [{
                    title: "Лидеры по ОЛДЖам",
                    description: leadersDescription,
                    color: Config.embeds.color
                }],
                components: row
            })
        })
    }
  }
}
