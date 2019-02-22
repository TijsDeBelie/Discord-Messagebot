const cmd = require("./commands/general.js")

async function newCommand(msg, message) {
	console.log("Message: " + message)
	var args = message.split(' ');
	console.log(args)
	var command = args[0]
	args.shift();
	
	console.log("Arguments: " + args)
	console.log("COMMAND: " + command)
	process(command, msg, msg.client, args)
	
}

var handlers = {
	
	"warn": cmd.warn.process,
	"kick": cmd.kick.process
}

function loop() {
	cmd.commands.forEach(function(element) {
		
		//add them to handlers
		
});
	
	
}
loop()


function process(command, msg, bot, args) {
	handlers[command](msg, bot, args)
}


module.exports = {
	newCommand: newCommand
}

