const fs = require('node:fs');
const path = require('node:path');

const StatsD = require('hot-shots');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { Client, Collection } = require('discord.js');

class AkiClient extends Client {

	constructor(options = {}) {
		super(options);

		this.options = options;

		this.commands = new Collection();

		this.stats = new StatsD();

		this.mongo = null;
	}


	async login(token) {
		const commandsPath = path.join(process.cwd(), 'src', 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		const eventsPath = path.join(process.cwd(), 'src', 'events');
		const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			this.commands.set(command.data.name, command);
		}

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args));
			} else {
				this.on(event.name, (...args) => event.execute(...args));
			}
		}

		const good = await this.connectMongo();
		if (!good) {
			console.log('Issue with mongo, not starting...');
			return process.exit(1);
		}
		return super.login(token);
	}

	async connectMongo() {
		const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;
		const options = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
		const client = new MongoClient(uri, options);

		await client.connect();
		this.mongo = client;
		this.db = client.db('aki');
		return true;
	}

}

module.exports = AkiClient;
