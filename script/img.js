const google = require("googlethis")
const fs = require("fs")
const http = require("https")
const request = require("request")
const wiki = require("./wiki")

async function img(query){
	let res = await google.image(query, {
		safe: true
	})
	return res
}

async function revImg(img){
	let r = await google.search(img, {
		ris: true,
		safe: true
	})
	return r.results
}

module.exports = async (api, event, regex) => {
	if(event.type == "message_reply"){
		if(event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type == "photo"){
			let res = await revImg(encodeURIComponent(event.messageReply.attachments[0].url))
			console.log("Log [RIS]: " + res)
			if(res.length > 0){
				let d = res[Math.floor(Math.random() * res.length)]
				console.log(res)
				api.sendMessage({
					body: `Result: [Reverse Image Search]\nI found ${res.length} results, and this is one of them.\nTitle: ${d.title}\n~ ${d.description}\nReference: ${d.url}`,
					url: d.url
				},event.threadID, event.messageReply.messageID)
			}else{
				api.sendMessage("No results found", event.threadID, event.messageReply.messageID)
			}
		}else{
			api.sendMessage("Google Reverse Image Search:\nThere must have image replied to this command.\nFile formats: (jpg, jpeg, png).", event.threadID, event.messageID)
		}
	}else{
		let d = event.body.match(regex)
		let r = await img(d[1])
		console.log(r)
		let file
		let e = r[Math.floor(Math.random() * r.length)]
		let req = request(e.url)
		file = fs.createWriteStream(event.messageID + "_img.png")
		req.pipe(file)
		file.on("finish", () => {
			api.sendMessage({
				body: `Result: [Image Search]\nTitle: ${e.origin.title}\nSource: ${e.origin.source}`,
				attachment: fs.createReadStream(__dirname + "/../" + event.messageID + "_img.png").on("end", async () => {
					const name = __dirname + "/../" + event.messageID + "_img.png"
					if(fs.existsSync(name)){
						fs.unlink(name, (err) => {
							if(err) console.log("Error [IMG]: " + err)
						})
					}
				})
			}, event.threadID, event.messageID)	
		})
		if(e.origin.source.includes(".lwikipedia.org")){
			let url = e.origin.source.split("/")
			wiki(api, url[url.length - 1], event)
		}
	}
}
