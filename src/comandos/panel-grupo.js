const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel_grupo")
        .setDescription("Muestra un panel interactivo de un grupo."),

    async execute(interaction) {
        await interaction.reply("Aquí irá el panel del grupo.");
    }
};
