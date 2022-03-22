const fs = require("fs")
const http = require("https")

module.exports = (api, body, event) => {
	let xpl = body.split(" ")
	api.sendMessage("h", event.threadID)
	xpl.shift()
	let data = "http://api.qrserver.com/v1/create-qr-code/?150x150&data=" + xpl.join(" ")
	let f = fs.createWriteStream("qr.jpg")
	http.get(data, (r) => {
		r.pipe(f)
		f.on("finish", () => {
			api.sendMessage({
				body: "QR Code Generated",
				attachment: fs.createReadStream(__dirname + "/../qr.jpg").on("end", async () => {
					if(fs.existsSync(__dirname + "/../qr.jpg")){
						fs.unlink(__dirname + "/../qr.jpg", (err) => {
							if(err){
								console.log(err)
							}
						})
					}
				}
			}, event.threadID, event.messageID)
		})
	})
}
