const axios = require("axios")

async function s(msg){
	let result = await axios.get("https://api-sv2.simsimi.net/v2/?text=" + msg + "&lc=en&cf=false&name=BhieBot").then((r) => {
		return r.data
	}).catch((e) => { 
		console.error("Error [Simsimi]: " + e)
		return null
	})
	return result
}

module.exports = (api, body, event) => {
	let data = body.split(" ")
	if(body.startsWith("bhie bot") || body.startsWith("@bhie bot")){
		data.shift()
	}
	data.shift()
	s(data.join(" ")).then((r) => {
		if(r == null){
			api.sendMessage("Pasensya na, nabobobo ko hahaha.", event.threadID, event.messageID)
		}else{
			api.sendMessage(r.success, event.threadID, event.messageID)
		}
	})
}
