const ggl = require("googlethis")
const fs = require("fs")
const http = require("https")

module.exports = async (api, body, event) => {
	let n = await ggl.getTopNews()
	//console.log(news.headline_stories)
	let news = n.headline_stories
	let a = news.length
	let b = Math.floor(Math.random() * a)
	let c = news[b]
	let d = "Title: " + c.title + "\nBy: " + c.by + "\nPublished: " + c.published + "\nSource: " + c.url
	if(c.image == undefined){
		api.sendMessage(d, event.threadID, event.messageID)
	}else{
		let e = fs.createWriteStream("news.jpg")
		http.get(c.image, (r) => {
			r.pipe(e)
			e.on("finish", () => {
				api.sendMessage({
					body: d,
					attachment: fs.createReadStream(__dirname + "/../news.jpg").on("end", async () => {
						if(fs.existsSync(__dirname + "/../news.jpg")){
							fs.unlink(__dirname + "/../news.jpg", (err) => {
								if(err){
									console.error("Error [FS News]: " + err)
								}
							})
						}
					})
				}, event.threadID, event.messageID)
			})
		})
	}
	//console.log(news)
}

/*
title
url
image
published
by
*/
