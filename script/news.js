const ggl = require("googlethis")

async function n(){
	return await ggl.getTopNews()
}

module.exports = (api, body, event) => {
	let news = n()[0]
	/*let message = ""
	for(let i : news){
		message += 
	}*/
	console.log(news)
}
