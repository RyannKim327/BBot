const google = require("googlethis")
const fs = require("fs")
const http = require("https")

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
			let file = fs.createWriteStream("file.jpg")
			http.get(event.messageReply.attachments[0].url, (s) => {
				s.pipe(file)
				file.on("finish", async () => {
					let r = await revImg(fs.createReadStream(__dirname + "/../file.jpg"))
					let d = r[0]
					console.log(fs.createReadStream(__dirname + "/../file.jpg"))
					console.log("Log [RIS]: " + d)
					//let m = `Result (Reverse Image Search)\nTitle: ${d.title}\nDescriptio : ${d.description}\nSource: ${d.url}`
					api.sendMessage("test", event.threadID, event.messageID)
				})
			})
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
