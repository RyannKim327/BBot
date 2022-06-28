const fs = require("fs")

module.exports = (body) => {
	const json = JSON.parse(fs.readFileSync("prefs/pref.json", "utf8"))
	let data = body.split(" ")
	let result = false
	for(let x = 0; x < data.length; x++){
		if(json.badwords.includes(data[x])){
			result = true
			break
		}
	}
	return result
}
