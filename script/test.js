
module.exports = (api, body, event) => {
	const regex = /NoBhie:\sHello/
	if(regex.test(body)){
		api.sendMessage("Regex test executed", event.threadID)
	}
}
