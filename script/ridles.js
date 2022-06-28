const axios = require("axios")

async function rids(){
	let result = await axios.get("https://api-pinoy-bugtong.vercel.app").then((r) => {
		console.log(r)
		return r.data
	}).catch((e) => {
		console.error("Error [api]: " + e)
		return null
	})
	return result
}

module.exports = async (api, event, regex) => {
	let riddle = await rids()
	api.sendMessage(riddle.b, event.threadID)
}
