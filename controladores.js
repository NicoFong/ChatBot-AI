import { mensajes, personas, jsonPersonas, obtenerClave, guardarMensaje } from "./Assets/models.js";
import {
    chatInput, btnchat, chatMensajes, usser, chatLista,
    imgPresentacion, personPresentacion, cambiarPresentacion,
    renderMensajes, btnMenu, sideBar, imgChatSide, menuMobile,
    btnSideIA, butonIA, btnChatInput, inputIA
} from "./Assets/vista.js";

export let person = personas;
export let mensajeX = mensajes;

let chatActivo = null;

const API_URL = "https://chatbot-ai-dm33.onrender.com/api/chat";
function SelectChat(e) {
    let li = e.target.closest("li");
    if (!li || !chatLista.contains(li)) return;
    return li.textContent.trim();
}

async function procesarMensaje(ud) {
    let texto = chatInput.value.trim();
    let clave = obtenerClave(ud, usser);  // clave del chat (ej: chat_Nicolas_ia)

    if (texto === "") {
        chatInput.classList.add("border", "border-red-500");
        return;
    }

    chatInput.classList.remove("border", "border-red-500");
    // Guardo mi mensaje: x=ud (con quién), autor=usser (yo escribí), usuarioActual=usser
    guardarMensaje(ud, texto, usser, usser);
    chatInput.value = "";
    renderMensajes(clave, mensajes, usser);

    if (ud === "ia") {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mensaje: texto })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Error en la respuesta del servidor");
            }

            const data = await response.json();
            // Guardo respuesta IA: x="ia" (chat con ia), autor="ia" (ia escribió), usuarioActual=usser
            guardarMensaje("ia", data.respuesta, "ia", usser);
            renderMensajes(clave, mensajes, usser);
        } catch (error) {
            console.error("Error al hablar con el servidor:", error);
            guardarMensaje("ia", "Lo siento, tuve un problema al conectar con mi cerebro.", "ia", usser);
            renderMensajes(clave, mensajes, usser);
        }
    }
}

function buscarfoto(nombre) {
    let liElements = document.querySelectorAll(".nameLista");
    for (let i = 0; i < liElements.length; i++) {
        let li = liElements[i];
        if (li.textContent.trim().includes(nombre)) {
            let img = li.querySelector(".imgLista");
            if (img) return img.src;
        }
    }
    return null;
}

chatLista.addEventListener("click", (e) => {
    let chater = SelectChat(e);
    chatActivo = chater;
    let clave = obtenerClave(chater, usser);

    jsonPersonas(chater);

    let foto = buscarfoto(chater);
    if (foto) personas[chater].foto = foto;

    if (!mensajes[clave]) {
        let guardado = localStorage.getItem(clave);
        if (guardado) mensajes[clave] = JSON.parse(guardado);
    }

    cambiarPresentacion(chater, personas);
    chatMensajes.innerHTML = "";
    renderMensajes(clave, mensajes, usser);
    chatInput.focus();
});

btnchat.addEventListener("click", () => {
    if (chatActivo) procesarMensaje(chatActivo);
});

chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && chatActivo) {
        procesarMensaje(chatActivo);
    }
});

document.addEventListener("click", menuMobile);

function renderIA() {
    let clave = obtenerClave("ia", usser);

    if (!mensajes[clave]) {
        let guardado = localStorage.getItem(clave);
        mensajes[clave] = guardado ? JSON.parse(guardado) : [];
    }

    cambiarPresentacion("ia", personas);
    chatMensajes.innerHTML = "";
    renderMensajes(clave, mensajes, usser);
    chatActivo = "ia";
    chatInput.focus();
}

btnSideIA.addEventListener("click", renderIA);
butonIA.addEventListener("click", renderIA);

inputIA.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let texto = inputIA.value.trim();
        if (!texto) return;
        chatActivo = "ia";
        chatInput.value = texto;
        inputIA.value = "";
        procesarMensaje("ia");
        renderIA();
    }
});