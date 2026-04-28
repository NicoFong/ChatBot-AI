export let mensajes = {};
export let personas = {
  ia: { nombre: "Chatbot IA", foto: "usuarios/fotos/chatBot.png" }
};

export function jsonPersonas(x) {
  if (!mensajes[x]) mensajes[x] = [];
  if (!personas[x]) personas[x] = { nombre: x, foto: null };
}

export function tiempo() {
  const ahora = new Date();
  return `${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`;
}

export function obtenerClave(x, usuarioActual) {
  return "chat_" + [x, usuarioActual].sort().join("_");
}

// x            = con quién chateás (ej: "ia", "Pepito")
// texto        = el mensaje
// autor        = quién lo escribió ("Nicolas" o "ia" o "Pepito")
// usuarioActual = el usuario logueado (usser)
export function guardarMensaje(x, texto, autor, usuarioActual) {
  let clave = obtenerClave(x, usuarioActual);
  if (!mensajes[clave]) mensajes[clave] = [];

  mensajes[clave].push({
    autor,
    hora: tiempo(),
    mensaje: texto,
  });

  localStorage.setItem(clave, JSON.stringify(mensajes[clave]));
}