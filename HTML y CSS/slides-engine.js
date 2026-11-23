/**
 * ============================================================================
 * MOTOR DE PRESENTACIONES INTERACTIVAS — HTML5 Y CSS3
 * Controla navegación de diapositivas, modo guía, índice rápido, sonido,
 * laboratorio en vivo, saltos rápidos, quiz interactivo y copia de código.
 * Documentación pedagógica LÍNEA POR LÍNEA en español.
 * ============================================================================
 */
(function () { // Instrucción JavaScript
    // Activa el modo estricto para evitar errores silenciosos y malas prácticas en JS
    'use strict'; // Activa el modo estricto de JavaScript

    // Obtiene todas las secciones con clase .slide y las convierte en un Array real
    const slides = Array.from(document.querySelectorAll('.slide')); // Obtiene referencia DOM para "slides"
    // Almacena la cantidad total de diapositivas disponibles en la presentación
    const totalSlides = slides.length; // Declara e inicializa "totalSlides"
    // Índice de la diapositiva visible actualmente (inicia en 1)
    let currentSlide = 1; // Declara e inicializa "currentSlide"
    // Modo de visualización activo: 'slides' (diapositivas) o 'guide' (documento continuo)
    let viewMode = 'slides'; // Declara e inicializa "viewMode"
    // Bandera booleana que indica si los efectos de audio están activados
    let soundEnabled = true; // Declara e inicializa "soundEnabled"

    // --- Referencias a elementos del DOM de la barra superior y controles ---
    // Barra de relleno que refleja el porcentaje de avance
    const progressBar = document.getElementById('progressBar'); // Obtiene referencia DOM para "progressBar"
    // Texto indicador del número actual sobre el total (ej. "1 / 8")
    const slideIndicator = document.getElementById('slideIndicator'); // Obtiene referencia DOM para "slideIndicator"
    // Botón inferior para retroceder una diapositiva
    const btnPrev = document.getElementById('btnPrev'); // Obtiene referencia DOM para "btnPrev"
    // Botón inferior para avanzar una diapositiva
    const btnNext = document.getElementById('btnNext'); // Obtiene referencia DOM para "btnNext"
    // Botón superior para alternar entre Modo Slides y Modo Guía
    const btnToggleMode = document.getElementById('btnToggleMode'); // Obtiene referencia DOM para "btnToggleMode"
    // Icono dentro del botón de cambio de modo
    const modeIcon = document.getElementById('modeIcon'); // Obtiene referencia DOM para "modeIcon"
    // Texto descriptivo dentro del botón de cambio de modo
    const modeText = document.getElementById('modeText'); // Obtiene referencia DOM para "modeText"
    // Botón superior para abrir o cerrar el índice general de diapositivas
    const btnOverview = document.getElementById('btnOverview'); // Obtiene referencia DOM para "btnOverview"
    // Contenedor modal a pantalla completa del índice de diapositivas
    const overviewModal = document.getElementById('overviewModal'); // Obtiene referencia DOM para "overviewModal"
    // Cuadrícula donde se inyectan dinámicamente las tarjetas del índice
    const overviewGrid = document.getElementById('overviewGrid'); // Obtiene referencia DOM para "overviewGrid"
    // Botón superior para activar o salir de pantalla completa
    const btnFullscreen = document.getElementById('btnFullscreen'); // Obtiene referencia DOM para "btnFullscreen"
    // Botón superior para activar o silenciar los sonidos
    const btnToggleSound = document.getElementById('btnToggleSound'); // Obtiene referencia DOM para "btnToggleSound"
    // Icono del altavoz dentro del botón de sonido
    const soundIcon = document.getElementById('soundIcon'); // Obtiene referencia DOM para "soundIcon"
    // Botón superior de acceso directo a la diapositiva del Laboratorio
    const btnGoLab = document.getElementById('btnGoLab'); // Obtiene referencia DOM para "btnGoLab"

    // --- Sintetizador ligero de sonido usando Web Audio API ---
    const SoundFX = { // Declara e inicializa "SoundFX"
        // Contexto de audio reutilizable (se crea bajo demanda tras interacción del usuario)
        ctx: null,
        // Genera un tono breve que cambia suavemente de freqStart a freqEnd en dur segundos
        beep(freqStart, freqEnd, dur) { // Instrucción JavaScript
            // Si el usuario silenció el audio, no produce sonido
            if (!soundEnabled) return; // Evalúa condición
            // Obtiene el constructor compatible de AudioContext
            const AudioCtx = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioCtx"
            // Si el navegador no soporta Web Audio API, sale sin error
            if (!AudioCtx) return; // Evalúa condición
            // Inicializa el contexto de audio la primera vez
            if (!this.ctx) this.ctx = new AudioCtx(); // Evalúa condición
            // Reanuda el contexto si el navegador lo pausó por política de autoplay
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Crea el oscilador (generador de onda) y el nodo de ganancia (volumen)
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Obtiene el instante exacto del reloj interno de audio
            const now = this.ctx.currentTime; // Declara e inicializa "now"
            // Selecciona onda senoidal suave
            osc.type = 'sine'; // Asigna valor
            // Fija la frecuencia inicial
            osc.frequency.setValueAtTime(freqStart, now); // Ejecuta llamada o método
            // Desliza exponencialmente la frecuencia hacia freqEnd
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur); // Ejecuta llamada o método
            // Volumen bajo (0.05) para no resultar molesto
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            // Atenúa el volumen hasta casi cero para evitar chasquidos al detenerse
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur); // Ejecuta llamada o método
            // Conecta oscilador -> ganancia -> altavoces del dispositivo
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            // Inicia y programa la parada automática del oscilador
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + dur); // Ejecuta llamada o método
        }
    };

    // --- Navegación principal entre diapositivas ---
    function goToSlide(n) { // Declara función
        // Limita el número de diapositiva al rango válido [1, totalSlides]
        if (n < 1) n = 1; // Evalúa condición
        if (n > totalSlides) n = totalSlides; // Evalúa condición
        // Actualiza el estado global con la diapositiva seleccionada
        currentSlide = n; // Asigna valor

        // Activa la clase .active solo en la diapositiva correspondiente
        slides.forEach((s, idx) => { // Instrucción JavaScript
            s.classList.toggle('active', idx + 1 === currentSlide); // Modifica clases CSS del elemento
        });

        // Actualiza el ancho proporcional de la barra de progreso
        if (progressBar) progressBar.style.width = `${(currentSlide / totalSlides) * 100}%`; // Evalúa condición
        // Actualiza el texto del indicador numérico
        if (slideIndicator) slideIndicator.textContent = `${currentSlide} / ${totalSlides}`; // Evalúa condición
        // Deshabilita el botón Anterior en la primera diapositiva
        if (btnPrev) btnPrev.disabled = currentSlide === 1; // Evalúa condición
        // Deshabilita el botón Siguiente en la última diapositiva
        if (btnNext) btnNext.disabled = currentSlide === totalSlides; // Evalúa condición

        // Resalta también la tarjeta activa dentro del modal de índice (Overview)
        if (overviewGrid) { // Evalúa condición
            overviewGrid.querySelectorAll('.overview-item').forEach((item, idx) => { // Instrucción JavaScript
                item.classList.toggle('active', idx + 1 === currentSlide); // Modifica clases CSS del elemento
            });
        }

        // Reproduce un sonido sutil de transición
        SoundFX.beep(340, 480, 0.12); // Ejecuta llamada o método
        // En modo presentación desplaza suavemente el scroll al inicio de la página
        if (viewMode === 'slides') window.scrollTo({ top: 0, behavior: 'smooth' }); // Evalúa condición
        // Si el usuario alcanza la última diapositiva, marca el módulo como completado
        if (currentSlide === totalSlides && totalSlides > 0) saveProgress({ completed: true }); // Evalúa condición
    }

    // --- Persistencia de progreso en localStorage ---
    // Construye una clave única basada en la ruta del módulo dentro del curso
    function getModuleKey() { // Declara función
        // Decodifica la URL y separa los segmentos de carpeta no vacíos
        const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean); // Declara e inicializa "parts"
        // Busca la carpeta raíz del bloque correspondiente
        const idx = parts.findIndex(p => p === 'HTML y CSS' || p === 'JAVASCRIPT MID LEVEL' || p === 'JAVASCRIPT MASTER LEVEL' || p === 'JAVASCRIPT JUNIOR LEVEL'); // Define función flecha "idx"
        // Devuelve la ruta relativa desde la carpeta del nivel, o los últimos 2 segmentos
        return idx !== -1 ? parts.slice(idx).join('/') : parts.slice(-2).join('/'); // Retorna resultado
    }

    // Mezcla y guarda datos de avance (completado, puntaje de quiz) en localStorage
    function saveProgress(patch) { // Declara función
        try { // Inicia bloque protegido contra errores
            // Lee el registro previo guardado en el navegador
            const raw = localStorage.getItem('curso_web_progress'); // Declara e inicializa "raw"
            // Parsea el JSON existente o inicia un objeto vacío
            const data = raw ? JSON.parse(raw) : {}; // Declara e inicializa "data"
            // Obtiene el identificador del módulo actual
            const key = getModuleKey(); // Declara e inicializa "key"
            // Fusiona marca de tiempo actual, datos previos y los nuevos cambios
            data[key] = Object.assign({ updatedAt: Date.now() }, data[key] || {}, patch); // Asigna valor
            // Persiste el objeto actualizado en localStorage
            localStorage.setItem('curso_web_progress', JSON.stringify(data)); // Ejecuta llamada o método
        } catch (_) { // Instrucción JavaScript
            // Ignora errores si el navegador bloquea localStorage (ej. modo privado estricto)
        }
    }

    // --- Construcción dinámica del modal de índice (Overview) ---
    if (overviewGrid) { // Evalúa condición
        slides.forEach((s, idx) => { // Instrucción JavaScript
            // Crea un botón tipo tarjeta para cada diapositiva
            const btn = document.createElement('button'); // Crea nuevo elemento DOM "btn"
            btn.className = 'overview-item'; // Asigna valor
            // Lee el título definido en data-title o usa un nombre genérico
            const title = s.dataset.title || `Diapositiva ${idx + 1}`; // Declara e inicializa "title"
            // Inserta número de slide y título
            btn.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`; // Actualiza contenido en el DOM
            // Al hacer clic: vuelve a modo slides si estaba en guía, navega y cierra el modal
            btn.addEventListener('click', () => { // Registra escuchador de eventos
                if (viewMode === 'guide') toggleMode(); // Evalúa condición
                goToSlide(idx + 1); // Ejecuta llamada o método
                overviewModal.classList.remove('open'); // Modifica clases CSS del elemento
            });
            // Agrega la tarjeta a la cuadrícula del modal
            overviewGrid.appendChild(btn); // Inserta nodo en el DOM
        });
    }

    // Alterna entre ver una diapositiva a la vez ('slides') o todas seguidas ('guide')
    function toggleMode() { // Declara función
        viewMode = viewMode === 'slides' ? 'guide' : 'slides'; // Asigna valor
        // Actualiza las clases del <body> que controlan la visibilidad en CSS
        document.body.classList.toggle('mode-presentation', viewMode === 'slides'); // Modifica clases CSS del elemento
        document.body.classList.toggle('mode-guide', viewMode === 'guide'); // Modifica clases CSS del elemento
        // Cambia icono y texto del botón para reflejar el siguiente modo disponible
        if (modeIcon) modeIcon.textContent = viewMode === 'slides' ? '📑' : '🎞️'; // Evalúa condición
        if (modeText) modeText.textContent = viewMode === 'slides' ? 'Modo Guía' : 'Modo Slides'; // Evalúa condición
        SoundFX.beep(480, 360, 0.1); // Ejecuta llamada o método
    }

    // --- Asignación de eventos a los botones de la interfaz ---
    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1)); // Evalúa condición
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1)); // Evalúa condición
    if (btnToggleMode) btnToggleMode.addEventListener('click', toggleMode); // Evalúa condición
    if (btnOverview && overviewModal) { // Evalúa condición
        // Abre/cierra el modal al pulsar el botón de cuadrícula
        btnOverview.addEventListener('click', () => overviewModal.classList.toggle('open')); // Registra escuchador de eventos
        // Cierra el modal si se hace clic en el fondo oscuro fuera de las tarjetas
        overviewModal.addEventListener('click', (e) => { // Registra escuchador de eventos
            if (e.target === overviewModal) overviewModal.classList.remove('open'); // Evalúa condición
        });
    }
    if (btnToggleSound && soundIcon) { // Evalúa condición
        // Alterna el estado de silencio y cambia el emoji del altavoz
        btnToggleSound.addEventListener('click', () => { // Registra escuchador de eventos
            soundEnabled = !soundEnabled; // Asigna valor
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
        });
    }
    if (btnFullscreen) { // Evalúa condición
        // Solicita pantalla completa o sale de ella según el estado actual
        btnFullscreen.addEventListener('click', () => { // Registra escuchador de eventos
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); // Evalúa condición
            else document.exitFullscreen?.(); // Rama alternativa
        });
    }
    if (btnGoLab) { // Evalúa condición
        // Busca la diapositiva marcada con data-lab="true" y salta directo a ella
        btnGoLab.addEventListener('click', () => { // Registra escuchador de eventos
            const labIdx = slides.findIndex(s => s.dataset.lab === 'true'); // Define función flecha "labIdx"
            if (labIdx !== -1) { // Evalúa condición
                if (viewMode === 'guide') { // Evalúa condición
                    slides[labIdx].scrollIntoView({ behavior: 'smooth' }); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    goToSlide(labIdx + 1); // Ejecuta llamada o método
                }
            }
        });
    }

    // --- Atajos de teclado globales ---
    document.addEventListener('keydown', (e) => { // Registra escuchador de eventos
        // Evita interceptar teclas mientras el usuario escribe en inputs o editores
        const tag = document.activeElement?.tagName; // Declara e inicializa "tag"
        if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return; // Evalúa condición

        // Flecha derecha o Espacio avanzan en modo diapositivas
        if (e.key === 'ArrowRight' || e.key === ' ') { // Evalúa condición
            if (viewMode === 'slides') { e.preventDefault(); goToSlide(currentSlide + 1); }
        // Flecha izquierda retrocede en modo diapositivas
        } else if (e.key === 'ArrowLeft') { // Instrucción JavaScript
            if (viewMode === 'slides') { e.preventDefault(); goToSlide(currentSlide - 1); }
        // Tecla 'O' abre o cierra el índice rápido (Overview)
        } else if (e.key.toLowerCase() === 'o' && overviewModal) { // Instrucción JavaScript
            overviewModal.classList.toggle('open'); // Modifica clases CSS del elemento
        // Tecla 'Escape' cierra el modal de índice si está abierto
        } else if (e.key === 'Escape' && overviewModal) { // Instrucción JavaScript
            overviewModal.classList.remove('open'); // Modifica clases CSS del elemento
        // Tecla 'F' alterna el modo pantalla completa
        } else if (e.key.toLowerCase() === 'f') { // Instrucción JavaScript
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); // Evalúa condición
            else document.exitFullscreen?.(); // Rama alternativa
        }
    });

    // --- Laboratorio HTML/CSS en Vivo ---
    // Editor de texto y marco iframe de vista previa
    const labEditor = document.getElementById('labEditor'); // Obtiene referencia DOM para "labEditor"
    const labPreview = document.getElementById('labPreview'); // Obtiene referencia DOM para "labPreview"
    // Botones de ejemplos preconfigurados dentro del laboratorio
    const presetBtns = document.querySelectorAll('.preset-btn[data-code]'); // Obtiene referencia DOM para "presetBtns"

    // Inyecta el código HTML/CSS actual del editor dentro del iframe aislado
    function updatePreview() { // Declara función
        if (labEditor && labPreview) { // Evalúa condición
            const raw = labEditor.value || ''; // Obtiene el código actual del editor
            // Detecta si el ejemplo define un fondo claro en body/html para elegir color de texto legible
            const hasLightBg = /(?:body|html)\s*\{[^}]*background(?:-color)?\s*:\s*(?:#f|#e|#d|#c|#fff|white|rgb\(\s*2)/i.test(raw);
            const textColor = hasLightBg ? '#0f172a' : '#f8fafc';
            const baseStyle = `<style>html,body{color:${textColor};font-family:system-ui,-apple-system,sans-serif;margin:0;}code{background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 6px;border-radius:4px;}</style>`;
            labPreview.srcdoc = baseStyle + raw; // Asigna valor con estilo base legible
        }
    }

    if (labEditor && labPreview) { // Evalúa condición
        const initialCode = labEditor.value; // Guarda el código inicial para restaurar
        const labSplit = labEditor.closest('.lab-split'); // Contenedor de editor + vista previa
        let runStatusEl = null; // Referencia al indicador de estado de ejecución

        // Crea la barra superior de ejecución si aún no existe
        if (labSplit && labSplit.parentNode && !labSplit.parentNode.querySelector('.lab-actions-bar')) {
            const bar = document.createElement('div');
            bar.className = 'lab-actions-bar';
            bar.innerHTML = `
                <div class="lab-actions-group">
                    <button type="button" class="lab-run-btn" title="Ejecutar código (Ctrl + Enter)">▶ Ejecutar Código</button>
                    <button type="button" class="lab-reset-btn" title="Restaurar ejemplo original">↻ Restaurar</button>
                </div>
                <span class="lab-run-status">● Vista en vivo · Ctrl + Enter</span>
            `;
            labSplit.parentNode.insertBefore(bar, labSplit);
            runStatusEl = bar.querySelector('.lab-run-status');

            bar.querySelector('.lab-run-btn').addEventListener('click', () => {
                updatePreview();
                SoundFX.beep(520, 680, 0.1);
                if (runStatusEl) {
                    runStatusEl.textContent = `✓ Ejecutado (${new Date().toLocaleTimeString()})`;
                }
            });

            bar.querySelector('.lab-reset-btn').addEventListener('click', () => {
                const activePreset = document.querySelector('.preset-btn.active[data-code]');
                labEditor.value = activePreset ? activePreset.dataset.code : initialCode;
                updatePreview();
                SoundFX.beep(420, 520, 0.08);
                if (runStatusEl) {
                    runStatusEl.textContent = '↻ Código restaurado y ejecutado';
                }
            });
        }

        // Atajo Ctrl+Enter / Cmd+Enter dentro del editor para ejecutar manualmente
        labEditor.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                updatePreview();
                SoundFX.beep(520, 680, 0.1);
                if (runStatusEl) {
                    runStatusEl.textContent = `✓ Ejecutado (${new Date().toLocaleTimeString()})`;
                }
            }
        });

        // Actualiza la vista previa en cada pulsación de tecla dentro del editor
        labEditor.addEventListener('input', updatePreview); // Registra escuchador de eventos
        // Conecta cada botón de ejemplo para reemplazar el código del editor
        presetBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener('click', () => { // Registra escuchador de eventos
                presetBtns.forEach(b => b.classList.remove('active')); // Modifica clases CSS del elemento
                btn.classList.add('active'); // Modifica clases CSS del elemento
                labEditor.value = btn.dataset.code; // Asigna valor
                updatePreview(); // Ejecuta llamada o método
                SoundFX.beep(520, 620, 0.08); // Ejecuta llamada o método
            });
        });
        // Renderiza el código inicial al cargar la página
        updatePreview(); // Ejecuta llamada o método

        // Conecta botones "Probar este ejemplo en el Lab" repartidos en las diapositivas
        document.querySelectorAll('.try-lab-btn[data-lab-code]').forEach(btn => { // Instrucción JavaScript
            btn.addEventListener('click', () => { // Registra escuchador de eventos
                // Carga el código del atributo data-lab-code en el editor
                labEditor.value = btn.dataset.labCode; // Asigna valor
                updatePreview(); // Ejecuta llamada o método
                // Localiza la diapositiva del laboratorio y navega hacia ella
                const labIdx = slides.findIndex(s => s.dataset.lab === 'true'); // Define función flecha "labIdx"
                if (labIdx !== -1) { // Evalúa condición
                    if (viewMode === 'guide') { // Evalúa condición
                        slides[labIdx].scrollIntoView({ behavior: 'smooth' }); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        goToSlide(labIdx + 1); // Ejecuta llamada o método
                    }
                }
                SoundFX.beep(540, 700, 0.12); // Ejecuta llamada o método
            });
        });
    }

    // --- Saltos rápidos desde tarjetas hero o botones con data-jump="N" ---
    document.querySelectorAll('[data-jump]').forEach(el => { // Instrucción JavaScript
        el.addEventListener('click', () => { // Registra escuchador de eventos
            // Convierte el número de diapositiva destino a entero base 10
            const targetSlide = parseInt(el.dataset.jump, 10); // Declara e inicializa "targetSlide"
            if (!Number.isNaN(targetSlide)) { // Evalúa condición
                if (viewMode === 'guide') { // Evalúa condición
                    slides[targetSlide - 1]?.scrollIntoView({ behavior: 'smooth' }); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    goToSlide(targetSlide); // Ejecuta llamada o método
                }
            }
        });
    });

    // --- Motor de Quiz Interactivo (.quiz-container) ---
    document.querySelectorAll('.quiz-container').forEach(container => { // Instrucción JavaScript
        // Obtiene todas las preguntas y referencias de puntaje/reinicio del bloque
        const questions = Array.from(container.querySelectorAll('.quiz-question')); // Obtiene referencia DOM para "questions"
        const scoreEl = container.querySelector('.quiz-score'); // Obtiene referencia DOM para "scoreEl"
        const resetBtn = container.querySelector('.quiz-reset-btn'); // Obtiene referencia DOM para "resetBtn"
        // Contadores de respuestas correctas y preguntas contestadas
        let correctCount = 0; // Declara e inicializa "correctCount"
        let answeredCount = 0; // Declara e inicializa "answeredCount"

        // Refresca el texto del marcador superior del cuestionario
        function updateScore() { // Declara función
            if (scoreEl) { // Evalúa condición
                scoreEl.textContent = `Puntaje: ${correctCount} / ${questions.length} (${answeredCount} respondidas)`; // Actualiza contenido en el DOM
            }
        }

        questions.forEach(q => { // Instrucción JavaScript
            // Lee respuesta correcta y mensajes personalizados desde atributos data-*
            const answer = q.dataset.answer; // Declara e inicializa "answer"
            const explainOk = q.dataset.ok || '¡Correcto! Excelente comprensión del concepto.'; // Declara e inicializa "explainOk"
            const explainErr = q.dataset.err || 'Revisa la explicación de las diapositivas anteriores e inténtalo de nuevo.'; // Declara e inicializa "explainErr"
            const options = Array.from(q.querySelectorAll('.quiz-option')); // Obtiene referencia DOM para "options"
            const feedback = q.querySelector('.quiz-feedback'); // Obtiene referencia DOM para "feedback"

            options.forEach(opt => { // Instrucción JavaScript
                opt.addEventListener('click', () => { // Registra escuchador de eventos
                    // Evita responder dos veces la misma pregunta
                    if (q.dataset.answered === 'true') return; // Evalúa condición
                    q.dataset.answered = 'true'; // Asigna valor
                    answeredCount++; // Instrucción JavaScript

                    // Comprueba si la opción elegida coincide con data-answer
                    const isRight = opt.dataset.opt === answer; // Declara e inicializa "isRight"
                    // Deshabilita todas las opciones y marca en verde la respuesta correcta
                    options.forEach(o => { // Instrucción JavaScript
                        o.disabled = true; // Asigna valor
                        if (o.dataset.opt === answer) o.classList.add('is-correct'); // Evalúa condición
                    });

                    if (isRight) { // Evalúa condición
                        // Incrementa puntaje y muestra retroalimentación positiva
                        correctCount++; // Instrucción JavaScript
                        opt.classList.add('is-correct'); // Modifica clases CSS del elemento
                        if (feedback) { // Evalúa condición
                            feedback.textContent = `✅ ${explainOk}`; // Actualiza contenido en el DOM
                            feedback.className = 'quiz-feedback show ok'; // Asigna valor
                        }
                        SoundFX.beep(520, 740, 0.14); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        // Marca la opción elegida como errónea y muestra explicación
                        opt.classList.add('is-wrong'); // Modifica clases CSS del elemento
                        if (feedback) { // Evalúa condición
                            feedback.textContent = `❌ ${explainErr}`; // Actualiza contenido en el DOM
                            feedback.className = 'quiz-feedback show err'; // Asigna valor
                        }
                        SoundFX.beep(240, 170, 0.16); // Ejecuta llamada o método
                    }
                    updateScore(); // Ejecuta llamada o método
                    // Al completar todas las preguntas guarda el resultado en localStorage
                    if (answeredCount === questions.length) { // Evalúa condición
                        saveProgress({ quizScore: correctCount, quizTotal: questions.length, completed: true }); // Ejecuta llamada o método
                    }
                });
            });
        });

        // Restaura el quiz a su estado inicial al pulsar Reiniciar
        if (resetBtn) { // Evalúa condición
            resetBtn.addEventListener('click', () => { // Registra escuchador de eventos
                correctCount = 0; // Asigna valor
                answeredCount = 0; // Asigna valor
                questions.forEach(q => { // Instrucción JavaScript
                    delete q.dataset.answered; // Instrucción JavaScript
                    q.querySelectorAll('.quiz-option').forEach(o => { // Instrucción JavaScript
                        o.disabled = false; // Asigna valor
                        o.classList.remove('is-correct', 'is-wrong'); // Modifica clases CSS del elemento
                    });
                    const fb = q.querySelector('.quiz-feedback'); // Obtiene referencia DOM para "fb"
                    if (fb) fb.className = 'quiz-feedback'; // Evalúa condición
                });
                updateScore(); // Ejecuta llamada o método
                SoundFX.beep(420, 520, 0.1); // Ejecuta llamada o método
            });
        }

        // Muestra el marcador inicial al cargar
        updateScore(); // Ejecuta llamada o método
    });

    // --- Botón Copiar automático en todos los bloques de código (.code-block) ---
    document.querySelectorAll('pre.code-block').forEach(pre => { // Instrucción JavaScript
        // Evita envolver dos veces el mismo bloque
        if (pre.parentElement?.classList.contains('code-block-wrap')) return; // Evalúa condición
        // Crea un contenedor relativo para posicionar el botón Copiar encima
        const wrap = document.createElement('div'); // Crea nuevo elemento DOM "wrap"
        wrap.className = 'code-block-wrap'; // Asigna valor
        pre.parentNode.insertBefore(wrap, pre); // Ejecuta llamada o método
        wrap.appendChild(pre); // Inserta nodo en el DOM

        // Crea el botón Copiar y copia el contenido al portapapeles al hacer clic
        const btn = document.createElement('button'); // Crea nuevo elemento DOM "btn"
        btn.type = 'button'; // Asigna valor
        btn.className = 'code-copy-btn'; // Asigna valor
        btn.textContent = 'Copiar'; // Actualiza contenido en el DOM
        btn.addEventListener('click', () => { // Registra escuchador de eventos
            navigator.clipboard?.writeText(pre.textContent || ''); // Actualiza contenido en el DOM
            btn.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
            SoundFX.beep(600, 760, 0.08); // Ejecuta llamada o método
            // Restaura el texto original después de 1.4 segundos
            setTimeout(() => { btn.textContent = 'Copiar'; }, 1400); // Actualiza contenido en el DOM
        });
        wrap.appendChild(btn); // Inserta nodo en el DOM
    });

    // Arranque inicial mostrando siempre la diapositiva 1
    goToSlide(1); // Ejecuta llamada o método
})(); // Ejecuta llamada o método
