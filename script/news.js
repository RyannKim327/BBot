const ggl = require("googlethis")

module.exports = async (api, body, event) => {
	let news = await ggl.getTopNews()
	/*let message = ""
	for(let i : news){
		message += 
	}*/
	console.log(news)
}
