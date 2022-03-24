const { keep_alive } = require("./keep_alive")
const login = require("fca-unofficial")
const fs = require("fs")

const prefix = ""
const adminPrefix = "<< "
const adminPostfix = " >>"

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
			api.markAsReadAll((err) => {
				if(err) return console.error("Error [Mark as Read All]: " + err)
			})
			let threadID = event.threadID
			let senderID = event.senderID
			let messageID = event.messageID
			let body = event.body
			let low_body = body.toLowerCase()
			api.getThreadInfo(threadID, (err, data) => {
				if(err) return console.error("Error [Thread admin gc]: " + err)
				let list = data.adminIDs
				for(let i = 0; i < list.length; i++){
					gc_admin.push(list[i].id)
				}
			})
			if(low_body.startsWith(adminPrefix) && low_body.endsWith(adminPostfix)){
				let command = low_body.replace(adminPrefix, "").replace(adminPostfix, "")
				if(command == "sleep" && gc_admin.includes(senderID) && !ban_thread.includes(threadID) && !gc.includes(threadID)){
					api.getThreadInfo(threadID, (err, data) => {
						if(err) return console.error("Error [Admin Off]: " + err)
						ban_thread += threadID + "/"
						api.sendMessage("Be right back guys. Please ask my VIPs to activate me to this thread", threadID)
						api.sendMessage(`An admin turned off the bot service on ${data.threadName}.`, gc)
					})
				}else if(vip.includes(senderID)){
					if(command == "toggle"){
						service = !service
						if(!gc.includes(threadID)){
							api.sendMessage("Bot service turned " ((service) ? "on" : "off") + " to all threads.", threadID)
						}
						api.sendMessage("Bot service turned " + ((service) ? "on" : "off") + " to all threads.", gc)
					}
				}
			}
		}
	})
})





