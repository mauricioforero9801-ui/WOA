const { SlashCommandBuilder } = require('discord.js');
const sistemaPlantillas = require('../servicios/sistemaPlantillas.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plantilla')
        .setDescription('Gestión de plantillas de grupos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('crear')
                .setDescription('Crear una nueva plantilla')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre de la plantilla')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('actividad')
                        .setDescription('Tipo de actividad')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('descripcion')
                        .setDescription('Descripción de la plantilla'))
        ),
    
    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const actividad = interaction.options.getString('actividad');
        const descripcion = interaction.options.getString('descripcion') || '';

        const plantillaId = await sistemaPlantillas.crearPlantilla({
            nombre,
            actividad,
            descripcion,
            creador: interaction.user.id
        });

        await interaction.reply({ 
            content: `✅ Plantilla **${nombre}** creada exitosamente (ID: ${plantillaId})`, 
            ephemeral: true 
        });
    }
};