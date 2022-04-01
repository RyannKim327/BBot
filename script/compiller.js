const request = require("request")

/*
var request = require('request');

var program = {
    script : "",
    language: "php",
    versionIndex: "0",
    clientId: "YourClientID",
    clientSecret:"YourClientSecret"
};
request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
});
*/

async function func(language, code){
	let prog = {
		script: code,
		language: language,
		versionIndex: "0",
		clientID: "3e98daab2192d6f484f184539e37dcfb",
		clientSecret: "d349305d1a727ba60749c79f9d0fbe473e0da0679961993757e0afc61641b4ae"
	}
	let output = request({
		url: "https://api.jdoodle.com/v1/execute",
		method: "POST",
		json: prog
	}, (err, res, body) => {
		if(err && res.statusCode != 200){
			console.error("Error [JDoodle]: " + err(
			return null
		}else{
			return body
		}
	})
	return output
}

module.exports = (api, body, event) => {
	let spl = body.split(" ")
	spl.shift()
	spl.shift()
	let lang = spl[0]
	spl.shift()
	api.sendMessage(func(lang, spl.join(" ")), event.threadID, event.senderID)
}
