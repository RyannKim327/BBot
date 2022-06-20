const axios = require("axios")
const fs = require("fs")

async function word(){
	let result = await axios.get("https://random-words-api.vercel.app/word").then((r) => {
		return r.data[0]
	}).catch((e) => {
		console.error("Error [Random Word]: " + e)
		return null
	})
	return result
}

module.exports = async (api, event, regex) => {
	let json = JSON.parse(fs.readFileSync("data/games.json", "utf8"))
	if(json.random.data[event.senderID] == undefined){
		let x = await word()
		let w = x.word
		let a = []
		let b = ""
		for(let i = 0; i < w.length; i++){
			let m = Math.floor(Math.random() * w.length)
			if(a.includes(m)){
				i--
			}else{
				a[i] = m
			}
		}
		for(let i = 0; i < a.length; i++){
			b += w[a[i]]
		}
		json.random.data[event.senderID] = w.toLowerCase()
		api.sendMessage("Here's your random word: " + b.toLowerCase() + "\n\nSend a message using the format: JC, the word is <word>", event.threadID)
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
	}else{
		let d = event.body.match(regex)[1]
		let data = d.toLowerCase()
		if(json.random.score[event.senderID] == undefined){
			json.random.score[event.senderID] = 0
		}
		if(data == json.random.data[event.senderID]){
			json.random.score[event.senderID] += 1
			api.sendMessage("You've got it.\n\nYour current score is: " + json.random.score[event.senderID], event.threadID)
		}else{
			json.random.score[event.senderID] -= 1
			let r_word = json.random.data[event.senderID]
			api.sendMessage(`Wrong, the correct answer is ${r_word}\n\nYour current score is ${json.random.score[event.senderID]}`, event.threadID)
		}
		json.random.data[event.senderID] = undefined
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
	}
}
