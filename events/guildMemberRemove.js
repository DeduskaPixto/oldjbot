const { config } = require("dotenv");

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, member) {
      mr = []
      await member.roles.cache.forEach(r => {
        if (r.id == Config.boosterRole) next
        mr.push(r.id)
      });
      client.db.query("SELECT * FROM `users` WHERE `ID` = '"+member.id+"'", function (error, results) {
        if(results[0] != undefined) {
          client.db.query("UPDATE users SET roles = '"+mr+"' WHERE id = "+member.id+"", function (error, results) {
            if(error) console.log(error)
          })
        } else {
            client.db.query("INSERT INTO `users` (`id`, `roles`) VALUES ('"+member.id+"', '"+mr+"')")
        }
      })
    }
}
