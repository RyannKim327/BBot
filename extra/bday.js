const cron = require("node-cron")

module.exports = (api) => {
	cron.schedule('0 0 * * *', async (err, data) => {
		api.getTheadList(20, null ['INBOX'], async () => {
			for(let i in data.length){
				if(data[i].isGroup){
					let list = data[i].participants
					let message = "Happy birthday to:\n"
					for(let j in list){
						let user = await api.getUserInfo(list[j])
						if(user.isBirthday){
							let g = ""
							switch(user.gender){
								case 1:
									g = "Ms."
								break
								case 2:
									g = "Mr."
								break
								default
									g = "Mr./Ms."
							}
							message += g + user[list[j]].name + "\n"
						}
					}
					message += "Wishing you have a great day."
					api.sendMessage(message, data[i].threadID)
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