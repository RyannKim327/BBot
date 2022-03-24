const { keep_alive } = require("./keep_alive")
const login = require("fca-unofficial")
const fs = require("fs")

const gc = process.env['gc']
let vip = []
let gc_admin = []

let service = true
let ban_users = ""
let ban_thread = ""

login({appState: JSON.parse(process.env['state'])}, (err, api) => {
	if(err) return console.error("Error [Api error]: " + err)
	api.getThreadInfo(gc, (err, data) => {
		if(err) return console.error("Error [Thread admin data]: " + err)
		vip = data.participantIDs
	})
	api.sendMessage("BhieBot service is now active", gc)
	api.setOptions({
		listenEvents: true,
		selfListen: false
	})
	api.listen(async (err, event) => {
		if(err) return console.error("Error [Listen events]: " + err)
		if(event.body != null){
			let threadID = event.threadID
			let senderID = event.senderID
			let messageID = event.messageID
			let body = event.body
			let low_body = body.toLowerCase()
			if(threadID == gc){
				api.sendMessage(low_body, gc)
			}
		}
	})
})