const { SlashCommandBuilder } = require('discord.js');
const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grupo')
        .setDescription('Comandos de gestión de grupos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('eliminar')
                .setDescription('Eliminar un grupo existente')
                .addStringOption(option =>
                    option.setName('grupo_id')
                        .setDescription('ID del grupo a eliminar')
                        .setRequired(true))
        ),
    
    async execute(interaction) {
        const grupoId = interaction.options.getString('grupo_id');
        const exito = await sistemaGrupos.eliminarGrupo(grupoId, interaction.user.id);
        
        if (exito) {
            await interaction.reply({ 
                content: '✅ Grupo eliminado exitosamente', 
                ephemeral: true 
            });
        } else {
            await interaction.reply({ 
                content: '❌ Error: Grupo no encontrado o no tienes permisos', 
                ephemeral: true 
            });
        }
    }
};