const { Interaction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const name = "пробив";
const description = "Информация о пользователе/сервере по ID/инвайту олдж";

module.exports = {
  name: name, // имя команды
  types: ["CHAT", "SLASH_GLOBAL"], // типы команды
  description: description, // описание команды
  user_permissions: ["SEND_MESSAGES"], // требуемые права для пользователя
  user_roles: [], // требуемые роли для пользователя
  bot_permissions: ["SEND_MESSAGES"], // требуемые права для бота
  componentsNames: [""],
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => 
        option.setName("type")
        .setRequired(true)
        .setDescription("Тип пробива")
        .addChoices(
            {
                name: "Пользователь",
                value: "user"
            },
            {
                name: "Сервер",
                value: "server"
            }
        )
    )
    .addStringOption(option => 
        option.setName("value")
        .setRequired(true)
        .setDescription("ID пользователя или Приглашение на сервер")
    ),

  async execute(client, command) {
    var informator = ""
    var guild = client.guilds.cache.get("994927950191403139")
    var value = ""
    if(command.content) {
      if(command.content.includes("пользователь" || "юзер" || "user")) {
        informator = "user"
        value = command.content.replace(/[^0-9]/g,"")
      }
      if(command.content.includes("сервер" || "server" || "guild")) {
        informator = "server"
        value = command.args[1]
      }
    } else {
      informator = command.options.getString("type")
      value = command.options.getString("value")
      if(informator == "user") value = command.options.getString("value").replace(/[^0-9]/g,"")
    }

    if(informator == "user") {
        client.users.fetch(value)
        .then(info => {
            var bot = "Нет"
            if(info.bot == true) {
                bot = "Да"
            }
            command.reply({
                embeds: [{
                    color: Config.embeds.color,
                    author: {
                      name: `${info.username}`,
                      url: `https://discord.com/users/${info.id}`,
                      icon_url: `${info.avatarURL({dynamic: true})}`
                    },
                    thumbnail: {
                      url: `${info.avatarURL({dynamic: true})}`
                    },
                    fields: [
                      {
                        name: "> Имя",
                        value: `\`${info.username}\``,
                        inline: true
                      },
                      {
                        name: "> Тег",
                        value: `\`${info.discriminator}\``,
                        inline: true
                      },
                      {
                        name: "> ID",
                        value: `\`${info.id}\``,
                        inline: true
                      },
                      {
                        name: "> Бот",
                        value: `\`${bot}\``,
                        inline: true
                      },
                      {
                        name: "> Дата регистрации в Discord",
                        value: `<t:${~~(info.createdAt/1000)}>`,
                        inline: true
                      }
                    ]
                  }]
            })
        })
        .catch(error => {
            command.reply({
                embeds: [{
                    title: "Ошибка",
                    color: Config.embeds.color,
                    description: "Я ничего не нашёл по этому ID"
                }],
                ephemeral: true
            })
        });
    }
    if(informator == "server") {
        client.fetchInvite(value)
        .then(invite => {
            let banner = `https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild.banner}.png?size=4096` ?? ""
            let description = invite.guild.description ?? "Пустое описание"
            let inviteDate = Number(invite.expiresAt) ?? "Вечное"
            
            if(inviteDate != null) {
              inviteDate = `<t:${Math.floor(new Date(inviteDate).getTime() / 1000)}:F>`
            } else {
              inviteDate = "Вечное"
            }
            command.reply({
                embeds: [{
                    title: `${invite.guild.name}`,
                    color: Config.embeds.color,
                    thumbnail: {
                      url: `${invite.guild.iconURL({dynamic: true})}`
                    },
                    image: {
                        url: banner
                    },
                    description: description,
                    fields: [
                      {
                        name: "> Участников",
                        value: `\`${invite.memberCount}\``,
                        inline: true
                      },
                      {
                        name: "> Онлайн",
                        value: `\`${invite.presenceCount}\``,
                        inline: true
                      },
                      {
                        name: "> Бустов",
                        value: `\`${invite.guild.premiumSubscriptionCount}\``,
                        inline: true
                      },
                      {
                        name: "> ID сервера",
                        value: `\`${invite.guild.id}\``,
                        inline: false
                      },
                      {
                        name: "> Уровень модерации",
                        value: `\`${invite.guild.verificationLevel}\``,
                        inline: true
                      },
                      {
                        name: "> Дата регистрации в Discord",
                        value: `<t:${~~(invite.guild.createdAt/1000)}>`,
                        inline: false
                      },
                      {
                        name: "> Создателя инвайта",
                        value: `\`${invite.inviter.tag} (ID: ${invite.inviter.id})\``,
                        inline: false
                      },
                      {
                        name: "> Канал инвайта",
                        value: `\`${invite.channel.name} (ID: ${invite.channel.id})\``,
                        inline: false
                      },
                      {
                        name: "> Срок инвайта",
                        value: inviteDate,
                        inline: false
                      },
                    ]
                  }]
            })
      })
        .catch(error => {
            command.reply({
                embeds: [{
                    title: "Ошибка",
                    color: Config.embeds.color,
                    description: "Я ничего не нашёл по этому приглашению"
                }],
                ephemeral: true
            })
        })
    }
  },

  componentListener(client, interaction) {
    // do nothing
  }
}
