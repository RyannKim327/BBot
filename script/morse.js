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
	let x = body.toLowerCase()
	const data = x.match(/^√morse\s([to|from]+)\s([\W\w]+)/)
	api.sendMessage(empty(data[2].replace(/^\r\n/, " "), data[1]), event.threadID, event.messageID)
}