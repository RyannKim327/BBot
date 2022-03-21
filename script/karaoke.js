const fs = require("fs")
const axios = require("axios")
const YoutubeMusicApi = require('youtube-music-api')
const ytdl = require('ytdl-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg')
const ffmpegs = require('fluent-ffmpeg')
ffmpegs.setFfmpegPath(ffmpeg.path)
const yt = new YoutubeMusicApi()

async function conv(v, t, e) {
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'X-Requested-Key': 'de0cfuirtgf67a'
	}
	results = await axios.post("https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994", "v_id=" + v + "&ftype=mp4&fquality=128&token=" + t + "&timeExpire=" + e + "&client=yt5s.com", {
		headers: headers
	}).then((response) => {
		return response.data.d_url
	}).catch((error) => {
		return error.message
	})
	return results
}
async function fetch(query) {
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	results = await axios.post("https://yt5s.com/api/ajaxSearch", "q=" + query + "&vt=mp4", {
		headers: headers
	}).then((response) => {
		return response.data
	}).catch((error) => {
		return error.message
	});
	return results
} 
async function dl(x){
	let s = fetch(x)
	let r = await s.then((response) => {
		let slist = response
		console.log(slist)
		if(slist.t < 1500){
			let d_u = conv(slist.vid, slist.token, slist.timeExpires).then((response) => {
				return [response, slist.title, slist.a]
			})
			return d_u
		}else{
			return "There's an error"
		}
	})
	return r
}

module.exports = async (api, body, event, file) => {
	let xpl = body.split(" ")
	xpl.shift()
	let d = xpl.join(" ").replace(/[^\w\s]+/gi, "")
	if(!d.endsWith("karaoke")){
		d += " karaoke"
	}
	api.setMessageReaction("🔎", event.messageID, (e) => {}, true)
		try{
			await yt.initalize()
			const m = await yt.search(d)
			console.log(m)
			if(m.content.length <= 0){
				throw new Error(`${d} returned no results found`)
				return true
			}else{
				if(m.content[0].videoId == undefined){
					throw new Error(`${d} is not found on youtube music. Try to add the singer name, maybe I can find it now.`)
					return true
				}
			}
			const url = `https://www.youtube.com/watch?v=${m.content[0].videoId}`
			const strm = ytdl(url, {
				quality: "lowest"
			})
			const info = await ytdl.getInfo(url)
			//api.sendMessage("A moment please", event.threadID, event.messageID)
			if(m.content[0].duration <= ((20 * 60) * 1000)){
				ffmpegs(strm).audioBitrate(128).save(`${__dirname}/../karaoke.mp4`).on("end", async () => {
					api.setMessageReaction("⏳", event.messageID, (e) => {}, true)
					api.sendMessage({
						//body: "Here is your request\n\nSong Title: " + info.videoDetails.title + "\nUploaded by: " + info.videoDetails.author.name,
						body: "Song Request",
						attachment: fs.createReadStream(`${__dirname}/../karaoke.mp4`).on("end", async () => {
							if(fs.existsSync(`${__dirname}/../karaoke.mp4`)){
								fs.unlink(`${__dirname}/../karaoke.mp4`, (err) => {
									if(err){
										console.log(err)
									}
									console.log("Done")
									api.setMessageReaction("✔", event.messageID, (err) => {}, true)
								})
							}
						})
					}, event.threadID, event.messageID)
				})
			}else{
				api.sendMessage("It's too long", event.threadID, event.messageID)
				if(fs.existsSync(`${__dirname}/../karaoke.mp4`)){
					fs.unlink(`${__dirname}/../karaoke.mp4`, (err) => {
						if(err){
							console.log(err)
						}else{
							api.setMessageReaction("✔", event.messageID, (err) => {}, true)
						}
					})
				}
			}
		}catch(err){
			api.sendMessage("Error: " + err, event.threadID, event.messageID)
			if(fs.existsSync(`${__dirname}/../karaoke.mp4`)){
				fs.unlink(`${__dirname}/../karaoke.mp4`, (err) => {
					if(err){
						console.log(err)
					}else{
						api.setMessageReaction("✔", event.messageID, (err) => {}, true)
					}
				})
			}
		}
}
