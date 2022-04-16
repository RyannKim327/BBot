const fs = require("fs")
const yt = require("youtubei.js")

module.exports = async (api, event) => {
	console.log("Test")
	if(event.type == "event"){
		console.log("Working event")
		let thread = await api.getThreadInfo(event.threadID)
		switch(event.logMessageType){
			case "log:subscribe":
				console.log("Log [Subs]")
				if(thread.isGroup){
					const joiner = await event.logMessageData.addedParticipants
					const me = api.getCurrentUserID()
					let messages = {
						body: "",
						mentions: []
					}
					for(let newb of joiner){
						const id = newb.userFbId
						if(id == me){
							api.sendMessage(fs.readFileSync("txt/abt.txt", "utf8"), event.threadID)
						}else{
							let user = await api.getUserInfo(id)
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
							messages.body = `Welcome to ${thread.threadName}, ${g} ${user[id].name}. Enjoy your staying here, always be patience and be active if you can. Respect all members specially admins.`
							messages.mentions.push = [{
								id: id,
								tag: `${user[id].name}`
							}]
							api.sendMessage(messages, event.threadID)
						}
					}
				}
			break
			case "log:unsubscribe":
				console.log("Exit")
				if(thread.isGroup){
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
						const yt2 = await new yt()
						let result = await yt2.search("goodbye air supply", {
							client: "YTMUSIC"
						})
						let file = fs.createWriteStream("removegc.mp3")
						let f = yt.download(result.songs[0].id, {
							format: "mp4",
							quality: "tiny",
							type: "audio",
							audioQuality: "lowest",
							audioBitrate: "550"
						})
						f.pipe(file)
						f.on("end", () => {
							let nameDir = __dirname + "/../removegc.mp3"
							api.sendMessage({
								body: `Farewell to you ${g} ${user.name}, the whole ${thread.threadName} will missed you.`,
								attachment: fs.createReadStream(nameDir).on("end", () => {
									if(fs.existsSync(nameDir)){
										fs.unlink(nameDir, (err) => {
											console.error("Error [Left]: " + err)
										})
									}
								})
							}, event.threadID)
						})
					}
				}
			break
		}
	}
}