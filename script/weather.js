const weatherjs = require("weather-js")
const ggl = require("googlethis")

async function search(location){
	let result = await ggl.search(location, {
		page: 0,
		safe: true,
		additional_parameters: {
			hl: "en"
		}
	})
	return result
}

module.exports = async (api, event, regex) => {
	let data = event.body.match(regex)
	let weather = await search("weather " + data[1])
	console.log(weather.weather)
	if(weather.weather == undefined || weather.weather.temperature == undefined){
		weatherjs.find({
			search: data.join(" "),
			degreeType: 'C'
		}, (err, r) => {
			if(err) return console.error("Error [Weather]: " + err)
			let d = r[0]
			let m = "Location: " + d.location.name + "\n"
			m += "Temperature: " + d.current.temperature + "\n"
			m += "Sky: " + d.current.skytext + "\n"
			m += "Observation time: " + d.current.date + " " + d.current.observationtime
			api.sendMessage(m, event.threadID, event.messageID)
		})
	}else{
		let output = weather.weather
		let m = "Location: " + output.location
		m += "\nForecast: " + output.forecast
		m += "\nTemperature: " + output.temperature + "°F" + " (" + ((output.temperature - 32) * 5/9) + "°C)"
		if(output.precipitation != undefined)
			m += "\nPrecipitation: " + output.precipitation
		if(output.humidity != undefined)
			m += "\nHumidity: " + output.humidity
		if(output.wind != undefined)
			m += "\nWind speed: " + output.wind
		api.sendMessage(m, event.threadID, event.messageID)
	}
}
