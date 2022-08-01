 const { keep_alive } = require("./keep_alive")
const login = require("fca-unofficial")
const fs = require("fs")
const cron = require("node-cron")

const joined = require("./configs/joined")
const xcl = require("./configs/xcl")
const bday = require("./configs/bday")
const commands = require("./configs/commands")

const covid = require("./script/covid")
const date = require('./script/date')
const filter = require("./script/filter")
const nasa = require("./script/nasa")
const quote = require("./script/quote")
const verse = require("./script/verse")

const prefix = "JC"
const low_pref = prefix.toLowerCase()
const adminPrefix = "<< "
const adminPostfix = " >>"

const regex_admin = /^<< ([\w\W]+) >>$/
const bad_regex = /JC, ([\w]+) is a bad word/i

const gc = process.env['gc']
let vip = []
let gc_admin = []

const excludeGC = process.env['xgc']

function resetTime(time, json){
	let morning = json.greet.morning
	let aftie = json.greet.afternoon
	let evening = json.greet.evening
	let night = json.greet.night
	if(time >= 5 && time < 12){
		json.greet.afternoon = ""
		json.greet.evening = ""
		json.greet.night = ""
	}else if(time >= 12 && time < 18){
		json.greet.morning = ""
		json.greet.evening = ""
		json.greet.night = ""
	}else if(time >= 18 && time < 22){
		json.greet.morning = ""
		json.greet.afternoon = ""
		json.greet.night = ""
	}else{
		json.greet.morning = ""
		json.greet.afternoon = ""
		json.greet.evening = ""
	}
	fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
}

async function activate(){
	console.log("Activate")
	setTimeout(activate, ((1000 * 60) * 20))
}

login({
	appState: JSON.parse(process.env['state']),
	pageID: 109982581806287
}, (err, api) => {
	if(err) return console.error("Error [Api error]: " + err)
	/*api.getThreadInfo(api.getCurrentUserID(), (err, data) => {
		if(err) return console.error("Error [Thread admin data]: " + err)
		vip = data.participantIDs
	})*/
	const myself = api.getCurrentUserID()
	vip = myself
	api.sendMessage("Bot service is now active", myself)
	//bday(api)
	cron.schedule('30 23 * * *', () => {
		api.getThreadList(20, null, ['INBOX'], (err, data) => {
			if(err) return console.error("Error [Thread List Cron]: " + err)
			let i = 0
			let j = 0
			while(j < 10 && i < data.length){
				let json = JSON.parse(fs.readFileSync("prefs/pref.json", "utf8"))
				if(data[i].isGroup && gc != data[i].threadID && data[i].name != null && 4699051006857054 != data[i].threadID && !json.saga.includes(data[i].threadID)){
					covid(api, data[i].threadID)
					verse(api, data[i].threadID, null)
					quote(api, "today", data[i].threadID)
					nasa(api, data[i].threadID)
					j++
				}
				i++
			}
		})
	})
	/*cron.schedule('5 * * * *', () => {
		let time = date("Asia/Manila").getHours()
		let mins = date("Asia/Manila").getMinutes()
		console.log("Command Executed " + time + ":" + mins)
	})*/
	//activate()
	api.setOptions({
		listenEvents: true,
		selfListen: true,
		autoMarkRead: true
	})
	api.listen(async (err, event) => {
		if(err) return console.error("Error [Listen events]: " + err)
		let json = JSON.parse(fs.readFileSync("prefs/pref.json", "utf8"))
		if(!json.saga.includes(event.threadID)){
			joined(api, event)
		}else{
			xcl(api, event)
		}
		if(event.body != null && !json.saga.includes(event.threadID)){
			let {
				body,
				messageID,
				senderID,
				threadID,
				type
			} = event
			/*api.getThreadHistory(threadID, 10, null, (e, h) => {
				console.log(h)
			})*/
			let morning = json.greet.morning
			let aftie = json.greet.afternoon
			let evening = json.greet.evening
			let night = json.greet.night
			let time = date("Asia/Manila").getHours()
			let mins = date("Asia/Manila").getMinutes()
			resetTime(time, json)
			let low_body = body.toLowerCase()
			api.getThreadInfo(threadID, (err, data) => {
				if(err) return console.error("Error [Thread admin gc]: " + err)
				let list = data.adminIDs
				for(let i = 0; i < list.length; i++){
					gc_admin.push(list[i].id)
				}
			})
			if(regex_admin.test(body)){
				let command = body.match(regex_admin)[1]
				if(command == "queries"){
					let q = fs.readFileSync("txt/queries.txt", "utf8")
					api.sendMessage(q, threadID)
				}else if(command == "sleep" && gc_admin.includes(senderID) && !ban_thread.includes(threadID) && !gc.includes(threadID)){
					api.getThreadInfo(threadID, (err, data) => {
						if(err) return console.error("Error [Admin Off]: " + err)
						json.off += threadID + ", "
						api.sendMessage("Be right back guys. Please ask my VIPs to activate me to this thread", threadID)
						api.sendMessage(`An admin turned off the bot service on ${data.threadName}.`, myself)
						fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
					})
				}else if(command == "game leaderboards"){
					let game = JSON.parse(fs.readFileSync("data/games.json", "utf8"))
					let seq = game.seq.score
					let word = game.word.score
					let riddles = game.riddles.score
					let random = game.random.score
					
					let seq_names = Object.keys(seq)
					let seq_score = Object.values(seq)
					
					let word_names = Object.keys(word)
					let word_score = Object.values(word)
					
					let riddles_names = Object.keys(riddles)
					let riddles_score = Object.values(riddles)
					
					let random_names = Object.keys(random)
					let random_score = Object.values(random)
					
					console.log(seq_names)
					
					let no_value = 0
					
					if(seq_names.length > 0){
						let msg = "Leaderboards for Sequencing game:\n"
						let names = seq_names
						let scores = seq_score
						for(let a = 0; a < names.length; a++){
							for(let b = 0; b < a; b++){
								if(scores[a] > scores[b]){
									let name = names[a]
									names[a] = names[b]
									names[b] = name
									
									let score = scores[a]
									scores[a] = scores[b]
									scores[b] = score
								}
							}
						}
						
						for(let a = 0; a < names.length; a++){
							let id = parseInt(names[a])
							let data = await api.getUserInfo(id)
							let n = data[id]['name']
							msg += "Name: " + n + "\nScore: " + scores[a] + "\n\n"
						}
						no_value++
						api.sendMessage(msg, threadID)
					}
					
					if(word_names.length > 0){
						let msg = "Leaderboards for What is the word game:\n"
						let names = word_names
						let scores = word_score
						for(let a = 0; a < names.length; a++){
							for(let b = 0; b < a; b++){
								if(scores[a] > scores[b]){
									let name = names[a]
									names[a] = names[b]
									names[b] = name
									
									let score = scores[a]
									scores[a] = scores[b]
									scores[b] = score
								}
							}
						}
						
						for(let a = 0; a < names.length; a++){
							let id = parseInt(names[a])
							let data = await api.getUserInfo(id)
							let n = data[id]['name']
							msg += "Name: " + n + "\nScore: " + scores[a] + "\n\n"
						}
						no_value++
						api.sendMessage(msg, threadID)
					}
					
					if(random_names.length > 0){
						let msg = "Leaderboards for Guess the word game:\n"
						
						let names = random_names
						let scores = random_score
						for(let a = 0; a < names.length; a++){
							for(let b = 0; b < a; b++){
								if(scores[a] > scores[b]){
									let name = names[a]
									names[a] = names[b]
									names[b] = name
									
									let score = scores[a]
									scores[a] = scores[b]
									scores[b] = score
								}
							}
						}
						
						for(let a = 0; a < names.length; a++){
							let id = parseInt(names[a])
							let data = await api.getUserInfo(id)
							let n = data[id]['name']
							msg += "Name: " + n + "\nScore: " + scores[a] + "\n\n"
						}
						no_value++
						api.sendMessage(msg, threadID)
					}
					
					if(riddles_names.length > 0){
						let msg = "Leaderboards for Pinoy Riddles game:\n"
						
						let names = riddles_names
						let scores = riddles_score
						for(let a = 0; a < names.length; a++){
							for(let b = 0; b < a; b++){
								if(scores[a] > scores[b]){
									let name = names[a]
									names[a] = names[b]
									names[b] = name
									
									let score = scores[a]
									scores[a] = scores[b]
									scores[b] = score
								}
							}
						}
						
						for(let a = 0; a < names.length; a++){
							let id = parseInt(names[a])
							let data = await api.getUserInfo(id)
							let n = data[id]['name']
							msg += "Name: " + n + "\nScore: " + scores[a] + "\n\n"
						}
						no_value++
						api.sendMessage(msg, threadID)
					}
					
					if(no_value <= 0){
						api.sendMessage("There's no data or any leaderboards on the database", threadID)
					}
				}else if(vip.includes(senderID)){
					if(event.type == "message"){
						if(command == "toggle"){
							json.status = !json.status
							if(!json.status){
								if(!myself.includes(threadID)){
									api.sendMessage("Bot service turned off to all threads.", threadID)
								}
							}else{
								if(!myself.includes(threadID)){
									api.sendMessage("Bot service turned on to all threads.", threadID)
								}
								json.test = ""
							}
							fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
							api.sendMessage("Bot service turned " + ((json.status) ? "on" : "off") + " to all threads.", myself)
						}else if(command == "bot: sleep" && !json.off.includes(threadID)){
							api.getThreadInfo(threadID, (err, data) => {
								if(err) return console.error("Error [Thread Sleep]: " + err)
								json.off += threadID + ", "
								api.sendMessage({
									body: "Good night guys.",
									attachment: fs.createReadStream(`${__dirname}/img/sleep.gif`)
								}, threadID)
								api.sendMessage(`You turned off the bot service for ${data.threadName}.`, myself)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
							})
						}else if(command == "bot: wake-up" && json.off.includes(threadID)){
							api.getThreadInfo(threadID, (err, data) => {
								if(err) return console.error("Error [Thread Wake-up]: " + err)
								json.off = json.off.replace(threadID + ", ", "")
								api.sendMessage("Hi guys, I'm back.", threadID)
								api.sendMessage(`You turned on the bot service for ${data.threadName}.`, myself)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
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
							api.sendMessage(fs.readFileSync("txt/admin.txt", "utf8"), threadID, messageID)
						}else if(command == "status"){
							let msg = ""
							if(!json.status){
								msg += "I am not active in all threads, except the admin room."
							}else{
								msg += "I am active now" + ((json.ban.includes(threadID)) ? " but not in this thread." : " even in this thread.")
							}
							api.sendMessage(msg, threadID, messageID)
						}else if (command == "tuned" && (gc.includes(threadID) || vip.includes(threadID))) {
							say_tuned = !say_tuned
							say_thread = threadID
							api.sendMessage("Say tuned: " + say_tuned, say_thread)
						}else if(command == "reset"){
							if(fs.existsSync(__dirname + "/temp")){
								fs.rmdir(__dirname + "/temp", {recursive: true}, (e) => {
									setTimeout(() => {
										fs.mkdirSync(__dirname + "/temp")
									}, 1500)
								})
							}
							api.setMessageReaction("👍", messageID, (err) => {}, true)
							api.sendMessage("Waste files are now deleted", event.threadID, event.messageID)
						}else if(command == "remove pin"){
							json.pin.message[threadID] = undefined
							json.pin.sender[threadID] = undefined
							api.sendMessage("Pinned message removed", threadID)
							fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
						}else if(command == "pin"){
							if(json.pin.message[threadID] == undefined){
								api.sendMessage("There is no pinned message for this thread.", threadID)
							}else{
								api.getUserInfo(json.pin.sender[threadID], (err, data) => {
									let user = data[json.pin.sender[threadID]]['name']
									api.sendMessage("~ " + json.pin.message[threadID] + "\n\nBy: " + user, threadID)
								})
							}
						}else if(command == "download"){
							let prefs = fs.readFileSync("prefs/pref.json", "utf8")
							let game = fs.readFileSync("data/games.json", "utf8")
							let lang = fs.readFileSync("data/tts.json", "utf8")
							api.sendMessage(prefs, threadID)
							api.sendMessage(game, threadID)
							api.sendMessage(lang, threadID)
						}else if(command.startsWith("add language: ")){
							let a = command.split(": ")
							a.shift()
							let b = a.join("").split(", ")
							let c = JSON.parse(fs.readFileSync("data/tts.json", "utf8"))
							c[b[0]] = b[1]
							fs.writeFileSync("data/tts.json", JSON.stringify(c), "utf8")
							api.sendMessage("New language added", threadID)
						}else if(command == "no leave" && !json.leave.includes(threadID)){
							json.leave += threadID + ", "
							api.sendMessage("All are settled, no one can leave us to this thread.", threadID)
							fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
						}else if(command == "can leave" && json.leave.includes(threadID)){
							json.leave = json.leave.replace(threadID + ", ", "")
							api.sendMessage("All are settled, anyone can leave to this thread.", threadID)
							fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
						}
					}else if(event.type == "message_reply"){
						let reply_senderID = event.messageReply.senderID
						let reply_body = event.messageReply.messageID
						let reply_low = reply_body.toLowerCase()
						if(command == "bot: ban" && !json.ban.includes(reply_senderID)){
							api.getUserInfo(reply_senderID, (err, data) => {
								if(err) return console.error("Error [User ban]: " + err)
								json.ban += reply_senderID + ", "
								let name = data[reply_senderID]
								api.sendMessage({
									body: `Bot features for ${name.name} is now turned off.`,
									mentions: [{
										tag: `${name.name}`,
										id: reply_senderID
									}]
								}, threadID)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
							})
						}else if(command == "bot: unban" && json.ban.includes(reply_senderID)){
							api.getUserInfo(reply_senderID, (err, data) => {
								if(err) return console.error("Error [User unban]" + err)
								json.ban = json.ban.replace(reply_senderID + ", ", "")
								let name = data[reply_senderID]['name']
								api.sendMessage({
									body: `Bot features for ${name} is now turned on.`,
									mentions: [{
										tag: `${name}`,
										id: reply_senderID
									}]
								}, threadID)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
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
						}else if(command == "allowed"){
							api.getUserInfo(event.messageReply.senderID, (err, data) => {
								if(err) return console.error("Error [Allow]: " + err)
								json.test += reply_senderID + ", "
								let name = data[reply_senderID]['name']
								api.sendMessage({
									body: `Bot test features for ${name} is now turned on.`,
									mentions: [{
										tag: `${name}`,
										id: reply_senderID
									}]
								}, threadID)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
							})
						}else if(command == "not allowed"){
							api.getUserInfo(event.messageReply.senderID, (err, data) => {
								if(err) return console.error("Error [Allow]: " + err)
								json.test = json.test.replace(reply_senderID + ", ", "")
								let name = data[reply_senderID]['name']
								api.sendMessage({
									body: `Bot test features for ${name} is now turned off.`,
									mentions: [{
										tag: `${name}`,
										id: reply_senderID
									}]
								}, threadID)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
							})
						}else if(command == "pin"){
							if(event.messageReply.body == ""){
								api.sendMessage("There is no text detected.", threadID)
							}else{
								json.pin.message[threadID] = event.messageReply.body
								json.pin.sender[threadID] = event.messageReply.senderID
								api.sendMessage("Message is now added as pinned message.", threadID, messageID)
								fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
							}
						}
					}
				}
			}else if((json.status && (low_body.startsWith(low_pref + " ") || low_body.startsWith(low_pref + ", ") || low_body == low_pref) && !json.ban.includes(senderID) && !json.off.includes(threadID)) || gc.includes(threadID) || json.test.includes(senderID) || vip.includes(senderID)){
				if(filter(low_body) && !vip.includes(senderID)){
					api.setMessageReaction("🥲", messageID, (err) => {}, true)
				}else{
					if(bad_regex.test(body) && vip.includes(senderID)){
						let data = body.match(bad_regex)[1]
						if(json.badwords.includes(data) && data != prefix){
							api.sendMessage("This word is already included to the badwords list.", threadID)
						}else{
							json.badwords.push(data)
							api.sendMessage(data + "😍", event.threadID)
							fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
						}
					}else if(low_body.startsWith(low_pref)){
						commands(api, event, prefix, gc, vip)
						/*let time = date("Asia/Manila").getHours()
						let mins = date("Asia/Manila").getMinutes()*/
						console.log("Time: [" + time + ":" + mins + "]")
						console.log("Command: " + body)
					}
				}
			}else if(!vip.includes(senderID) && !body.startsWith(prefix) && event.type == "message"){
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
						json.greet.morning += senderID + " "
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
						json.greet.afternoon += senderID + " "
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
						json.greet.evening += senderID + " "
					}else if((time >= 22 || time < 5) && !night.includes(senderID) && (low_body.includes("goodnight") || low_body.includes("good night"))){
						let g_night = [
							`Good night and sweet dreams ${gender} ${user.name}. Don't forget to pray before you sleep`,
							`Ikaw ay matulog na para bukas ${kasarian} ${user.name} ay may lakas upang harapin at sagupain muli ang bawat hamon ng buhay`
						]
						api.sendMessage({
							body: g_night[Math.floor(Math.random() * g_night.length)],
							mentions: [{
								tag: `${user.name}`,
								id: senderID
							}],
							attachment: fs.createReadStream(__dirname + "/img/goodnight.gif")
						}, threadID, messageID)
						json.greet.night += senderID + " "
					}
					fs.writeFileSync("prefs/pref.json", JSON.stringify(json), "utf8")
				})
			}else if(myself != senderID && event.type == "message_reply"){
				if(event.messageReply.senderID == myself){
					if(low_body.includes("thank") || low_body.includes("salamat") || low_body.includes("tnx")){
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
	})
})
