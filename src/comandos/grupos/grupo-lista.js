const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { cargarJSON } = require("../../../servicios/manejadorJSON");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("grupo_lista")
        .setDescription("Lista todos los grupos activos."),

    async execute(interaction, client) {
        const grupos = cargarJSON("grupos");

        if (!grupos || Object.keys(grupos).length === 0) {
            return interaction.reply("No hay grupos creados actualmente.");
        }

        const embed = new EmbedBuilder()
            .setTitle("📋 Grupos activos")
            .setColor(client.config.colores.albion);

        for (const id in grupos) {
            const g = grupos[id];
            embed.addFields({
                name: `${id} — ${g.actividad}`,
                value: `Inscritos: **${g.inscritos.length}/${g.limite}**\nEstado: ${g.estado === "abierto" ? "🟢" : "🔴"}`,
                inline: false
            });
        }

        return interaction.reply({ embeds: [embed] });
    }
};
