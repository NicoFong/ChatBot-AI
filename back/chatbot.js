import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.API_TOKEN);
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ── Leer PDF ──────────────────────────────────────────────────────────────────
export async function leerPDF(ruta) {
    const dataBuffer = fs.readFileSync(ruta);

    // Ruta de fuentes estándar (solo para suprimir warnings, no es crítico)
    const fontPath = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'standard_fonts') + path.sep;
    const standardFontDataUrl = "file:///" + fontPath.replace(/\\/g, "/");

    const pdfDoc = await pdfjsLib.getDocument({
        data: new Uint8Array(dataBuffer),
        standardFontDataUrl,
        // Evita que los warnings de fuentes corten la ejecución
        verbosity: 0
    }).promise;

    let textoCompleto = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const textoPage = content.items.map(item => item.str).join(" ");
        textoCompleto += textoPage + "\n\n";
    }

    // Devuelve párrafos con al menos 30 caracteres
    return textoCompleto.split('\n\n').filter(p => p.trim().length > 30);
}

// ── Búsqueda por relevancia de palabras clave (sin embeddings) ────────────────
function buscarFragmentosRelevantes(pregunta, fragmentos, topN = 5) {
    const palabras = pregunta.toLowerCase().split(/\s+/).filter(p => p.length > 3);

    const puntuados = fragmentos.map(parrafo => {
        const texto = parrafo.toLowerCase();
        let puntos = 0;
        for (const palabra of palabras) {
            // Coincidencia exacta vale más
            const exactas = (texto.match(new RegExp(`\\b${palabra}\\b`, 'g')) || []).length;
            const parciales = (texto.match(new RegExp(palabra, 'g')) || []).length;
            puntos += exactas * 2 + parciales;
        }
        return { parrafo, puntos };
    });

    puntuados.sort((a, b) => b.puntos - a.puntos);
    return puntuados.slice(0, topN).map(p => p.parrafo);
}

// ── Responder con Gemini ──────────────────────────────────────────────────────
export async function responderDuda(preguntaUsuario, fragmentosPDF) {
    if (!preguntaUsuario || preguntaUsuario.trim() === "") {
        return "Por favor escribe una pregunta.";
    }

    if (!fragmentosPDF || fragmentosPDF.length === 0) {
        return "Lo siento, el manual aún no está disponible. Intenta en un momento.";
    }

    const topFragmentos = buscarFragmentosRelevantes(preguntaUsuario, fragmentosPDF);
    const contexto = topFragmentos.join("\n\n");

    const promptFinal = `Eres el asistente del chat Bot trabajo final de nicolas.
Responde de forma amable, clara y breve usando SOLO el siguiente fragmento del manual.
Si la respuesta no está en el fragmento, dilo amablemente y sugiere contactar al equipo.

Fragmento del manual:
"""
${contexto}
"""

Pregunta del cliente: "${preguntaUsuario}"`;

    const result = await chatModel.generateContent(promptFinal);
    return result.response.text();
}