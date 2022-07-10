
module.exports = async (api, event) => {
	if(event.type == "event"){
		if(event.logMessageType == "log:subscribe"){
			const joiner = await event.logMessageData.addedParticipants
			for(let n in data){
				let usrID = parseInt(n.userFbId)
				let data = await api.getUserInfo(usrID)
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
				let name = data[usrID]['name']
				api.sendMessage({
					body: `Welcome ${g} ${name} please watch this vid to learn more about saga AI`,
					url: "https://youtu.be/HbIgnweie3M",
					mentions:[{
						id: usrID,
						tag: name
					}]
				}, event.threadID)
			}
		}
	}
}
