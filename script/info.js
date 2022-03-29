const fs = require("fs")
const request = require("request")
const tool = require("fb-tools")

module.exports = async (api, body, event) => {
	let message = ""
	if(event.type == "message_reply"){
		api.getUserInfo(event.messageReply.senderID, async (err, data) => {
			if(err){
				console.log(err)
				api.sendMessage("Error occured", event.threadID, event.messageID)
			}else{
				let d = data[event.messageReply.senderID]
				let gender = ""
				switch(d.gender){
					case 1:
						gender = "Female"
					break
					case 2:
						gender = "Male"
					break
					default:
						gender = "Custom"
				}
				let id = await tool.findUid(d.profileUrl)
				let file = fs.createWriteStream("dp.jpg")
				message += "Name: " + d.name + "\n"
				if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
					message += "Username: " + d.vanity + "\n"
				}
				message += "Gender: " + gender + "\n"
				message += "Profile Link: " + d.profileUrl
				let r = request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
				r.pipe(file)
				file.on("close", () => {
					api.sendMessage({
						body: message,
						attachment: fs.createReadStream(__dirname + "/../dp.jpg").on("end", async () => {
							fs.unlink(__dirname + "/../dp.jpg", (err) => {})
						})
					}, event.threadID, event.messageID)
				})
			}
		})
	}else{
		let info = body.split(" ")
		if(info.length <= 2){
			api.sendMessage(fs.readFileSync("txt/abt.txt", "utf8"), event.threadID)
		}else{
			if(Object.keys(event.mentions).length > 0){
				let mention = Object.keys(event.mentions)[0]
				api.getUserInfo(mention, async (err, data) => {
					if(err){
						console.log(err)
						api.sendMessage("Error occured [Mention]", event.threadID, event.messageID)
					}else{
						let d = data[mention]
						let gender = ""
						switch(d.gender){
							case 1:
								gender = "Female"
							break
							case 2:
								gender = "Male"
							break
							default:
								gender = "Custom"
						}
						let id = await tool.findUid(d.profileUrl)
						let file = fs.createWriteStream("dp.jpg")
						message += "Name: " + d.name + "\n"
						if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
							message += "Username: " + d.vanity + "\n"	
						}
						message += "Gender: " + gender + "\n"
						message += "Profile Link: " + d.profileUrl
						let r = request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
						r.pipe(file)
						file.on("close", () => {
							api.sendMessage({
								body: message,
								attachment: fs.createReadStream(__dirname + "/../dp.jpg").on("end", async () => {
									fs.unlink(__dirname + "/../dp.jpg", (err) => {})
								})
							}, event.threadID, event.messageID)
						})//api.sendMessage(message, event.threadID, event.messageID)
					}
				})
			}else{
				if(!isNaN(info[2])){
					api.getUserInfo(parseInt(info[2]), async (err, data) => {
						if(err){
							console.log(err)
							api.sendMessage("Error occured. either not found, deleted or deactivated.", event.threadID, event.messageID)
						}else{
							let d = data[info[2]]
							let gender = ""
							switch(d.gender){
								case 1:
									gender = "Female"
								break
								case 2:
									gender = "Male"
								break
								default:
									gender = "Custom"
							}
							let id = await tool.findUid(d.profileUrl)
							let file = fs.createWriteStream("dp.jpg")
							message += "Name: " + d.name + "\n"
							if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
								message += "Username: " + d.vanity + "\n"	
							}
							message += "Gender: " + gender + "\n"
							message += "Profile Link: " + d.profileUrl
							let r = request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
							r.pipe(file)
							file.on("close", () => {
								api.sendMessage({
									body: message,
									attachment: fs.createReadStream(__dirname + "/../dp.jpg").on("end", async () => {
										fs.unlink(__dirname + "/../dp.jpg", (err) => {})
									})
								}, event.threadID, event.messageID)
							})
						}
					})
				}else{
					api.getUserID(info[2], (err, obj) => {
						if(err){
							console.log(err)
							api.sendMessage("Error occured, either not found, deleted or deactivated", event.threadID, event.messageID)
						}else{
							api.getUserInfo(obj[0].userID, async (err, data) => {
								let d = data[obj[0].userID]
								let gender = ""
								switch(d.gender){
									case 1:
										gender = "Female"
									break
									case 2:
										gender = "Male"
									break
									default:
										gender = "Custom"
								}
								let id = await tool.findUid(d.profileUrl)
								let file = fs.createWriteStream("dp.jpg")
								message += "Name: " + d.name + "\n"
								if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
									message += "Username: " + d.vanity + "\n"	
								}
								message += "Gender: " + gender + "\n"
								message += "Profile Link: " + d.profileUrl
								let r = request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
								r.pipe(file)
								file.on("close", () => {
									api.sendMessage({
										body: message,
										attachment: fs.createReadStream(__dirname + "/../dp.jpg").on("end", async () => {
											fs.unlink(__dirname + "/../dp.jpg", (err) => {})
										})
									}, event.threadID, event.messageID)
								})
							})
						}
					})
				}
			}
		}
	}
}
