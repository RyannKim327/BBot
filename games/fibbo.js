const fs = require("fs")

module.exports = (api, event, regex) => {
	let json = JSON.parse(fs.readFileSync("data/games.json", "utf8"))
	let regex_reply = /Guess what's next!!!([\w\W]+)/
	if(regex.test(event.body)){
		//let num = fs.readFileSync(event.threadID + "_fibbonacci.txt", "utf8").replace("[", "").replace("]", "")
		let guess = event.body.match(regex)[1]
		if(guess == json.fibbo.digit[event.senderID]){
			json.fibbo.score[event.senderID] += 1
			api.sendMessage("You've got it.\n\nYour score: " + json.fibbo.score[event.senderID], event.threadID)
		}else{
			json.fibbo.score[event.senderID] -= 1
			api.sendMessage("Wrong, the correct answer is: " + json.fibbo.digit[event.senderID] + "\n\nYour score: " + json.fibbo.score[event.senderID], event.threadID)
		}
		json.fibbo.digit[event.senderID] = undefined
		//fs.unlink(__dirname + "/../" + event.threadID + "_fibbonacci.txt", (e) => {})
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
	}else{
		//let file = fs.createWriteStream(event.threadID + "_fibbonacci.txt")
		let message = "Guess what's next!!!\n\nThis game is just a simple sequencing game, wherein you need to guess the missing number. To answer, just message using the format below:\n\nHere's your sequence: "
		let random = Math.floor(Math.random() * 100)
		let position = Math.floor(Math.random() * 14) + 1
		let result = [1]
		let temp = random
		for(let i = 1; i < 15; i++){
			let e = result[i - 1] + temp
			temp = result[i - 1]
			result[i] = e
		}
		for(let i = 0; i < result.length; i++){
			message += ((i == position) ? "*" : result[i]) + ", "
		}
		//let data = "[" + result[position] + "]"
		if(json.fibbo.score[event.senderID] == undefined){
			json.fibbo.score[event.senderID] = 0
		}
		json.fibbo.digit[event.senderID] = result[position]
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
		message += "\n\nFormat: JC, the hidden number is <number>"
		api.sendMessage(message, event.threadID)
	}
}
