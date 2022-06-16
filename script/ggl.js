const ggl = require("googlethis")
const fs = require("fs")
const http = require("https")
const request = require("request")

const define = require("./what")
const pedia = require("./wiki")

async function search(query){
	const opts = {
		safe: true,
		additional_parameters: {
			hl: "en"
		}
	}
	const output = await ggl.search(query, opts).then((r) => {
		return r
	}).catch((e) => {
		console.error("Error [Google this]: " + e)
		return null
	})
	return output
}

async function img(query){
	const output = await ggl.image(query, {
		safe: true
	})
	return output
}

module.exports = async (api, event) => {
	let data = event.body.split(" ")
	data.shift()
	if(data.length > 0){
		api.setMessageReaction("🔎", event.messageID, (e) => {}, true)
		let res = await search(data.join(" "))
		if(res.did_you_mean != undefined)
			api.sendMessage("You mean: " + res.did_you_mean, event.threadID, event.messageID)
		if(res.knowledge_panel.title != "N/A" && res.knowledge_panel.lyrics == undefined && (res.knowledge_panel.description != "N/A" || res.featured_snippet.description != "N/A")){
			let output = res.knowledge_panel
			console.log("Log [Info]: " + output.title)
			let obj = Object.keys(output)
			let m = `Result [Information]:\n${output.title}`
			if(output.type != undefined && output.type != "N/A")
				m += " - " + output.type
			if(output.description != "N/A")
				m += `\n~ ${output.description}`
			if(res.featured_snippet.description != "N/A" && res.featured_snippet.description != undefined)
				m += `\n~ ${res.featured_snippet.description}`
			obj.forEach((r) => {
				if(r != "title" && r != "description" && r != "type" && r != "url"){
					if(Array.isArray(output[r])){
						m += "\n-~-~-~-~-~\n" + r.replace(/_/gi, " ").toUpperCase() + ":\n"
						let rate = output[r]
						for(let i in rate) {
							let x = Object.keys(rate[i])
							x.forEach((y) => {
								m += y.toUpperCase() + ": " + rate[i][y] + "\n" //+ ": " + rate[i].rating + "\n"
							})
						}
					}else{
						m += "\n-~-~-~-~-~\n" + r.replace(/_/gi, " ").toUpperCase() + ": " + output[r]
					}
				}
			})
			if(output.url != undefined && output.url != "N/A"){
				m += "\n-~-~-~-~-~\nSource: " + output.url
				let wiki = output.url.split("/")
				if(output.url.includes("en.m.wikipedia.org")){
					const pedia = require("./wiki")
					pedia(api, wiki[wiki.length - 1], event)
				}
			}
			api.sendMessage(m, event.threadID, event.messageID)
			console.log(output)
		}else if(res.knowledge_panel != "N/A" && res.knowledge_panel.lyrics != undefined){
			let output = res.knowledge_panel
			api.sendMessage(`Result [Lyrics]\nTitle: ${output.title}\n${output.type}\n\n${output.lyrics}`, event.threadID, event.messageID)
		}else if(res.featured_snippet.title != "N/A"){
			let output = res.featured_snippet
			let m = "Result [Featured Snippet]:\n"
			m += output.title + "\n~ " + output.description
			if(output.url != undefined && output.url != "N/A"){
				let wiki = output.url.split("/")
				if(output.url.includes("en.m.wikipedia.org")){
					pedia(api, wiki[wiki.length - 1], event)
				}
			}
			api.sendMessage(m, event.threadID, event.messageID)
			api.setMessageReaction("✔", event.messageID, (e) => {}, true)
		}else if(res.translation != undefined){
			let output = res.translation
			api.sendMessage(`Result [Translate]:\nTranslation from ${output.source_language} to ${output.target_language}\nOriginal: ${output.source_text}\nTranslated: ${output.target_text}`, event.threadID, event.messageID)
			api.setMessageReaction("✔", event.messageID, (e) => {}, true)
		}else if(res.dictionary != undefined){
			let output = res.dictionary
			let definitions = ""
			let examples = ""
			let defines = output.definitions
			for(let i = 0; i < defines.length; i++){
				definitions += (i + 1) + ": " + defines[i] + "\n"
			}
			if(output.examples != undefined){
				let ex = output.examples
				for(let i = 0; i < ex.length; i++){
					examples += (i + 1) + ": " + ex[i] + "\n"
				}
			}
			if(output.audio != null){
				let file = fs.createWriteStream(`${output.word}.mp3`)
				http.get(output.audio, (p) => {
					p.pipe(file)
					file.on("finish", () => {
						api.sendMessage({
							body: `Result [Dictionary]:\n${output.word} (${output.phonetic})\n\nDefinitions:\n${definitions}\n\nExamples:\n${examples}`,
							attachment: fs.createReadStream(`${__dirname}/../${output.word}.mp3`).on("end", async () => {
								if(fs.existsSync(__dirname + "/../" + output.word + ".mp3")){
									fs.unlink(`${__dirname}/../${output.word}.mp3`, (err) => {
										if(err) return console.error("Error [Dictionary audio]: " + err)
									})
								}
							})
						}, event.threadID, event.messageID)
					})
				})
			}else{
				api.sendMessage(`Result [Dictionary]:\n${output.word} (${output.phonetic})\n\nDefinitions:\n${definitions}\n\nExamples:\n${examples}`, event,threadID, event.messageID)
			}
			define(api, data[data.length - 1], event, "")
			api.setMessageReaction("✔", event.messageID, (e) => {}, true)
		}else if(res.unit_converter != undefined){
			let convert = res.unit_converter
			let m = `Result [Unit Converter]:\nInput: ${convert.input}\nOutput: ${convert.output}\nFormula: ${convert.formula}`
			api.sendMessage(m, event.threadID, event.messageID)
			api.setMessageReaction("✔", event.messageID, (e) => {}, true)
		}else{
			let r = res.results
			if(r.length > 0){
				for(i = 0; i < 3; i++){
					let output = r[i]
					if(output.title != undefined || output != undefined){
						api.sendMessage({
							body: `Result [Results]:\n${output.title}\n~${output.description}\nSource: ${output.url}`,
							url: output.url
						}, event.threadID, event.messageID)
						let wiki = output.url.split("/")
						if(output.url.includes("en.m.wikipedia.org")){
							pedia(api, wiki[wiki.length - 1], event)
						}
					}
				}
			}else{
				api.seneMessage("There is no results found, or might be a server error.", event.threadID)
			}
			console.log(r)
		}
		api.setMessageReaction("✔", event.messageID, (e) => {}, true)
	}else{
		api.sendMessage(`Yes? Do you have any issues about me? Or something you want to ask? Kindly execute << queries >> if you need something you want me to do.`, event.threadID, event.messageID)
	}
}

