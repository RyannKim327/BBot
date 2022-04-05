module.exports = (body) => {
	const regex = /(bobo|bobu|bold|bubo|bubu|fuck|fuck\syou|gaga|gago|gagu|kulangot|kwak|olol|olul|pota|potaena|putangina|putang\sina|ulol|ulul|tanga|taena|tangina|yawa)/
	return regex.test(body)
}
