import express from "express";
import dotenv from "dotenv";
import { leerPDF, responderDuda } from "./chatbot.js";

dotenv.config();
const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();
    next();
});

app.use(express.json());

// ── Carga del PDF al iniciar ──────────────────────────────────────────────────
let contenidoManual = [];

leerPDF("./manual.pdf")
    .then(data => {
        contenidoManual = data;
        console.log("Manual cargado y listo. (" + data.length + " fragmentos)");
    })
    .catch(err => {
        console.error("Error al cargar el PDF:", err.message);
    });

// ── Ruta del chatbot ──────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
    console.log("=== Mensaje recibido:", req.body);
    const { mensaje } = req.body;

    if (!mensaje || mensaje.trim() === "") {
        return res.status(400).json({ error: "Mensaje vacío" });
    }

    try {
        const respuesta = await responderDuda(mensaje, contenidoManual);
        console.log("=== Respuesta:", respuesta);
        res.json({ respuesta });
    } catch (error) {
        console.error("=== ERROR COMPLETO ===");
        console.error(error);
        res.status(500).json({ error: "Error al procesar la pregunta" });
    }
});
// ── Servidor ──────────────────────────────────────────────────────────────────
app.listen(3000, "127.0.0.1", () => {
    console.log("Servidor corriendo en http://127.0.0.1:3000");
});