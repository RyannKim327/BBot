
module.exports = async (api, event) => {
	if(event.type == "event"){
		if(event.logMessageType == "log:subscribe"){
			const joiner = await event.logMessageData.addedParticipants
			for(let n in joiner){
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
					body: `Hello ${g} ${name}!!!\n\n    Welcome to SAGA AI please watch and understand this video to learn more about Saga AI and to maximize your income without investing.`,
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
