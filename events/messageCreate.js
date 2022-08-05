const Perms = require('../jsons/permissions.json');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    if(message.author.bot) return
    
    if (!message.content.startsWith(Config.prefix) && message.channel.id != Config.spamchannel) {
    client.db.query("SELECT * FROM `users` WHERE `ID` = '"+message.member.id+"'", async function (error, results) {
      if(error) return console.log(error)
      if(results[0] == undefined) {
        return client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+message.member.id+"');")
      }
      var messages = results[0]["messages"]+1
      client.db.query("UPDATE `users` SET `messages` = '"+messages+"' WHERE `users`.`ID` = '"+message.member.id+"';"), async function (error, results) {
        if(error) console.log(error)
      }
    })
  }

    if (message.content.startsWith(Config.prefix)) {
      const prefix = Config.prefix;
      message.args = message.content.slice(message.content.startsWith(prefix) ? prefix.length : Config.prefix).trim().split(/ +/g);
      message.command = message.args.shift();
      const cmd = client.commands.get(message.command)
      if (!cmd) return;

      if (!cmd.types.includes("CHAT")) return

      if (cmd.user_permissions) {
        let invalidPerms = []
        for (const perm of cmd.user_permissions) {
          if (!message.member.permissions.has(perm)) invalidPerms.push(Perms[perm]);
        }
        if (invalidPerms.length) {
          return await message.reply({ content: `У вас не достаточно прав: \`${invalidPerms}\``, ephemeral: true });
        }
      }

      if (cmd.user_roles && !cmd.user_roles[0] == "") {
        if (!message.member.roles.cache.some(role => cmd.user_roles.includes(role.id))) {
          return await message.reply({ content: "У вас нет требуемой роли", ephemeral: true });
        }
      }

      if (cmd.bot_permissions) {
        let invalidPerms = []
        for (const perm of cmd.bot_permissions) {
          if (!message.guild.me.permissions.has(perm)) invalidPerms.push(Perms[perm]);
        }
        if (invalidPerms.length) {
          return await message.reply({ content: `У меня не достаточно прав: \`${invalidPerms}\``, ephemeral: true });
        }
      }
      
      message.guild.channels.cache.get("997194713927000174").send(`**${message.author.tag}** использовал команду **${Config.prefix}${message.command}**`)
      cmd.execute(client, message)
    }
  }
}
