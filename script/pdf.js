const axios = require("axios")
const http = require("https")
const fs = require("fs")
const ggl = require("googlethis")

async function search(query){
	let result = await ggl.search(query, {
		safe: true
	})
	return result
}

module.exports = async (api, event, regex) => {
	let data = event.body.match(regex)
	api.setMessageReaction("🔎", event.messageID, (er) => {}, true)
	let a = await search(data[1] + " pdf").then((r) => {
		return r
	}).catch((e) => {
		console.log(e)
		return null
	})
	let b = a.results
	console.log(b)
	let d = true
	e = 0
	for(let c = 0; c < b.length; c++){
		let title = b[c].title.replace(/\//gi, "_")
		if(b[c] != undefined && b[c].url.includes(".pdf")){
			let file = fs.createWriteStream("temp/" + title + ".pdf")
			let name = `${__dirname}/../temp/${title}.pdf`
			try{
				d = false
				http.get(b[c].url, (r) => {
					r.pipe(file)
					file.on("finish", () => {
						api.sendMessage({
							body: `Source title: ${b[c].title}\nSource link: ${b[c].url}`,
							attachment: fs.createReadStream(name).on("end", () => {
								if(fs.existsSync(name)){
									fs.unlink(name, (err) => {
										if(err) return console.error("Error [PDF]: " + err)
										api.setMessageReaction("👌", event.messageID, (er) => {}, true)
									})
								}
							})
						}, event.threadID, event.messageID)
					})
				})
			}catch(e){
				if(fs.existsSync(name)){
					fs.unlink(name, (err) => {
						if(err) return console.error("Error [PDF]: " + err)
						d = false
					})
				}
			}
		}
		e++
	}
	if(d && e >= b.length - 1){
		api.sendMessage("I can't find a link on my query", event.threadID, event.messageID)
		api.setMessageReaction("✖", event.messageID, (er) => {}, true)
	}
}