const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grupo')
        .setDescription('Crear un nuevo grupo para actividades de Albion Online')
        .addSubcommand(subcommand =>
            subcommand
                .setName('crear')
                .setDescription('Crear un nuevo grupo')
                .addStringOption(option =>
                    option.setName('actividad')
                        .setDescription('Tipo de actividad')
                        .setRequired(true)
                        .addChoices(
                            { name: 'ZvZ 50v50', value: 'zvz_50' },
                            { name: 'ZvZ 80v80', value: 'zvz_80' },
                            { name: 'ZvZ 120v120', value: 'zvz_120' },
                            { name: 'ZvZ 180v180', value: 'zvz_180' },
                            { name: 'GVG', value: 'gvg' },
                            { name: 'HCE Nivel 1-10', value: 'hce_1_10' },
                            { name: 'HCE Nivel 11-18', value: 'hce_11_18' },
                            { name: 'Mazmorra Avaloniana', value: 'mazmorra_avalonian' }
                        ))
                .addStringOption(option =>
                    option.setName('fecha')
                        .setDescription('Fecha del evento (DD/MM/YYYY)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('hora')
                        .setDescription('Hora del evento (HH:MM)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('descripcion')
                        .setDescription('Descripción adicional del grupo'))
        ),
    
    async execute(interaction) {
        const actividad = interaction.options.getString('actividad');
        const fecha = interaction.options.getString('fecha');
        const hora = interaction.options.getString('hora');
        const descripcion = interaction.options.getString('descripcion') || 'Sin descripción adicional';

        const grupoId = await sistemaGrupos.crearGrupo({
            actividad,
            fecha,
            hora,
            descripcion,
            lider: interaction.user.id,
            canalId: interaction.channel.id
        });

        const embed = sistemaGrupos.crearEmbedGrupo(grupoId);
        const botones = sistemaGrupos.crearBotonesInscripcion(grupoId);

        await interaction.reply({ 
            content: `✅ Grupo **${actividad}** creado exitosamente!`, 
            ephemeral: true 
        });

        await interaction.channel.send({ 
            embeds: [embed], 
            components: botones 
        });
    }
};