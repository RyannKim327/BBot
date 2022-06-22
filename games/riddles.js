const axios = require("axios")
const fs = require("fs")

async function riddle(){
	let output = await axios.get("https://riddles-api.vercel.app/random").then((r) => {
		return r.data
	}).catch((e) => {
		console.error("Error [Riddles]: " + e)
		return null
	})
	return output
}

module.exports = async (api, event, regex) => {
	let json = JSON.parse(fs.readFileSync("data/games.json", "utf8"))
	if(json.riddles.ans[event.senderID] == undefined){
		let data = await riddle()
		json.riddles.ans[event.senderID] = data.answer.toLowerCase()
		if(json.riddles.score[event.senderID] == undefined){
			json.riddles.score[event.senderID] = 0
		}
		api.sendMessage("Here's your riddle:\n\n" + data.riddle + "\n\nJust send a message using the format: JC, the answer is <answer>", event.threadID)
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
	}else{
		let data = event.body.match(regex)[1]
		let ans = data.toLowerCase()
		if(ans == json.riddles.ans[senderID]){
			json.riddles.score[event.senderID] += 1
			api.sendMessage("You've got it.\n\nCurrent score: " + json.riddles.score[event.senderID], event.threadID)
		}else{
			json.riddles.score[event.senderID] -= 1
			api.sendMessage("Wrong answer, the correct answer is " + json.riddles.ans[event.senderID] + "\n\nCurrent score: " + json.riddles.score[event.senderID], event.threadID)
		}
		json.riddles.ans[event.senderID] = undefined
		fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
	}
}
/*
{
		"riddle": "They have not flesh, nor feathers, nor scales, nor bone. Yet they have fingers and thumbs of their own. What are they?",
		"answer": "Gloves"
}
*/
