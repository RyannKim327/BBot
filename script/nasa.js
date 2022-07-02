const axios = require("axios")
const fs = require("fs")
const request = require("request")

async function nasayou(){
	let data = await axios.get("https://api.nasa.gov/planetary/apod?api_key=DuqrL1XzDT7H5lEcfqKecpsaSuwMDU0lYZqcdk5U").then((r) => {
		return r.data
	}).catch((e) => {
		console.error("Error [Nasa]: " + e)
		return null
	})
	return data
}

module.exports = (api, event) => {
	nasayou().then((r) => {
		if(r.media_type == "image"){
			let file = fs.createWriteStream("temp/nasa.jpg")
			let r2 = request(r.hdurl)
			r2.pipe(file)
			file.on("close", () => {
				api.sendMessage({
					body: `${r.title}\n    "${r.explanation}"\n\n~ ${r.copyright} - ${r.date}`,
					attachment: fs.createReadStream(__dirname + "/../temp/nasa.jpg").on("end", () => {
						if(fs.existsSync(__dirname + "/../temp/nasa.jpg")){
							fs.unlink(__dirname + "/../temp/nasa.jpg", (e) => {
								if(e) return console.error("Error [Nasa Unlink]: " + e)
							})
						}
					})
				}, event)
			})
		}
	})
}
