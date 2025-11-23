const { SlashCommandBuilder } = require('discord.js');
const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grupo')
        .setDescription('Comandos de gestión de grupos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Obtener información de un grupo')
                .addStringOption(option =>
                    option.setName('grupo_id')
                        .setDescription('ID del grupo')
                        .setRequired(true))
        ),
    
    async execute(interaction) {
        const grupoId = interaction.options.getString('grupo_id');
        const embed = sistemaGrupos.crearEmbedGrupo(grupoId);
        
        if (embed) {
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ 
                content: '❌ Grupo no encontrado', 
                ephemeral: true 
            });
        }
    }
};