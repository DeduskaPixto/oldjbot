module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        if(member.user.bot == true) return
        var bin = (+member.id).toString(2);
        var unixbin = '';
        var unix = '';
        var m = 64 - bin.length;
        unixbin = bin.substring(0, 42-m);
        unix = parseInt(unixbin, 2) + 1420070400000;
        unix = Math.floor(unix/1000)
        timea = Math.floor(new Date().getTime()/1000)
        datacreated = unix-timea
        if (datacreated > -43200) {
          member.guild.bans.create(member.user.id, {reason: 'новорег'})
        }

	member.guild.channels.cache.get("970419643636400218").send(`Ку, <@${member.user.id}>!`)

        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+member.id+"'", async function (error, results) {
          if(results[0] != undefined && results[0]["roles"] != null) {
              var mr = []
              var rm = results[0]["roles"].split(",")
              await rm.forEach(r => {
                mr.push(r)
              });
              member.roles.set(mr)
          } else {
            member.roles.add(Config.startrole)
            client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+member.id+"');")
          }
        })
    }
}
