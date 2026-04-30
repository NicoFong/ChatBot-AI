Chatbot AI (Frontend)

Demo

Accede a la aplicación:
https://chatbot-ai-1-1j58.onrender.com/

Descripción

Este proyecto corresponde al frontend de una aplicación de chatbot. Actualmente, la lógica de backend no está implementada; se desarrollará como parte de un proyecto futuro.

La aplicación permite simular un entorno de chat dinámico, donde la interfaz se adapta según el perfil seleccionado.

Funcionalidades

* Cambio de conversación según el perfil seleccionado.
* Actualización dinámica de la imagen del contacto activo.
* Persistencia de mensajes utilizando `localStorage`.
* Diseño responsive:

  * El chat se mantiene como vista principal.
  * El menú lateral y la barra derecha se ocultan en pantallas pequeñas.
* Menú interactivo:

  * Se abre con un clic.
  * Se cierra al seleccionar un chat o al hacer clic fuera del menú.

Objetivo del Chatbot

La funcionalidad principal es un chatbot alimentado con archivos locales. Está diseñado para que colaboradores puedan:

* Consultar procedimientos internos.
* Acceder a información de inventarios.
* Basarse en manuales propios de la empresa.

Esto permite:

* Reducir tiempos en los procesos.
* Disminuir errores operativos.

Tecnologías

-Frontend

* HTML
* Tailwind CSS
* JavaScript

-Backend

* Node.js
* Express

-Dependencias principales

* @google/generative-ai → Integración con el modelo de IA
* cors → Manejo de solicitudes entre dominios
* dotenv → Gestión de variables de entorno
* pdfjs-dist → Lectura y procesamiento de archivos PDF

Próximos pasos

* Desarrollo del backend.
* Integración con base de datos.
* Implementación de procesamiento de lenguaje natural (NLP).
* Mejora en la gestión de archivos y fuentes de datos.

Estado del proyecto

🟡 En desarrollo (Frontend funcional, Backend pendiente)

---
