const fs = require("fs")
const request = require("request")

module.exports = async (api, body, event) => {
	let data = body(" ")[2]
	let url = "https://github-readme-stats.vercel.app/api?username=" + data + "&show_icons=true&theme=radical"
	let file = fs.createWriteStream("gh.jpg")
	let r = request(encodeURI(url))
	r.pipe(file)
	file.on("close", () => {
		api.sendMessage({
			attachment: fs.createReadStream(__dirname + "/../gh.jpg").on("end", async () => {
				if(fs.existsSync(__dirname + "/../gh.jpg")){
					fs.unlink(__dirname + "/../gh.jpg", (err) => {
						if(err) return console.error("Error [Github]: " + err)
					})
				}
			})
		}, event.threadID, messageID)
	}
}
