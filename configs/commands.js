const fs = require("fs")
const axios = require("axios")

//const chat = require("./script/chat")

const morse = require("./../script/morse")
const news = require("./../script/news")


const dice = require("./../games/dice")
const random_word = require("./../games/randomword")
const riddles = require("./../games/riddles")
const seq = require("./../games/sequence")
const word = require("./../games/word")

const ggl = require("./../script/ggl")
const guitar = require("./../script/guitar")
const img = require("./../script/img")
const info = require("./../script/info")
const javascript = require('./../script/javascript')
const pdf = require("./../script/pdf")
const sing = require("./../script/sing")
const qr = require("./../script/qr")
const quote = require("./../script/quote")
const tell = require("./../script/tell")
const verse = require("./../script/verse")
const weather = require("./../script/weather")

module.exports = async (api, event, pre, gc, vip) => {
	const prefix = pre + ","
	
	const regex_game_dice = new RegExp(prefix + " play roll a die", "i")
	const regex_game_seq = new RegExp(prefix + " play sequencing game", "i")
	const regex_game_random_word = new RegExp(prefix + " play random word", "i")
	const regex_game_riddles = new RegExp(prefix + " play riddles", "i")
	const regex_game_word = new RegExp(prefix + " play guess the word", "i")
	const regex_game_ans = new RegExp(prefix + " the answer is ([\\w\\W]+)", "i")
	
	const regex_guitar = new RegExp(prefix + " may I have the guitar chords of ([\\w\\W]+) please", "i")
	const regex_img = new RegExp(prefix + " may I have a random image of ([\\w\\W]+) please", "i")
	const regex_img_v2 = new RegExp(prefix + " what does this photo means", "i")
	const regex_info = new RegExp(prefix + " may I have the facebook info of ([\\w\\W]+) please", "i")
	const regex_info_self = new RegExp(prefix + " please introduce yourself to us", "i")
	const regex_js = new RegExp(prefix + " please test this javascript code ([\\w\\W]+)", "i")
	const regex_pdf = new RegExp(prefix + " may I have some pdf books of ([\\w\\W]+) please", "i")
	const regex_quote = new RegExp(prefix + " may I have a random quotes please", "i")
	const regex_quote_anime = new RegExp(prefix + " may I have a random quotes from an anime character please", "i")
	const regex_quote_about = new RegExp(prefix + " may I have a random quotes about ([\\w\\W]+) please", "i")
	const regex_qr_reply = new RegExp(prefix + " generate a QR Code for this text please", "i")
	const regex_qr = new RegExp(prefix + " generate a QR Code of ([\\w\\W]+) please", "i")
	const regex_sing = new RegExp(prefix + " play the song ([\\w\\W]+) please", "i")
	const regex_speech = new RegExp(prefix + " how to pronounce ([\\w\\W\\s\\n\\r]+) in ([\\w]+)", "i")
	const regex_speech_reply = new RegExp(prefix + " how to pronounce these words in ([\\w]+)", "i")
	const regex_verse = new RegExp(prefix + " may I have a random bible verse please", "i")
	const regex_verse_of_the_day = new RegExp(prefix + " what is your bible verse for this day", "i")
	const regex_verse_v2 = new RegExp(prefix + " may I have ([\\w\\W]+) in the bible please", "i")
	const regex_weather = new RegExp(prefix + " may I know the weather update in ([\\w\\W]+) please", "i")
	
	let {
		body,
		messageID,
		senderID,
		threadID,
		type
	} = event

	let json_games = JSON.parse(fs.readFileSync("data/games.json", "utf8"))

	if(regex_game_dice.test(body)){
		dice(api, event)
	}else if((regex_game_seq.test(body) && json_games.seq.data[senderID] == undefined) || (regex_game_ans.test(body) && json_games.seq.data[senderID] != undefined)){
		if(json_games.ingame[senderID] == undefined){
			seq(api, event, regex_game_ans)
		}else{
			api.sendMessage(json_games.ingame[senderID], threadID)
		}
	}else if((regex_game_random_word.test(body) && json_games.random.data[senderID] == undefined) || (regex_game_ans.test(body) && json_games.random.data[senderID] != undefined)){
		if(json_games.ingame[senderID] == undefined){
			random_word(api, event, regex_game_ans)
		}else{
			api.sendMessage(json_games.ingame[senderID], threadID)
		}
	}else if((regex_game_word.test(body) && json_games.word.data[senderID] == undefined) || (regex_game_ans.test(body) && json_games.word.data[senderID] != undefined)){
		if(json_games.ingame[senderID] == undefined){
			word(api, event, regex_game_ans)
		}else{
			api.sendMessage(json_games.ingame[senderID], threadID)
		}
	}else if((regex_game_riddles.test(body) && json_games.riddles.ans[senderID] == undefined) || (regex_game_ans.test(body) && json_games.riddles.ans[senderID] != undefined)){
		if(json_games.ingame[senderID] == undefined){
			riddles(api, event, regex_game_ans)
		}else{
			api.sendMessage(json_games.ingame[senderID], threadID)
		}
	}else if(regex_guitar.test(body) && type == "message"){
		guitar(api, event, regex_guitar)
	}else if(regex_img.test(body) && type == "message"){
		img(api, event, regex_img)
	}else if(regex_img_v2.test(body) && type == "message_reply"){
		img(api, event, regex_img_v2)
	}else if(regex_info.test(body)){
		info(api, event, regex_info)
	}else if(regex_info_self.test(body)){
		let x = fs.readFileSync("txt/abt.txt", "utf8")
		api.sendMessage(x, threadID)
	}else if(regex_js.test(body)){
		javascript(api, event, regex_js)
	}else if(regex_pdf.test(body)){
		pdf(api, event, regex_pdf)
	}else if(regex_quote.test(body) && type == "message"){
		quote(api, event, "random")
	}else if(regex_quote_anime.test(body) && type == "message"){
		quote(api, event, "anime")
	}else if(regex_quote_about.test(body) && type == "message"){
		quote(api, event, regex_quote_about)
	}else if((regex_qr_reply.test(body) && type == "message_reply") || (regex_qr.test(body) && type == "message")){
		qr(api, event, regex_qr)
	}else if(regex_sing.test(body) && type == "message"){
		let name = "temp/" + threadID + "_song.mp3"
		if(fs.existsSync(__dirname + "/../" + name)){
			api.sendMessage("Lemme finish the earlier request. Thanks.", threadID, messageID)
		}else{
			let file = fs.createWriteStream(name)
			sing(api, event, file, name, regex_sing)
		}
	}else if(regex_speech.test(body) && type == "message"){
		tell(api, event, regex_speech)
	}else if(regex_speech_reply.test(body) && type == "message_reply"){
		tell(api, event, regex_speech_reply)
	}else if(regex_verse.test(body) && type == "message"){
		verse(api, event, "random")
	}else if(regex_verse_v2.test(body) && type == "message"){
		verse(api, event, regex_verse_v2)
	}else if(regex_verse_of_the_day.test(body) && type == "message"){
		verse(api, event, "verse of the day")
	}else if(regex_weather.test(body) && type == "message"){
		weather(api, event, regex_weather)
	}else{
		ggl(api, event)
	}
}
