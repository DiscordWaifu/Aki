require('dotenv').config();

const { GatewayIntentBits } = require('discord.js');
const AkiClient = require('./library/AkiClient');

const client = new AkiClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers] });


client.login(process.env.DISCORD_TOKEN);