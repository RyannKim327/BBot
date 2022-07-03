const axios = require("axios")

async function t(text){
	let result = await axios.get("https://api-baybayin-transliterator.vercel.app/?text=" + text).then((r) => {
		return r.data
	}).catch((e) => {
		console.error("Error [Baybayin API]: " + e)
		return null
	})
	return result
}

module.exports = (api, event, regex) => {
	let data = event.body.match(regex)[1]
	let r = t(data)
	api.sendMessage("Result: " + data + " in baybayin is " + r.baybay, event.threadID)
}
