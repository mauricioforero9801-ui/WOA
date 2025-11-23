const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config.js');

const cliente = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

cliente.comandos = new Collection();

// Configuración básica del bot
cliente.once('ready', () => {
    console.log(`✅ WorldOfAlbionBot conectado como ${cliente.user.tag}`);
    cliente.user.setActivity('Albion Online | /grupo', { type: 'PLAYING' });
});

// Manejo de comandos básico
cliente.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Comando básico de prueba
    if (interaction.commandName === 'grupo') {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'crear') {
            await interaction.reply({
                content: '🎯 **WorldOfAlbionBot - Grupo Creado**\n¡Funcionando correctamente!',
                ephemeral: true
            });
        }
    }
});

// Iniciar el bot
cliente.login(config.token).catch(console.error);