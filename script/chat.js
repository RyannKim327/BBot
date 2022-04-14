const chatbot = require("djs-chatbot")

async function bot(message){
	client.on("message", async msg => {
		const reply = await chatbot.chat({
			Message: message
		})
		return msg.channel.send(reply)
	})
	return client
}

module.exports = async (api, body, event) => {
	if(event.type == "message_reply"){
		let msg = await bot(body)
		api.sendMessage(msg, event.threadID, event.messageID)
	}else{
		if(body.startsWith("NoBhie")){
			let data = body.split(" ")
			data.shift()
			let msg = await bot(data.join(" "))
			api.sendMessage(msg, event.threadID, event.messageID)
		}
	}
}