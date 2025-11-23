const { SlashCommandBuilder } = require('discord.js');
const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configuración del WorldOfAlbionBot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('limites')
                .setDescription('Configurar límites de roles por actividad')
                .addStringOption(option =>
                    option.setName('actividad')
                        .setDescription('Tipo de actividad')
                        .setRequired(true)
                        .addChoices(
                            { name: 'ZvZ 50v50', value: 'zvz_50' },
                            { name: 'ZvZ 80v80', value: 'zvz_80' },
                            { name: 'HCE', value: 'hce' },
                            { name: 'Mazmorra Avaloniana', value: 'mazmorra_avalonian' }
                        ))
                .addStringOption(option =>
                    option.setName('rol')
                        .setDescription('Rol a configurar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Tanque', value: 'tanque' },
                            { name: 'Sanador', value: 'sanador' },
                            { name: 'DPS Melee', value: 'dps_melee' },
                            { name: 'DPS Rango', value: 'dps_rango' },
                            { name: 'Soporte', value: 'soporte' }
                        ))
                .addIntegerOption(option =>
                    option.setName('limite')
                        .setDescription('Límite máximo para este rol')
                        .setRequired(true))
        ),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ 
                content: '❌ No tienes permisos para usar este comando', 
                ephemeral: true 
            });
        }

        const actividad = interaction.options.getString('actividad');
        const rol = interaction.options.getString('rol');
        const limite = interaction.options.getInteger('limite');

        await sistemaGrupos.configurarLimiteRol(actividad, rol, limite);
        
        await interaction.reply({ 
            content: `✅ Límite configurado: **${rol}** en **${actividad}** = ${limite}`, 
            ephemeral: true 
        });
    }
};