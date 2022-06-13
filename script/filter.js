const fs = require("fs")

module.exports = (body) => {
	//const regex = new RegExp(fs.readFileSync("prefs/badwords.txt", "utf8"), "i")
	const regex = /^(bobo|bobu|bold|bubo|bubu|fuck|fuck\syou|gaga|gago|gagu|kulangot|kwak|olol|olul|pota|potaena|putangina|putang\sina|ulol|ulul|tanga|taena|tangina|yawa)$/i

	let text = body.split(" ")
	let res = false
	for(let i = 0; i < text.length; i++){
		if(regex.test(text[i])){
			res = true
			break
		}
	}
	return res
}
/*
module.exports = (body) => {
	let data = body.split(" ")
	let bad = fs.readFileSync("prefs/badwords.txt", "utf8").split(", ")
	let a = false

	for(let b = 0; b < data.length; b++){
		for(let c = 0; c < bad.length; c++){
			if(data[b] == bad[c]){
				console.log(data[b])
				a = true
				break
			}
		}
	}
	
	return a
}*/