const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('../config.js');

class ClienteWorldOfAlbion extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        this.comandos = new Collection();
        this.grupos = new Map();
        this.plantillas = new Map();
        this.paneles = new Map();
        this.recordatorios = new Map();
        this.config = config;
    }
}

module.exports = ClienteWorldOfAlbion;