const { SlashCommandBuilder } = require('discord.js');
const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grupo')
        .setDescription('Comandos de gestión de grupos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('editar')
                .setDescription('Editar un grupo existente')
                .addStringOption(option =>
                    option.setName('grupo_id')
                        .setDescription('ID del grupo a editar')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('campo')
                        .setDescription('Campo a editar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Fecha', value: 'fecha' },
                            { name: 'Hora', value: 'hora' },
                            { name: 'Descripción', value: 'descripcion' }
                        ))
                .addStringOption(option =>
                    option.setName('valor')
                        .setDescription('Nuevo valor')
                        .setRequired(true))
        ),
    
    async execute(interaction) {
        const grupoId = interaction.options.getString('grupo_id');
        const campo = interaction.options.getString('campo');
        const valor = interaction.options.getString('valor');

        const exito = await sistemaGrupos.editarGrupo(grupoId, campo, valor, interaction.user.id);
        
        if (exito) {
            await interaction.reply({ 
                content: `✅ Grupo actualizado exitosamente - **${campo}** cambiado a: ${valor}`, 
                ephemeral: true 
            });
        } else {
            await interaction.reply({ 
                content: '❌ Error: Grupo no encontrado o no eres el líder', 
                ephemeral: true 
            });
        }
    }
};