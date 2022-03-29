const axios = require("axios")

async function myFunction(x){
	if(x.includes("of the day")){
		let v = await axios.get("http://labs.bible.org/api/?passage=votd&type=json").then((r) => {
			console.log(r)
			return r.data
		}).catch((e) => {
			console.error("Error [Verse of the day]: " + e)
			return null
		})
		return v
	}else if(x == ""){
		let v = await axios.get("http://labs.bible.org/api/?passage=random&type=json").then((r) => {
			return r.data
		}).catch((err) => {
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

module.exports = (api, body, event) => {
	if(event == null){
		myFunction("verse of the day").then((r) => {
			if(r == null){
				api.sendMessage("An error occured", event)
			}else{
				let result = "Bible verse of the day:\n\n"
				for(let i = 0; i < r.length; i++){
					result += `[ ${r[i].bookname} ${r[i].chapter}:${r[i].verse} ]\n${r[i].text}\n\n`
				}
				console.log("LOG [Verse of the day]: " + result)
				api.sendMessage(result, body)
			}
		})
	}else{
		let text = body.split(" ")
		text.shift()
		text.shift()
		myFunction(text.join(" ")).then((r) => {
			if(r == null){
				api.sendMessage("Invalid format, please try again.", event.threadID, event.messageID)
			}else{
				let result = ""
				let total = r.length
				for(let i = 0; i < total; i++){
					result += "[ " + r[i].bookname + " " + r[i].chapter + ":" + r[i].verse + " ]\n" + r[i].text + "\n\n"
				}
				api.sendMessage(result, event.threadID, event.messageID)
			}
		})
	}
}
