const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("grupo_editar")
        .setDescription("Edita un grupo existente.")
        .addStringOption(op =>
            op.setName("grupo_id")
                .setDescription("ID del grupo a editar.")
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName("actividad")
                .setDescription("Nueva actividad del grupo.")
                .setRequired(false)
        )
        .addIntegerOption(op =>
            op.setName("limite")
                .setDescription("Nuevo límite de jugadores.")
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.reply("Grupo editado correctamente.");
    }
};
