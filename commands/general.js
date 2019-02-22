exports.commands = [
	"kick"
	, "warn"
]
const DB = require("../database.js")
exports.kick = {
	name: "kick"
	, permission: "SEND_MESSAGES"
	, description: "kicks people"
	, category: "GENERAL"
	, process: function (msg, bot, args) {
		console.log("I tried to kick")
	}
}
exports.warn = {
	name: "warn"
	, permission: "SEND_MESSAGES"
	, description: "warns people"
	, category: "GENERAL"
	, process: async function (msg, bot, args) {
		console.log("I tried to warn")
		await DB.log("warn", args).then(w => {
			console.log(args[0])
			var user = msg.guild.members.get(args[0]);
			console.log(user.user.username);
			msg.channel.send(`I warned ${user.user.username}`)
			DB.getData(args[0]).then(data => {
				if (data != null) {
					//msg.channel.send(JSON.stringify(data,null,'\t'))
					console.log(data)
				}
			});
		});
	}
}