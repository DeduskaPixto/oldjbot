module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {
        if(oldState.channel == undefined && newState.channel != undefined) {
            let startTime = Math.floor(Date.now()/1000)
            client.db.query("INSERT INTO `voice` (`ID`, `startTime`) VALUES ('"+newState.member.id+"', '"+startTime+"');"), async function (error, results) {
                if(error) console.log(error)
            }
        }
        if(oldState.channel != undefined && newState.channel == undefined) {
            client.db.query("SELECT * FROM `voice` WHERE `ID` = '"+oldState.member.id+"'", async function (error, results) {
                if(error) console.log(error)
                if(results[0] == null || results[0] == undefined) return

                let lastTime = Number(results[0]["startTime"])
                let newTime = Math.floor(Date.now()/1000)
                const difference = newTime-lastTime
                console.log(difference)
                client.db.query("SELECT * FROM `users` WHERE `ID` = '"+oldState.member.id+"'", async function (error, results) {
                    if(results[0] == undefined) {
                        return client.db.query("INSERT INTO `users` (`ID`) VALUES ('"+oldState.member.id+"');")
                    }
                    let voice = results[0]["voice"]
                    let cp = voice+difference
                    client.db.query("UPDATE `users` SET `voice` = '"+cp+"' WHERE `users`.`ID` = '"+oldState.member.id+"';", async function (error, results) {
                        if(error) console.log(error)
                    })
                    client.db.query("DELETE FROM `voice` WHERE `voice`.`ID` = '"+oldState.member.id+"';", async function (error, results) {
                        if(error) console.log(error)
                    })
                })

            })
        }
    }
}
