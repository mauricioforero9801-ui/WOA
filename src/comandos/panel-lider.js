const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel_lider")
        .setDescription("Muestra el panel de herramientas del líder de grupo."),

    async execute(interaction) {
        await interaction.reply("Panel del líder desplegado.");
    }
};
