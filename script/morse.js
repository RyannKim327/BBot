function empty(str, condition){
	const n = [
		"a", "b", "c", "d", "e",
		"f", "g", "h", "i","j",
		"k", "l", "m", "n", "o",
		"p", "q", "r", "s", "t",
		"u", "v", "w", "x", "y",
		"z", " ",
		"0", "1", "2", "3", "4",
		"5", "6", "7", "8", "9"
	]
	const m = [
		".-", "-...", "-.-.", "-..", ".",
		"..-.", "--.",  "....", "..", ".---",
		"-.-", ".-..", "--", "-.", "---",
		".--.", "--.-", ".-.", "...", "-",
		"..-", "...-", ".--", "-..-", "-.--",
		"--..", "/",
		"-----", ".----", "..---", "...--", "....-",
		".....", "-....", "--...", "---..", "----."
	]
	let o = ""
	if(condition == "to"){
		str = str.toLowerCase()
		for(let i = 0; i < str.length; i++){
			for(let j = 0; j < m.length; j++){
				if(str[i] == n[j]){
					o += m[j] + " "
					break
				}
			}
		}
	}else{
		let s = str.split(" ")
		for(let i = 0; i < s.length; i++){
			for(let j = 0; j < m.length; j++){
				if(s[i] == m[j]){
					o += n[j]
					break
				}
			}
		}
	}
	return o
}

module.exports = (api, body, event) => {
	if(event.type == "message_reply"){
		let rBody = event.messageReply.body
		let x = rBody.toLowerCase()
		let data = body.match(/NoBhie:\smorse\s([to|from]+)/)
		api.sendMessage(empty(x.replace(/\r\n/, " "), data[1]), event.threadID, event.messageID)
	}else{
		if(body.split(" ").length > 3){
			let data = body.match(/NoBhie:\smorse\s([to|from]+)\s([\w\W\s\r\n]+)/)
			let x = data[2].toLowerCase()
			api.sendMessage(empty(x.replace(/\r\n/, " "), data[1]), event.threadID, event.messageID)
		}else{
			api.sendMessage(`Morse code Command:\nThe format for this code is\nNoBhie: morse [from|to] <word|phrase>.`, event.threadID, event.messageID)
		}
	}
}
