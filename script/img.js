const google = require("googlethis")
const fs = require("fs")

async function img(query){
	let result = await google.image(query, {
		safe: true
	})
	return result
}

async function revImg(attach){
	let result = await google.search(attach, {
		ris: true
	})
	return result
}

module.exports = async (api, body, event) => {
	if(event.type == "message_reply"){
		if(event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type == "photo"){
			console.log("Log [URL]: " + event.messageReply.attachments[0].url)
			let r = await revImg(event.messageReply.attachments[0].url)
			let d = r[0]
			console.log(d)
			//let m = `Result (Reverse Image Search)\nTitle: ${d.title}\nDescriptio : ${d.description}\nSource: ${d.url}`
			api.sendMessage(r, event.threadID, event.messageID)
		}else{
			api.sendMessage("Something went wrong", event.threadID, event.MessageID)
		}
	}else{
		let d = body.split(" ")
		d.shift()
		d.shift()
		let r = await img(d.join(" "))
		
	}
}
