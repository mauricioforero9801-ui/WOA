const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

async function cargarComandos(cliente) {
    cliente.comandos = new Collection();

    const comandosPath = path.join(__dirname, '..', 'comandos');
    if (!fs.existsSync(comandosPath)) return;

    const carpetas = fs.readdirSync(comandosPath);

    for (const carpeta of carpetas) {
        const carpetaRuta = path.join(comandosPath, carpeta);
        if (!fs.lstatSync(carpetaRuta).isDirectory()) continue;

        const archivos = fs.readdirSync(carpetaRuta).filter(a => a.endsWith('.js'));

        for (const archivo of archivos) {
            const comando = require(path.join(carpetaRuta, archivo));

            if (comando && comando.data && comando.execute) {
                cliente.comandos.set(comando.data.name, comando);
                console.log(`✔ Comando cargado: ${comando.data.name}`);
            }
        }
    }
}

async function cargarEventos(cliente) {
    const eventosPath = path.join(__dirname, '..', 'eventos');
    if (!fs.existsSync(eventosPath)) return;

    const archivos = fs.readdirSync(eventosPath).filter(a => a.endsWith('.js'));

    for (const archivo of archivos) {
        const evento = require(path.join(eventosPath, archivo));

        if (!evento || !evento.name || !evento.execute) continue;

        if (evento.once) {
            cliente.once(evento.name, (...args) => evento.execute(...args, cliente));
        } else {
            cliente.on(evento.name, (...args) => evento.execute(...args, cliente));
        }
    }
}

module.exports = { cargarComandos, cargarEventos };
