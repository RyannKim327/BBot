const login = require("fca-unofficial")
const { keep_alive } = require("./keep_alive")
const fs = require("fs")

const filter = require("./script/filter")
const info = require("./script/info")
const morse = require("./script/morse")
const music = require("./script/music")
const qr = require("./script/qr")
const quote = ("./script/quote")
const special = require("./script/specials")
const verse = require("./script/verse")
const what = require("./script/what")
const wiki = require("./script/wiki")

const prefix = "√"
const adminPrefix = "<< "
const adminPostfix = ">>"
const separator = "|"

const gc = process.env['gc']
const cute = process.env['abril']

const gc_admin = []

let morning = ""
let aftie = ""
let eve = ""
let night = ""

let ban_users = ""
let ban_thread = ""
let toggle_bot = true

let say_active = 0

login({appState: JSON.parse(process.env['state'])}, (err, api) => {
	if(err) return console.log("Error [API]: " + err)
	api.sendMessage("BhieBot is now active", gc)
	const myself = api.getCurrentUserID()
	let vip = []
	let admin = []
	api.getThreadInfo(gc, (err, data) => {
		if(err) return console.log("Error [Thread VIP Data]: " + )
		vip = data.participantIDs
	})
	api.getThreadInfo(gc, (err, data) => {
		if(err) return console.log("Error [Thread ADMIN Data]: " + e)
		const list = data.adminIDs
		for(let index = 0; index < list.length; index++){
			admin.push(list[index].id)
		}
	})
	api.setOptions({
		listenEvents: true,
		selfListen: true
	})
	api.listen(async (err, event) => {
		if(err) return console.log("Error [Events]: " + err)
		const threadID = event.threadID
		const messageID = event.messageID
		const senderID = event.messageID
		const body = event.body
		const low_body = body.toLowerCase
		api.getThreadInfo(threadID, (err, data) =>{
			if(err) return console.log("Error [Thread GC Admin Data]: " + err)
			let list = data.adminIDs
			for(let index = 0; index < list.length; index++){
				gc_admin.push(list[index].id)
			}  
		})
		if(low_body.startsWith(adminPrefix) && low_body.endsWith(adminPostfix)){
			const command = body.replace("<< ", "").replace(" >>", "")
			if(gc_admin.includes(senderID)){
				if(command == "sleep"){
					ban_thread += threadID + "/"
					api.sendMessage("Bot service turned off for this thread.", threadID)
					api.geThreadInfo(threadID, (err, data) => {
						if(err) return console.log("Error [Thread Admin off Data]: " + err)
						api.sendMessage(`An admin turned off the bot service on ${data.threadName}.`, gc)
					})
				}
			}else if(command == "status"){
				let message = ""
				if(toggle_bot){
					message += "I'm active now " + ((ban_thread.includes(threadID)) ? "but on sleep mode." : "and still on duty")
				}else{
					messsage += "I'm not active now. Tell to my owners to open me if you want to."
				}
				api.sendMessage(message, threadID, messageID)
			}else if(admin.includes(senderID)){
				if(command == "toggle"){
					toggle_bot = !toggle_bot
					if(gc != threadID){
						api.sendMessage("Bot service turned " + ((toggle_bot) ? "on" : "off") + " to all threads except the admin room.", threadID)
					}
					api.sendMessage("Bot service turned " + ((toggle_bot) ? "on" : "off") + " to all threads except the admin room.", gc)
				}else if(command == "bot: deactivate" && gc != threadID){
					ban_thread += threadID + "/"
					api.sendMessage("Bot service turned off for this thread.", threadID)
					api.geThreadInfo(threadID, (err, data) => {
						if(err) return console.log("Error [Thread You off Data]: " + err)
						api.sendMessage(`You turned off the bot service on ${data.threadName}.`, gc)
					})
				}else if(command == "bot: activate" && gc != threadID){
					ban_thread = ban_thread.replace(threadID + "/", "")
					api.sendMessage("Bot service turned on for this thread.", threadID)
					api.geThreadInfo(threadID, (err, data) => {
						if(err) return console.log("Error [Thread You on Data]: " + err)
						api.sendMessage(`You turned on the bot service on ${data.threadName}.`, gc)
					})
				}else if(event.type == "message_reply"){
					const thread = event.messageReply.body
					const regex = thread.match(/^Thread\sID:([0-9]+)/)
					if(command == "bot: deactivate"){
						ban_thread += regex[1] + "/"
						api.getThreadInfo(regex[1], (err, data) => {
							if(err) return console.log("Error [Thread reply off]: " +  err)
							api.sendMessage(`Bot service for ${data.threadName} turned off.`, threadID)
						})
					}else if(command == "bot: activate"){
						ban_thread = ban_thread.replace(regex[1] + "/", "")
						api.getThreadInfo(regex[1], (err, data) => {
							if(err) return console.log("Error [Thread reply on]: " + err)
							api.sendMessage(`Bot service for ${data.threadName} turned on.`, threadID)
						})
					}else if(command == "bot: user off"){
						let sID = event.messageReply.senderID
						ban_users += sID + "/"
						api.getUserInfo(sID, (err, data) => {
							if(err) return console.log("Error [User off data]: " + err)
							const name = data[sID]['name']
							api.sendMessage(`Bot service turned off for ${name}.`, threadID)
						})
					}else if(command == "bot: user on"){
						let sID = event.messageReply.senderID
						ban_users = ban_users.replace(sID + "/", "")
						api.getUserInfo(sID, (err, data) => {
							if(err) return console.log("Error [User on data]: " + err)
							const name = data[sID]['name']
							api.sendMessage(`Bot service turned on for ${name}.`, threadID)
						})
					}
				}
			}
		}else if(low_body.startsWith(prefix)){
			if((toggle_bot && !ban_user.includes(senderID) && !ban_thread(threadID)) || vip.includes(senderID) || gc.includes(threadID)){
				if(low_body.startsWith(prefix + "say") && (gc.includes(threadID) || vip.includes(senderID))){
					if(event.type == "message_reply"){
						const thread = event.messageReply.body
						const regex = thread.match(/^Thread\sID:\s([0-9]+)/)
						say_active = regex[1]
						api.sendMessage(`The Thread ID:${say_active} set as current say command active line. You may now send a message without using the reply method.`, threadID)
					}else{
						let thread = body.split(separator)
						say_active = thread[1]
					}
					if(say_active > 0){
						api.sendMessage(body, say_active)
						api.getThreadInfo(say_active, (err, data) => {
							if(err) return console.log("Error [Thread Say]: " + err)
							api.sendMessage("Message sent to " + data.threadName, threadID)
						}
					}else{
						api.sendMessage("Undefined Thread ID", threadID, messageID)
					}
				}else if(event.type == "message"){
					if(low_body.startsWith(prefix + "music")){
						let file = fs.createWriteStream("song.mp3")
						music(api, body, event, file)
					}else if(low_body.startsWith(prefix + "motivate")){
						quote(api, low_body, event)
					}else if(low_body.startsWith(prefix + "bang bang")){
						special.bang(api, low_body, event)
					}else if(low_body.startsWith(prefix + "special")){
						special.kolai(api, low_body, event)
					}else if(low_body.startsWith(prefix + "verse")){
						verse(api, body, event)
					}else if(low_body.startsWith(prefix + "what is")){
						what(api, body, event)
					}else if(low_body.startsWith(prefix + "wiki")){
						wiki(api, body, event)
					}
				}else if(low_body.startsWith(prefix + "info")){
					info(api, body, event)
				}else if(low_body.startsWith(prefix + "morse")){
					morse(api, low_body, event)
				}else if(low_body.startsWith(prefix + "qr")){
					qr(api, body, event)
				}
			}
		}else if((low_body.includes("bhie") || low_body.includes("bhe")) && low_body.includes("bot")){
			const words = low_body.split(/\s\r\n/)
			for(let index = 0; index < words.length; index++){
				const word = words[index]
				if(word == "cute" || word == "kyot" || word == "kyut"){
					if(cute.includes(senderID) && (low_body.includes("ko" ) || low_body.includes("ako"))){
						api.sendMessage({
							body: "Oo, ang cute mo lalo na dito",
							attachment: fs.createReadStream(__dirname + "/img/april.jpg")
						}, threadID, messageID)
					}else if(low_body.includes("april")){
						api.sendMessage({
							body: "Oo, ang cute ni April, lalo na dito.",
							attachment: fs.createReadStream(__dirname + "/img/april.jpg")
						}, threadID, messageID)
					}else{
						api.sendMessage("Cute ka din naman, pero mas cute pa rin si Ulan.", threadID, messageID)
					}
				}
			}
		}
	})
})
