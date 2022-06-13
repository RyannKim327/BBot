
module.exports = (api, body, event) => {
	const regex = /KG:\sHello/
	if(regex.test(body)){
		api.sendMessage("Regex test executed", event.threadID)
	}
}
