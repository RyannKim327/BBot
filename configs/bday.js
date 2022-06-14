const cron = require("node-cron")

module.exports = async (api) => {
	cron.schedule('30 23 * * *', async () => {
		api.getThreadList(20, null, ['INBOX'], async (err, data) => {
			if(err) return console.error("Error [Birthday]: " + err)
			for(i in data){
				if(data[i].isGroup && data[i].isSubscribed){
					let list = data[i].participantIDs
					let message = "Happy birthday to:\n"
					let k = 0
					let myself = api.getCurrentUserID()
					let ment = []
					for(j in list){
						//console.log("greet")
						let user = await api.getUserInfo(list[j])
						console.log(user[list[j]].name + " " + user[list[j]].isBirthday)
						if(user[list[j]].isBirthday && list[j] != myself){
							let g = ""
							switch(user.gender){
								case 1:
									g = "Ms."
								break
								case 2:
									g = "Mr."
								break
								default:
									g = "Mr./Ms."
							}
							message += g + " " + user[list[j]].name + "\n"
							ment.push = [{
								id: list[j],
								tag: `${user[list[j]].name}`,
								fromIndex: 9
							}]
							k++
						}
					}
					if(k > 0){
						message += "Wishing you have a longer life. Enjoy great day."
						api.sendMessage({
							body: message,
							mentions: ment
						}, data[i].threadID)
					}
				}
			}
		})
	})
}

/*
const fs = require("fs");
const login = require("fca-unofficial");

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.getUserInfo([1, 2, 3, 4], (err, ret) => {
        if(err) return console.error(err);

        for(var prop in ret) {
            if(ret.hasOwnProperty(prop) && ret[prop].isBirthday) {
                api.sendMessage("Happy birthday :)", prop);
            }
        }
    });
});
*/