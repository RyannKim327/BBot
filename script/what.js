const fs = require("fs")
const axios = require("axios")


async function whatIs(x){
	let o = await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/" + x).then((response) => {
		return response.data[0]
	}).catch((err) => {
		return "Error 123 " + err.message
	})
	return o
}

module.exports = (api, body, event) => {
	let w = body.split(" ")
	w.shift()
	let o = whatIs(w)
	let r = ""
	o.then((response) => {
		r = "You've searched about the word \"" + response.word + "\"\n"
		if(response.phonetics[0].text != undefined){
			let p = response.phonetics
			r += p[0].text + "\n"
		}
		if(response.origin != undefined){
			r += response.origin + "\n"
		}
		if(response.meanings != undefined){
			let means = response.meanings
			for(let i = 0; i < means.length; i++){
				r += "Part of speech: " + means[i].partOfSpeech + "\n"
				for(let j = 0; j < means[i].definitions.length; j++){
					let d = means[i].definitions[j]
					if(d.definition != undefined){
						r += "[" + (j + 1) + "] " + d.definition + "\n"
						if(d.example != undefined){
							r += "Example " + d.example + "\n\n"
						}else{
							r += "\n\n"
						}
					}
				}
			}
		}
		if(response.sourceUrls != undefined){
			r += "References:\n"
			let sauce = response.sourceUrls
			for(let i = 0; i < sauce.length; i++){
				r += sauce[i] + "\n"
			}
		}
		if(response.phonetics != undefined){
			let p = response.phonetics
			for(let i = 0; i < p.length; i++){
				if(p[i].audio.includes("https://")){
					let f = fs.createWriteStream("whatis.mp3")
					let g = http.get(p[i].audio, (rs) => {
						rs.pipe(f)
						f.on("finish", (err) => {
							api.sendMessage({
								body: r,
								attachment: fs.createReadStream(__dirname + "/whatis.mp3").on("end", async () => {
									if(fs.existsSync(__dirname + "/whatis.mp3")){
										fs.unlink(__dirname + "/whatis.mp3", (err) => {
											if(err){
												console.log(err)
											}else{
												console.log("Done")
											}
										})
									}
								})
							}, event.threadID, event.messageID)
						})
					})
					break
				}else{
					if(i >= p.length){
						api.sendMessage(r, event.threadID, event.messageID)
					}
				}
			}
		}else{
			api.sendMessage(r, event.threadID, event.messageID)
		}
	}).catch((err) => {
		api.sendMessage("Word is not found", event.threadID, event.messageID)
		console.log("Error " + err)
	})
}