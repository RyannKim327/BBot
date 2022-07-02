const fs = require("fs")
const yt = require("youtubei.js")

module.exports = async (api, event) => {
	if(event.type == "event"){
		console.log("Working event")
		let thread = await api.getThreadInfo(event.threadID)
		let json = JSON.parse(fs.readFileSync("prefs/pref.json", "utf8"))
		switch(event.logMessageType){
			case "log:subscribe":
				console.log("Log [Subs]")
				if(thread.isGroup){
					const joiner = await event.logMessageData.addedParticipants
					const me = api.getCurrentUserID()
					let pin = ""
					if(json.pin.message[event.threadID] != undefined){
						let _id = parseInt(json.pin.sender[event.threadID])
						let sender = await api.getUserInfo(_id)
						pin = "\n\nPinned Message:\n\n" + json.pin.message[event.threadID] + "\nBy: " + sender[_id]['nsme']
					}
					for(let newb of joiner){
						const ids = parseInt(newb.userFbId)
						if(ids == me){
							api.sendMessage(fs.readFileSync("txt/abt.txt", "utf8"), event.threadID)
						}else{
							let user = await api.getUserInfo(ids)
							let g = ""
							switch(user.gender){
								case 1:
									g = "Ms."
								break
								case 2:
									g = "Mr."
								break
								default:
									g = "Mr./Ms."
							}
							let n = user[ids]['name']
							api.sendMessage({
								body: `Welcome to ${thread.threadName} ${g} ${n}. We hope that you'll enjoy here share and gain knowledge that helps us for our future. Be mindful, respectful and kind to all members. ${pin}`,
								mentions: [{
									id: ids,
									tag: n
								}]
							}, event.threadID)
						}
					}
				}
			break
			case "log:unsubscribe":
				console.log("Exit")
				const yt2 = await new yt()
				if(thread.isGroup){
					if(json.leave.includes(event.threadID)){
						let left = event.logMessageData.leftParticipantFbId
						api.addUserToGroup(parseInt(left), event.threadID, async (e) => {
							if(e){
								api.sendMessage(e, event.threadID)
							}else{
								let j = await api.getUserInfo(parseInt(left))
								let n = j[parseInt(left)]['name']
								api.sendMessage({
									body: "Walang iwanan " + n + ", dito ka lang.",
									mentions: [{
										id: parseInt(left),
										tag: n
									}]
								}, event.threadID)
							}
						})
					}else{
						me = api.getCurrentUserID()
						let left = event.logMessageData.leftParticipantFbId
						if(me != left){
							user = await api.getUserInfo(left)
							g = ""
							switch(user.gender){
								case 1:
									g = "Ms."
								break
								case 2:
									g = "Mr."
								break
								default:
									g = "Mr./Ms."
							}
							let songs = [
								"goodbye air supply",
								"farewell to you my friend",
								"bye bye bye nsync",
								"thanks to you mariah carey",
								"bye bye na rivermaya",
								"graduation song remix",
								"grand march"
							]
							let result = await yt2.search(songs[Math.floor(Math.random() * songs.length)], { client: "YTMUSIC" })
							let file = fs.createWriteStream(event.threadID + "_removegc.mp3")
							let f = yt2.download(result.songs[0].id, {
								format: "mp4",
								quality: "tiny",
								type: "audio",
								audioQuality: "lowest",
								audioBitrate: "550"
							})
							f.pipe(file)
							f.on("end", () => {
								let nameDir = __dirname + `/../${event.threadID}_removegc.mp3`
								api.sendMessage({
									body: `Farewell to you ${g} ${user[left].name}, the whole ${thread.threadName} will missed you.`,
									attachment: fs.createReadStream(nameDir).on("end", () => {
										if(fs.existsSync(nameDir)){
											fs.unlink(nameDir, (err) => {
												if(err){
													console.error("Error [Left]: " + err)
												}
											})
										}
									})
								}, event.threadID)
							})
						}
					}
				}
			break
		}
	}
}
