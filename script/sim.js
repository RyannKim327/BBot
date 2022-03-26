const axios = require("axios")

async function s(message){
	let result = await axios.get(`https://api-sv2.simsimi.net/v2/?text=${message}&lc=en&cf=false&name=BhieBot`).then((r) => {
		return r.data
	}).catch((e) => {
		console.error("Error [Simsimi]: " + e)
		return null
	})
	return result
}

module.exports = (api, body, event) => {
	let data = body.split(" ")
	data.shift()
	s(data.join(" ")).then((r) => {
		if(r == null){
			api.sendMessage("Sorry, there's a problem on my mind.", event.threadID, event.messageID)
		}else{
			api.sendMessage(r.success, event.threadID, event.messageID)
		}
	})
}