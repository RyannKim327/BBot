const chatbot = require("djs-chatbot")
const bot = new Chatbot({
	name: "NoBhie",
	gender: "Female AI"
})

module.exports = async (api, body, event) => {
	if(event.type == "message_reply"){
		let msg = await bot.chat(body)
		api.sendMessage(msg, event.threadID, event.messageID)
	}else{
		if(body.startsWith("NoBhie")){
			let data = body.split(" ")
			data.shift()
			let msg = await bot.chat(data.join(" "))
			api.sendMessage(msg, event.threadID, event.messageID)
		}
	}
}