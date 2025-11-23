const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.js');

class SistemaGrupos {
    constructor() {
        this.grupos = new Map();
        this.configActividades = this.inicializarConfigActividades();
    }

    inicializarConfigActividades() {
        return {
            'zvz_50': { 
                nombre: 'ZvZ 50v50', 
                color: config.colores.zvz, 
                limites: { 
                    tanque: 5, 
                    sanador: 8, 
                    dps_melee: 20, 
                    dps_rango: 15, 
                    soporte: 2,
                    shotcaller: 1,
                    flex: 5,
                    reserva: 10
                } 
            },
            'zvz_80': { 
                nombre: 'ZvZ 80v80', 
                color: config.colores.zvz, 
                limites: { 
                    tanque: 8, 
                    sanador: 12, 
                    dps_melee: 30, 
                    dps_rango: 25, 
                    soporte: 5,
                    shotcaller: 1,
                    flex: 10,
                    reserva: 15
                } 
            },
            'gvg': { 
                nombre: 'GVG', 
                color: config.colores.gvg, 
                limites: { 
                    tanque: 1, 
                    sanador: 1, 
                    dps_melee: 5, 
                    dps_rango: 2, 
                    soporte: 1 
                } 
            },
            'hce_1_10': { 
                nombre: 'HCE Nivel 1-10', 
                color: config.colores.hce, 
                limites: { 
                    tanque: 1, 
                    sanador: 1, 
                    dps_melee: 2, 
                    dps_rango: 1, 
                    soporte: 0 
                } 
            }
        };
    }

    obtenerConfiguracionActividad(actividad) {
        return this.configActividades[actividad] || this.configActividades['zvz_50'];
    }

    async crearGrupo(datos) {
        const grupoId = `grupo_${Date.now()}`;
        const configActividad = this.obtenerConfiguracionActividad(datos.actividad);
        
        const grupo = {
            id: grupoId,
            actividad: datos.actividad,
            fecha: datos.fecha,
            hora: datos.hora,
            descripcion: datos.descripcion,
            lider: datos.lider,
            canalId: datos.canalId,
            configActividad: configActividad,
            miembros: {
                tanque: [],
                sanador: [],
                dps_melee: [],
                dps_rango: [],
                soporte: [],
                shotcaller: [],
                flex: [],
                reserva: []
            },
            estado: 'formando',
            fechaCreacion: new Date(),
            mensajeId: null
        };

        this.grupos.set(grupoId, grupo);
        return grupoId;
    }

    async obtenerGrupo(grupoId) {
        return this.grupos.get(grupoId);
    }

    async editarGrupo(grupoId, campo, valor, usuarioId) {
        const grupo = this.grupos.get(grupoId);
        if (!grupo || grupo.lider !== usuarioId) return false;

        grupo[campo] = valor;
        this.grupos.set(grupoId, grupo);
        return true;
    }

    async eliminarGrupo(grupoId, usuarioId) {
        const grupo = this.grupos.get(grupoId);
        if (!grupo || grupo.lider !== usuarioId) return false;

        this.grupos.delete(grupoId);
        return true;
    }

    async unirseAlGrupo(grupoId, usuarioId, rol) {
        const grupo = this.grupos.get(grupoId);
        if (!grupo) return { exito: false, razon: 'GRUPO_NO_ENCONTRADO' };

        const config = grupo.configActividad;
        const miembrosRol = grupo.miembros[rol];
        
        if (!miembrosRol) return { exito: false, razon: 'ROL_INVALIDO' };
        if (miembrosRol.length >= config.limites[rol]) {
            return { exito: false, razon: 'ROL_LLENO' };
        }

        this.removerUsuarioDeTodosLosRoles(grupoId, usuarioId);
        
        miembrosRol.push(usuarioId);
        return { exito: true };
    }

    async salirDelGrupo(grupoId, usuarioId) {
        const grupo = this.grupos.get(grupoId);
        if (!grupo) return false;

        return this.removerUsuarioDeTodosLosRoles(grupoId, usuarioId);
    }

    removerUsuarioDeTodosLosRoles(grupoId, usuarioId) {
        const grupo = this.grupos.get(grupoId);
        if (!grupo) return false;

        let removido = false;
        Object.keys(grupo.miembros).forEach(rol => {
            const index = grupo.miembros[rol].indexOf(usuarioId);
            if (index > -1) {
                grupo.miembros[rol].splice(index, 1);
                removido = true;
            }
        });

        return removido;
    }

    crearEmbedGrupo(grupoId) {
        const grupo = this.grupos.get(grupoId);
        if (!grupo) return null;

        const config = grupo.configActividad;
        const embed = new EmbedBuilder()
            .setTitle(`🎯 ${config.nombre} - WorldOfAlbionBot`)
            .setColor(config.color)
            .setDescription(grupo.descripcion)
            .addFields(
                { name: '📅 Fecha', value: grupo.fecha, inline: true },
                { name: '⏰ Hora', value: grupo.hora, inline: true },
                { name: '👤 Líder', value: `<@${grupo.lider}>`, inline: true },
                { name: '📊 Estado', value: this.obtenerEstadoTexto(grupo.estado), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `WorldOfAlbionBot - ID: ${grupo.id}`, iconURL: 'https://albiononline.com/favicon.ico' });

        Object.keys(grupo.miembros).forEach(rol => {
            if (config.limites[rol] > 0) {
                const miembros = grupo.miembros[rol].length > 0 
                    ? grupo.miembros[rol].map(id => `<@${id}>`).join('\n')
                    : '*Vacío*';
                const limite = config.limites[rol];
                embed.addFields({ 
                    name: `${this.obtenerEmojiRol(rol)} ${this.formatearNombreRol(rol)} (${grupo.miembros[rol].length}/${limite})`, 
                    value: miembros, 
                    inline: true 
                });
            }
        });

        return embed;
    }

    crearBotonesInscripcion(grupoId) {
        const botonesFila1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`unirse_tanque_${grupoId}`)
                .setLabel('🛡️ Tanque')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`unirse_sanador_${grupoId}`)
                .setLabel('💚 Sanador')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`unirse_dps_melee_${grupoId}`)
                .setLabel('⚔️ DPS Melee')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`unirse_dps_rango_${grupoId}`)
                .setLabel('🏹 DPS Rango')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`unirse_soporte_${grupoId}`)
                .setLabel('🔮 Soporte')
                .setStyle(ButtonStyle.Secondary)
        );

        const botonesFila2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`unirse_shotcaller_${grupoId}`)
                .setLabel('🎯 Shotcaller')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`unirse_flex_${grupoId}`)
                .setLabel('🔄 Flex')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`unirse_reserva_${grupoId}`)
                .setLabel('⏰ Reserva')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`salir_grupo_${grupoId}`)
                .setLabel('❌ Salir')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`info_grupo_${grupoId}`)
                .setLabel('ℹ️ Info')
                .setStyle(ButtonStyle.Secondary)
        );

        return [botonesFila1, botonesFila2];
    }

    obtenerEmojiRol(rol) {
        const emojis = {
            tanque: '🛡️',
            sanador: '💚',
            dps_melee: '⚔️',
            dps_rango: '🏹',
            soporte: '🔮',
            shotcaller: '🎯',
            flex: '🔄',
            reserva: '⏰'
        };
        return emojis[rol] || '👤';
    }

    formatearNombreRol(rol) {
        const nombres = {
            tanque: 'Tanque',
            sanador: 'Sanador',
            dps_melee: 'DPS Melee',
            dps_rango: 'DPS Rango',
            soporte: 'Soporte',
            shotcaller: 'Shotcaller',
            flex: 'Flex',
            reserva: 'Reserva'
        };
        return nombres[rol] || rol;
    }

    obtenerEstadoTexto(estado) {
        const estados = {
            'formando': '🟡 Formándose',
            'completo': '🟢 Completo',
            'activo': '🔵 Activo',
            'finalizado': '⚫ Finalizado'
        };
        return estados[estado] || estado;
    }

    async configurarLimiteRol(actividad, rol, limite) {
        if (this.configActividades[actividad]) {
            this.configActividades[actividad].limites[rol] = limite;
            return true;
        }
        return false;
    }
}

module.exports = new SistemaGrupos();