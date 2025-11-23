const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "..", "data");

// Crear carpeta si no existe
if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
}

// Asegura archivo JSON
function asegurarArchivo(nombre, estructura = {}) {
    const archivo = path.join(DATA_PATH, nombre);

    if (!fs.existsSync(archivo)) {
        fs.writeFileSync(archivo, JSON.stringify(estructura, null, 4));
    }

    return archivo;
}

// Cargar archivo JSON
function cargarJSON(nombre) {
    const archivo = asegurarArchivo(nombre);
    try {
        return JSON.parse(fs.readFileSync(archivo, "utf8"));
    } catch (e) {
        console.error("Error al leer JSON:", nombre, e);
        return {};
    }
}

// Guardar archivo JSON
function guardarJSON(nombre, data) {
    try {
        const archivo = asegurarArchivo(nombre);
        fs.writeFileSync(archivo, JSON.stringify(data, null, 4));
        return true;
    } catch (e) {
        console.error("Error al guardar JSON:", nombre, e);
        return false;
    }
}

// Generar ID corto
function generarID() {
    return Math.random().toString(36).substring(2, 10);
}

// =========================
// FUNCIONES DEL SISTEMA
// =========================

// Crear panel
function crearPanel(actividad, limite, autorID) {
    const db = cargarJSON("postulaciones.json");

    const id = generarID();

    db[id] = {
        id,
        actividad,
        limite,
        autorID,
        estado: "abierto",
        inscritos: [],
        roles: {},
        fecha: Date.now()
    };

    guardarJSON("postulaciones.json", db);
    return db[id];
}

// Inscribir usuario
function inscribirUsuario(idPanel, userID, rol) {
    const db = cargarJSON("postulaciones.json");
    if (!db[idPanel]) return null;
    if (db[idPanel].estado !== "abierto") return null;

    if (!db[idPanel].roles[rol]) db[idPanel].roles[rol] = [];

    if (!db[idPanel].roles[rol].includes(userID)) {
        db[idPanel].roles[rol].push(userID);
    }

    if (!db[idPanel].inscritos.includes(userID)) {
        db[idPanel].inscritos.push(userID);
    }

    guardarJSON("postulaciones.json", db);
    return db[idPanel];
}

// Cerrar panel
function cerrarPanel(idPanel) {
    const db = cargarJSON("postulaciones.json");
    if (!db[idPanel]) return null;

    db[idPanel].estado = "cerrado";
    guardarJSON("postulaciones.json", db);
    return db[idPanel];
}

// Obtener panel
function obtenerPanel(id) {
    const db = cargarJSON("postulaciones.json");
    return db[id] || null;
}

module.exports = {
    cargarJSON,
    guardarJSON,
    generarID,
    crearPanel,
    inscribirUsuario,
    cerrarPanel,
    obtenerPanel
};
