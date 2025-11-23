const sistemaGrupos = require('../../servicios/sistemaGrupos.js');

module.exports = {
    name: 'unirse_tanque',
    
    async execute(interaction) {
        const grupoId = interaction.customId.split('_')[2];
        const usuarioId = interaction.user.id;

        const resultado = await sistemaGrupos.unirseAlGrupo(grupoId, usuarioId, 'tanque');
        
        if (resultado.exito) {
            await interaction.reply({ 
                content: `✅ Te has unido como **Tanque** al grupo`, 
                ephemeral: true 
            });
            
            await sistemaGrupos.actualizarMensajeGrupo(grupoId);
        } else {
            await interaction.reply({ 
                content: '❌ No se pudo unir al grupo: ' + resultado.razon, 
                ephemeral: true 
            });
        }
    }
};
