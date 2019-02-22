const discord = require("discord.js");
const bot = new discord.Client();
const auth = require("./auth.json")
const DB = require("./database.js")
const Error = require("./error.js")
const Command = require("./commands.js")
const config = require("./config.json")
	//plugins
bot.on("ready", () => {
	console.log("I am ready!")
	DB.open();
})
bot.on("message", (msg) => {
	if (msg.channel.type == 'dm') {
		DB.WriteDM(msg)
	}
	else {
		//console.log(`${msg.guild.id} ${msg.channel.id} ${msg.author.id} ${msg.content}\n`)
		DB.WriteMessage(msg)
	}
	if(msg.content.startsWith(config.prefix)){
		Command.newCommand(msg,msg.content.substring(config.prefix.length));
	}
})
bot.on("error", error => {
	Error.log(error)
	DB.close();
})


bot.login(auth.login)