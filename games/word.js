const axios = require("axios")
const fs = require("fs")

async function _words(){
	let result = await axios.get("https://random-words-api.vercel.app/word").then((r) => {
		return r.data[0]
	}).catch((e) => {
		return null
	})
	return result
}

module.exports = async (api, event, regex) => {
	let json = JSON.parse(fs.readFileSync("data/games.json", "utf8"))
	let word = json.word//
	if(word.score[event.senderID] == undefined){
		word.score[event.senderID] = 0
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
	}
	if(regex.test(event.body)){
		let msg = /\- Word Game \-([\w\W]+)/
		//if(msg.test(event.messageReply.body) && word.data[event.senderID] != undefined /*&& fs.existsSync(__dirname + "/../" + event.threadID + "_word.txt")*/){
			let guess = event.body.match(regex)[1]
			let a = guess.toLowerCase()
			let got = word.data[event.senderID].toLowerCase()
			
			if(got == a){
				word.score[event.senderID] += 1
				word.trials[event.senderID] = 0
				word.data[event.senderID] = undefined
				api.sendMessage("You've got it\n\nYour score: " + word.score[event.senderID] , event.threadID, event.messageID)
			}else{
				if(word.trials[event.senderID] > 1){
					api.sendMessage(`Wrong answer ${word.trials[event.senderID] - 1} trials left`, event.threadID)
					word.trials[event.senderID] -= 1
				}else{
					word.trials[event.senderID] -= 1
					word.score[event.senderID] -= 1
					api.sendMessage("Wrong, the correct answer is: " + got + "\n\nYour score: " +  (word.score[event.senderID]), event.threadID, event.messageID)
					word.data[event.senderID] = undefined
				}
			}
			fs.unlink(__dirname + "/../" + event.threadID + "_word.txt", (e) => {})
			fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
		/*}else{
			api.sendMessage("This is not for you.", event.threadID)
		}*/
	}else{
		//fs.createWriteStream(event.threadID + "_word.txt")
		let r = await _words().then((r) => {
			return r
		}).catch((e) => {
			return null
		})
		let words = r.word
		let a = []
		let b = 0
		let output = ""
		if(words.length <= 3){
			b = 1
		}else if(words.length <= 5){
			b = 2
		}else if(words.length <= 8){
			b = 3
		}else if(words.length <= 10){
			b = 4
		}else if(words.length <= 13){
			b = 5
		}else if(words.length <= 15){
			b = 6
		}else if(words.length <= 18){
			b = 7
		}else if(words.length <= 20){
			b = 8
		}else if(words.length <= 23){
			b = 9
		}else if(words.length <= 25){
			b = 10
		}else if(words.length <= 28){
			b = 11
		}else if(words.length <= 30){
			b = 12
		}else if(words.length <= 33){
			b = 13
		}else if(words.length <= 35){
			b = 14
		}else if(words.length <= 38){
			b = 15
		}else if(words.length <= 40){
			b = 16
		}else if(words.length <= 43){
			b = 17
		}else{
			b = 18
		}
		for(let c = 0; c < b; c++){
			let temp = Math.floor(Math.random() * words.length)
			if(a.includes(temp)){
				c--
			}else{
				a[c] = temp
			}
		}

		for(let c = 0; c < words.length; c++){
			if(a.includes(c)){
				output += words[c]
			}else{
				output += "*"
			}
		}
		word.data[event.senderID] = words
		word.trials[event.senderID] = 3
		//fs.writeFileSync(event.threadID + "_word.txt", words, "utf8")
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
		api.sendMessage(`- Word Game -\nHere's your clue: ${output}\nDefinition: ${r.definition}\n\nFormat: JC, its <answer>`, event.threadID)
	}
}