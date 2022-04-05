module.exports = (body) => {
	const regex = /^(bobo|bobu|bold|bubo|bubu|fuck|fuck\syou|gaga|gago|gagu|kulangot|kwak|olol|olul|pota|potaena|putangina|putang\sina|ulol|ulul|tanga|taena|tangina|yawa)$/i

	let text = body.split(" ")
	let res = false
	for(let i = 0; i < text.length; i++){
		if(regex.test(text[i])){
			res = true
			break
		}
	}
	return res
}
