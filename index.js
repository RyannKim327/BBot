const { keep_alive } = require("./keep_alive")
const login = require("fca-unofficial")
const fs = require("fs")
const cron = require("node-cron")

const joined = require("./extra/joined")

const compiller = require("./script/compiller")
const date = require('./script/date')
const filter = require("./script/filter")
const ggl = require("./script/ggl")
const img = require("./script/img")
const info = require("./script/info")
const morse = require("./script/morse")
const music = require("./script/music")
const news = require("./script/news")
const qr = require("./script/qr")
const quote = require("./script/quote")
const sim = require("./script/sim")
const sing = require("./script/sing")
const solve = require("./script/solve")
const specials = require("./script/specials")
const verse = require("./script/verse")
const weather = require("./script/weather")
const what = require("./script/what")
const wiki = require("./script/wiki")

const prefix = "NoBhie: "
const adminPrefix = "<< "
const adminPostfix = " >>"

const gc = process.env['gc']
let vip = []
let gc_admin = []

let service = true
let ban_users = ""
let ban_thread = ""

let say_active = 0
let say_tuned = false
let say_thread = 0

let morning = ""
let aftie = ""
let evening = ""
let night = ""

function resetTime(time){
	if(time >= 5 && time < 12){
		aftie = ""
		evening = ""
		night = ""
	}else if(time >= 12 && time < 18){
		morning = ""
		evening = ""
		night = ""
	}else if(time >= 18 && time < 22){
		morning = ""
		aftie = ""
		night = ""
	}else{
		morning = ""
		aftie = ""
		evening = ""
	}
}

login({appState: JSON.parse(process.env['state'])}, (err, api) => {
	if(err) return console.error("Error [Api error]: " + err)
	api.getThreadInfo(gc, (err, data) => {
		if(err) return console.error("Error [Thread admin data]: " + err)
		vip = data.participantIDs
	})
	const myself = api.getCurrentUserID()
	api.sendMessage("BhieBot service is now active", gc)
	cron.schedule('30 23 * * *', () => {
		api.getThreadList(20, null, ['INBOX'], (err, data) => {
			if(err) return console.error("Error [Thread List Cron]: " + err)
			let i = 0
			let j = 0
			while(j < 5 && i < data.length){
				if(data[i].isGroup && gc != data[i].threadID && data[i].name != null && 4699051006857054 != data[i].threadID){
					verse(api, data[i].threadID, null)
					j++
				}
				i++
			}
		})
	})
	cron.schedule('20 * * * *', () => {
		console.log("Command Executed")
	})
	api.setOptions({
		listenEvents: true,
		selfListen: true
	})
	api.listen(async (err, event) => {
		if(err) return console.error("Error [Listen events]: " + err)
		//joined(api, event)
		if(event.body != null){
			console.log("Log [Message Type]: " + event.logMessageType)
			api.markAsReadAll((err) => {
				if(err) return console.error("Error [Mark as Read All]: " + err)
			})
			let time = date("Asia/Manila").getHours()
			let mins = date("Asia/Manila").getMinutes()
			console.log(`Log[Time]: ${time} : ${mins}`)
			resetTime(time)
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
			if(say_tuned && say_thread > 0 && say_active == threadID){
				api.getThreadInfo(threadID, (err, data) => {
					if(err) return console.error("Error [Thread stay tuned]: " + err)
						if(say_active == threadID && senderID != myself){
							api.getUserInfo(senderID, (error, info) => {
								if(error) return console.error("Error [Back response]: " + error)
								let user = info[senderID]
								if(event.attachments.length > 0){
									api.sendMessage(`An Attachment was sent from ${user.name} of ${data.threadName}.`, say_thread)
								}else{
									api.sendMessage(`From ${user.name} of ${data.threadName}:\n${body}`, say_thread)
								}
							})
						}
				})
			}
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
								api.sendMessage("Bot service turned " + ((service) ? "on" : "off") + " to all threads.", threadID)
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
						}else if(command == "list"){
							api.getThreadList(20, null, ["INBOX"], (err, data) => {
								if(err) return console.error("Error [List of threads]: " + err)
								for(let i = 0; i <= data.length; i++){
									if(data[i].threadID != threadID && data[i].isGroup){
										api.sendMessage(`Thread ID: ${data[i].threadID}\nThread name: ${data[i].name}`, threadID)
									}
								}
							})
						}else if(command == "admin"){
							api.sendMessage("Here's your admin commands:\n\n\n<< admin >>\n<< list >>\n<< toggle >>\n<< bot: sleep >>\n<< bot: wake-up >>\n<< bot: ban >>\n<< bot: unban >>\n<< status >>", threadID, messageID)
						}else if(command == "status"){
							let msg = ""
							if(!service){
								msg += "BhieBot is not active in all threads, except the admin room."
							}else{
								msg += "BhieBot is active now" + ((ban_thread.includes(threadID)) ? " but not in this thread." : " even in this thread.")
							}
							api.sendMessage(msg, threadID, messageID)
						}else if (command == "tuned" && (gc.includes(threadID) || vip.includes(threadID))) {
							say_tuned = !say_tuned
							say_thread = threadID
							api.sendMessage("Say tuned: " + say_tuned, say_thread)
						}
					}else if(event.type == "message_reply"){
						let reply_senderID = event.messageReply.senderID
						let reply_body = event.messageReply.messageID
						let reply_low = reply_body.toLowerCase()
						if(command == "bot: ban" && !ban_users.includes(reply_senderID)){
							api.getUserInfo(reply_senderID, (err, data) => {
								if(err) return console.error("Error [User ban]: " + err)
								ban_users += reply_senderID + "/"
								let name = data[reply_senderID]
								api.sendMessage({
									body: `Bot features for ${name.name} is now turned off.`,
									mentions: [{
										tag: `${name.name}`,
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
						}else if(command == "bot: unsend"){
							api.unsendMessage(event.messageReply.messageID, (err) => {
								if(err){
									console.log("Error [Unsend]: " + err);
								}
							})
							api.setMessageReaction("✔", messageID, (err) => {
								if(err){
									console.log("Error [Message react]: " + err)
								}
							}, true)
						}
					}
				}
			}else if(event.type == "message" && say_tuned && say_active > 0 && say_thread == threadID && senderID != myself && !low_body.startsWith(prefix) && !low_body.startsWith(adminPrefix)){
				api.sendMessage(body, say_active)
				api.getThreadInfo(say_active, (err, data) => {
					if (err) return console.error("Error [Auto send thread]: " + err)
						api.sendMessage(`A message sent to: ${data.threadName}\nMessage: ${body}`, say_thread)
				})
			}else if((service && !ban_users.includes(senderID) && !ban_thread.includes(threadID)) || gc.includes(threadID) || vip.includes(senderID)){
				if(filter(low_body)){
					api.setMessageReaction("🥲", messageID, (err) => {}, true)
				}else{
					if(body.startsWith(prefix) && low_body.includes(":")){
						const spl = low_body.split(" ").length
						if(body.startsWith(prefix + "say") && spl >= 3){
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
									msg.shift()
									api.getThreadInfo(say_active, (err, data) => {
										if(err) return console.error("Error [Thread say]: " + err)
										api.sendMessage(msg.join(" "), say_active)
										api.sendMessage(`A message sent to: ${data.threadName}\nMessage: ${msg.join(" ")}`, threadID)
									})
								}
							}
						}else if(body.startsWith(prefix + "bang bang")){
							specials.bang(api, event)
						}else if (body.startsWith(prefix + "run")){
							compiller(api, body, event)
						}else if(body.startsWith(prefix + "img")){
							img(api, body, event)
						}else if(body.startsWith(prefix + "info")){
							info(api, body, event)
						}else if(body.startsWith(prefix + "google")){
							ggl(api, body, event)
						}else if(body.startsWith(prefix + "morse")){
							morse(api, body, event)
						}else if(body.startsWith(prefix + "test")){
							if(fs.existsSync(__dirname + "/sing.mp3")){
								api.sendMessage("Lemme finish the earlier request. Thanks.", threadID, messageID)
							}else{
								let file = fs.createWriteStream("sing.mp3")
								sing(api, body, event, file)
							}
						}else if(body.startsWith(prefix + "sing")){
							if(fs.existsSync(__dirname + "/song.mp3")){
								api.sendMessage("Lemme finish the earlier request. Thanks.", threadID, messageID)
							}else{
								let file = fs.createWriteStream("song.mp3")
								music(api, body, event, file)
							}
						}else if(body.startsWith(prefix + "whats up")){
						 	news(api, body, event)
						}else if(body.startsWith(prefix + "qr")){
							qr(api, body, event)
						}else if(body.startsWith(prefix + "quote")){
							quote(api, low_body, event)
						}else if(body.startsWith(prefix + "solve")){
							solve(api, body, event)
						}else if(body.startsWith(prefix + "special")){
							specials.kolai(api, event)
						}else if( body.startsWith(prefix + "verse")){
							verse(api, body, event)
						}else if(body.startsWith(prefix + "status")){
							weather(api, body, event)
						}else if(body.startsWith(prefix + "what is")){
							what(api, body, event)
						}else if(body.startsWith(prefix + "wiki")){
							wiki(api, body, event)
						}
					}else if(senderID != myself && body.startsWith("@No-Bhie Bot")){
						if(body == "@No-Bhie Bot"){
							api.sendMessage("Bakit?", threadID, messageID)
						}else if(low_body.includes("cute") || low_body.includes("kyut") || low_body.includes("kyot")){
							if(low_body.includes("ko") && cute.includes(senderID)){
								api.sendMessage({
									body: "Oo, ang cute mo, lalo na sa picture na to.",
									attachment: fs.createReadStream(__dirname + "/img/april.jpg")
								}, threadID, messageID)
							}else if(low_body.includes("ba si april")){
								api.sendMessage({
									body: "Oo, ang cute nya, lalo na sa picture na to.",
									attachment: fs.createReadStream(__dirname + "/img/april.jpg")
								}, threadID, messageID)
							}else if(low_body.includes("ba si") && (low_body.includes("Rheign") || low_body.includes("kimmy"))){
								api.sendMessage("Walang duda, kids can tell.", threadID, messageID)
							}else{
								api.sendMessage("Hindi eh, mas cute pa rin si Rheign.", threadID, messageID)
							}
						}else{
							sim(api, low_body, event)
						}
					}else if(!myself.includes(senderID) && event.type == "message"){
						api.getUserInfo(senderID, (err, data) => {
							if(err) return console.error("Error [Greetings User]: " + err)
							let user = data[senderID]
							let gender = ""
							let kasarian = ""
							switch(user.gender){
								case 1:
									gender = "Ms."
									kasarian = "Binibining"
								break
								case 2:
									gender = "Mr."
									kasarian = "Ginoong"
								break
								default:
									gender = "Mr./Ms."
									kasarian = "Ginoo/Binibining"
							}
							if((time >= 5 && time < 12) && !morning.includes(senderID) && (low_body.includes("morning") || low_body.includes("magandang umaga"))){
								let msg = [
									`Good morning ${gender} ${user.name}. Come on, let's have some coffee.`,
									`A blessed morning to you ${gender} ${user.name}. Don't forget to take a heavy breakfast.`,
									`Magandang umaga ${kasarian} ${user.name}. Isa nanamang araw para harapin, at sagupain ang hamon ng buhay.`,
									`Isang mapagpalang araw para sa iyo ${kasarian} ${user.name}. Tara at magkape muna tayo.`
								]
								let lateMsg = [
									`Late morning ${gender} ${user.name}. Lunch time is near. By the way, don't skip your meal.`,
									`Good day ${gender} ${user.name}, you woke-up too late. Maybe you have a late night talk with a wrong person again.`,
									`Magandang umaga sa iyo ${kasarian} ${user.name}, at puyat ka nanaman. Sana sa susunod ay matulog ka na ng mas maaga, para sabay naman tayong magkape.`,
									`Magandang araw ${kasarian} ${user.name}. Sana tamang tao na ang kapuyatan mo. At wag kakalimutan, magluto ka na, malapit na ang tanghalian.`
								]
								if(time >= 5 && time < 10){
									api.sendMessage({
										body: msg[Math.floor(Math.random() * msg.length)],
										mentions: [{
											tag: `${user.name}`,
											id: senderID
										}]
									}, threadID, messageID)
								}else{
									api.sendMessage({
										body: lateMsg[Math.floor(Math.random() * lateMsg.length)],
										mentions: [{
											tag: `${user.name}`,
											id: senderID
										}]
									}, threadID, messageID)
								}
								morning += senderID + " "
							}else if((time >= 12 && time < 18) && !aftie.includes(senderID) && (low_body.includes("magandang hapon") || low_body.includes("afternoon") || low_body.includes("aftie"))){
								if(time >= 12 && time < 15){
									api.sendMessage({
										body: `Good afternoon ${gender} ${user.name}. Don't skip your meal.`,
										mentions: [{
											tag: `${user.name}`,
											id: senderID
										}]
									}, threadID, messageID)
								}else{
									api.sendMessage({
										body: `Good afternoon ${gender} ${user.name}`,
										mentions: [{
											tag: `${user.name}`,
											id: senderID
										}]
									}, threadID, messageID)
								}
								aftie += senderID + " "
							}else if((time >= 18 && time < 22) && !evening.includes(senderID) && (low_body.includes("goodeve") || low_body.includes("good eve") || low_body.includes("magandang gabi") || low_body.includes("evening"))){
								let g_eve = [
									`Good evening ${gender} ${user.name}. Its been a long day for you. Take some rest for a while.`,
									`Magandang gabi din sa iyo ${kasarian} ${user.name}. Isa nanamang nakakapagod na araw. Pahinga ka muna, at magluto na, gabi na.`,
									`Oras na para magluto ${kasarian} ${user.name}. Saka wag kakalimutang magpahinga.`
								]
								api.sendMessage({
									body: g_eve[Math.floor(Math.random() * g_eve.length)],
									mentions: [{
										tag: `${user.name}`,
										id: senderID
									}]
								}, threadID, messageID)
								evening += senderID + " "
							}else if((time >= 22 || time < 5) && !night.includes(senderID) && (low_body.includes("goodnight") || low_body.includes("good night"))){
								let g_night = [
									`Good night and sweet dreams ${gender} ${user.name}. Dn't forget to pray before you sleep`,
									`Ikaw ay matulog na para bukas ${kasarian} ${user.name} ay may lakas upang harapin at sagupain muli ang bawat hamon ng buhay`
								]
								.sendMessage({
									body: g_night[Math.floor(Math.random() * g_night.length)],
									mentions: [{
										tag: `${user.name}`,
										id: senderID
									}],
									attachment: fs.createReadStream(__dirname + "/img/goodnight.gif")
								}, threadID, messageID)
								night += senderID + " "
							}
						})
					}else if(myself != senderID && event.type == "message_reply"){
						if(event.messageReply.senderID == myself){
							if(low_body.includes("thank") || low_body.includes("tnx")){
								let bool_num = Math.floor(Math.random() * 10)
								if((bool_num % 2) == 0){
									api.setMessageReaction("💗", messageID, (err) => {}, true)
								}else{
									api.sendMessage("You're welcome", threadID, messageID)
								}
							}
						}
					}
				}
			}
		}
	})
})
