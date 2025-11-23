const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    name: 'salir_grupo',
    
    async execute(interaction) {
        const grupoId = interaction.customId.split('_')[2];
        const usuarioId = interaction.user.id;

        const resultado = await sistemaGrupos.salirDelGrupo(grupoId, usuarioId);
        
        if (resultado) {
            await interaction.reply({ 
                content: `✅ Has salido del grupo`, 
                ephemeral: true 
            });
            
            await sistemaGrupos.actualizarMensajeGrupo(grupoId);
        } else {
            await interaction.reply({ 
                content: '❌ No estabas en este grupo', 
                ephemeral: true 
            });
        }
    }
};