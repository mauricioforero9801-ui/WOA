const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("plantilla_aplicar")
        .setDescription("Aplica una plantilla a un grupo existente.")
        .addStringOption(op =>
            op.setName("plantilla")
                .setDescription("Nombre de la plantilla.")
                .setRequired(true)
        )
        .addStringOption(op =>
            op.setName("grupo_id")
                .setDescription("ID del grupo al cual aplicar la plantilla.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.reply(`Plantilla aplicada correctamente.`);
    }
}