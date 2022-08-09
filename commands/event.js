const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "ивент";
const description = "Создать ивент олдж";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: ["937417139416084501"], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: ["createJackbox", "createGartic", "createFilm", "garticphoneModal", "createOther", "deleteEvent", "editEvent", "createJackboxSelect", "otherModal", "filmModal", "jackboxModal", "editEventModal"],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description),

  async execute(client, command) {
    let activeEvents = null

    client.db.query("SELECT * FROM `activeEvents` WHERE `ID` = '"+command.member.id+"'", function (error, results) {
        if(error) {
            return console.log(error)
        }
        if(results[0] == undefined) {
            const row = new MessageActionRow().addComponents(
                new MessageButton().setCustomId("createJackbox").setStyle("SECONDARY").setLabel("Jackbox").setEmoji("<:jackbox:986424224694542427>"),
                new MessageButton().setCustomId("createGartic").setStyle("SECONDARY").setLabel("Gartic Phone").setEmoji("<:garticphone:986424364360663041>"),
                new MessageButton().setCustomId("createFilm").setStyle("SECONDARY").setLabel("Фильмы").setEmoji("🎥")
            );
            const row2 = new MessageActionRow().addComponents(
                new MessageButton().setCustomId("createOther").setStyle("PRIMARY").setLabel("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Другое⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"),
            );
            command.reply({
                embeds: [{
                    title: "Ивент меню",
                    description: `*Выберите тип мероприятия*⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
                    color: "#2f3136",
                }],
                components: [row, row2],
                ephemeral: true
            });
        } else {
            const nameEvent = results["Name"]
            const typeEvent = results["Type"]

            if(typeEvent == "Фильм") {
                return command.reply({
                    embeds: [{
                        title: "Управление ивентом",
                        description: `*${nameEvent}*⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
                        color: "#2f3136",
                    }],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton().setCustomId("deleteEvent").setStyle("DANGER").setLabel("Удалить ивент"),
                            new MessageButton().setCustomId("editEvent").setStyle("PRIMARY").setLabel("Изменить")
                        ),
                    ],
                    ephemeral: true
                });
            }
            command.reply({
                embeds: [{
                    title: "Управление ивентом",
                    description: `*${nameEvent}*⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
                    color: "#2f3136",
                }],
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setCustomId("deleteEvent").setStyle("DANGER").setLabel("Удалить ивент")
                    )
                ],
                ephemeral: true
            });
        }
    })
  },

  componentListener(client, interaction) {
    const creator = interaction.member.id
    var messageEvent = ""

    if(interaction.isButton()) {
        if(interaction.customId === "createJackbox") {
            const modal = new Modal()
            .setCustomId('jackboxModal')
            .setTitle('Начать ивент по Jackbox');
        const annonce = new TextInputComponent()
            .setCustomId('annonce')
            .setLabel("Запланировать (указывать время по МСК)")
            .setPlaceholder("20:00")
            .setRequired(false)
            .setStyle('SHORT');
        const ActionRow = new MessageActionRow().addComponents(annonce);
        modal.addComponents(ActionRow);
        interaction.showModal(modal);
        }
        if(interaction.customId === "createGartic") {
            const modal = new Modal()
            .setCustomId('garticphoneModal')
            .setTitle('Начать ивент по Gartic Phone');
        const link = new TextInputComponent()
            .setCustomId('linkGartic')
            .setLabel("Ссылка на игру")
            .setRequired(true)
            .setStyle('SHORT');
        const ActionRow = new MessageActionRow().addComponents(link);
        modal.addComponents(ActionRow);
        interaction.showModal(modal);
        }
        if(interaction.customId === "createFilm") {
            const modal = new Modal()
            .setCustomId('filmModal')
            .setTitle('Начать ивент по просмотру фильма/сериала.');
        const id = new TextInputComponent()
            .setCustomId('linkFilm')
            .setLabel("ID фильма на кинопоиске")
            .setRequired(true)
            .setStyle('SHORT');
        const season = new TextInputComponent()
            .setCustomId('seasonFilm')
            .setLabel("Сезон")
            .setRequired(false)
            .setStyle('SHORT');
        const series = new TextInputComponent()
            .setCustomId('seriesFilm')
            .setLabel("Серия")
            .setRequired(false)
            .setStyle('SHORT');
        const annonce = new TextInputComponent()
            .setCustomId('annonce')
            .setLabel("Запланировать (указывать время по МСК)")
            .setPlaceholder("20:00")
            .setRequired(false)
            .setStyle('SHORT');

        const fActionRow = new MessageActionRow().addComponents(id);
        const tActionRow = new MessageActionRow().addComponents(season);
        const thActionRow = new MessageActionRow().addComponents(series);
        const ffActionRow = new MessageActionRow().addComponents(annonce);
        modal.addComponents(fActionRow, tActionRow, thActionRow, ffActionRow);
        interaction.showModal(modal); 
        }
        if(interaction.customId === "createOther") {
            const modal = new Modal()
            .setCustomId('otherModal')
            .setTitle('Ивент');
        const name = new TextInputComponent()
            .setCustomId('nameOther')
            .setLabel("Название ивента")
            .setRequired(true)
            .setStyle('SHORT');
        const desc = new TextInputComponent()
            .setCustomId('descOther')
            .setLabel("Описание")
            .setRequired(true)
            .setStyle('PARAGRAPH');
        const img = new TextInputComponent()
            .setCustomId('imgOther')
            .setLabel("Ссылка на картинку")
            .setRequired(false)
            .setStyle('SHORT');
        const annonce = new TextInputComponent()
        .setCustomId('annonce')
        .setLabel("Запланировать (указывать время по МСК)")
        .setPlaceholder("20:00")
        .setRequired(false)
        .setStyle('SHORT');

        const fActionRow = new MessageActionRow().addComponents(name);
        const cActionRow = new MessageActionRow().addComponents(desc);
        const vActionRow = new MessageActionRow().addComponents(img);
        const ffActionRow = new MessageActionRow().addComponents(annonce);
        modal.addComponents(fActionRow, cActionRow, vActionRow, ffActionRow);
        interaction.showModal(modal); 
        }
        if(interaction.customId === "deleteEvent") {
            client.db.query("SELECT * FROM `activeEvents` WHERE `ID` LIKE '"+interaction.member.id+"'", function (error, results) {
                if(error) {
                    return console.log(error)
                }
                if(results[0] == undefined) {
                    return interaction.update({
                        content: "У вас нет ивентов",
                        components: [],
                        embeds: []
                    })
                }
                if(results != undefined) {
                    messageEvent = results["messageId"]
                    deleteMessage(Config.event_channel, messageEvent)
                    client.db.query("DELETE FROM `activeEvents` WHERE `ID` LIKE '"+interaction.member.id+"'", function (error, results) {
                        if(error) {
                            return console.log(error)
                        }
                    })
                    interaction.update({
                        content: "Ивент удалён!",
                        components: [],
                        embeds: []
                    })
                }
            })
            async function deleteMessage(channel, message) {
                const msg = await client.channels.cache
                .get(channel)
                .messages.fetch(message)
                if(msg != undefined) {
                    msg.delete()
                }
            }
        }
        if(interaction.customId === "editEvent") {
            const modal = new Modal()
            .setCustomId('editEventModal')
            .setTitle('Начать ивент по просмотру фильма/сериала.');
        const season = new TextInputComponent()
            .setCustomId('seasonFilm')
            .setLabel("Сезон")
            .setRequired(false)
            .setStyle('SHORT');
        const series = new TextInputComponent()
            .setCustomId('seriesFilm')
            .setLabel("Серия")
            .setRequired(false)
            .setStyle('SHORT');
            
        const fActionRow = new MessageActionRow().addComponents(season);
        const tActionRow = new MessageActionRow().addComponents(series);
        modal.addComponents(fActionRow, tActionRow);
        interaction.showModal(modal); 
        }
    } 
    if (interaction.isModalSubmit()) {
        let messageId = ""
        if (interaction.customId == 'garticphoneModal') {
            const game = interaction.fields.getTextInputValue('linkGartic');
            interaction.guild.channels.cache.get(Config.event_channel).send({
                content: `@here`,
                embeds: [{
                    title: `Прямо сейчас идёт ивент по Gartic Phone!`,
                    description: `Заходим в [игру](${game}) и играем!`,
                    color: "#2f3136",
                    image: {
                        url: "https://media.rawg.io/media/screenshots/c53/c5362b3d359b73e6d8b266767d571c3b.jpg"
                    },
                    author: {
                        name: interaction.member.displayName,
                        icon_url: interaction.member.user.avatarURL({dynamic: true})
                    }
                }],
                components: [
                    {
                      type: 1,
                      components: [
                        {
                          type: 2,
                          style: 5,
                          label: "Играть",
                          url: game
                        }
                      ]
                    }
                ]
            }).then ((message) => {
                messageId = message.id
            })
            client.db.query("INSERT INTO `activeEvents` (`ID`, `Type`, `Name`, `Date`, `messageId`) VALUES ('"+creator+"', 'Gartic Phone', '"+game+"', '"+Date.now()+"', '"+messageId+"');")
            return interaction.update({
                content: "Отправлено!",
                components: [],
                embeds: [],
                ephemeral: true
            })
        }
        if(interaction.customId == "jackboxModal") {
            var dtEvent = interaction.fields.getTextInputValue('annonce') ?? null
            if(dtEvent) {
                dtEvent = dtEvent.split(":")
                let hours = new Date().getHours()
                let minutes = new Date().getMinutes()
                let hoursEvent = dtEvent[0]
                let minutesEvent = dtEvent[1]

                if(hoursEvent < hours || minutesEvent <= minutes) {
                    return interaction.reply({
                        content: "чел, я не умею делать ивенты в прошлом",
                        ephemeral: true
                    })
                }
                
                const date = Math.floor((hoursEvent-hours)*3600+(minutesEvent-minutes)*60)
                const dateUnix = Math.floor((new Date().getTime() / 1000) + ((hoursEvent-hours)*3600+(minutesEvent-minutes)*60))
                var msgp = ""
                setTimeout(() => {
                    interaction.guild.channels.cache.get(Config.event_channel).send({
                        content: `@here Ивент начался!`
                    }).then(message => {
                        msgp = message
                    })
                    setTimeout(() => {
                        msgp.delete()
                    }, 15000);
                }, date*1000);
                let messageId = ""
                interaction.guild.channels.cache.get(Config.event_channel).send({
                    embeds: [{
                        title: `Прямо сейчас идёт ивент по Jackbox!`,
                        description: `Заходим на [стрим](https://discord.gg/qcsG3C9Z5m) и играем!`,
                        color: "#2f3136",
                        image: {
                            url: "https://www.insidehook.com/wp-content/uploads/2020/05/Jackbox-Games-Logo.jpg?resize=50"
                        },
                        author: {
                            name: interaction.member.displayName,
                            icon_url: interaction.member.user.avatarURL({dynamic: true})
                        },
                        fields: [
                            {
                                name: "Начало (по МСК)",
                                value: `<t:${dateUnix}:t>`,
                                inline: true
                            }
                        ]
                    }],
                    components: [
                        {
                          type: 1,
                          components: [
                            {
                              type: 2,
                              style: 5,
                              label: "Играть",
                              url: "https://discord.gg/qcsG3C9Z5m"
                            }
                          ]
                        }
                    ]
                }).then ((message) => {
                    messageId = message.id
                })
                client.db.query("INSERT INTO `activeEvents` (`ID`, `Type`, `Name`, `Date`, `messageId`) VALUES ('"+creator+"', 'Jackbox', 'Jackbox', '"+Date.now()+"', '"+messageId+"');")
                return interaction.reply({
                    content: "Ивент запланирован!",
                    ephemeral: true
                })
            }
            else {
                let messageId = ""
                interaction.guild.channels.cache.get(Config.event_channel).send({
                    content: `@here`,
                    embeds: [{
                        title: `Прямо сейчас идёт ивент по Jackbox!`,
                        description: `Заходим на [стрим](https://discord.gg/qcsG3C9Z5m) и играем!`,
                        color: "#2f3136",
                        image: {
                            url: "https://www.insidehook.com/wp-content/uploads/2020/05/Jackbox-Games-Logo.jpg?resize=50"
                        },
                        author: {
                            name: interaction.member.displayName,
                            icon_url: interaction.member.user.avatarURL({dynamic: true})
                        }
                    }],
                    components: [
                        {
                          type: 1,
                          components: [
                            {
                              type: 2,
                              style: 5,
                              label: "Играть",
                              url: "https://discord.gg/qcsG3C9Z5m"
                            }
                          ]
                        }
                    ]
                }).then ((message) => {
                    messageId = message.id
                })
                client.db.query("INSERT INTO `activeEvents` (`ID`, `Type`, `Name`, `Date`, `messageId`) VALUES ('"+creator+"', 'Jackbox', 'Jackbox', '"+Date.now()+"', '"+messageId+"');")
                return interaction.update({
                    content: "Отправлено!",
                    components: [],
                    embeds: [],
                    ephemeral: true
                })
            }
        }
        if(interaction.customId == "filmModal") {
            const film = interaction.fields.getTextInputValue('linkFilm');
            const season = interaction.fields.getTextInputValue('seasonFilm');
            const series = interaction.fields.getTextInputValue('seriesFilm');

            const options = {
                url: `https://api.kinopoisk.dev/movie?token=8M5PKWH-7NFMW5P-J7TWJGY-X8EBC5D&search=${film}&field=id`,
                method: 'GET'
            };
            request(options, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                let json = JSON.parse(body)
                if(json["message"] != undefined) {
                    return interaction.reply({
                        content: `ID не верный.`,
                        ephemeral: true
                    })
                }
                let title = json.name,
                image = json.poster.url,
                description = `${json.description}\n`,
                ml = json.movieLength,
                country = json.countries[0].name,
                genres = json.genres[0].name
                for (let i = 1; i < json.genres.length; i++) {
                    genres += `, ${json.genres[i].name}`
                }
    
                var embed = {
                    title: `Смотрим: ${title}`,
                    image: {
                        url: image
                   },
                   author: {
                    name: interaction.member.displayName,
                    icon_url: interaction.member.user.avatarURL({dynamic: true})
                   },
                   color: "#2f3136",
                   description: description,
                   fields: [
                    {
                        name: `Страна`,
                        value: country,
                        inline: true
                    },
                    {
                        name: `Жанр`,
                        value: genres,
                        inline: true
                    },
                    {
                        name: `Длительность`,
                        value: `${ml} минут`,
                        inline: true
                    }
                   ]
                }
    
                if(season != false) {
                    embed.fields.push({
                        name: `Сезон`,
                        value: `${season}`,
                        inline: true
                    })
                }
    
                if(series != false) {
                    embed.fields.push({
                        name: `Серия`,
                        value: `${series}`,
                        inline: true
                    })
                }

                var dtEvent = interaction.fields.getTextInputValue('annonce') ?? null
                if(dtEvent) {
                    dtEvent = dtEvent.split(":")
                    let hours = new Date().getHours()+3
                    let minutes = new Date().getMinutes()
                    let hoursEvent = dtEvent[0]
                    let minutesEvent = dtEvent[1]

                    if(hoursEvent < hours || minutesEvent <= minutes) {
                        return interaction.reply({
                            content: "чел, я не умею делать ивенты в прошлом",
                            ephemeral: true
                        })
                    }
                    
                    const date = Math.floor((hoursEvent-hours)*3600+(minutesEvent-minutes)*60)
                    const dateUnix = Math.floor((new Date().getTime() / 1000) + ((hoursEvent-hours)*3600+(minutesEvent-minutes)*60))
                    embed.fields.push({
                        name: `Начало (по МСК)`,
                        value: `<t:${dateUnix}:t>`,
                        inline: true
                    })
                    var msgp = ""
                    setTimeout(() => {
                        interaction.guild.channels.cache.get(Config.event_channel).send({
                            content: `@here Ивент начался!`
                        }).then(message => {
                            msgp = message
                        })
                        setTimeout(() => {
                            msgp.delete()
                        }, 15000);
                    }, date*1000);
                }
    
                let messageId = ""
                interaction.guild.channels.cache.get(Config.event_channel).send({
                    embeds: [embed],
                    components: [
                        {
                          type: 1,
                          components: [
                            {
                              type: 2,
                              style: 5,
                              label: "Смотреть",
                              url: "https://discord.gg/qcsG3C9Z5m"
                            }
                          ]
                        }
                    ]
                }).then ((message) => {
                    messageId = message.id
                })
                
                client.db.query("INSERT INTO `activeEvents` (`ID`, `Type`, `Name`, `Date`, `messageId`) VALUES ('"+creator+"', 'Фильм', '"+title+"', '"+Date.now()+"', '"+messageId+"');")
                
                interaction.update({
                    content: "⠀",
                    embeds: [{
                        title: "Отправлено!",
                        color: "#2f3136",
                    }],
                    components: []
                })
            });
        }
        if(interaction.customId == "editEventModal") {
            client.db.query("SELECT * FROM `activeEvents` WHERE `ID` LIKE '"+interaction.member.id+"'", async function(error, results) {
                const season = interaction.fields.getTextInputValue('seasonFilm') ?? null;
                const series = interaction.fields.getTextInputValue('seriesFilm') ?? null;

                const msg = await client.channels.cache
                .get(Config.event_channel)
                .messages.fetch(results["messageId"])
                var embed = msg.embeds[0]
                if(season) {
                    embed.fields[3] = { name: 'Сезон', value: season, inline: true }
                }
                if(series) {
                    embed.fields[4] = { name: 'Серия', value: series, inline: true }
                }
                msg.edit({
                    embeds: [embed]
                })
                interaction.reply({
                    content: "Ивент изменён!",
                    ephemeral: true
                })
            })
        }
        if(interaction.customId == "otherModal") {
            const name = interaction.fields.getTextInputValue('nameOther');
            const desc = interaction.fields.getTextInputValue('descOther');
            const img = interaction.fields.getTextInputValue('imgOther') ?? "https://i.imgur.com/1ZS2Tov.png";
            var dtEvent = interaction.fields.getTextInputValue('annonce') ?? false
            if(dtEvent) {
                dtEvent = dtEvent.split(":")
                let hours = new Date().getHours()
                let minutes = new Date().getMinutes()
                let hoursEvent = dtEvent[0]
                let minutesEvent = dtEvent[1]

                if(hoursEvent < hours || minutesEvent <= minutes) {
                    return interaction.reply({
                        content: "чел, я не умею делать ивенты в прошлом",
                        ephemeral: true
                    })
                }
                
                const date = Math.floor((hoursEvent-hours)*3600+(minutesEvent-minutes)*60)
                const dateUnix = Math.floor((new Date().getTime() / 1000) + ((hoursEvent-hours)*3600+(minutesEvent-minutes)*60))
                var msgp = ""
                setTimeout(() => {
                    interaction.guild.channels.cache.get(Config.event_channel).send({
                        content: `@here Ивент начался!`
                    }).then(message => {
                        msgp = message
                    })
                    setTimeout(() => {
                        msgp.delete()
                    }, 15000);
                }, date*1000);
                var embed = {
                    title: name,
                    description: desc,
                    author: {
                        name: interaction.member.displayName,
                        icon_url: interaction.member.user.avatarURL({dynamic: true})
                    },
                    image: {
                        url: img
                    },
                    fields: [
                        {
                            name: "Начало (по МСК)",
                            value: `<t:${dateUnix}:t>`,
                            inline: true
                        }
                    ]
                }
                let messageId = ""
                interaction.guild.channels.cache.get(Config.event_channel).send({
                    embeds: [embed],
                }).then ((message) => {
                    messageId = message.id
                })
                client.db.query("INSERT INTO `activeEvents` (`ID`, `Type`, `Name`, `Date`, `messageId`) VALUES ('"+creator+"', 'Other', '"+name+"', '"+Date.now()+"', '"+messageId+"');")
                return interaction.reply({
                    content: "Ивент запланирован!",
                    ephemeral: true
                })
            } else {
                var embed = {
                    title: name,
                    description: desc,
                    author: {
                        name: interaction.member.displayName,
                        icon_url: interaction.member.user.avatarURL({dynamic: true})
                    },
                    image: {
                        url: img
                    }
                }
                let messageId = ""
                interaction.guild.channels.cache.get(Config.event_channel).send({
                    content: `@here`,
                    embeds: [embed]
                }).then ((message) => {
                    messageId = message.id
                })
                client.db.query("INSERT INTO `activeEvents` (`ID`, `Type`, `Name`, `Date`, `messageId`) VALUES ('"+creator+"', 'Other', '"+name+"', '"+Date.now()+"', '"+messageId+"');")
                return interaction.reply({
                    content: "Ивент создан!",
                    ephemeral: true
                })
            }
            
        }
    }
  }
}