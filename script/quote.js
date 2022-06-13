const axios = require("axios")

async function quote(key){
	let me = await axios.get("https://zenquotes.io/api/quotes/keyword=" + key).then((r) => {
		console.log(r.data)
		return r.data
	}).catch((err) => {
		return "Error"
	})
	return me
}
async function quotes(){
	/*let me = await axios.get("https://www.quotepub.com/api/widget/?type=rand&limit=1").then((r) => {
		return r.data[0]
	}).catch((e) => {
		console.log(e)
		return null
	})
	return me*/
	let me = await axios.get("https://zenquotes.io/api/quotes/random").then((r) => {
		console.log(r.data)
		return r.data[0]
	}).catch((err) => {
		return "Error"
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

module.exports = (api, event, regex) => {
	if(regex == "anime"){
		let q = anime()
		q.then((response) => {
			api.getUserInfo(event.senderID, (err, data) => {
				if(err){
					console.log(err)
				}else{
					const name = data[event.senderID]
					api.sendMessage({
						body: `A quotation for you my dear ${name.firstName}\nFrom: ${response.character}\nIn the anime: ${response.anime}\n~ ${response.quote}`,
						mentions: [{
							tag: `${name.firstName}`,
							id: event.senderID
						}]
					}, event.threadID, event.messageID)
				}
			})
		})
	}else if(regex == "random"){
		quotes().then((response) => {
			api.getUserInfo(event.senderID, (err, data) => {
				if(err){
					console.log(err)
				}else{
					const name = data[event.senderID]
					api.sendMessage({
						body: `A quotation for you my dear ${name.firstName}\nFrom: ${response.a}\n~ ${response.q}`,
						mentions: [{
							tag: `${name.firstName}`,
							id: event.senderID
						}]
					}, event.threadID, event.messageID)
				}
			})
		})
	}else{
		let c = event.body.match(regex)
		quote(c[1]).then((r) => {
			api.getUserInfo(event.senderID, (err, data) => {
				if(err){
					console.error("Error [Quotes]: " + err)
				}else{
					if(r.length > 0){
						let q = r[0]
						let gender = ""
						switch(data.gender){
							case 0:
								gender = "Ms."
							break
							case 1:
								gender = "Mr."
							break
							default:
								gender = "Mr./Ms."
						}
						api.sendMessage({
							body: `A quotation for you ${gender} ${data[event.senderID]['name']}\nAuthor: ${q.a}\n~ ${q.q}`,
							mentions: [{
								tag: data[event.senderID]['name'],
								id: event.senderID
							}]
						}, event.threadID, event.messageID)
					}else{
						api.sendMessage("There's no results found", event.threadID, event.messageID)
					}
				}
			})
		}).catch((e) => {
			api.sendMessage("Something went wrong", event.threadID, event.messageID)
		})
	}
}
