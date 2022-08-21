require('dotenv').config();

const path = require('path');

const { GatewayIntentBits } = require('discord.js');
const AkiClient = require('./library/AkiClient');

const client = new AkiClient({ intents: [GatewayIntentBits.Guilds] });

client.keys = {
	private: path.join(process.cwd(), 'keys', 'jwt.key'),
	public: path.join(process.cwd(), 'keys', 'jwt.pub')
};

client.login(process.env.DISCORD_TOKEN);
