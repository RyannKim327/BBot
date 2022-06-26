const axios = require("axios")

function ns (y){
	let x = y.toString()
	let a = ""
	let b = 0
	for(let c = x.length - 1; c >= 0; c--){
		if(((c - x.length) % 3) == 0 && (c % 3) != 0){
			a = "," + x[c] + a
		}else{
			a = x[c] + a
		}
	}
	return a
}

async function cov(){
	let result = await axios.get("https://disease.sh/v3/covid-19/countries/ph").then((r) => {
		return r.data
	}).catch((e) => {
		console.error("Error [Api Covid]: " + e)
		return null
	})
	return result
}

module.exports = async (api, event) => {
	let covid = await cov()
	let date = new Date(covid.updated)
	let months = [
		"January", "Febuary", "March", "April", "May", "June", "July", 
		"August", "September", "October", "November", "December"
	]
	let str = `Covid update for ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}.\n\n    According to desease(dot)sh, there are ${ns(covid.active)} currently active cases out of ${ns(covid.cases)} total cases, and ${ns(covid.critical)} of them are in critical condition. There are ${ns(covid.todayDeaths)} added deaths and the current total deaths for now is ${ns(covid.deaths)}. But the good news is, there are ${ns(covid.todayRecovered)} recoveries for today with the total of ${ns(covid.recovered)} recoveries. Based on my system's calculation with the formula of (total recoveries) / (total cases) * 100, the current recovery rate of covid-19 here in the ${covid.country} is about ${Math.round((covid.recovered / covid.cases) * 100)} %, this formula is based on (Calculating SARS-CoV-2 | CDC)\n\n- Covid-19 Daily updates`
	api.sendMessage(str, event)
}
