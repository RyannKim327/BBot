const fs = require("fs")
const axios = require("axios")
const http = require("https")
const request = require("request")

async function getWiki(q) {
	let out = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/" + q).then((response) => {
		return response.data
	}).catch((error) => {
		console.error("Error [Wiki Axios]: " + error)
		return null
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
			api.sendMessage("Error: ", event.threadID, event.messageID)
			throw new Error("Document not found")
		}
		if(r.title === undefined){
			api.sendMessage("Error: ", event.threadID, event.messageID)
			throw new Error("Document not found")
		}
		w += `You've search about ${r.title}\n~${r.description}\n\n${r.extract}\n\nReferences\nMobile: ${r.content_urls.mobile.page}\nDesktop: ${r.content_urls.desktop.page}`
		if(r.originalimage !== undefined){
			let f = fs.createWriteStream("wiki.png")
			let go = http.get(r.originalimage.source, (s) => {
				s.pipe(f)
				f.on("finish", () => {
					api.sendMessage({
						body: w,
						attachment: fs.createReadStream(__dirname + "/../wiki.png").on("end", async () => {
							if(fs.existsSync(__dirname + "/../wiki.png")){
								await fs.unlink(__dirname + "/../wiki.png", (err) => {
									if(err) return console.error("Error [Wiki img]: " + err)
								})
							}
						})
					}, event.threadID)
				})
			})
		}else{
			api.sendMessage(w, event.threadID, event.messageID)
		}
	}catch(e){
		api.sendMessage(e, event.threadID, event.messageID)
	}
}
/*
{
	"type":"standard",
	"title":"Odin",
	"displaytitle":"Odin",
	"namespace":{
		"id":0,
		"text":""
	},
	"wikibase_item":"Q43610",
	"titles":{
		"canonical":"Odin",
		"normalized":"Odin",
		"display":"Odin"
	},
	"pageid":19230767,
	"thumbnail":{
		"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Georg_von_Rosen_-_Oden_som_vandringsman%2C_1886_%28Odin%2C_the_Wanderer%29.jpg/218px-Georg_von_Rosen_-_Oden_som_vandringsman%2C_1886_%28Odin%2C_the_Wanderer%29.jpg",
		"width":218,
		"height":320
	},
	"originalimage":{
		"source":"https://upload.wikimedia.org/wikipedia/commons/1/1d/Georg_von_Rosen_-_Oden_som_vandringsman%2C_1886_%28Odin%2C_the_Wanderer%29.jpg",
		"width":500,
		"height":733
	},
	"lang":"en",
	"dir":"ltr",
	"revision":"1078833647",
	"tid":"578210e0-aabf-11ec-9031-77a26336e9cc",
	"timestamp":"2022-03-23T15:38:46Z",
	"description":"Widely attested deity in Germanic mythology",
	"description_source":"local",
	"content_urls":{
		"desktop":{
			"page":"https://en.wikipedia.org/wiki/Odin",
			"revisions":"https://en.wikipedia.org/wiki/Odin?action=history",
			"edit":"https://en.wikipedia.org/wiki/Odin?action=edit",
			"talk":"https://en.wikipedia.org/wiki/Talk:Odin"
		},
		"mobile":{
			"page":"https://en.m.wikipedia.org/wiki/Odin",
			"revisions":"https://en.m.wikipedia.org/wiki/Special:History/Odin",
			"edit":"https://en.m.wikipedia.org/wiki/Odin?action=edit",
			"talk":"https://en.m.wikipedia.org/wiki/Talk:Odin"
		}
	},
	"extract":"Odin is a widely revered god in Germanic mythology. Norse mythology, the source of most surviving information about him, associates him with wisdom, healing, death, royalty, the gallows, knowledge, war, battle, victory, sorcery, poetry, frenzy, and the runic alphabet, and depicts him as the husband of the goddess Frigg. In wider Germanic mythology and paganism, the god was known in Old English as Wōden, in Old Saxon as Uuôden, in Old Dutch as Wuodan, in Old Frisian as Wêda, and in Old High German as Wuotan, all ultimately stemming from the Proto-Germanic theonym *Wōđanaz, meaning 'lord of frenzy', or 'leader of the possessed'.",
	"extract_html":"<p><b>Odin</b> is a widely revered god in Germanic mythology. Norse mythology, the source of most surviving information about him, associates him with wisdom, healing, death, royalty, the gallows, knowledge, war, battle, victory, sorcery, poetry, frenzy, and the runic alphabet, and depicts him as the husband of the goddess Frigg. In wider Germanic mythology and paganism, the god was known in Old English as <b><span><i lang=\"ang\">Wōden</i></span></b>, in Old Saxon as <b><span><i lang=\"osx\">Uuôden</i></span></b>, in Old Dutch as <i><b>Wuodan</b></i>, in Old Frisian as <i><b>Wêda</b></i>, and in Old High German as <b><span><i lang=\"goh\">Wuotan</i></span></b>, all ultimately stemming from the Proto-Germanic theonym *<i><b>Wōđanaz</b></i>, meaning 'lord of frenzy', or 'leader of the possessed'.</p>"}
*/


