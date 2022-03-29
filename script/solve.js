module.exports = (api, body, event) => {
  let data = body.split(" ")
  data.shift()
  let result = Math.eval(data.join(" "))
  api.sendMessage(`Result: ${result}`, event.threadID, event.messageID)
}
