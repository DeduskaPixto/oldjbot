const { Interaction } = require('discord.js');
var fs = require('fs')

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`${client.user.tag} Ready!`);
        require('../handlers/commands.js').init(client)
        client.db.query("SELECT * FROM `voice`", async function (error, results) {
            if(error) return console.log(error)
            if(results[0] != undefined) {
                for (let i = 0; i < results.length; i++) {
                    if(results[i] == undefined) break
                    let user = client.guilds.cache.get(Config.guild).members.cache.get(results[i]["ID"])
                    let lastTime = Number(results[i]["startTime"])
                    let newTime = Math.floor(Date.now()/1000)
                    let uid = results[i]["ID"]
                    const difference = newTime-lastTime
                    if(user) {
                        if(user.voice.channel) {
                        client.db.query("SELECT * FROM `users` WHERE `ID` = '"+uid+"'", async function (error, results) {
                            if(results[0] == undefined) {
                                return client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+uid+"');")
                            }
                            let voice = results[0]["voice"]
                            console.log(voice)
                            let cp = voice+difference
                            client.db.query("UPDATE `users` SET `voice` = '"+cp+"' WHERE `users`.`ID` = '"+results[0]["ID"]+"';", async function (error, results) {
                                if(error) console.log(error)
                            })
                            client.db.query("UPDATE `voice` SET `startTime` = '"+newTime+"' WHERE `voice`.`ID` = '"+results[0]["ID"]+"';", async function (error, results) {
                                if(error) console.log(error)
                            })
                        })
                        } else {
                            client.db.query("DELETE FROM `voice` WHERE `voice`.`ID` = '"+results[i]["ID"]+"';", async function (error, results) {
                                if(error) return client.db.query("DELETE FROM `voice` WHERE `voice`.`ID` = '"+results[i]["ID"]+"';")
                            })
                        }
                    } else {
                        client.db.query("DELETE FROM `voice` WHERE `voice`.`ID` = '"+results[i]["ID"]+"';", async function (error, results) {
                            if(error) return client.db.query("DELETE FROM `voice` WHERE `voice`.`ID` = '"+results[i]["ID"]+"';")
                        })
                    }
                }
            }
        })

        var last = 0
        async function banner() {
            setTimeout(banner, 1000 * 60);
                client.guilds.fetch("733015028353204245")
                    .then((guild) => {
                        if (guild.premiumSubscriptionCount >= 7) {
                            let files = fs.readdirSync('./banners/')
                            let randomFile = files[last]
                            if(randomFile == undefined) {
                                last = 0
                                randomFile = files[last]
                            }
                            last = last+1
                            guild.setBanner(`./banners/${randomFile}`)
                                .then((updated) => {
                                    // do nothing
                                })
                                .catch(console.log);
                        }
                    }).catch(console.log);
        }
        banner()

        var guild = client.guilds.cache.get(Config.guild)
        var maxBitrate = guild.maximumBitrate
        guild.channels.cache.forEach(channel => {
            if(channel.isVoice()) {
                channel.setBitrate(maxBitrate)
            }
        });
    }
}
