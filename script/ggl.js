const ggl = require("googlethis")
const fs = require("fs")
const http = require("https")

async function search(query){
	const opts = {
		page: 0,
		safe: true,
		additional_parameters: {
			hl: "en"
		}
	}
	const output = await ggl.search(query, opts)
	return output
}

module.exports = async (api, body, event) => {
	let data = body.split(" ")
	data.shift()
	let res = await search(data.join(" "))
	if(res.knowledge_panel.title != "N/A"){
		let output = res.knowledge_panel
		console.log("Log [Info]: " + output.title)
		api.sendMessage(`Result [Information]:\n${output.title}\n${output.description}`, event.threadID, event.messageID)
	}else if(res.translation != undefined){
		let output = res.translation
		api.sendMessage(`Result [Translate]:\nTranslation from ${output.source_language} to ${output.target_language}\nOriginal: ${output.source_text}\nTranslated: ${output.target_text}`, event.threadID, event.messageID)
	}else if(res.dictionary != undefined){
		let output = res.dictionary
		let definitions = ""
		let examples = ""
		//if(output.definitions != undefined)
			let defines = output.definitions
			for(let i = 0; i < defines.length; i++){
			  definitions += (i + 1) + ": " + defines[i] + "\n"
			}
		//}
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
	}else{
		let output = res.results[0]
		api.sendMessage(`Result [Results]:\n${output.title}\n~${output.description}`, event.threadID, event.messageID)
	}
}

/*
{
   //...
   "dictionary":{
      "word":"a·maz·ing",
      "phonetic":"/əˈmāziNG/",
      "audio":"https://ssl.gstatic.com/dictionary/static/sounds/20200429/amazing--_us_1.mp3",
      "definitions":[
         "causing great surprise or wonder; astonishing.",
         "startlingly impressive."
      ],
      "examples":[
         "\"an amazing number of people registered\"",
         "\"she makes the most amazing cakes\""
      ]
   }
}

{
   //...
   "translation": {
      "source_language":"English - detected",
      "target_language":"German",
      "source_text":"this is a test",
      "target_text":"das ist ein Test"
   }
}
*/








