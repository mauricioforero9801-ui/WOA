const { SlashCommandBuilder } = require("discord.js");
const { cerrarPanel } = require("../../../servicios/manejadorJSON");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("grupo_eliminar")
        .setDescription("Eliminar un grupo creado.")
        .addStringOption(op =>
            op.setName("id")
                .setDescription("ID del grupo")
                .setRequired(true)
        ),

    async execute(interaction) {
        const id = interaction.options.getString("id");

        const exito = cerrarPanel("grupos", id);

        if (!exito) {
            return interaction.reply({
                content: "❌ No existe un grupo con ese ID.",
                ephemeral: true
            });
        }

        return interaction.reply(`🗑️ Grupo **${id}** eliminado correctamente.`);
    }
};
