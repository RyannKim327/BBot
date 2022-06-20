let fs = require("fs")

//const chat = require("./script/chat")

const morse = require("./../script/morse")
const news = require("./../script/news")


const dice = require("./../games/dice")
const fibbo = require("./../games/fibbo")
const random_word = require("./../games/randomword")
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

const regex_game_dice = /JC, play roll a die/
const regex_game_fibbo = /JC, play fibbonacci game/
const regex_game_fibbo_ans = /JC, the hidden number is ([0-9]+)/
const regex_game_random_word = /JC, play random word/
const regex_game_random_word_ans = /JC, the word is ([\w\W]+)/
const regex_game_word = /JC, play guess the word/
const regex_game_word_ans = /JC, its ([\w\W]+)/
	
const regex_guitar = /JC, may I have the guitar chords of ([\w\W]+) please/
const regex_img = /JC, may I have a random image of ([\w\W]+) please/
const regex_img_v2 = /JC, what does this photo means/
const regex_info = /JC, may I have the facebook info of ([\w\W]+) please/
const regex_info_self = /JC, please introduce yourself to us/
const regex_js = /JC, please test this javascript code ([\w\W]+)/
const regex_pdf = /JC, may I have some pdf books of ([\w\W]+) please/
const regex_quote = /JC, may I have a random quotes please/
const regex_quote_anime = /JC, may I have a random quotes from an anime character please/
const regex_quote_about = /JC, may I have a random quotes about ([\w\W]+) please/
const regex_qr_reply = /JC, generate a QR Code for this text please/
const regex_qr = /JC, generate a QR Code of ([\w\W]+) please/
const regex_sing = /JC, play the song ([\w\W]+) please/
const regex_speech = /JC, how to pronounce ([\w\W\s\n\r]+) in ([\w]+)/
const regex_speech_reply = /JC, how to pronounce these words in ([\w]+)/
const regex_verse = /JC, may I have a random bible verse please/
const regex_verse_of_the_day = /JC, what is your bible verse for this day/
const regex_verse_v2 = /JC, may I have ([\w\W]+) in the bible please/
const regex_weather = /JC, may I know the weather update in ([\w\W]+) please/
	
module.exports = async (api, event, prefix, gc, vip) => {
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
	}else if((regex_game_fibbo.test(body) && json_games.fibbo.digit[senderID] == undefined) || (regex_game_fibbo_ans.test(body) && json_games.fibbo.digit[senderID] != undefined)){
		fibbo(api, event, regex_game_fibbo_ans)
	}else if((regex_game_random_word.test(body) && json_games.random.data[senderID] == undefined) || (regex_game_random_word_ans.test(body) && json_games.random.data[senderID] != undefined)){
		random_word(api, event, regex_game_random_word_ans)
	}else if((regex_game_word.test(body) && json_games.word.data[senderID] == undefined) || (regex_game_word_ans.test(body) && json_games.word.data[senderID] != undefined)){
		word(api, event, regex_game_word_ans)
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
