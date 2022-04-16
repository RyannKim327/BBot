const fs = require("fs")

module.exports = async (api, event) => {
	console.log("Test")
	if(event.type == "event"){
		console.log("Working event")
		switch(event.logMessageType){
			case "log:subscribe":
				console.log("Log [Subs]")
				let thread = await api.getThreadInfo(event.threadID)
				if(thread.isGroup){
					const joiner = await event.logMessageData.addedParticipants
					const me = api.getCurrentUserID()
					let messages = {
						body: "",
						mentions: []
					}
					for(let newb of joiner){
						const id = newb.userFbId
						if(id == me){
							api.sendMessage(fs.readFileSync("txt/abt.txt", "utf8"), event.threadID)
						}else{
							let user = await api.getUserInfo(id)
							let g = ""
							switch(user.gender){
								case 1:
									g = "Ms."
								break
								case 2:
									g = "Mr."
								break
								default:
									g = "Mr./Ms."
							}
							messages.body = `Welcome to ${thread.threadName}, ${g} ${user[id].name}. Enjoy your staying here, always be patience and be active if you can. Respect all members specially admins.`
							messages.mentions.push = [{
								id,
								tag: `${user[id].name}`
							}]
							api.sendMessage(messages, event.threadID)
						}
					}
				}
			break
			case "log:unsubscribe":
				console.log("Exit")
			break
		}
	}
}
