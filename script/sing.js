const yt = require("youtubei.js")
const fs = require("fs")

module.exports = async (api, event, file, name, regex) => {
	api.setMessageReaction("🔎", event.messageID, (e) => {}, true)
	const yt2 = await new yt()
	let body = event.body.match(regex)[1]
	let result = await yt2.search(body)
	if(result.videos.length <= 0){
		api.sendMessage("Nothing found", event.threadID, event.messageID)
		if(fs.existsSync(__dirname + "/../" + name)){
			fs.unlink(__dirname + "/../" + name, (err) => {
				if(err) return console.error("Error [Sing FS]: " + err)
				api.setMessageReaction("✔", event.messageID, (err) => {}, true)
			})
		}
	}else if(result.videos[0] == undefined){
		api.sendMessage("Something went wrong", event.threadID, event.messageID)
		if(fs.existsSync(__dirname + "/../" + name)){
			fs.unlink(__dirname + "/../" + name, (err) => {
				if(err) return console.error("Error [Sing FS]: " + err)
				api.setMessageReaction("✔", event.messageID, (err) => {}, true)
			})
		}
	}else{
		//console.log("Log [Duration]: " + result.videos[0].duration)
		const ytInfo = await yt2.getDetails(result.videos[0].id)
		if(ytInfo.title == undefined){
			api.sendMessage("Something went wrong", event.threadID, event.messageID)
			let name = __dirname + "/../" + name
			if(fs.existsSync(name2)){
				fs.unlink(name2, (err) => {
					if(err) return console.error("Error [Sing]: " + err)
					api.setMessageReaction("✔", event.messageID, (err) => {}, true)
				})
			}
		}
		let info = ""
		let f = yt2.download(result.videos[0].id, {
			format: 'mp4',
			quality: 'tiny',
			type: 'audio',
			audioQuality: 'lowest',
			audioBitrate: '550'
		})
		f.pipe(file)
		f.on("start", () => {
			api.setMessageReaction("🔁", event.messageID, (err) => {}, true)
		})
		f.on("proccess", (info) => {
			api.setMessageReaction("⏳", event.messageID, (err) => {}, true)
		})
		f.on("end", () => {
			let name2 = __dirname + "/../" + name
			api.getUserInfo(event.senderID, (err, user) => {
				if(err) console.error("Error [Music Link]: " + err)
				let gender = ""
				switch(user.gender){
					case 1:
						gender = "Ms."
					break
					case 2:
						gender = "Mr."
					break
					default:
						gender = "Mr./Ms."
				}
				let username = user[event.senderID]['name']
				info = `Here's your request ${gender} ${username}. A song entitled ${ytInfo.title}, uploaded by ${ytInfo.metadata.channel_name} on a platform called youtube.`
				let message = ""
				message += info
				api.sendMessage({
					body: message,
					mentions: [{
						tag: username,
						id: event.senderID
					}],
					attachment: fs.createReadStream(name2).on("end", async () => {
						if(fs.existsSync(name2)){
							fs.unlink(name2, (err) => {
								if(err) return console.error("Error [Sing]: " + err)
								api.setMessageReaction("✔", event.messageID, (err) => {}, true)
							})
						}
					})
				}, event.threadID, event.messageID)
			})
		})
		//let info = `Title: ${ytInfo.title}\nUploaded by: ${ytInfo.metadata.channel_name}`
	}
}

/*
stream.on('start', () => {
    console.info('[DOWNLOADER]', 'Starting download now!');
  });
  
  stream.on('info', (info) => {
    // { video_details: {..}, selected_format: {..}, formats: {..} }
    console.info('[DOWNLOADER]', `Downloading ${info.video_details.title} by ${info.video_details.metadata.channel_name}`);
  });
  
  stream.on('progress', (info) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`[DOWNLOADER] Downloaded ${info.percentage}% (${info.downloaded_size}MB) of ${info.size}MB`);
  });
  
  stream.on('end', () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.info('[DOWNLOADER]', 'Done!');
  });
  */
