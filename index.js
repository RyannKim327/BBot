const fs = require("fs")
const { keep_alive } = require("./keep_alive.js");
const request = require("request")
const http = require("https")
const axios = require("axios")
const login = require("fca-unofficial")

const filter = require("./script/filter")
const morse = require("./script/morse")
const music = require("./script/music")
const quote = require("./script/quote")
const specials = require("./script/specials")
const verse = require("./script/verse")
const what = require("./script/what")
const wiki = require("./script/wiki")

const prefix = "√"
const separator = "|"
const gc = process.env['gc']
let cute = [
	process.env['abril']
]
let morning = ""
let aftie = ""
let eve = ""
let night = ""
let b_users = ""
let bday = ""
let onBot = true 
let musics = true
let vids = true
let bhiebot = true
async function qwak(q){
	let result = await axios.get("https://api.duckduckgo.com/?q=" + q + "&format=json&pretty=1").then((response) => {
		return response.data
	}).catch((e) => {
		console.log("Error: " + e)
		return null
	})
}
function read(){
	return fs.readFileSync("txt/thread.txt", "utf-8")
}

login({appState: JSON.parse(process.env['state'])}, (err, api) => {
	if(err)  return console.error(err)
	const selves = api.getCurrentUserID()
	let vip = []
	api.getThreadInfo(gc, (err, data) => {
		if(err){
			console.log("Error: " + err)
			vip = []
		}else{
			vip = data.participantIDs
		}
	})
	if(bhiebot){
		api.sendMessage("BhieBot is now active", gc)
		bhiebot = false
	}
	api.setOptions({listenEvents: true, selfListen: true})
	var listenEmitter = api.listen(async (err, event) => {
		if(err) return console.error(err)
		api.markAsReadAll((err) => {
			if(err){
				console.log(err)
			}
		})
		//api.handleMessageRequests(
		switch(event.type){
			case "message":
				if(event.body != null){
					let mess = event.body
					let x = mess.toLowerCase()
					let y = x.split(" ")
					let myDay = 0
					threads = read()
					if((new Date().getHours() + 8) > 24){
						myDay = (new Date().getHours() + 8) - 24
					}else{
						myDay = new Date().getHours() + 8
					}
					if(myDay >= 22 || myDay < 5){
						morning = ""
						aftie = ""
						eve = ""
					}else if(myDay >= 5 && myDay < 12){
						aftie = ""
						eve = ""
						night = ""
					}else if(myDay >= 12 && myDay < 18){
						morning = ""
						eve = ""
						night = ""
					}else{
						morning = ""
						aftie = ""
						night = ""
					}
					if(vip.includes(event.senderID) || gc.includes(event.threadID)){
						if(x.startsWith("_admin_")){
							api.sendMessage("Here are your commands:\n~Bot: Sleep\n~Bot: Wake-up\n~Bot: Toggle\n~Off\n~On\n~Bot: Activate [ID]\n~Bot: Deactivate [ID]", event.threadID)
						}else if(x.startsWith("_list_")){
							api.getThreadList(20, null, ["INBOX"], (err, data) => {
								if(err){
									console.log(err)
								}else{
									for(let i = 0; i < data.length; i++){
										if(!vip.includes(data[i].threadID) && !gc.includes(data[i].threadID)){
											api.sendMessage(`Thread ID: ${data[i].threadID}\nThread Name: ${data[i].name}\nIs Group: ${data[i].isGroup}`, event.threadID)
										}
									}
								}
							})
						}else if(x.startsWith("_off_")){
							let mm = fs.readFileSync("txt/thread.txt", "utf-8").split("/")
							for (let i = mm.length - 1; i >= 0; i--) {
								api.getThreadInfo(parseInt(mm[i]), (err, data) => {
									if(err){
										console.log(err)
									}else{
										api.sendMessage("Thread ID: " + mm[i] + "\nThread Name: " + data.threadName, event.threadID)
									}
								})
							}
						}else if(x.startsWith(prefix) && x.includes(separator)){
							let m = mess.split(separator)
							let c = m[0].split(" ")
							let t = parseInt(m[1].replace(" ", ""))
							if(x.startsWith(prefix + "say")){
								let w = m[0].split(" ")
								let j = ""
								w.shift()
								for(let i = 0; i < w.length; i++){
									j += w[i] + " "
								}
								api.sendMessage(j, t)
								api.sendMessage("Sent", event.threadID, event.messageID)
							}
						}else if(x.startsWith("_status_")){
							let m = "I'm active. "
							if(onBot){
								if(threads.includes(event.threadID)){
									m += "But the bot wasn't alive to this thread"
								}else{
									m += "Also enabled."
								}
							}else{
								m += "But on sleep mode"
							}
							api.sendMessage(m, event.threadID)
						}else if(mess.startsWith("~Bot: Toggle")){
							onBot = !onBot
							if(onBot){
								if(!gc.includes(event.threadID)){
									api.sendMessage("Bot turned on", event.threadID)
								}
								api.sendMessage("Bot turned on", gc)
							}else{
								if(!gc.includes(event.threadID)){
									api.sendMessage("Bot turned off", event.threadID)
								}
								api.sendMessage("Bot turned off", gc)
							}
						}else if(mess.startsWith("~Bot: Deactivate ") && vip.includes(event.threadID)){
							let d = x.split(" ")
							threads += d[2] + "/"
							fs.writeFileSync("thread.txt", threads, "utf-8")
							api.getThreadInfo(d[2], (err, data) => {
								api.sendMessage("Added to off list:\nID: " + d[3] + "\nThread name: " + data.threadName, gc)
								console.log(data)
							})
						}else if(mess.startsWith("~Bot: Activate ") && !x.includes("here")){
							let l = x.split(" ")
							threads = threads.replace(l[2] + "/", "")
							fs.writeFileSync("thread.txt", threads, "utf-8")
							api.sendMessage("Unlocked thread ID: " + l[2], event.threadID, event.messageID)
						}else if(mess.startsWith("~Bot: Sleep") && !threads.includes(event.threadID)){
							if(event.threadID != gc){
								threads += event.threadID + "/"
								fs.writeFileSync("thread.txt", threads, "utf-8")
								api.sendMessage({
								  body:"Good night guys",
								  attachment: fs.createReadStream(__dirname + "/sleep.gif")
								}, event.threadID)
								api.getThreadInfo(event.threadID, (err, data) => {
									api.sendMessage("Added to off list:\nID: " + event.threadID + "\nThread name: " + data.threadName, gc)
									console.log(data)
								})
							}
						}else if(mess.startsWith("~Bot: Wake-up") && threads.includes(event.threadID)){
							threads = threads.replace(event.threadID + "/", "")
							fs.writeFileSync("thread.txt", threads, "utf-8")
							api.getThreadInfo(event.threadID, (err, data) => {
								if(err){
									console.log(err)
								}else{
									api.sendMessage("Activated bot to:\nThread ID:" + event.threadID + "\nThread Name: " + data.threadName, gc)
								}
							})
							api.sendMessage("Good Day guys", event.threadID)
						}
					}
					if(onBot && !b_users.includes(event.senderID) && !(threads.includes(event.threadID))){
						if(filter(x)){
							api.setMessageReaction("🥲", event.messageID, (err) => {}, true)
						}else{
							if(x.startsWith(prefix)){
								if(x.startsWith(prefix + "motivate")){
									quote(api, x, event)
								}else if(x.startsWith(prefix + "info")){
									if(y.length <= 1){
										api.sendMessage(fs.readFileSync("txt/abt.txt", "utf-8"), event.threadID, event.messageID)
									}else{
										let sp = mess.split(" ")
										sp.shift()
										let z = y.join(" ")
										console.log("911")
										console.log(event.mentions.data)
										if(isNaN(z)){
											api.getUserID(z, (err, data) => {
												if(err){
													console.log(err)
												}else{
													let ID = data.userID
													api.getUserInfo(data.userID, (err, data) => {
														if(err){
															console.log(err)
														}else{
															let name = data[ID]
															let info = "Name: " + name.name + "\n"
															if(name.vanity != undefined){
																info += "Username: " + name.vanity + "\n"
															}
															switch(name.gender){
																case 1:
																	info += "Gender: Female"
																break
																case 2:
																	info += "Gender: Male"
																break
																default:
																	info += "Gender: Custom"
															}
															info += "\nProfile Url: " + name.profileUrl
															api.sendMessage(info, event.threadID, event.messageID)
														}
													})
												}
											})
											
											/*
										}else if(event.mentions.length > 0){
											api.sendMessage("hi", gc)*/
										}else{
											api.getUserInfo(sp[0], (err, data) => {
												if(err){
													console.log(err)
												}else{
													let name = data[z]
													let info = "Name: " + name.name + "\n"
													if(name.vanity != undefined){
														info += "Username: " + name.vanity + "\n"
													}
													switch(name.gender){
														case 1:
															info += "Gender: Female"
														break
														case 2:
															info += "Gender: Male"
														break
														default:
															info += "Gender: Custom"
													}
													info += "\nProfile Url: " + name.profileUrl
													api.sendMessage(info, event.threadID, event.messageID)
												}
											})
										}
									}
								}else if(x.startsWith(prefix + "music")){
									if(musics){
										musics = false
										musics = music(api, mess, event)
									}else{
										api.sendMessage("Lemme finish first the earlier request", event.threadID, event.messageID)
									}
								}else if(x.startsWith(prefix + "special")){
									specials.kolai(api, event)
								}else if(x.startsWith(prefix + "bang bang")){
									specials.bang(api, event)
								}else if(x.startsWith(prefix + "wiki")){
									wiki(api, mess, event)
								}else if(x.startsWith(prefix + "verse")){
									verse(api, mess, event)
								}else if(x.startsWith(prefix + "whatis")){
									what(api, mess, event)
								}else if(x.startsWith(prefix + "morse")){
									morse(api, x, event)
								}/*else if(x.startsWith(prefix + "know")){
									let data = mess.split(" ")
									data.shift()
									let joins = data.join(" ")
									qwak(joins).then((r) => {
										let f = fs.createWriteStream("duck.jpg")
										http.get(r.Image, (re) => {
											re.pipe(f)
											f.on("finish", () => {
												api.sendMessage({
													body: `You've searched about ${joins} `
												}, event.threadID, event.messageID)
											})
										})
									})
								}*/
							}else{
								for(let z = 0; z < y.length; z++){
									if(selves != event.senderID && (y[z] == "masaket" || y[z] == "peyn" || y[z] == "ouch" || y[z] == "awts" || y[z] == "ansaket" || y[z] == "ansakit" || y[z] == "masakit" || y[z] == "pain" || y[z] == "pighati")){
										api.setMessageReaction("😥", event.mesaageID, () => {}, true)
										api.sendMessage({
											body: "Kawawa naman",
											attachment: fs.createReadStream(__dirname + "/edamage.jpg")
										}, event.threadID, event.mesaageID)
									}else if(!selves.includes(event.senderID) && (y[z] == "kain" && (!x.includes("ka na") || !x.includes("kana")))){
										api.getUserInfo(event.senderID, (err, data) => {
											if(err){
												console.log(err)
											}else{
											  let name = data[event.senderID]
												api.setMessageReaction("💗", event.messageID, (err) => {}, true)
												api.sendMessage({
												  body: `Eat well @${name.firstName}`,
												  mentions: [{
												    tag: `@${name.firstName}`,
												    id: event.senderID
												  }]
												}, event.threadID, event.messageID)
											}
										})
									}
								}
								if(!selves.includes(event.senderID)){
									if(x.includes("welcome") && (x.includes("bhiebot") || x.includes("bhie"))){
										api.setMessageReaction("😍", event.messageID, (err) => {}, true)
										api.getUserInfo(event.senderID, (err, data) => {
											if(err){
												console.log(err)
											}else{
												api.sendMessage("Salamat master " + data[event.senderID]['firstName'], event.threadID, event.messageID)
											}
										})
									}else if((x.includes("suggest") || x.includes("suggestion") || x.includes("recommend"))){
										if((x.includes("capstone") || x.includes("thesis") || x.includes("research")) && (x.includes("title"))){
											api.sendMessage(fs.readFileSync("capstone.txt", "utf-8"), event.threadID, event.messageID)
										}
									}else if( (x.includes("mahal kita") || x.includes("love you") || x.includes("i love")) && (x.includes("bot") || x.includes("bhiebot") || x.includes("bhie bot"))){
										api.setMessageReaction("🤣", event.messageID, (err) => {}, true)
										api.getUserInfo(event.senderID, (err, data) => {
											api.sendMessage("Luhh, nainlove sa bot hahaha", event.threadID, event.messageID)
										})
									}else if(x.includes("ito pala")){
										api.setMessageReaction("🤣", event.messageID, (err) => {}, true)
										api.getUserInfo(event.senderID, (err, data) => {
											api.sendMessage("Lutang ka ata hahaha", event.threadID, event.messageID)
										})
									}else if(x.includes("maganda ba ako") || x.includes("maganda ba ko")){
										api.sendMessage("Ewan, isa lang naman akong di hamak na bot na walang ambag sa lipunan", event.threadID, event.messageID)
									}else if(4699051006857054 != event.threadID && !selves.includes(event.senderID) && (x.includes("cute") || x.includes("kyot")) && !x.includes("execute")){
										if(x.includes("april")){
											api.sendMessage({
												body: "Oo ang cute ni April, lalo na dito",
												attachment: fs.createReadStream(__dirname + "/april.jpg")
											}, event.threadID, event.messageID)
										}else if(cute.includes(event.senderID) && (x.includes("ako") || x.includes("ko"))){
											api.sendMessage({
												body: "Oo, ang cute mo dito.",
												attachment: fs.createReadStream(__dirname + "/april.jpg")
											}, event.threadID, event.messageID)
										}else if(x.includes("rheign kimmy") || x.includes("kimmy") || x.includes("rheign") || x.includes("ulan")){
											api.sendMessage("Oo naman yes, walang duda kids can tell", event.threadID, event.messageID)
										}else{
											api.sendMessage("Kyot ka din naman, kaso mas kyot pa rin si Ulan.",  event.threadID, event.messageID)
										}
									}
								}
							}
						}
					}
					if(!x.startsWith(prefix)){
						for(let z = 0; z < y.length; z++){
							let greet = y[z].replace(/[^\w\s]/gi, '')
							if(!selves.includes(event.senderID) && myDay >= 5 && myDay < 12 && !morning.includes(event.senderID) && (greet.includes("morning") || greet.includes("umaga")) && y.length <= 8){
								api.getUserInfo(event.senderID, (err, data) => {
									if(err){
										console.log(err)
									}else{
										let name = data[event.senderID]
										morning += event.senderID + " "
										if(myDay >= 5 && myDay < 11){
											api.setMessageReaction("☕", event.messageID, (err) => {}, true)
											let f = fs.createWriteStream("morning.jpg")
											let l = ""
											let z = Math.floor(Math.random() * 3)
											if(z == 0){
												l = `https://stlexano.sirv.com/morning.jpg?w=340&text.0.text=Good%20Morning&text.0.position=north&text.0.size=30%&text.0.color=ffffff&text.1.text=${name.name}&text.1.position=south&text.1.size=50%&text.1.color=ffffff`
											}else if(z == 1){
												l = `https://stlexano.sirv.com/kape.jpg?w=340&text.0.text=Good%0AMorning&text.0.position=southwest&text.0.size=50%&text.0.align=left&text.0.color=ffffff&text.1.text=${name.name}&text.1.position=southeast&text.1.size=40%&text.1.color=ffffff`
											}else{
												l = `https://stlexano.sirv.com/umaga.jpg?w=340&text.0.text=Good%0AMorning&text.0.position=northwest&text.0.size=50%&text.0.align=left&text.0.color=ffffff&text.1.text=${name.name}&text.1.position=southeast&text.1.size=40%&text.1.color=ffffff`
											}
											let g = http.get(l, (s) => {
												s.pipe(f)
												f.on("finish", (err) => {
													api.sendMessage({
														body: "Good morning " + ((data[event.senderID]['gender'] == 1) ? "Ms." : ((data[event.senderID]['gender'] == 6) ? "Mr./Ms." : "Mr.")) + " " + `@${name.firstName}` + ". Have a nice day. Come on, let's have some coffee.",
														mentions: [{
															tag: `@${name.firstName}`,
															id: event.senderID
														}],
														attachment: fs.createReadStream(__dirname + "/morning.jpg").on("end", async () =>{
															if(fs.existsSync(__dirname + "/morning.jpg")){
																fs.unlink(__dirname + "/morning.jpg", (err) => {
																	if(err){
																		console.log(err)
																	}else{
																		console.log("Done")
																	}
																})
															}
														})
													}, event.threadID, event.messageID)
												})
											})
										}else{
											api.setMessageReaction("🍽", event.messageID, (err) => {}, true)
											api.sendMessage({
												body: "Good morning " + ((data[event.senderID]['gender'] == 1) ? "Ms." : ((data[event.senderID]['gender'] == 6) ? "Mr./Ms." : "Mr.")) + " " + `@${name.firstName}` + ". Have a nice day. Come on, let's have some lunch.",
												mentions: [{
													tag: `@${name.firstName}`,
													id: event.senderID
												}]
											}, event.threadID, event.messageID)
										}
									}
								})
							}else if(!selves.includes(event.senderID) && myDay >= 12 && myDay < 18 && !aftie.includes(event.senderID) && (greet.includes("afternoon") || greet.includes("aftie") || greet.includes("hapon"))){
								api.getUserInfo(event.senderID, (err, data) => {
									if(err){
										console.log(err)
									}else{
										let name = data[event.senderID]
										aftie += event.senderID + " "
										if(myDay >= 12 && myDay < 15){
											api.setMessageReaction("🍽", event.messageID, (err) => {}, true)
											api.sendMessage({
												body: "Good afternoon " + ((data[event.senderID]['gender'] == 1) ? "Ms." : ((data[event.senderID]['gender'] == 6) ? "Mr./Ms." : "Mr.")) + ` @${name.firstName}` + ", don't forget to eat your lunch.",
												mentions: [{
													tag: `@${name.firstName}`,
													id: event.senderID
												}]
											}, event.threadID, event.messageID)
										}else{
											api.setMessageReaction("💗", event.messageID, (err) => {}, true)
											api.sendMessage({
												body: "Good afternoon " + ((data[event.senderID]['gender'] == 1) ? "Ms." : ((data[event.senderID]['gender'] == 6) ? "Mr./Ms." : "Mr.")) + " " + `@${name.firstName}` + ". Hoping that you're still okay.",
												mentions: [{
													tag: `@${name.firstName}`,
													id: event.senderID
												}]
											}, event.threadID, event.messageID)
										}
									}
								})
							}else if(!selves.includes(event.senderID) && myDay >= 18 && myDay < 22 && !eve.includes(event.senderID) && (greet == "eve" || greet.includes("gabi") || greet.includes("evening"))){
								api.setMessageReaction("💗", event.messageID, (err) => {}, true)
								api.getUserInfo(event.senderID, (err, data) => {
									if(err){
										console.log(err)
									}else{
										let name = data[event.senderID]
										eve += event.senderID + " "
										api.sendMessage({
											body: "Good evening " + ((data[event.senderID]['gender'] == 1) ? "Ms." : ((data[event.senderID]['gender'] == 6) ? "Mr./Ms." : "Mr.")) + " " + `@${name.firstName}` + ". It's been a long long day.",
											mentions: [{
												tag: `@${name.firstName}`,
												id: event.senderID
											}]
										}, event.threadID, event.messageID)
									}
								})
							}else if(!selves.includes(event.senderID) && (myDay >= 22 || myDay < 5) && (greet.includes("night") && !night.includes(event.senderID) && y.length <= 8)){
								api.setMessageReaction("😴", event.messageID, (err) => {}, true)
								api.getUserInfo(event.senderID, (err, data) => {
									if(err){
										console.log(err)
									}else{
										let name = data[event.senderID]
										night += event.senderID + " "
										api.sendMessage({
											body: `Good night and sweet dreams my dear @${name.firstName}. Have a nice rest.`,
											mentions: [{
												tag: `@${name.firstName}`,
												id: event.senderID
											}],
											attachment: fs.createReadStream(__dirname + "/goodnight.gif")
										}, event.threadID, event.messageID)
									}
								})
							}
						}
					}
				}
			break;
			case "message_reply":
				let mess = event.body
				let x = mess.toLowerCase()
				let y = x.split(" ")
				if(event.body != undefined){
					if(x.startsWith(prefix) && (gc.includes(event.threadID) || vip.includes(event.senderID))){
						let least = event.messageReply.body
						let data = least.match(/^Thread\sID:\s([0-9]+)/)
						if(x.startsWith(prefix + "say")){
							let xpl = mess.split(" ")
							xpl.shift()
							api.sendMessage(xpl.join(" "), data[1])
							api.getThreadInfo(data[1], (err, dat) => {
								api.sendMessage(`Message sent to ${dat.threadName}`, event.threadID, event.messageID)
							})
						}else if(x.startsWith(prefix + "info") && !b_users.includes(event.senderID)){
							api.getUserInfo(parseInt(event.messageReply.senderID),  (err, data) => {
								if(err){
									console.log(err)
								}else{
									let gender = ""
									switch(data[event.messageReply.senderID]['gender']){
										case 1:
											gender = "Female"
										break
										case 2:
											gender = "Male"
										break
										default:
											gender = "Custom"
									}
									let message = "Name: " + data[event.messageReply.senderID]['name'] + "\n"
									if(data[event.messageReply.senderID]['vanity'] != undefined){
										info += "Username: " + data[event.messageReply.senderID]['vanity'] + "\n"
									}
									message += "Gender: " + gender + "\n"
									if(data[event.messageReply.senderID]['nickname'] != undefined){
										message += data[event.messageReply.senderID]['nickname']
									}
									message += "Profile Link: " + data[event.messageReply.senderID]['profileUrl']
									api.sendMessage(message, event.threadID, event.messageID)
								}
							})
						}
					}else if(!selves.includes(event.senderID) && vip.includes(event.messageReply.senderID) && (x.includes("salamat") || x.includes("thank") || x.includes("tnx"))){
						api.setMessageReaction("😻", event.messageID, (err) => {}, true)
						api.getUserInfo(event.senderID, (err, data) => {
							console.log(api.mention)
							api.sendMessage("You're welcome " + data[event.senderID]['name'], event.threadID, event.messageID)
						})
					}else if(!selves.includes(event.senderID) && vip.includes(event.senderID) && (x.includes("duda") || x.includes("sana all") || x.includes("naol") || x.includes("sanaol") || x.includes("naul") || x.includes("sana'll"))){
						api.sendMessage("(2)", event.threadID, event.messageID)
					}else if(!selves.includes(event.senderID) && x.includes("(2)") && vip.includes(event.senderID)){
						api.sendMessage("(3)", event.threadID, event.messageID)
					}else if(selves != event.senderID && (x.includes("masaket") || x.includes("peyn") || x.includes("ouch") || x.includes("awts") || x.includes("sakit") || x.includes("pain") || x.includes("pighati"))){
						api.setMessageReaction("😥", event.mesaageID, () => {}, true)
						api.sendMessage({
								body: "Kawawa naman",
								attachment: fs.createReadStream(__dirname + "/edamage.jpg")
						}, event.threadID, event.messageReply.messageID)
					}else if(4699051006857054 != event.threadID && !selves.includes(event.senderID) && (x.includes("cute") || x.includes("kyot")) && !x.includes("execute")){
						if(x.includes("april")){
							api.sendMessage({
								body: "Oo ang cute ni April, lalo na dito",
								attachment: fs.createReadStream(__dirname + "/april.jpg")
							}, event.threadID, event.messageID)
						}else if(cute.includes(event.senderID) && (x.includes("ako") || x.includes("ko"))){
							api.sendMessage({
								body: "Oo, ang cute mo dito.",
								attachment: fs.createReadStream(__dirname + "/april.jpg")
							}, event.threadID, event.messageID)
						}else if(x.includes("rheign kimmy") || x.includes("kimmy") || x.includes("rheign") || x.includes("ulan")){
							api.sendMessage("Oo naman yes, walang duda kids can tell", event.threadID, event.messageID)
						}else{
							api.sendMessage("Kyot ka din naman, kaso mas kyot pa rin si Ulan.",  event.threadID, event.messageID)
						}
					}else if(x.startsWith(prefix + "unsent") && vip.includes(event.senderID)){
						api.unsendMessage(event.messageReply.messageID, (err) => {
							if(err){
								console.log(err)
							}else{
								api.sendMessage("Done", event.threadID, event.messageID)
							}
						})
					}
				}
				if(gc.includes(event.threadID) || vip.includes(event.senderID)){
					let m = event.messageReply.body
					let rep = m.toLowerCase()
					let threads = read()
					let e = rep.split(/\r?\n/)
					let d = e[0].split(" ")
					if(mess.startsWith("~Off") && !b_users.includes(event.messageReply.senderID) && !vip.includes(event.messageReply.senderID)){
						let userID = event.messageReply.senderID
						b_users += userID + " "
						api.getUserInfo(userID, (err, data) => {
							api.sendMessage(`Features OFF for ${data[userID]['name']}`, event.threadID, event.messageID)
						})
					}else if(mess.startsWith("~On") && b_users.includes(event.messageReply.senderID) && !vip.includes(event.messageReply.senderID)){
						let userID = event.messageReply.senderID
						let b_u =  b_users.replace(userID + " ", "")
						b_users = b_u
						api.getUserInfo(userID, (err, data) => {
							api.sendMessage(`Features ON for ${data[userID]['name']}`, event.threadID, event.messageID)
						})
					}
					if(mess.startsWith("~Bot: Deactivate") && !threads.includes(d[2])){
						threads += d[2] + "/"
						fs.writeFileSync("thread.txt", threads, "utf-8")
						api.getThreadInfo(parseInt(d[2]), (err, data) => {
								api.sendMessage("Added to off list:\nID: " + d[2] + "\nThread name: " + data.threadName, gc)
								console.log(d[2])
						})
					}else if(mess.startsWith("~Bot: Activate") && threads.includes(d[2])){
						threads = threads.replace(d[2] + "/", "")
						fs.writeFileSync("thread.txt", threads, "utf-8")
						console.log(d[2])
						api.getThreadInfo(parseInt(d[2]), (err, data) => {
							api.sendMessage("Unlocked:\nThread ID: " + d[2] + "\nThread name: " + data.threadName, event.threadID, event.messageID)
						})
					}
				}
			break;
		}
	})
})
