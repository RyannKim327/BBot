const ggl = require("googlethis")
const fs = require("fs")
const http = require("https")

module.exports = async (api, body, event) => {
	let news = await ggl.getTopNews().headline_stories
	console.log(news[0])
	//let a = news.length
	//let b = Math.floor(Math.random() * a)
	/*let c = news//[b]
	let d = "Title: " + c.title + "\nBy: " + c.by + "\nPublished: " + c.published + "\nSource: " + c.url
	if(image == undefined){
		api.sendMessage(d, event.threadID, event.messageID)
	}else{
		let e = fs.createWriteStream("news.jpg")
		http.get(c.image, (r) => {
			r.pipe(e)
			e.on("finish", () => {
				api.sendMessage({
					body: d,
					attachment: fs.crreateReadStream(__dirname + "/../news.jpg").on("end", async () => {
						if(fs.existsSync(__dirname + "/../news.jpg")){
							fs.unlink(__dirname + "/../news.jpg", (err) => {
								if(err){
									coonsole.error("Error [FS News]: " + err)
								}
							})
						}
					})
				}, event.threadID, event.messageID)
			})
		})
	}
	
	console.log(news)*/
}

/*
title
url
image
published
by
*/
