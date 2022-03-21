const axios = require("axios")

async function myFunction(x){
	if(x.includes("of the day")){
		let v = await axios.get("http://labs.bible.org/api/?passage=votd&type=json").then((r) => {
			console.log(r)
			return r.data
		}).catch((e) => {
			return "Error"
		})
		return v
	}else if(x == ""){
		let v = await axios.get("http://labs.bible.org/api/?passage=random&type=json").then((r) => {
			return r.data
		}).catch((err) => {
			return "Error"
		})
		return v
	}else{
		let v = await axios.get("http://labs.bible.org/api/?passage=" + x + "&type=json").then((r) => {
			return r.data
		}).catch((e) => {
			return "Error"
		})
		return v
	}
}

module.exports = (api, body, event) => {
	let text = body.split(" ")
	text.shift()
	myFunction(text.join(" ")).then((r) => {
		let result = ""
		let total = r.length
		for(let i = 0; i < total; i++){
			result += "[ " + r[i].bookname + " " + r[i].chapter + ":" + r[i].verse + " ]\n" + r[i].text + "\n\n"
		}
		api.sendMessage(result, event.threadID, event.messageID)
	})
}
