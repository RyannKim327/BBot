const fws = require("fs")
const axios = require("axios")
const http = require("https")
const request = require("request")

async function getWiki(q) {
	let out = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/" + q).then((response) => {
		return response.data
	}).catch((error) => {
		return error
	})
	return out
}

module.exports = async (api, body, event) => {
	let d = body.split(" ")
	try{
		d.shift()
		let w = ""
		let r = await getWiki(d.join(" "))
		if(r === undefined){
			api.sendMessage("API Returned this: " + r, event.threadID, event.messageID)
			throw new Error("API Returned this: " + r)
		}
		if(r.title === undefined){
			api.sendMessage("API Returned this: " + r, event.threadID, event.messageID)
			throw new Error("API Returned this: " + r)
		}
		w += "You've searched about " + r.title + "\n\nDescription: " + r.description + "\n\n\t" + r.extract + "\n\nSource:\nDesktop: " + r.content_urls.desktop.page + "\nMobile: " + r.content_urls.mobile.page
		if(r.originalimage !== undefined){
			let f = fs.createWriteStream("wiki.png")
			let g_r = request(encodeURI(r.originalimage.source))
			g_r.pipe(f)
			f.on("close", () => {
				try{
					console.log(f)
					api.sendMessage({
						body: "",
						attachment: fs.createReadStream(__dirname + "/../wiki.png").on("end", async () => {
							if(fs.existsSync(__dirname + "/../wiki.png")){
								fs.unlink(__dirname + "/../wiki.png", (err) => {
									if(err){
										console.log("error " + err)
									}else{
										console.log("Done")
									}
								})
								api.sendMessage(w, event.threadID, event.messageID)
							}
						})
					}, event.threadID, event.messageID)
				}catch (err){
					api.sendMessage(w, event.threadID)
				}
			})
		}else{
			api.sendMessage(w, event.threadID, event.messageID)
		}
	}catch(err){
		api.sendMessage(err, event.threadID, event.messageID)
	}
}
