const fs = require("fs")
const axios = require("axios")
const http = require("https")
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
	results = await axios.post("https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994", "v_id=" + v + "&ftype=mp3&fquality=128&token=" + t + "&timeExpire=" + e + "&client=yt5s.com", {
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
	results = await axios.post("https://yt5s.com/api/ajaxSearch", "q=" + query + "&vt=mp3", {
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
		if(slist.t < 2000){
			let d_u = conv(slist.vid, slist.token, slist.timeExpires).then((response) => {
				return [response, slist.title, slist.a]
			})
			return d_u
		}else{
			return null
		}
	})
	return r
}

module.exports = async (api, body, event, file) => {
	let x = body.toLowerCase()
	let d = body.split(" ")
	if(x.includes("https://m.youtube.com") || x.includes("https://youtu.be") || x.includes("https://youtube.com") || x.includes("https://www.youtube.com")){
		let s = dl(d[1])
		api.setMessageReaction("🔎", event.messageID, (e) => {}, true)
		try{
			s.then((response) => {
				if(response[0] != null || response[0] != undefined){
					let t_u = response
					//console.log("hi " + t_u)
					let g_r = http.get(t_u[0], function(g_rs) {
						g_rs.pipe(file)
						file.on("finish", function() {
							api.setMessageReaction("⏳", event.senderID, (e) => {}, true)
							//api.sendMessage("Downloading success, please wait", event.threadID, event.messageID)
							api.sendMessage({
								body: "Here's your file\nTitle: " + response[1] + "\nUploaded by: " + response[2] ,
								attachment: fs.createReadStream(`${__dirname}/../song.mp3`).on("end", async () => {
									if(fs.existsSync(`${__dirname}/../song.mp3`)){
										fs.unlink(`${__dirname}/../song.mp3`, (err) => {
											if(err){
												console.log(err)
											}
											console.log("Done")
										})
									}
								})
							}, event.threadID, event.messageID)
						})
					})
				}else{
					api.sendMessage("Error", event.threadID, event.messageID)
					if(fs.existsSync(`${__dirname}/../song.mp3`)){
						fs.unlink(`${__dirname}/../song.mp3`, (err) => {
							if(err){
								console.log(err)
							}else{
								api.setMessageReaction("✔", event.messageID, (err) => {}, true)
							}
						})
					}
				}
			})
		}catch(err){
			api.sendMessage(err, event.threadID)
			if(fs.existsSync(`${__dirname}/../song.mp3`)){
				fs.unlink(`${__dirname}/../song.mp3`, (err) => {
					if(err){
						console.log(err)
					}else{
						api.setMessageReaction("✔", event.messageID, (err) => {}, true)
					}
				})
			}
		}
	}else{
		api.setMessageReaction("🔎", event.messageID, (e) => {}, true)
		try{
			d.shift()
			await yt.initalize()
			const m = await yt.search(d.join(" ").replace(/[^\w\s]/gi, ''))
			console.log(m)
			if(m.content.length <= 0){
				throw new Error(`${d.join(" ").replace(/[^\w\s]/gi, '')} returned no results found`)
				return true
			}else{
				if(m.content[0].videoId == undefined){
					throw new Error(`${d.join(" ").replace(/[^\w\s]/gi, '')} is not found on youtube music. Try to add the singer name, maybe I can find it now.`)
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
				ffmpegs(strm).audioBitrate(96).save(`${__dirname}/../song.mp3`).on("end", async () => {
					api.setMessageReaction("⏳", event.messageID, (e) => {}, true)
					api.sendMessage({
						body: "Here is your request\n\nSong Title: " + info.videoDetails.title + "\nUploaded by: " + info.videoDetails.author.name,
						attachment: fs.createReadStream(`${__dirname}/../song.mp3`).on("end", async () => {
							if(fs.existsSync(`${__dirname}/../song.mp3`)){
								fs.unlink(`${__dirname}/../song.mp3`, (err) => {
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
				if(fs.existsSync(`${__dirname}/../song.mp3`)){
					fs.unlink(`${__dirname}/../song.mp3`, (err) => {
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
			if(fs.existsSync(`${__dirname}/../song.mp3`)){
				fs.unlink(`${__dirname}/../song.mp3`, (err) => {
					if(err){
						console.log(err)
					}else{
						api.setMessageReaction("✔", event.messageID, (err) => {}, true)
					}
				})
			}
		}
	}
}
