/**
 * ============================================================================
 * MOTOR DE PRESENTACIONES INTERACTIVAS — HTML5 Y CSS3
 * Controla navegación de diapositivas, modo guía, índice rápido, sonido,
 * laboratorio en vivo, saltos rápidos, quiz interactivo y copia de código.
 * Documentación pedagógica LÍNEA POR LÍNEA en español.
 * ============================================================================
 */
(function () {
    // Activa el modo estricto para evitar errores silenciosos y malas prácticas en JS
    'use strict'; // Activa el modo estricto de JavaScript

    // Obtiene todas las secciones con clase .slide y las convierte en un Array real
    const slides = Array.from(document.querySelectorAll('.slide'));
    // Almacena la cantidad total de diapositivas disponibles en la presentación
    const totalSlides = slides.length;
    // Índice de la diapositiva visible actualmente (inicia en 1)
    let currentSlide = 1;
    // Modo de visualización activo: 'slides' (diapositivas) o 'guide' (documento continuo)
    let viewMode = 'slides';
    // Bandera booleana que indica si los efectos de audio están activados
    let soundEnabled = true;

    // --- Referencias a elementos del DOM de la barra superior y controles ---
    // Barra de relleno que refleja el porcentaje de avance
    const progressBar = document.getElementById('progressBar');
    // Texto indicador del número actual sobre el total (ej. "1 / 8")
    const slideIndicator = document.getElementById('slideIndicator');
    // Botón inferior para retroceder una diapositiva
    const btnPrev = document.getElementById('btnPrev');
    // Botón inferior para avanzar una diapositiva
    const btnNext = document.getElementById('btnNext');
    // Botón superior para alternar entre Modo Slides y Modo Guía
    const btnToggleMode = document.getElementById('btnToggleMode');
    // Icono dentro del botón de cambio de modo
    const modeIcon = document.getElementById('modeIcon');
    // Texto descriptivo dentro del botón de cambio de modo
    const modeText = document.getElementById('modeText');
    // Botón superior para abrir o cerrar el índice general de diapositivas
    const btnOverview = document.getElementById('btnOverview');
    // Contenedor modal a pantalla completa del índice de diapositivas
    const overviewModal = document.getElementById('overviewModal');
    // Cuadrícula donde se inyectan dinámicamente las tarjetas del índice
    const overviewGrid = document.getElementById('overviewGrid');
    // Botón superior para activar o salir de pantalla completa
    const btnFullscreen = document.getElementById('btnFullscreen');
    // Botón superior para activar o silenciar los sonidos
    const btnToggleSound = document.getElementById('btnToggleSound');
    // Icono del altavoz dentro del botón de sonido
    const soundIcon = document.getElementById('soundIcon');
    // Botón superior de acceso directo a la diapositiva del Laboratorio
    const btnGoLab = document.getElementById('btnGoLab');

    // --- Sintetizador ligero de sonido usando Web Audio API ---
    const SoundFX = {
        // Contexto de audio reutilizable (se crea bajo demanda tras interacción del usuario)
        ctx: null,
        // Genera un tono breve que cambia suavemente de freqStart a freqEnd en dur segundos
        beep(freqStart, freqEnd, dur) {
            // Si el usuario silenció el audio, no produce sonido
            if (!soundEnabled) return;
            // Obtiene el constructor compatible de AudioContext
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            // Si el navegador no soporta Web Audio API, sale sin error
            if (!AudioCtx) return;
            // Inicializa el contexto de audio la primera vez
            if (!this.ctx) this.ctx = new AudioCtx();
            // Reanuda el contexto si el navegador lo pausó por política de autoplay
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Crea el oscilador (generador de onda) y el nodo de ganancia (volumen)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // Obtiene el instante exacto del reloj interno de audio
            const now = this.ctx.currentTime;
            // Selecciona onda senoidal suave
            osc.type = 'sine';
            // Fija la frecuencia inicial
            osc.frequency.setValueAtTime(freqStart, now);
            // Desliza exponencialmente la frecuencia hacia freqEnd
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
            // Volumen bajo (0.05) para no resultar molesto
            gain.gain.setValueAtTime(0.05, now);
            // Atenúa el volumen hasta casi cero para evitar chasquidos al detenerse
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
            // Conecta oscilador -> ganancia -> altavoces del dispositivo
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            // Inicia y programa la parada automática del oscilador
            osc.start(now);
            osc.stop(now + dur);
        }
    };

    // --- Navegación principal entre diapositivas ---
    function goToSlide(n) {
        // Limita el número de diapositiva al rango válido [1, totalSlides]
        if (n < 1) n = 1;
        if (n > totalSlides) n = totalSlides;
        // Actualiza el estado global con la diapositiva seleccionada
        currentSlide = n;

        // Activa la clase .active solo en la diapositiva correspondiente
        slides.forEach((s, idx) => {
            s.classList.toggle('active', idx + 1 === currentSlide);
        });

        // Actualiza el ancho proporcional de la barra de progreso
        if (progressBar) progressBar.style.width = `${(currentSlide / totalSlides) * 100}%`;
        // Actualiza el texto del indicador numérico
        if (slideIndicator) slideIndicator.textContent = `${currentSlide} / ${totalSlides}`;
        // Deshabilita el botón Anterior en la primera diapositiva
        if (btnPrev) btnPrev.disabled = currentSlide === 1;
        // Deshabilita el botón Siguiente en la última diapositiva
        if (btnNext) btnNext.disabled = currentSlide === totalSlides;

        // Resalta también la tarjeta activa dentro del modal de índice (Overview)
        if (overviewGrid) {
            overviewGrid.querySelectorAll('.overview-item').forEach((item, idx) => {
                item.classList.toggle('active', idx + 1 === currentSlide);
            });
        }

        // Reproduce un sonido sutil de transición
        SoundFX.beep(340, 480, 0.12);
        // En modo presentación desplaza suavemente el scroll al inicio de la página
        if (viewMode === 'slides') window.scrollTo({ top: 0, behavior: 'smooth' });
        // Si el usuario alcanza la última diapositiva, marca el módulo como completado
        if (currentSlide === totalSlides && totalSlides > 0) saveProgress({ completed: true });
    }

    // --- Persistencia de progreso en localStorage ---
    // Construye una clave única basada en la ruta del módulo dentro del curso
    function getModuleKey() {
        // Decodifica la URL y separa los segmentos de carpeta no vacíos
        const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
        // Busca la carpeta raíz del bloque correspondiente
        const idx = parts.findIndex(p => p === 'HTML y CSS' || p === 'JAVASCRIPT MID LEVEL' || p === 'JAVASCRIPT MASTER LEVEL' || p === 'JAVASCRIPT JUNIOR LEVEL');
        // Devuelve la ruta relativa desde la carpeta del nivel, o los últimos 2 segmentos
        return idx !== -1 ? parts.slice(idx).join('/') : parts.slice(-2).join('/');
    }

    // Mezcla y guarda datos de avance (completado, puntaje de quiz) en localStorage
    function saveProgress(patch) {
        try { // Inicia bloque protegido contra errores
            // Lee el registro previo guardado en el navegador
            const raw = localStorage.getItem('curso_web_progress');
            // Parsea el JSON existente o inicia un objeto vacío
            const data = raw ? JSON.parse(raw) : {};
            // Obtiene el identificador del módulo actual
            const key = getModuleKey();
            // Fusiona marca de tiempo actual, datos previos y los nuevos cambios
            data[key] = Object.assign({ updatedAt: Date.now() }, data[key] || {}, patch);
            // Persiste el objeto actualizado en localStorage
            localStorage.setItem('curso_web_progress', JSON.stringify(data));
        } catch (_) {
            // Ignora errores si el navegador bloquea localStorage (ej. modo privado estricto)
        }
    }

    // --- Construcción dinámica del modal de índice (Overview) ---
    if (overviewGrid) {
        slides.forEach((s, idx) => {
            // Crea un botón tipo tarjeta para cada diapositiva
            const btn = document.createElement('button');
            btn.className = 'overview-item';
            // Lee el título definido en data-title o usa un nombre genérico
            const title = s.dataset.title || `Diapositiva ${idx + 1}`;
            // Inserta número de slide y título
            btn.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`; // Actualiza contenido en el DOM
            // Al hacer clic: vuelve a modo slides si estaba en guía, navega y cierra el modal
            btn.addEventListener('click', () => {
                if (viewMode === 'guide') toggleMode();
                goToSlide(idx + 1);
                overviewModal.classList.remove('open');
            });
            // Agrega la tarjeta a la cuadrícula del modal
            overviewGrid.appendChild(btn);
        });
    }

    // Alterna entre ver una diapositiva a la vez ('slides') o todas seguidas ('guide')
    function toggleMode() {
        viewMode = viewMode === 'slides' ? 'guide' : 'slides';
        // Actualiza las clases del <body> que controlan la visibilidad en CSS
        document.body.classList.toggle('mode-presentation', viewMode === 'slides');
        document.body.classList.toggle('mode-guide', viewMode === 'guide');
        // Cambia icono y texto del botón para reflejar el siguiente modo disponible
        if (modeIcon) modeIcon.textContent = viewMode === 'slides' ? '📑' : '🎞️';
        if (modeText) modeText.textContent = viewMode === 'slides' ? 'Modo Guía' : 'Modo Slides';
        SoundFX.beep(480, 360, 0.1);
    }

    // --- Asignación de eventos a los botones de la interfaz ---
    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    if (btnToggleMode) btnToggleMode.addEventListener('click', toggleMode);
    if (btnOverview && overviewModal) {
        // Abre/cierra el modal al pulsar el botón de cuadrícula
        btnOverview.addEventListener('click', () => overviewModal.classList.toggle('open'));
        // Cierra el modal si se hace clic en el fondo oscuro fuera de las tarjetas
        overviewModal.addEventListener('click', (e) => {
            if (e.target === overviewModal) overviewModal.classList.remove('open');
        });
    }
    if (btnToggleSound && soundIcon) {
        // Alterna el estado de silencio y cambia el emoji del altavoz
        btnToggleSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
        });
    }
    if (btnFullscreen) {
        // Solicita pantalla completa o sale de ella según el estado actual
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.(); // Rama alternativa
        });
    }
    if (btnGoLab) {
        // Busca la diapositiva marcada con data-lab="true" y salta directo a ella
        btnGoLab.addEventListener('click', () => {
            const labIdx = slides.findIndex(s => s.dataset.lab === 'true');
            if (labIdx !== -1) {
                if (viewMode === 'guide') {
                    slides[labIdx].scrollIntoView({ behavior: 'smooth' });
                } else {
                    goToSlide(labIdx + 1);
                }
            }
        });
    }

    // --- Atajos de teclado globales ---
    document.addEventListener('keydown', (e) => {
        // Evita interceptar teclas mientras el usuario escribe en inputs o editores
        const tag = document.activeElement?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

        // Flecha derecha o Espacio avanzan en modo diapositivas
        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (viewMode === 'slides') { e.preventDefault(); goToSlide(currentSlide + 1); }
        // Flecha izquierda retrocede en modo diapositivas
        } else if (e.key === 'ArrowLeft') {
            if (viewMode === 'slides') { e.preventDefault(); goToSlide(currentSlide - 1); }
        // Tecla 'O' abre o cierra el índice rápido (Overview)
        } else if (e.key.toLowerCase() === 'o' && overviewModal) {
            overviewModal.classList.toggle('open');
        // Tecla 'Escape' cierra el modal de índice si está abierto
        } else if (e.key === 'Escape' && overviewModal) {
            overviewModal.classList.remove('open');
        // Tecla 'F' alterna el modo pantalla completa
        } else if (e.key.toLowerCase() === 'f') {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.(); // Rama alternativa
        }
    });

    // --- Laboratorio HTML/CSS en Vivo ---
    // Editor de texto y marco iframe de vista previa
    const labEditor = document.getElementById('labEditor');
    const labPreview = document.getElementById('labPreview');
    // Botones de ejemplos preconfigurados dentro del laboratorio
    const presetBtns = document.querySelectorAll('.preset-btn[data-code]');

    // Inyecta el código HTML/CSS actual del editor dentro del iframe aislado
    function updatePreview() {
        if (labEditor && labPreview) {
            const raw = labEditor.value || ''; // Obtiene el código actual del editor
            // Detecta si el ejemplo define un fondo claro en body/html para elegir color de texto legible
            const hasLightBg = /(?:body|html)\s*\{[^}]*background(?:-color)?\s*:\s*(?:#f|#e|#d|#c|#fff|white|rgb\(\s*2)/i.test(raw);
            const textColor = hasLightBg ? '#0f172a' : '#f8fafc';
            const baseStyle = `<style>html,body{color:${textColor};font-family:system-ui,-apple-system,sans-serif;margin:0;}code{background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 6px;border-radius:4px;}</style>`;
            labPreview.srcdoc = baseStyle + raw; // Asigna valor con estilo base legible
        }
    }

    if (labEditor && labPreview) {
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
        labEditor.addEventListener('input', updatePreview);
        // Conecta cada botón de ejemplo para reemplazar el código del editor
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                labEditor.value = btn.dataset.code;
                updatePreview();
                SoundFX.beep(520, 620, 0.08);
            });
        });
        // Renderiza el código inicial al cargar la página
        updatePreview();

        // Conecta botones "Probar este ejemplo en el Lab" repartidos en las diapositivas
        document.querySelectorAll('.try-lab-btn[data-lab-code]').forEach(btn => {
            btn.addEventListener('click', () => {
                // Carga el código del atributo data-lab-code en el editor
                labEditor.value = btn.dataset.labCode;
                updatePreview();
                // Localiza la diapositiva del laboratorio y navega hacia ella
                const labIdx = slides.findIndex(s => s.dataset.lab === 'true');
                if (labIdx !== -1) {
                    if (viewMode === 'guide') {
                        slides[labIdx].scrollIntoView({ behavior: 'smooth' });
                    } else {
                        goToSlide(labIdx + 1);
                    }
                }
                SoundFX.beep(540, 700, 0.12);
            });
        });
    }

    // --- Saltos rápidos desde tarjetas hero o botones con data-jump="N" ---
    document.querySelectorAll('[data-jump]').forEach(el => {
        el.addEventListener('click', () => {
            // Convierte el número de diapositiva destino a entero base 10
            const targetSlide = parseInt(el.dataset.jump, 10);
            if (!Number.isNaN(targetSlide)) {
                if (viewMode === 'guide') {
                    slides[targetSlide - 1]?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    goToSlide(targetSlide);
                }
            }
        });
    });

    // --- Motor de Quiz Interactivo (.quiz-container) ---
    document.querySelectorAll('.quiz-container').forEach(container => {
        // Obtiene todas las preguntas y referencias de puntaje/reinicio del bloque
        const questions = Array.from(container.querySelectorAll('.quiz-question'));
        const scoreEl = container.querySelector('.quiz-score');
        const resetBtn = container.querySelector('.quiz-reset-btn');
        // Contadores de respuestas correctas y preguntas contestadas
        let correctCount = 0;
        let answeredCount = 0;

        // Refresca el texto del marcador superior del cuestionario
        function updateScore() {
            if (scoreEl) {
                scoreEl.textContent = `Puntaje: ${correctCount} / ${questions.length} (${answeredCount} respondidas)`; // Actualiza contenido en el DOM
            }
        }

        questions.forEach(q => {
            // Lee respuesta correcta y mensajes personalizados desde atributos data-*
            const answer = q.dataset.answer;
            const explainOk = q.dataset.ok || '¡Correcto! Excelente comprensión del concepto.';
            const explainErr = q.dataset.err || 'Revisa la explicación de las diapositivas anteriores e inténtalo de nuevo.';
            const options = Array.from(q.querySelectorAll('.quiz-option'));
            const feedback = q.querySelector('.quiz-feedback');

            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    // Evita responder dos veces la misma pregunta
                    if (q.dataset.answered === 'true') return;
                    q.dataset.answered = 'true';
                    answeredCount++;

                    // Comprueba si la opción elegida coincide con data-answer
                    const isRight = opt.dataset.opt === answer;
                    // Deshabilita todas las opciones y marca en verde la respuesta correcta
                    options.forEach(o => {
                        o.disabled = true;
                        if (o.dataset.opt === answer) o.classList.add('is-correct');
                    });

                    if (isRight) {
                        // Incrementa puntaje y muestra retroalimentación positiva
                        correctCount++;
                        opt.classList.add('is-correct');
                        if (feedback) {
                            feedback.textContent = `✅ ${explainOk}`; // Actualiza contenido en el DOM
                            feedback.className = 'quiz-feedback show ok';
                        }
                        SoundFX.beep(520, 740, 0.14);
                    } else {
                        // Marca la opción elegida como errónea y muestra explicación
                        opt.classList.add('is-wrong');
                        if (feedback) {
                            feedback.textContent = `❌ ${explainErr}`; // Actualiza contenido en el DOM
                            feedback.className = 'quiz-feedback show err';
                        }
                        SoundFX.beep(240, 170, 0.16);
                    }
                    updateScore();
                    // Al completar todas las preguntas guarda el resultado en localStorage
                    if (answeredCount === questions.length) {
                        saveProgress({ quizScore: correctCount, quizTotal: questions.length, completed: true });
                    }
                });
            });
        });

        // Restaura el quiz a su estado inicial al pulsar Reiniciar
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                correctCount = 0;
                answeredCount = 0;
                questions.forEach(q => {
                    delete q.dataset.answered;
                    q.querySelectorAll('.quiz-option').forEach(o => {
                        o.disabled = false;
                        o.classList.remove('is-correct', 'is-wrong');
                    });
                    const fb = q.querySelector('.quiz-feedback');
                    if (fb) fb.className = 'quiz-feedback';
                });
                updateScore();
                SoundFX.beep(420, 520, 0.1);
            });
        }

        // Muestra el marcador inicial al cargar
        updateScore();
    });

    // --- Botón Copiar automático en todos los bloques de código (.code-block) ---
    document.querySelectorAll('pre.code-block').forEach(pre => {
        // Evita envolver dos veces el mismo bloque
        if (pre.parentElement?.classList.contains('code-block-wrap')) return;
        // Crea un contenedor relativo para posicionar el botón Copiar encima
        const wrap = document.createElement('div');
        wrap.className = 'code-block-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        // Crea el botón Copiar y copia el contenido al portapapeles al hacer clic
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy-btn';
        btn.textContent = 'Copiar'; // Actualiza contenido en el DOM
        btn.addEventListener('click', () => {
            navigator.clipboard?.writeText(pre.textContent || ''); // Actualiza contenido en el DOM
            btn.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
            SoundFX.beep(600, 760, 0.08);
            // Restaura el texto original después de 1.4 segundos
            setTimeout(() => { btn.textContent = 'Copiar'; }, 1400); // Actualiza contenido en el DOM
        });
        wrap.appendChild(btn);
    });

    // Arranque inicial mostrando siempre la diapositiva 1
    goToSlide(1);
})();
