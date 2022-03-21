const fs = require("fs")
module.exports = (api, body, event) => {
	let message = ""
	if(event.type == "message_reply"){
		api.getUserInfo(event.messageReply.senderID, (err, data) => {
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
				message += "Name: " + d.name + "\n"
				if(d.vanity != undefined){
					message += "Username: " + d.vanity + "\n"
				}
				message += "Gender: " + gender + "\n"
				message += "Profile Link: " + d.profileUrl
				api.sendMessage(message, event.threadID, event.messageID)
			}
		})
	}else{
		let info = body.split(" ")
		if(info.length > 0){
			try{
				let mention = Object.keys(event.mentions)[0]
				api.getUserInfo(mention, (err, data) => {
					if(err){
						console.log(err)
						api.sendMessage("Error occured", event.threadID, event.messageID)
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
						if(d.vanity != undefined){
							message += "Username: " + d.vanity + "\n"	
						}
						message += "Gender: " + gender + "\n"
						message += "Profile Link: " + d.profileUrl
						api.sendMessage(message, event.threadID, event.messageID)
					}
				})
			}catch(e){
				if(isNaN(info[1])){
					api.getUserID(info[1], (err, obj) => {
						if(err){
							console.log(err)
							api.sendMessage("Error occured", event.threadID, event.messageID)
						}else{
							api.getUserInfo(obj.userID, (err, data) => {
								let d = data[obj.userID]
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
								if(d.vanity != undefined){
									message += "Username: " + d.vanity + "\n"	
								}
								message += "Gender: " + gender + "\n"
								message += "Profile Link: " + d.profileUrl
								api.sendMessage(message, event.threadID, event.messageID)
							})
						}
					})
				}else{
					api.getUserInfo(info[1], (err, data) => {
						if(err){
							console.log(err)
							api.sendMessage("Error occured", event.threadID, event.messageID)
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
							if(d.vanity != undefined){
								message += "Username: " + d.vanity + "\n"	
							}
							message += "Gender: " + gender + "\n"
							message += "Profile Link: " + d.profileUrl
							api.sendMessage(message, event.threadID, event.messageID)
						}
					})
				}
			}
		}else{
			api.sendMessage(fs.readFileSync("../txt/abt.txt", "utf8"), event.threadID)
		}
	}
}
