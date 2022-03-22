const fs = require("fs")
const request = require("request")
const tool = require("fb-tools")
/*
var link = data[1];
if (!link) return api.sendMessage(`Please enter the link to get avatar.`,event.threadID,event.messageID);
var tool = require("fb-tools");
try {
var id = await tool.findUid(data[1] || event.messageReply.body);
var callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/1.png"),event.messageID);   
return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/1.png')).on('close',() => callback());
}
catch(e){
    api.sendMessage("User does not exist.",event.threadID,event.messageID)
}
}
*/

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
				let f = fs.createWriteStream("dp.jpg")
				let id = await tool.findUid(d.userID || event.messageReply.body)
				console.log(id)
				message += "Name: " + d.name + "\n"
				if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
					message += "Username: " + d.vanity + "\n"
				}
				message += "Gender: " + gender + "\n"
				message += "Profile Link: " + d.profileUrl
				let req = request(encodeUrl(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(f)
				f.on("close", () => {
					api.sendMessage({
						body: message,
						attachment: fs.createReadStream(__dirname + "/dp.jpg").on("end", async () => {
							fs.unlink(__dirname + "/dp.jpg", (e) => {})
						})
					}, event.threadID, event.messageID)
				})
			}
		})
	}else{
		let info = body.split(" ")
		if(info.length <= 1){
			api.sendMessage(fs.readFileSync("txt/abt.txt", "utf8"), event.threadID)
		}else{
			if(Object.keys(event.mentions).length > 0){
				let mention = Object.keys(event.mentions)[0]
				api.getUserInfo(mention, (err, data) => {
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
						message += "Name: " + d.name + "\n"
						if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
							message += "Username: " + d.vanity + "\n"	
						}
						message += "Gender: " + gender + "\n"
						message += "Profile Link: " + d.profileUrl
						api.sendMessage(message, event.threadID, event.messageID)
					}
				})
			}else{
				if(!isNaN(info[1])){
					api.getUserInfo(parseInt(info[1]), (err, data) => {
						if(err){
							console.log(err)
							api.sendMessage("Error occured. either not found, deleted or deactivated.", event.threadID, event.messageID)
						}else{
							let d = data[info[1]]
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
							message += "Name: " + d.name + "\n"
							if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
								message += "Username: " + d.vanity + "\n"	
							}
							message += "Gender: " + gender + "\n"
							message += "Profile Link: " + d.profileUrl
							api.sendMessage(message, event.threadID, event.messageID)
						}
					})
				}else{
					api.getUserID(info[1], (err, obj) => {
						if(err){
							console.log(err)
							api.sendMessage("Error occured, either not found, deleted or deactivated", event.threadID, event.messageID)
						}else{
							api.getUserInfo(obj[0].userID, (err, data) => {
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
								message += "Name: " + d.name + "\n"
								if(d.vanity != undefined || d.vanity != null || d.vanity != ""){
									message += "Username: " + d.vanity + "\n"	
								}
								message += "Gender: " + gender + "\n"
								message += "Profile Link: " + d.profileUrl
								api.sendMessage(message, event.threadID, event.messageID)
							})
						}
					})
				}
			}
		}
	}
}
