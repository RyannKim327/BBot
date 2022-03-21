const axios = require("axios")

async function joke (){
	let result = await axios.get("https://api.chucknorris.io/jokes/random?category=dev").then((r) => {
		return r.data
	}).catch((e) => {
		console.log(e)
		return "Error"
	})
}