const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("plantilla_crear")
        .setDescription("Crea una plantilla personalizada para grupos de Albion Online.")
        .addStringOption(op =>
            op.setName("nombre")
                .setDescription("Nombre de la plantilla.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.reply(`Plantilla **${interaction.options.getString("nombre")}** creada.`);
    }
};
