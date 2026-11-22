/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: HTML5 CANVAS 2D API
 * ARCHIVO: main.js
 * LABORATORIO INTERACTIVO DE DIBUJO EN CANVAS Y QUIZ DEL MÓDULO
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
(function () { // Encapsula la lógica para evitar variables globales
    'use strict'; // Activa el modo estricto de JavaScript

    // Obtiene referencias del lienzo y su contexto de renderizado 2D
    const canvas = document.getElementById('canvasLab'); // Referencia al elemento <canvas>
    if (!canvas) return; // Sale de forma segura si el lienzo no existe
    const ctx = canvas.getContext('2d'); // Solicita el contexto gráfico 2D

    // Referencias de controles del laboratorio
    const colorInput = document.getElementById('cvColor'); // Selector de color
    const widthInput = document.getElementById('cvWidth'); // Control deslizante de grosor
    const widthVal = document.getElementById('cvWidthVal'); // Etiqueta de píxeles actuales
    const coordsLabel = document.getElementById('cvCoords'); // Indicador de coordenadas (x, y)

    // Estado interno del pincel libre
    let dibujando = false; // Indica si el usuario mantiene presionado el ratón

    // Función auxiliar para registrar eventos en consola DevTools y consola visual si existe
    function registrar(msg) { // Declara función auxiliar
        console.log('[Canvas 2D Lab]', msg); // Imprime en consola del navegador
        const logBox = document.getElementById('jrConsoleLog'); // Busca panel de consola unificado
        if (logBox) { // Si el panel ya fue inyectado
            const line = document.createElement('div'); // Crea línea de registro
            line.className = 'jr-log-line ok'; // Aplica clase visual
            line.textContent = `[${new Date().toLocaleTimeString()}] 🎨 ${msg}`; // Asigna texto con hora
            logBox.appendChild(line); // Añade la línea al panel
            logBox.scrollTop = logBox.scrollHeight; // Desplaza el scroll al final
        }
    }

    // Dibuja una rejilla guía de fondo de 40x40 px
    function dibujarRejilla() { // Declara función para rejilla
        ctx.save(); // Guarda el estado actual del contexto
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)'; // Color sutil para las líneas guía
        ctx.lineWidth = 1; // Grosor fino de 1 píxel
        for (let x = 40; x < canvas.width; x += 40) { // Recorre columnas cada 40px
            ctx.beginPath(); // Inicia nueva línea vertical
            ctx.moveTo(x, 0); // Ubica lápiz en borde superior
            ctx.lineTo(x, canvas.height); // Traza hasta borde inferior
            ctx.stroke(); // Dibuja la línea
        }
        for (let y = 40; y < canvas.height; y += 40) { // Recorre filas cada 40px
            ctx.beginPath(); // Inicia nueva línea horizontal
            ctx.moveTo(0, y); // Ubica lápiz en borde izquierdo
            ctx.lineTo(canvas.width, y); // Traza hasta borde derecho
            ctx.stroke(); // Dibuja la línea
        }
        ctx.restore(); // Restaura estilos anteriores del contexto
        registrar('Rejilla de coordenadas (40x40 px) dibujada'); // Registra acción
    }

    // Dibuja un rectángulo en posición aleatoria dentro del lienzo
    document.getElementById('btnDrawRect')?.addEventListener('click', () => { // Evento clic en rectángulo
        const x = Math.floor(Math.random() * (canvas.width - 140)) + 20; // Coordenada X segura
        const y = Math.floor(Math.random() * (canvas.height - 100)) + 20; // Coordenada Y segura
        ctx.fillStyle = colorInput.value; // Usa el color elegido
        ctx.fillRect(x, y, 110, 70); // Pinta rectángulo relleno
        registrar(`fillRect(${x}, ${y}, 110, 70) con color ${colorInput.value}`); // Registra coordenadas
    });

    // Dibuja un círculo usando beginPath() y arc()
    document.getElementById('btnDrawCircle')?.addEventListener('click', () => { // Evento clic en círculo
        const cx = Math.floor(Math.random() * (canvas.width - 120)) + 60; // Centro X aleatorio
        const cy = Math.floor(Math.random() * (canvas.height - 120)) + 60; // Centro Y aleatorio
        ctx.beginPath(); // Aísla la ruta para evitar trazos previos
        ctx.arc(cx, cy, 42, 0, Math.PI * 2); // Traza circunferencia completa de 360 grados
        ctx.fillStyle = colorInput.value; // Asigna color de relleno
        ctx.fill(); // Rellena el círculo
        ctx.lineWidth = Number(widthInput.value); // Define grosor del borde
        ctx.strokeStyle = '#ffffff'; // Contorno blanco nítido
        ctx.stroke(); // Dibuja el contorno
        registrar(`arc(${cx}, ${cy}, 42, 0, 2π)`); // Registra en consola
    });

    // Dibuja un triángulo usando moveTo(), lineTo() y closePath()
    document.getElementById('btnDrawTriangle')?.addEventListener('click', () => { // Evento clic en triángulo
        const x = Math.floor(Math.random() * (canvas.width - 140)) + 70; // Vértice superior X
        const y = Math.floor(Math.random() * (canvas.height - 120)) + 20; // Vértice superior Y
        ctx.beginPath(); // Inicia ruta independiente
        ctx.moveTo(x, y); // Punto superior
        ctx.lineTo(x + 55, y + 85); // Vértice inferior derecho
        ctx.lineTo(x - 55, y + 85); // Vértice inferior izquierdo
        ctx.closePath(); // Cierra el triángulo automáticamente
        ctx.fillStyle = colorInput.value; // Color seleccionado
        ctx.fill(); // Pinta el interior
        registrar(`Triángulo con closePath() en (${x}, ${y})`); // Registra acción
    });

    // Botón para dibujar rejilla y botón para limpiar todo el lienzo
    document.getElementById('btnDrawGrid')?.addEventListener('click', dibujarRejilla); // Registra rejilla
    document.getElementById('btnClearCanvas')?.addEventListener('click', () => { // Registra limpieza
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Borra todo el lienzo
        registrar('clearRect(0, 0, width, height) — Lienzo limpiado'); // Registra acción
    });

    // Actualiza etiqueta de grosor al mover el slider
    widthInput?.addEventListener('input', () => { // Escucha cambios del control range
        if (widthVal) widthVal.textContent = `${widthInput.value}px`; // Actualiza texto visual
    });

    // Calcula coordenadas reales del ratón ajustadas al tamaño interno del canvas
    function obtenerCoords(e) { // Declara función de coordenadas
        const rect = canvas.getBoundingClientRect(); // Obtiene posición y tamaño CSS actual
        const scaleX = canvas.width / rect.width; // Factor de escala horizontal
        const scaleY = canvas.height / rect.height; // Factor de escala vertical
        return { // Retorna coordenadas escaladas
            x: Math.round((e.clientX - rect.left) * scaleX), // Coordenada X exacta
            y: Math.round((e.clientY - rect.top) * scaleY) // Coordenada Y exacta
        };
    }

    // Eventos de dibujo libre con el ratón sobre el lienzo
    canvas.addEventListener('mousedown', (e) => { // Al presionar el botón del ratón
        dibujando = true; // Activa estado de dibujo
        const { x, y } = obtenerCoords(e); // Obtiene coordenadas iniciales
        ctx.beginPath(); // Inicia un nuevo trazo limpio
        ctx.moveTo(x, y); // Coloca el lápiz en el punto inicial
    });

    canvas.addEventListener('mousemove', (e) => { // Al mover el ratón sobre el lienzo
        const { x, y } = obtenerCoords(e); // Calcula posición actual
        if (coordsLabel) coordsLabel.textContent = `Cursor: (x: ${x}, y: ${y})`; // Muestra coordenadas en vivo
        if (!dibujando) return; // No pinta si el botón no está presionado
        ctx.lineTo(x, y); // Extiende la línea al nuevo punto
        ctx.strokeStyle = colorInput.value; // Color elegido
        ctx.lineWidth = Number(widthInput.value); // Grosor elegido
        ctx.lineCap = 'round'; // Terminación redondeada suave
        ctx.lineJoin = 'round'; // Unión de vértices suave
        ctx.stroke(); // Dibuja el segmento
    });

    window.addEventListener('mouseup', () => { dibujando = false; }); // Finaliza el trazo al soltar

    // Lógica interactiva del Quiz de 3 preguntas
    const quizBox = document.getElementById('canvasQuiz'); // Contenedor del quiz
    if (quizBox) { // Si existe el quiz en el DOM
        const questions = Array.from(quizBox.querySelectorAll('.quiz-question')); // Lista de preguntas
        const resultEl = document.getElementById('quizResult'); // Elemento para mostrar puntaje
        let hits = 0; // Contador de aciertos

        questions.forEach((q) => { // Recorre cada pregunta
            const correct = q.dataset.answer; // Respuesta correcta esperada
            q.querySelectorAll('.quiz-opt').forEach((btn) => { // Recorre opciones
                btn.addEventListener('click', () => { // Al hacer clic en una opción
                    if (q.dataset.answered === '1') return; // Evita responder dos veces
                    q.dataset.answered = '1'; // Marca pregunta como respondida
                    const chosen = btn.dataset.opt; // Opción seleccionada
                    if (chosen === correct) { // Si acertó
                        btn.classList.add('correct'); // Estilo verde
                        hits++; // Incrementa aciertos
                    } else { // Si falló
                        btn.classList.add('wrong'); // Estilo rojo
                        q.querySelector(`[data-opt="${correct}"]`)?.classList.add('correct'); // Muestra la correcta
                    }
                    const totalDone = questions.filter(x => x.dataset.answered === '1').length; // Respondidas
                    if (resultEl) { // Actualiza resumen de puntuación
                        resultEl.textContent = `Puntuación: ${hits} / ${questions.length} (${totalDone} respondidas)`;
                    }
                });
            });
        });
    }

    // Dibuja una escena inicial de bienvenida al cargar el módulo
    dibujarRejilla(); // Pinta rejilla guía inicial
    ctx.fillStyle = '#00f0ff'; // Color neón inicial
    ctx.fillRect(40, 40, 120, 80); // Rectángulo de ejemplo
    ctx.beginPath(); // Inicia ruta de ejemplo
    ctx.arc(280, 140, 45, 0, Math.PI * 2); // Círculo de ejemplo
    ctx.strokeStyle = '#a855f7'; // Color púrpura
    ctx.lineWidth = 4; // Grosor 4px
    ctx.stroke(); // Dibuja contorno
})();
