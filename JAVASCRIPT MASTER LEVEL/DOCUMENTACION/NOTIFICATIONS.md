# GUÍA COMPLETA — Notifications API en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de Notificaciones (*Notifications API*) en JavaScript para solicitar permisos de forma segura al usuario, verificar el estado de autorización y emitir alertas visuales a nivel de sistema operativo incluso cuando el usuario no está mirando la pestaña activa.

---

# 📚 Temario

1. ¿Qué es la Notifications API?
2. Verificación de estado: `Notification.permission`
3. Solicitud de autorización: `Notification.requestPermission()`
4. Creación y envío: `new Notification(title, options)`
5. Eventos de la instancia de notificación
6. Analogías del mundo real
7. Diagrama de flujo del ciclo de notificaciones
8. Buenas prácticas y errores comunes
9. Proyecto Integrador: Sistema de Alertas con Permisos Inteligentes
10. Resumen técnico

---

# ¿Qué es la Notifications API?

La **Notifications API** permite que una página o aplicación web envíe notificaciones nativas que se muestran fuera de la ventana del navegador, directamente en el centro de notificaciones del sistema operativo (Windows, macOS, Linux, Android).

A diferencia de un `alert()` tradicional o un *toast* interno en HTML, estas alertas son visibles aunque el usuario haya minimizado el navegador o esté trabajando en otra aplicación, lo que las hace ideales para chats, recordatorios, correos entrantes o alertas críticas.

> **Requisito de seguridad:** Por políticas estrictas de privacidad, esta API funciona únicamente en **contextos seguros (HTTPS)** o en entornos locales de desarrollo (`localhost`).

---

# Verificación de estado: `Notification.permission`

Antes de intentar mostrar cualquier alerta, es obligatorio consultar la propiedad estática **`Notification.permission`**, la cual devuelve una cadena de texto (*string*) con el estado actual de autorización del usuario para ese dominio:

* **`"default"`:** El usuario aún no ha tomado una decisión (ni aceptó ni rechazó). El navegador se comporta como si el permiso estuviera denegado hasta que se solicite explícitamente.
* **`"granted"`:** El usuario concedió permiso explícito para mostrar notificaciones.
* **`"denied"`:** El usuario bloqueó las notificaciones. Mientras siga en este estado, la web no puede volver a mostrar el cuadro de solicitud ni emitir alertas.

```javascript
// Comprobación básica de soporte y permiso actual
if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones de escritorio.");
} else {
    console.log("Estado actual del permiso:", Notification.permission);
}
```

---

# Solicitud de autorización: `Notification.requestPermission()`

El método estático **`Notification.requestPermission()`** despliega el cuadro de diálogo nativo del navegador preguntando al usuario si desea permitir notificaciones del sitio.

Este método es asíncrono y devuelve una **Promesa (*Promise*)** que se resuelve con la decisión final del usuario (`"granted"`, `"denied"` o `"default"`).

```javascript
// Uso moderno con async / await
const pedirPermiso = async () => {
    const resultado = await Notification.requestPermission();
    
    if (resultado === "granted") {
        console.log("¡Permiso concedido por el usuario!");
    } else {
        console.log("El usuario rechazó o cerró la solicitud.");
    }
};
```

> **Regla de oro de los navegadores:** Este método **debe ejecutarse dentro de un evento iniciado por el usuario** (como el `click` de un botón). Si intentas llamarlo automáticamente al cargar la página (`DOMContentLoaded`), los navegadores modernos bloquearán la solicitud de inmediato.

---

# Creación y envío: `new Notification(msg, options)`

Una vez que `Notification.permission === "granted"`, puedes crear y disparar la notificación instanciando el constructor **`new Notification(titulo, options)`**.

*(Nota: Aunque conceptualmente representa el mensaje principal, el primer argumento es el **título** de la alerta, y el segundo es un objeto opcional de configuración).*

### Propiedades principales del objeto `options`
* **`body`:** Texto descriptivo adicional que aparece debajo del título principal.
* **`icon`:** URL de la imagen o logotipo que acompaña la notificación.
* **`image`:** URL de una imagen grande destacada dentro del cuerpo de la alerta (soportado en varios navegadores).
* **`tag`:** Identificador único. Si envías dos notificaciones con el mismo `tag`, la nueva reemplaza a la anterior en lugar de apilar varias alertas iguales.
* **`silent`:** Booleano (`true` / `false`). Si es `true`, silencia el sonido o vibración predeterminada del sistema.
* **`requireInteraction`:** Booleano. Si es `true`, la notificación permanece fija en pantalla hasta que el usuario haga clic o la cierre manualmente.

```javascript
const enviarAlerta = () => {
    if (Notification.permission === "granted") {
        const opciones = {
            body: "Tu reporte mensual ya está listo para descargar.",
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827347.png",
            tag: "reporte-mensual"
        };

        const notificacion = new Notification("¡Proceso Completado!", opciones);
    }
};
```

---

# Eventos de la instancia de notificación

Cada objeto creado con `new Notification()` permite escuchar interacciones directas del usuario sobre la tarjeta de alerta:

* **`click`:** Se dispara cuando el usuario hace clic sobre la notificación (muy útil para enfocar la pestaña con `window.focus()` o redirigir a una ruta).
* **`close`:** Se ejecuta cuando el usuario cierra la notificación o el sistema la oculta tras expirar su tiempo.
* **`error`:** Se activa si ocurre algún fallo al intentar mostrar la alerta.
* **`show`:** Se dispara en el instante en que la notificación aparece en pantalla.

```javascript
const noti = new Notification("Nuevo mensaje", { body: "Haz clic para leerlo" });

noti.addEventListener("click", () => {
    window.focus(); // Trae la ventana del navegador al frente
    noti.close();   // Cierra la notificación
});
```

---

# Analogías del mundo real

### 1. El Portero de un Edificio Residencial (`requestPermission`) 🏢
* Antes de que un repartidor pueda subir a dejarte un paquete en tu puerta (`new Notification`), el portero llama por el citófono para pedirte autorización (`Notification.requestPermission()`).
* Si le dices que sí (`"granted"`), los siguientes paquetes suben directo. Si le dices que no vuelva a molestar (`"denied"`), el portero rechazará cualquier entrega futura sin volver a llamarte.

### 2. El Tablero de Avisos con Etiquetas (`tag`) 📌
* Usar la propiedad `tag` es como tener un espacio reservado en la pizarra con el título *"Estado de descarga"*: en lugar de pegar 10 notas adhesivas distintas por cada avance, reemplazas la misma nota actualizando su contenido para no saturar el tablero.

---

# Diagrama de flujo del ciclo de notificaciones

```
   [ Verificar soporte: "Notification" in window ]
                         │
                         ▼
          ¿Qué valor tiene Notification.permission?
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   [ "denied" ]     [ "default" ]    [ "granted" ]
        │                │                │
        ▼                ▼                │
  ( Fin: Bloqueado ) ( Esperar clic )     │
                         │                │
                         ▼                │
              ( requestPermission() )     │
                         │                │
                 ┌───────┴───────┐        │
                 ▼               ▼        │
            [ Rechaza ]     [ Acepta ] ───┘
                 │                        │
                 ▼                        ▼
           ( Fin: No mostrar )  ( new Notification(msg, options) )
                                          │
                                          ▼
                                [ Alerta visible en el SO ]
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Pide permiso en contexto:** Explica primero mediante un botón o interruptor dentro de tu interfaz por qué son útiles las alertas (ej. *"Activar avisos de nuevos mensajes"*) antes de invocar `requestPermission()`.
* **Combínala con `visibilitychange`:** Si el usuario ya tiene la pestaña activa y mirando la pantalla (`document.visibilityState === "visible"`), suele ser mejor mostrar un aviso sutil dentro de la web en lugar de lanzar una notificación externa del sistema operativo.
* **Usa `window.focus()` en el evento `click`:** Ayuda al usuario a regresar inmediatamente a la pestaña de tu aplicación al pulsar la alerta.

### ❌ Errores Comunes
* **Pedir permisos apenas carga la página:** Además de ofrecer una mala experiencia de usuario, navegadores como Firefox y Safari bloquean automáticamente cualquier llamada a `requestPermission()` que no provenga de un gesto explícito del usuario (clic o toque).
* **Spamear notificaciones sin `tag`:** Enviar múltiples alertas seguidas sin agruparlas mediante `tag` provoca que el usuario revoque los permisos desde la configuración del navegador.

---

# Proyecto Integrador: Sistema de Alertas Inteligente

A continuación se presenta una implementación completa que gestiona el botón de permisos, valida el estado actual y emite una notificación interactiva:

```html
<!-- Estructura HTML -->
<div class="panel-notificaciones">
    <button id="btn-activar">Activar Notificaciones</button>
    <button id="btn-enviar" disabled>Enviar Alerta de Prueba</button>
    <p id="estado-permiso">Estado actual: verificando...</p>
</div>
```

```javascript
// Lógica de JavaScript Moderno
const btnActivar = document.getElementById("btn-activar");
const btnEnviar = document.getElementById("btn-enviar");
const textoEstado = document.getElementById("estado-permiso");

// Función para actualizar la interfaz según el permiso actual
const actualizarInterfaz = () => {
    if (!("Notification" in window)) {
        textoEstado.innerText = "Tu navegador no soporta Notifications API.";
        btnActivar.disabled = true;
        return;
    }

    const permiso = Notification.permission;
    textoEstado.innerText = `Estado actual del permiso: ${permiso}`;

    if (permiso === "granted") {
        btnActivar.disabled = true;
        btnEnviar.disabled = false;
    } else if (permiso === "denied") {
        btnActivar.disabled = true;
        textoEstado.innerText += " (Debes habilitarlo manualmente en el candado de la URL)";
    }
};

// 1. Solicitar permiso tras interacción del usuario
btnActivar.addEventListener("click", async () => {
    const decision = await Notification.requestPermission();
    actualizarInterfaz();

    if (decision === "granted") {
        mostrarNotificacion("¡Listo!", "Las notificaciones han sido activadas correctamente.");
    }
});

// 2. Función reutilizable para instanciar notificaciones
const mostrarNotificacion = (titulo, mensaje) => {
    if (Notification.permission !== "granted") return;

    const alerta = new Notification(titulo, {
        body: mensaje,
        icon: "https://cdn-icons-png.flaticon.com/512/3602/3602145.png",
        tag: "alerta-sistema"
    });

    alerta.addEventListener("click", () => {
        window.focus();
        alerta.close();
    });
};

// 3. Disparar notificación de prueba
btnEnviar.addEventListener("click", () => {
    mostrarNotificacion(
        "Nueva Tarea Asignada",
        "Tienes una revisión de código pendiente en el proyecto principal."
    );
});

// Inicializar estado al cargar
actualizarInterfaz();
```

---

# Resumen técnico

* **`Notification.permission`** permite consultar en cualquier momento si el usuario tiene el estado `"default"`, `"granted"` o `"denied"`.
* **`Notification.requestPermission()`** retorna una promesa con la respuesta del usuario y debe ejecutarse siempre tras una interacción explícita (como un clic).
* **`new Notification(titulo, options)`** crea y muestra la notificación nativa en el sistema operativo utilizando configuraciones como `body`, `icon`, `tag` y `silent`.
* **Las instancias de notificación** soportan eventos como `click` y `close` para enfocar la ventana del navegador o ejecutar acciones al interactuar con la alerta.
