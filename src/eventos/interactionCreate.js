module.exports = {
  name: 'interactionCreate',
  execute: async (interaction, client) => {
    try {
      if (interaction.isChatInputCommand()) {
        const cmd = client.comandos.get(interaction.commandName);
        if (!cmd) return interaction.reply({ content: 'Comando no encontrado', ephemeral: true });
        await cmd.execute(interaction, client);
      }
      // Aquí puedes manejar botones, selects, modales en el futuro
    } catch (err) {
      console.error('Error en interactionCreate:', err);
      if (interaction.replied || interaction.deferred) {
        try { await interaction.followUp({ content: 'Error interno', ephemeral: true }); } catch(e){}
      } else {
        try { await interaction.reply({ content: 'Error interno', ephemeral: true }); } catch(e){}
      }
    }
  }
};
