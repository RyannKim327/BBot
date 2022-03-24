const { keep_alive } = require("./keep_alive")
const login = require("fca-unofficial")
const fs = require("fs")

const filter = require("./script/filter")
const info = require("./script/info")
const morse = require("./script/morse")
const music = require("./script/music")
const qr = require("./script/qr")
const quote = require("./script/quote")
const specials = require("./script/specials")
const verse = require("./script/verse")
const what = require("./script/what")
const wiki = require("./script/wiki")

const prefix = "√"
const adminPrefix = "<< "
const adminPostfix = " >>"

const gc = process.env['gc']
let vip = []
let gc_admin = []

let service = true
let ban_users = ""
let ban_thread = ""

let say_active = 0

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
					if(event.type == "message"){
						if(command == "toggle"){
							service = !service
							if(!gc.includes(threadID)){
								api.sendMessage("Bot service turned " ((service) ? "on" : "off") + " to all threads.", threadID)
							}
							api.sendMessage("Bot service turned " + ((service) ? "on" : "off") + " to all threads.", gc)
						}else if(command == "bot: sleep" && !ban_thread.includes(threadID)){
							api.getThreadInfo(threadID, (err, data) => {
								if(err) return console.error("Error [Thread Sleep]: " + err)
								ban_thread += threadID + "/"
								api.sendMessage({
									body: "Good night guys.",
									attachment: fs.createReadStream(`${__dirname}/img/sleep.gif`)
								}, threadID)
								api.sendMessage(`You turned off the bot service for ${data.threadName}.`, gc)
							})
						}else if(command == "bot: wake-up" && ban_thread.includes(threadID)){
							api.getThreadInfo(threadID, (err, data) => {
								if(err) return console.error("Error [Thread Wake-up]: " + err)
								ban_thread = ban_thread.replace(threadID + "/", "")
								api.sendMessage("Hi guys, I'm back.", threadID)
								api.sendMessage(`You turned on the bot service for ${data.threadName}.`, gc)
							})
						}
					}else if(event.type == "message_reply"){
						let reply_senderID = event.messageReply.senderID
						let reply_body = event.messageReply.messageID
						let reply_low = reply_body.toLowerCase()
						if(command == "bot: ban" && !ban_users.includes(reply_senderID)){
							api.getUserInfo(reply_senderID, (err, data) => {
								if(err) return console.error("Error [User ban]: " + err)
								ban_users += reply_senderID + "/"
								let name = data[reply_senderID]['name']
								api.sendMessage({
									body: `Bot features for ${name} is now turned off.`,
									mentions: [{
										tag: `${name}`,
										id: reply_senderID
									}]
									}, threadID)
							})
						}else if(command == "bot: unban" && ban_users.includes(reply_senderID)){
							api.getUserInfo(reply_senderID, (err, data) => {
								if(err) return console.error("Error [User unban]" + err)
								ban_users = ban_users.replace(reply_senderID + "/", "")
								let name = data[reply_senderID]['name']
								api.sendMessage({
									body: `Bot features for ${name} is now turned on.`,
									mentions: [{
										tag: `${name}`,
										id: reply_senderID
									}]
								}, threadID)
							})
						}
					}
				}
			}else if((service && !ban_users.includes(senderID) && ban_thread.includes(threadID)) || gc.includes(threadID) || vip.includes(senderID)){
				if(filter(low_body)){
					api.setMessageReaction("🥲", messageID, (err) => {}, true)
				}else{
					if(low_body.startsWith(prefix)){
						if(low_body.startsWith(prefix + "say")){
							if(vip.includes(senderID) || gc.includes(threadID)){
								if(event.type == "message_reply"){
									let data = event.messageReply.body
									let regex = data.match(/^Thread\sID:\s([0-9]+)/)
									say_active = regex[1]
								}
								if(say_active <= 0){
									api.sendMessage("Say active thread is not set yet", threadID)
								}else{
									let msg = body.split(" ")
									msg.shift()
									api.getThreadInfo(say_active, (err, data) => {
										if(err) return console.error("Error [Thread say]: " + err)
										api.sendMessage(msg.join(" "), say_active)
										api.sendMessage(`Your message: ${msg.join(" ")}, is sent to ${data.threadName} successfully.`, threadID)
									})
								}
							}
						}else if(low_body.startsWith(prefix + "bang bang")){
							specials.bang(api, event)
						}else if(low_body.startsWith(prefix + "info")){
							info(api, body, event)
						}else if(low_body.startsWith(prefix + "morse")){
							morse(api, low_body, event)
						}else if(low_body.startsWith(prefix + "music")){
							let file = fs.createWriteStream("song.mp3")
							music(api, body, event, file)
						}else if(low_body.startsWith(prefix + "qr")){
							qr(api, body, event)
						}else if(low_body.startsWith(prefix + "quote")){
							quote(api, low_body, event)
						}else if(low_body.startsWith(prefix + "special")){
							specials.kolai(api, event)
						}else if(low_body.startsWith(prefix + "verse")){
							verse(api, body, event)
						}else if(low_body.startsWith(prefix + "whatis")){
							what(api, body, event)
						}else if(low_body.startsWith(prefix + "wiki")){
							wiki(api, body, event)
						}
					}
				}
			}
		}
	})
})





