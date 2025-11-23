function buildRaidEmbed(raid) {
  const lines = [];
  lines.push(`Actividad: ${raid.actividad || 'No especificada'}`);
  lines.push(`Fecha: ${raid.fecha || 'No definida'} (${raid.zonaHoraria || 'No definida'})`);
  lines.push('');
  lines.push('Roles:');
  lines.push(`Tanque (${raid.roles.tanque.length}/${raid.limites.tanque}): ${raid.roles.tanque.map(u => `<@${u}>`).join(', ') || '—'}`);
  lines.push(`Sanador (${raid.roles.sanador.length}/${raid.limites.sanador}): ${raid.roles.sanador.map(u => `<@${u}>`).join(', ') || '—'}`);
  lines.push(`DPS (${raid.roles.dps.length}/${raid.limites.dps}): ${raid.roles.dps.map(u => `<@${u}>`).join(', ') || '—'}`);
  lines.push(`Flex (${raid.roles.flex.length}/${raid.limites.flex}): ${raid.roles.flex.map(u => `<@${u}>`).join(', ') || '—'}`);
  lines.push(`Reserva (${raid.roles.reserva.length}): ${raid.roles.reserva.map(u => `<@${u}>`).join(', ') || '—'}`);

  return {
    embeds: [{
      title: raid.titulo || 'Grupo de Albion',
      description: lines.join('\n'),
      timestamp: new Date().toISOString()
    }]
  };
}

module.exports = { buildRaidEmbed };
