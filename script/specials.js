const fs = require("fs")

const bang = (api, event) => {
	api.getUserInfo(event.senderID, (err, data) => {
		if(err){
			console.log(err)
		}else{
			let name = data[event.senderID]
			let gender = ""
			switch(name.gender){
				case 1:
					gender = "Ms."
				break
				case 2:
					gender = "Mr."
				break
				default:
					gender = "Mr./Ms."
			}
			api.sendMessage({
				body: `A bang bang command for ${gender} ${name.name}`,
				mentions: [{
					tag: `${name.name}`,
					id: event.senderID
				}],
				attachment: [
					fs.createReadStream(__dirname + "/../img/b1.gif"),
					fs.createReadStream(__dirname + "/../img/b2.gif"),
					fs.createReadStream(__dirname + "/../img/b3.gif")
				]
			}, event.threadID, event.messageID)
		}
	})
}

const kolai = (api, event) => {
	api.getThreadInfo(event.threadID, (err, data) => {
		api.sendMessage({
			body: `Kulay command executed to ${data.threadName}`,
			attachment: fs.createReadStream(__dirname + "/../img/kolai.gif")
		}, event.threadID)
	})
}

module.exports = {
	bang,
	kolai
}
