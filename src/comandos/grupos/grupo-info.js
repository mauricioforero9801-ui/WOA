const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { obtenerPanel } = require("../../../servicios/manejadorJSON");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("grupo_info")
        .setDescription("Muestra la información de un grupo de Albion Online.")
        .addStringOption(op =>
            op.setName("id")
                .setDescription("ID del grupo")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const id = interaction.options.getString("id");
        const grupo = obtenerPanel("grupos", id);

        if (!grupo) {
            return interaction.reply({
                content: "❌ No existe un grupo con ese ID.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📖 Información del grupo: ${grupo.actividad}`)
            .setColor(client.config.colores.albion)
            .addFields(
                { name: "ID", value: grupo.id, inline: true },
                { name: "Límite", value: `${grupo.limite}`, inline: true },
                { name: "Estado", value: grupo.estado === "abierto" ? "🟢 Abierto" : "🔴 Cerrado", inline: true },
                { name: "Creador", value: `<@${grupo.creador}>`, inline: true },
                { name: "Inscritos", value: grupo.inscritos.length > 0 ? grupo.inscritos.map(u => `<@${u.usuario}>`).join("\n") : "Nadie todavía" }
            )
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};
