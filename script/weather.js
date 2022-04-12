const weatherjs = require("weather-js")

module.exports = async (api, body, event) => {
	let data = body.split(" ")
	if(data.length <= 2){
		api.sendMessage("This feature requires the city of area you want to know", event.threadID, event.messageID)
	}else{
		data.shift()
		data.shift()
		weatherjs.find({
			search: data.join(" "),
			degreeType: 'C'
		}, (err, r) => {
			let d = r[0]
			let m = "Location: " + d.location.name + "\n"
			m += "Temperature: " + d.current.temperature + "\n"
			m += "Sky: " + d.current.skytext + "\n"
			m += "Observation time: " + d.current.date + " " + d.current.observationtime
			api.sendMessage(m, event.threadID, event.messageID)
		})
	}
}
