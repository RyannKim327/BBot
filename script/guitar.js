const cheerio = require("cheerio")
const axios = require("axios")
const fs = require("fs")
const ggl = require("googlethis")

async function search(song){
	let output = await ggl.search(song, {
		safe: true
	})
	return output
}

async function tabs(url){
	let { data } = await axios.get(url)
	let $ = cheerio.load(data)
	let output = $("div[class='js-store']").attr("data-content")
	let res = JSON.parse(output)
	console.log(res)
	return res
}

module.exports = async (api, event, regex) => {
	let q = event.body.match(regex)
	api.setMessageReaction("🔎", event.messageID, () => {}, true)
	let s = await search(q[1] + " tabs ultimate guitar")
	//console.log(s)
	let d = s.results
	let b = false
	let i = Math.floor(Math.random() * d.length)
	let j = []
	if(d.length > 0){
		while(d[i].url == undefined || !(d[i].url).startsWith("https://tabs.ultimate-guitar.com/")){
			i = Math.floor(Math.random() * d.length)
			console.log(i)
			for(let l = 0; l < j.length; l++){
				if(i == j[l]){
					i = Math.floor(Math.random() * d.length)
					console.log(i)
					break
				}
			}
			if(j.length == d.length){
				b = true
				break
			}
		}
		/*
		for(let i = 0; i < d.length; i++){
			let o = d[i].url
			if(o.includes("tabs.ultimate-guitar.com")){
				b = false
				let tab = await tabs(o)
				//console.log(tab)
				let m = tab.store.page.data.tab_view.wiki_tab.content
				let n = tab.store.page.data.tab
				let message = `${n.song_name} - ${n.artist_name}\nChords/Tabs by: ${n.username}\nTuning: ${n.tonality_name}\n\n` + m.replace(/(\[\/ch\]|\[\/tab\]|\[tab\]|\[ch\])/gi,"")
				console.log(tab.store.page.data.tab_view.wiki_tab.meta)
				api.sendMessage(message, event.threadID, event.messageID)
				api.setMessageReaction("✔", event.messageID, () => {}, true)
				break
			}
		}*/
		if(b && j >= d.length){
			api.sendMessage("Song not found on the query", event.threadID, event.messageID)
			api.setMessageReaction("✖", event.messageID, () => {}, true)
		}else{
			let o = d[i].url
			try{
				let tab = await tabs(o)
				//console.log(tab)
				let m = tab.store.page.data.tab_view.wiki_tab.content
				let n = tab.store.page.data.tab
				let message = `${n.song_name} - ${n.artist_name}\nChords/Tabs by: ${n.username}\nTuning: ${n.tonality_name}\n\n` + m.replace(/(\[\/ch\]|\[\/tab\]|\[tab\]|\[ch\])/gi,"")
				//console.log(tab.store.page.data.tab_view.wiki_tab.meta)
				api.sendMessage(message, event.threadID, event.messageID)
				api.setMessageReaction("✔", event.messageID, () => {}, true)
			}catch(e){
				api.sendMessage("An error happened. Please try again.", event.threadID)
				api.setMessageReaction("✖", event.messageID, () => {}, true)
			}
		}
	}else{
		api.sendMessage("Song not found on the query", event.threadID, event.messageID)
		api.setMessageReaction("✖", event.messageID, () => {}, true)
	}
}