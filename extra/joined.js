const fs = require("fs")

module.exports = async (api, event) => {
	console.log("Test")
	if(event.type == "event"){
		console.log("Working event")
		switch(event.logMessageType){
			case "log:subscribe":
				await api.getThreadInfo(event.threadID, (err, data) => {
					if(err) return console.error("Error [Log Subscribe]: " + err)
					if(data.isGroup){
						const joiner = event.logMessageData.addedParticipants
						const me = api.getCurrentUserID()
						let messages = {
							body: "",
							mentions: []
						}
						for(newbies of joiner){
							if(newbies == me){
								api.sendMessage(fs.readFileSync("txt/abt.txt"), event.threadID)
								break
							}
							const id = newbies.userFbId
							api.getUserInfo(id, (err, user_data) => {
								if(err) return console.err("Error [User joiner]: " + err)
								let g = ""
								let user = user_data[id]
								switch(user.gender){
									case 0:
										g = "Ms."
									break
									case 1:
										g = "Mr."
									break
									default:
										g = "Mr./Ms."
								}
								messages.body = `Welcome to ${data.threadName}, ${g} ${user.name}. Please follow rules and be active. Communicate with others and respect all members speciay the admins.`
								messages.mentions.push[{
									id, tag: `${user.name}`
								}]
							})
						}
						api.sendMessage(messages, event.threadID)
					}
				})
			break
			case "log:unsubscribe":
				
			break
		}
	}
}
