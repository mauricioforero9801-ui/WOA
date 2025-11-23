const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    
    async execute(cliente) {
        console.log(`🎯 WorldOfAlbionBot listo! Conectado como ${cliente.user.tag}`);
        console.log(`📊 Servidores: ${cliente.guilds.cache.size}`);
        console.log(`👥 Usuarios: ${cliente.users.cache.size}`);
        
        cliente.user.setActivity('Albion Online | /grupo crear', { type: 'PLAYING' });
    }
};