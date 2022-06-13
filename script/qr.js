const fs = require("fs")
const request = require("request")

module.exports = (api, event, regex) => {
	if(event.type == "message_reply"){
		let body = event.messageReply.body
		let data = "http://api.qrserver.com/v1/create-qr-code/?150x150&data=" + body
		let f = fs.createWriteStream("qr.jpg")
		let res = request(encodeURI(data))
		res.pipe(f)
		f.on("close", () => {
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
				})
			}, event.threadID, event.messageID)
		})
	}else{
		let xpl = event.body.match(regex)
		let data = "http://api.qrserver.com/v1/create-qr-code/?150x150&data=" + xpl[1]
		let f = fs.createWriteStream("qr.jpg")
		let res = request(encodeURI(data))
		res.pipe(f)
		f.on("close", () => {
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
				})
			}, event.threadID, event.messageID)
		})
	}
}
