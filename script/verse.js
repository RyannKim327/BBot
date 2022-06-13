const axios = require("axios")

async function myFunction(x){
	if(x.includes("verse of the day")){
		let v = await axios.get("http://labs.bible.org/api/?passage=votd&type=json").then((r) => {
			console.log(r)
			return r.data
		}).catch((e) => {
			console.error("Error [Verse of the day]: " + e)
			return null
		})
		return v
	}else if(x == "random"){
		let v = await axios.get("http://labs.bible.org/api/?passage=random&type=json").then((r) => {
			return r.data
		}).catch((e) => {
			console.error("Error [Random Verse]: " + e)
			return null
		})
		return v
	}else{
		let v = await axios.get("http://labs.bible.org/api/?passage=" + x + "&type=json").then((r) => {
			return r.data
		}).catch((e) => {
			console.error("Error [Custom verse]: " + e)
			return null
		})
		return v
	}
}

module.exports = (api, event, regex) => {
	if(regex == null){
		myFunction("verse of the day").then((r) => {
			if(r == null){
				api.sendMessage("An error occured", event)
			}else{
				let result = "Bible verse of the day:\n\n"
				for(let i = 0; i < r.length; i++){
					result += `[ ${r[i].bookname} ${r[i].chapter}:${r[i].verse} ]\n${r[i].text}\n\n`
				}
				console.log("LOG [Verse of the day]: " + result)
				api.sendMessage(result, event)
			}
		})
	}else{
		api.getUserInfo(event.senderID, (err, data) => {
			if(err) return console.error("Error [Verse]: " + err)
			let gender = ""
			switch(data.gender){
				case 1:
					gender = "Ms."
				break
				case 2:
					gender = "Mr."
				break
				default:
					gender = "Mr./Ms."
			}
			let user = data[event.senderID]['name']
			if(regex == "random"){
				myFunction(regex).then((r) => {
					let result = ""
					let total = r.length
					for(let i = 0; i < total; i++){
						result += "[ " + r[i].bookname + " " + r[i].chapter + ":" + r[i].verse + " ]\n" + r[i].text + "\n\n"
					}
					api.sendMessage({
						body: `A random verse for you ${gender} ${user}\n\n${result}`,
						mentions: [{
							tag: user,
							id: event.senderID
						}]
					}, event.threadID, event.messageID)
				})
			}else if(regex == "verse of the day"){
				myFunction(regex).then((r) => {
					let result = ""
					let total = r.length
					for(let i = 0; i < total; i++){
						result += "[ " + r[i].bookname + " " + r[i].chapter + ":" + r[i].verse + " ]\n" + r[i].text + "\n\n"
					}
					api.sendMessage({
						body: `Here's the bible verse of the day ${gender} ${user}\n\n${result}`,
						mentions: [{
							tag: user,
							id: event.senderID
						}]
					}, event.threadID, event.messageID)
				})
			}else{
				let body = event.body.match(regex)
				myFunction(body[1]).then((r) => {
					if(r == null){
						api.sendMessage("Invalid format, please try again.", event.threadID, event.messageID)
					}else{
						let result = ""
						let total = r.length
						for(let i = 0; i < total; i++){
							result += "[ " + r[i].bookname + " " + r[i].chapter + ":" + r[i].verse + " ]\n" + r[i].text + "\n\n"
						}
						api.sendMessage({
							body: `Here's the bible verse you've requested ${gender} ${user}\n\n${result}`,
							mentions: [{
								tag: user,
								id: event.senderID
							}]
						}, event.threadID, event.messageID)
					}
				})
			}
		})
	}
}
