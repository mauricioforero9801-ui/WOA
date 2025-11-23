require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const config = require("./config.js");

const comandos = [];
const comandosPath = path.join(__dirname, "src", "comandos");

function cargarComandos(dir) {
    const carpetas = fs.readdirSync(dir);

    for (const carpeta of carpetas) {
        const carpetaRuta = path.join(dir, carpeta);
        if (!fs.lstatSync(carpetaRuta).isDirectory()) continue;

        const archivos = fs.readdirSync(carpetaRuta).filter(a => a.endsWith(".js"));

        for (const archivo of archivos) {
            const comando = require(path.join(carpetaRuta, archivo));

            if (comando && comando.data) {
                comandos.push(comando.data.toJSON());
                console.log(`✔ Comando detectado: ${comando.data.name}`);
            }
        }
    }
}

cargarComandos(comandosPath);

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {
        console.log(`🚀 Registrando ${comandos.length} comandos en el servidor ${config.servidorId}...`);

        await rest.put(
            Routes.applicationGuildCommands(config.clienteId, config.servidorId),
            { body: comandos }
        );

        console.log("✅ Comandos registrados correctamente.");
    } catch (error) {
        console.error("❌ Error registrando comandos:", error);
    }
})();
