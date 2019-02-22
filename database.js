const sqlite3 = require('sqlite3').verbose();
var MessageDB;

function open() {
	MessageDB = new sqlite3.Database('./Storage/MessageDB.sqlite', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Connected to the MessageDB database.');
	});
}

function close() {
	MessageDB.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Closed the MessageDB database connection.');
	})
}
async function WriteMessage(msg) {
	if (msg.content == null) return;
	var results = msg.content.replace(/[^a-zA-Z0-9 ]/g, '');
	console.log(results)
	let sql = `SELECT user_id FROM PersonDB where user_id = ${msg.author.id}`;
	MessageDB.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		console.log(rows)
		console.log(rows.length)
		if (rows.length <= 0) {
			var stmt = MessageDB.prepare("INSERT INTO PersonDB (user_id,warnings,kicks,comment) VALUES (?,?,?,?)");
			stmt.run(msg.author.id, 0, 0, null);
			stmt.finalize();
			console.log(`Added ${msg.author.id} to the PersonDB`)
		}
	});
	var stmt = MessageDB.prepare("INSERT INTO MessageDB (guild_id,channel_id,user_id,message_id,message) VALUES (?,?,?,?,?)");
	stmt.run(msg.guild.id, msg.channel.id, msg.author.id, msg.id, results);
	stmt.finalize();
}
async function WriteDM(msg) {
	if (msg.content == null || msg.author.bot) return;
	var stmt = MessageDB.prepare("INSERT INTO MessageDB (guild_id,channel_id,user_id,message_id,message) VALUES (?,?,?,?,?)");
	stmt.run("DM", "DM", msg.author.id, msg.id, msg.content);
	stmt.finalize();
}
async function log(event, userid) {
	return new Promise(function (resolve, reject) {
		switch (event) {
		case "kick":
			var stmt = MessageDB.prepare(`UPDATE PersonDB set kicks = kicks + 1 where user_id = ${userid}`);
			stmt.run();
			resolve();
			break;
		case "warn":
			var stmt = MessageDB.prepare(`UPDATE PersonDB set warnings = warnings + 1 where user_id = ${userid}`);
			stmt.run();
			resolve();
			break;
		}
	});
}
async function getData(userid) {
	return new Promise(function (resolve, reject) {
		let sql = `SELECT warnings,kicks,comment FROM PersonDB where user_id = ${userid}`;
		var result;
		MessageDB.all(sql, [], (err, rows) => {
			if (err) {
				reject("An error occured");
			}
			resolve(Object.keys(rows).map(function (key) {
				return [Number(key), rows[key]];
			}));
		});
	})
}
module.exports = {
		WriteMessage: WriteMessage
		, open: open
		, close: close
		, WriteDM: WriteDM
		, log: log
		, getData: getData
	}
	//select * from MessageDB inner join PersonDB on MessageDB.user_id = PersonDB.user_id where PersonDB.user_id = 243275264497418250 LIMIT 1