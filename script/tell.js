const fs = require("fs")
const http = require("https")
const voice = require("google-tts-api")

async function seek(txt, lang){
	const url = await voice.getAudioUrl(txt, {
		lang: lang,
		host: "https://translate.google.com",
		slow: false
	})
	return url
}

module.exports = async (api, event, regex) => {
	let json = JSON.parse(fs.readFileSync("data/tts.json"))
	if(event.type == "message"){
		let data = event.body.match(regex)
		if(data[1].length > 200){
			api.sendMessage("Text must less than 200 characters", event.threadID, event.messageID)
		}else{
			api.getUserInfo(event.senderID, async (err, user) => {
				let dl = await seek(data[1].toLowerCase(), json[data[2].toLowerCase()])
				let file = fs.createWriteStream("temp/" + event.messageID + ".mp3")
				let n = __dirname + "/../temp/" + event.messageID + ".mp3"
				let gender = ""
				switch(user.gender){
					case 1:
						gender = "Ms."
					break
					case 2:
						gender = "Mr."
					break
					default:
						gender = "Mr./Ms."
				}
				let username = user[event.senderID]['name']
				http.get(dl, (r) => {
					r.pipe(file)
					file.on("finish", () => {
						api.sendMessage({
							body: `This is how to pronounce ${data[1]} in ${data[2]} ${gender} ${username}`,
							mentions: [{
								tag: username,
								id: event.senderID
							}],
							attachment: fs.createReadStream(n).on("end", () => {
								if(fs.existsSync(n)){
									fs.unlink(n, (e) => {
										if(e) return console.error("Error [TTS]: " + e)
									})
								}
							})
						}, event.threadID)
					})
				})
			})
		}
	}else if(event.type == "message_reply"){
		let body = event.messageReply.body
		let data = event.body.match(regex)
		if(body.length > 200){
			api.sendMessage("Text must not exceed more than 200 characters.", event.threadID, event.messageID)
		}else{
			api.getUserInfo(event.senderID, async (err, user) => {
				let tts = await seek(body, json[data[1]])
				let file = fs.createWriteStream("temp/" + event.messageID + ".mp3")
				let n = __dirname + "/../temp/" + event.messageID + ".mp3"
				let gender = ""
				switch(user.gender){
					case 1:
						gender = "Ms."
					break
					case 2:
						gender = "Mr."
					break
					default:
						gender = "Mr./Ms."
				}
				let username = user[event.senderID]['name']
				http.get(tts, r => {
					r.pipe(file)
					file.on("finish", () => {
						api.sendMessage({
							body: `This is how to pronounce ${body} in ${data[1]} ${gender} ${username}`,
							mentions: [{
								tag: username,
								id: event.senderID
							}],
							attachment: fs.createReadStream(n).on("end", () => {
								if(fs.existsSync(n)){
									fs.unlink(n, (e) => {
										if(e) return console.error("Error [TTS]: " + e)
									})
								}
							})
						}, event.threadID)
					})
				})
			})
		}
	}
}