const fs = require("fs")
const tools = require("fb-tools")
const http = require("https")

async function getLink(url){
	let result = await tools.getVideoUrl(url)
	return result.sd
}

module.exports = (api, body, event, file) => {
	let xpl = body.split(" ")
	let name = `${__dirname}/../fb.mp4`
	xpl.shift()
	xpl.shift()
	http.get(getLink(xpl.join("")), (r) => {
		r.pipe(file)
		file.on("finish", () => {
			api.sendMessage({
				body: "Here's your request",
				attachment: fs.createReadStream(name).on("end", () => {
					if(fs.existsSync(name)){
						fs.unlink(name, (err) => {
							if(err){
								console.error("Error [Unlink fb]: " + err)
							}
						})
					}
				})
			}, event.threadID, event.messageID)
		})
	})
}
