const itt = require("text-from-image")
const fs = require("fs")
const http = require("https")
const request = require("request")

module.exports = async (api, body, event) => {
	if(event.type == "message_reply"){
		let repl = event.messageReply.attachments
		if(repl.length > 0 && repl[0].type == "photo"){
			let file = fs.createWriteStream(event.messageID + ".jpg")
			let req = request(repl[0].url)
			req.pipe(file)
			req.on("close", async () => {
				api.setMessageReaction("🔬", event.messageID, (err) => {}, true)
				await itt("./" + event.messageID + ".jpg").then((s) => {
					if(s != null){
						api.sendMessage({
							body: "Result [Text from Image]:\n\n" + s,
							attachment: fs.createReadStream(__dirname + "/../" + event.messageID + ".jpg").on("end", () => {
								if(fs.existsSync(__dirname + "/../" + event.messageID + ".jpg")){
									fs.unlink(__dirname + "/../" + event.messageID + ".jpg", (e) => {
										if(e) return console.error("Error [Text from image]: " + e)
										api.setMessageReaction("✔", event.messageID, (err) => {}, true)
									})
									fs.unlink(__dirname + "/../eng.traineddata", (e) => {})
									fs.unlink(__dirname + "/../osd.traineddata", (e) => {})
								}
							})
						}, event.threadID, event.messageReply.messageID)
					}else{
						api.sendMessage("Something went wrong", event.threadID, event.messageID)
						if(fs.existsSync(__dirname + "/../" + event.messageID + ".jpg")){
							fs.unlink(__dirname + "/../" + event.messageID + ".jpg", (e) => {
								if(e) return console.error("Error [Text from image]: " + e)
								api.setMessageReaction("✔", event.messageID, (err) => {}, true)
							})
							fs.unlink(__dirname + "/../eng.traineddata", (e) => {})
							fs.unlink(__dirname + "/../osd.traineddata", (e) => {})
						}
					}
				}).catch((err) => {
					api.sendMessage("Error [Image to text]: " + err, event.threadID, event.messageID)
				})
			})
		}else{
			api.sendMessage("File must be a jpg file.", event.threadID, event.messageID)
		}
	}
}