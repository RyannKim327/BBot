module.exports = (api, event, regex) => {
	let data = event.body.match(regex)
	let output = eval(data[1])
	api.sendMessage(`Output:\n\n${output}`, event.threadID)
}
