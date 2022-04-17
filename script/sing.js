const yt = require("youtubei.js")
const fs = require("fs")

module.exports = async (api, body, event, file) => {
	const yt2 = await new yt()
	let data = body.split(" ")
	data.shift()
	data.shift()
	let result = await yt2.search(data.join(" "))
	if(result.songs[0].id == undefined){
		api.sendMessage("Something went wrong", event.threadID, event.messageID)
	}else{
		console.log("Log [Duration]: " + result.songs[0].duration)
		const ytInfo = await yt2.getDetails(result.songs[0].id)
		if(ytInfo.title == undefined){
			return api.sendMessage("Something went wrong", event.threadID, event.messageID)
		}
		let info = `Title: ${ytInfo.title}\nUploaded by: ${ytInfo.metadata.channel_name}`
		let f = yt2.download(result.songs[0].id, {
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
			let name = __dirname + "/../sing.mp3"
			let message = ""
			message += info
			api.sendMessage({
				body: message,
				attachment: fs.createReadStream(name).on("end", async () => {
					if(fs.existsSync(name)){
						fs.unlink(name, (err) => {
							if(err) return console.error("Error [Sing]: " + err)
							api.setMessageReaction("✔", event.messageID, (err) => {}, true)
						})
					}
				})
			}, event.threadID, event.messageID)
		})
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
