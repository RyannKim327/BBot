const axios = require("axios")

async function rids(){
	let result = await axios.get("https://api-pinoy-bugtong.vercel.app").then((r) => {
		return r.data
	}).catch((e) => {
		return null
	})
	return result
}

module.exports = (api, event, regex) => {
	let riddle = rids()
	api.sendMessage(riddle.b, event.threadID)
}
