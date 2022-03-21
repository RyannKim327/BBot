const axios = require("axios")

async function quote(){
	let me = await axios.get("https://zenquotes.io/api/random/").then((r) => {
		console.log(r.data[0])
		return r.data[0]
	}).catch((err) => {
		return "Error"
	})
	return me
}
async function quotes(){
	let me = await axios.get("https://www.quotepub.com/api/widget/?type=rand&limit=1").then((r) => {
		return r.data[0]
	}).catch((e) => {
		console.log(e)
		return null
	})
	return me
}
async function anime(){
	let me = await axios.get("https://animechan.vercel.app/api/random").then((r) => {
		console.log(r.data)
		return r.data
	}).catch((err) => {
		return "Error"
	})
	return me
}

module.exports = (api, body, event) => {
	let c = body.split(" ")
	if(c[1] === "anime"){
		let q = anime()
		q.then((response) => {
			api.getUserInfo(event.senderID, (err, data) => {
				if(err){
					console.log(err)
				}else{
					const name = data[event.senderID]
					api.sendMessage({
						body: `A quotation for you my dear @${name.firstName}\nFrom: ${response.character}\nIn the anime: ${response.anime}\n~ ${response.quote}`,
						mentions: [{
							tag: `@${name.firstName}`,
							id: event.senderID
						}]
					}, event.threadID, event.messageID)
				}
			})
		})
	}else{
		quotes().then((response) => {
			api.getUserInfo(event.senderID, (err, data) => {
				if(err){
					console.log(err)
				}else{
					const name = data[event.senderID]
					api.sendMessage({
						body: `A quotation for you my dear @${name.firstName}\nFrom: ${response.quote_author}\n~ ${response.quote_body}`,
						mentions: [{
							tag: `@${name.firstName}`,
							id: event.senderID
						}]
					}, event.threadID, event.messageID)
				}
			})
		})
	}
}