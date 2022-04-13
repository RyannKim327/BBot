const fs = require("fs")
const request = require("request")

module.exports = async (api, body, event) => {
	let data = body.split(" ")[2]
	let url = "https://github-readme-stats.vercel.app/api?username=" + data + "&show_icons=true&theme=radical"
	let file = fs.createWriteStream("gh.gif")
	let r = request(encodeURI(url))
	r.pipe(file)
	file.on("close", () => {
		api.sendMessage({
			attachment: fs.createReadStream(__dirname + "/gh.gif").on("end", async () => {
				if(fs.existsSync(__dirname + "/gh.gif")){
					fs.unlink(__dirname + "/gh.gif", (err) => {
						if(err) return console.error("Error [Github]: " + err)
					})
				}
			})
		}, event.threadID, event.messageID)
	})
}
