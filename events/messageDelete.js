module.exports = {
    name: 'messageDelete',
    async execute(client, message) {
        if(message.author.bot) return
        let snipes = client.snipes.get(message.channel.id) || []
        if(snipes.length > 19) snipes = snipes.slice(0, 19)
        let attachment = message.attachments.size > 0 ? message.attachments.first().url : false
    
        snipes.unshift({
            msg: message,
            url: attachment,
            type: message.attachments.first()?.contentType || null,
            time: Date.now()
        })
        client.snipes.set(message.channel.id, snipes)
    }
}