const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { generarID, crearPanel } = require("../../../servicios/manejadorJSON");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("grupo_crear")
        .setDescription("Crear un grupo avanzado para Albion Online.")
        .addStringOption(op =>
            op.setName("actividad")
                .setDescription("Actividad (ZvZ, HCE, Mazmorra, Facción, Gank, etc.)")
                .setRequired(true)
        )
        .addIntegerOption(op =>
            op.setName("limite")
                .setDescription("Límite máximo de jugadores.")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const actividad = interaction.options.getString("actividad");
        const limite = interaction.options.getInteger("limite");

        const grupoID = generarID("GRP");

        const grupo = crearPanel("grupos", grupoID, {
            id: grupoID,
            actividad,
            limite,
            creador: interaction.user.id,
            inscritos: [],
            estado: "abierto",
            creadoEn: Date.now()
        });

        const embed = new EmbedBuilder()
            .setTitle(`📌 Grupo creado: ${actividad}`)
            .setColor(client.config.colores.albion)
            .addFields(
                { name: "ID del grupo", value: grupoID, inline: true },
                { name: "Límite de jugadores", value: `${limite}`, inline: true },
                { name: "Estado", value: "🟢 Abierto", inline: true }
            )
            .setFooter({ text: "WorldOfAlbionBot — Sistema de grupos PRO" })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
