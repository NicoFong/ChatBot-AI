export const chatInput = document.getElementById("chatInput");
export const btnchat = document.getElementById("btnChatInput");
export const chatMensajes = document.getElementById("chatMensajes");
export const usser = document.getElementById("usser").textContent || "Usuario";

/* constantes de cambio de chat */
export const chatLista = document.querySelector("#chatLista");
export const imgPresentacion = document.getElementById("imgPresentacion");
export const personPresentacion = document.getElementById("personPresentacion");

/* menu mobile */
export const btnMenu = document.getElementById("btnMenu");
export const sideBar = document.getElementById("sideBar");
export const imgChatSide = document.querySelector(".imgLista");

/* boton robot */
export const btnChatInput = document.getElementById("btnChatInput");
export const btnSideIA = document.getElementById("btnSideIA");
export const butonIA = document.getElementById("butonIA");
export const inputIA = document.getElementById("inputIA");

export function cambiarPresentacion(x, person) {
    if (!person[x]) return;
    imgPresentacion.src = person[x].foto ?? "usuarios/fotos/grupo.webp";
    personPresentacion.textContent = person[x].nombre;
}

// usuarioActual = usser (para saber qué mensajes van a la derecha)
export function renderMensajes(clave, mensajeX, usuarioActual) {
    let data = localStorage.getItem(clave);
    if (!data) return;

    let mensajes = mensajeX[clave];
    if (!mensajes) return;

    chatMensajes.innerHTML = "";
    mensajes.forEach((i) => {
        let chatMensaje = document.createElement('div');
        let pDelChat = document.createElement('p');
        let hora = document.createElement('span');

        chatMensajes.appendChild(chatMensaje);

        // Si el autor soy yo → derecha azul, si no → izquierda gris
        if (i.autor === usuarioActual) {
            chatMensaje.classList.add("flex", "items-end", "flex-col");
            pDelChat.classList.add("bg-blue-500", "text-white");
        } else {
            chatMensaje.classList.add("flex", "items-start", "flex-col");
            pDelChat.classList.add("bg-gray-200");
        }

        pDelChat.classList.add("p-2", "rounded-lg", "text-sm", "max-w-xs");
        chatMensaje.appendChild(pDelChat);
        chatMensaje.appendChild(hora);
        hora.classList.add("text-black-400", "text-[11px]", "ml-2");
        pDelChat.textContent = i.mensaje;
        hora.textContent = i.hora;
        chatMensajes.scrollTop = chatMensajes.scrollHeight;
    });
}

export function menuMobile(e) {
    if (btnMenu.contains(e.target)) {
        sideBar.classList.toggle("hidden");
    } else {
        sideBar.classList.add("hidden");
    }
}