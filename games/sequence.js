const fs = require("fs")

function fibbo(){
	let a = Math.floor(Math.random() * 100) + 1
	let p = Math.floor(Math.random() * 13) + 1
	let r = [1]
	let t = a
	let o = ""
	for(let i = 1; i < 15; i++){
		let j = r[i - 1] + t
		t = r[i - 1]
		r[i] = j
	}
	for(let i = 0; i < r.length; i++){
		o += ((i == p) ? "*" : r[i]) + ", "
	}
	return [o, r[p]]
}

function pell(){
	let a = Math.floor(Math.random() * 9) + 1
	let p = Math.floor(Math.random() * 8) + 1
	let r = [0, a]
	let o = ""
	let b = 0
	for(let i = 2; i < 10; i++){
		let c = r[i - 2]
		let d = r[i - 1]
		b = (d + d) + c
		r[i] = b
	}
	for(let i = 0; i < r.length; i++){
		o += ((i == p) ? "*" : r[i]) + ", "
	}
	return [o, r[p]]
}

function def_seq(){
	let m = Math.floor(Math.random() * 100) + 1
	let p = Math.floor(Math.random() * 14) + 1
	let x = 0
	let r = []
	let y = ""
	for(let i = 0; i < 15; i++){
		x += m
		r[i] = x
	}
	for(let i = 0; i < r.length; i++){
		y += ((i == p) ? "*" : r[i]) + ", "
	}
	return [y, r[p]]
}

module.exports = (api, event, regex) => {
	let a = Math.floor(Math.random() * 3)
	let json = JSON.parse(fs.readFileSync("data/games.json", "utf8"))
	if(json.ingame[event.senderID] == undefined){
		let s
		if(a == 1){
			s = pell()
		}else if(a == 2){
			s = def_seq()
		}else{
			s = fibbo()
		}
		console.log(a)
		if(json.seq.score[event.senderID] == undefined){
			json.seq.score[event.senderID] = 0
		}
		json.seq.data[event.senderID] = s[1]
		let hold = "Here's your sequence:\n" + s[0] + "\n\nTo answer this, kindly message with this format: JC, the answer is <number>"
		json.ingame[event.senderID] = hold
		json.current_game[event.senderID] = "Sequencing game"
		api.sendMessage(hold, event.threadID)
	}else{
		let d = event.body.match(regex)[1]
		if(d == json.seq.data[event.senderID]){
			json.seq.score[event.senderID] += 1
			api.sendMessage("You've got it.\n\nCurrent score:  " + json.seq.score[event.senderID], event.threadID)
		}else{
			if(json.seq.score[event.senderID] > 0){
				json.seq.score[event.senderID] -= 1
			}
			api.sendMessage("Wrong answer, the correct one is: " + json.seq.data[event.senderID] + ".\n\nCurrent score:  " + json.seq.score[event.senderID], event.threadID)
		}
		json.seq.data[event.senderID] = undefined
		json.ingame[event.senderID] = undefined
		json.current_game[event.senderID] = undefined
	}
	fs.writeFileSync("data/games.json", JSON.stringify(json), "utf8")
}
