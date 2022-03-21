function f(p) {
	let g = [
		"bobo",
		"bold",
		"tanga",
		"gaga",
		"gago",
		"gagu",
		"kulangot",
		"kwak",
		"ulol",
		"olol",
		"ulul",
		"olul",
		"taena",
		"tangina",
	]
	let w = p.split(" ")
	for(let i = 0; i < g.length; i++){
		for(let j = 0; j < w.length; j++){
			if(w[j] == g[i]){
				return true
				break
			}
		}
	}
	return false
	//return /^([bobo|bobu|bubo|gaga|gagi|gago|gagu|kulangot|kwak|olol|olul|ulol|ulul|potaena|shit|putanginamo|potaenamo|putang\sina|putangina|pota|tanga|taena|tangina|yawa]+)/.test(p)
}

module.exports = (body) => {
	return f(body)
}