/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: OBJETO SCREEN (window.screen)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO EN VIVO, QUIZ Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
(function () { // Instrucción JavaScript
    // Activamos el modo estricto para prevenir errores silenciosos
    'use strict'; // Activa el modo estricto de JavaScript

    // Estado centralizado de la presentación
    const AppState = { // Declara e inicializa "AppState"
        currentSlide: 1,
        totalSlides: document.querySelectorAll('.slide').length,
        viewMode: 'slides',
        soundEnabled: true
    };

    // Referencias del DOM para navegación y controles
    const slides = Array.from(document.querySelectorAll('.slide')); // Obtiene referencia DOM para "slides"
    const progressBar = document.getElementById('progressBar'); // Obtiene referencia DOM para "progressBar"
    const slideIndicator = document.getElementById('slideIndicator'); // Obtiene referencia DOM para "slideIndicator"
    const btnPrev = document.getElementById('btnPrev'); // Obtiene referencia DOM para "btnPrev"
    const btnNext = document.getElementById('btnNext'); // Obtiene referencia DOM para "btnNext"
    const btnToggleMode = document.getElementById('btnToggleMode'); // Obtiene referencia DOM para "btnToggleMode"
    const modeIcon = document.getElementById('modeIcon'); // Obtiene referencia DOM para "modeIcon"
    const modeText = document.getElementById('modeText'); // Obtiene referencia DOM para "modeText"
    const btnToggleSound = document.getElementById('btnToggleSound'); // Obtiene referencia DOM para "btnToggleSound"
    const soundIcon = document.getElementById('soundIcon'); // Obtiene referencia DOM para "soundIcon"
    const btnOverview = document.getElementById('btnOverview'); // Obtiene referencia DOM para "btnOverview"
    const btnCloseOverview = document.getElementById('btnCloseOverview'); // Obtiene referencia DOM para "btnCloseOverview"
    const overviewModal = document.getElementById('overviewModal'); // Obtiene referencia DOM para "overviewModal"
    const overviewGrid = document.getElementById('overviewGrid'); // Obtiene referencia DOM para "overviewGrid"
    const btnFullscreen = document.getElementById('btnFullscreen'); // Obtiene referencia DOM para "btnFullscreen"
    const btnGoLab = document.getElementById('btnGoLab'); // Obtiene referencia DOM para "btnGoLab"

    // Sintetizador ligero de sonido mediante Web Audio API
    const SoundFX = { // Declara e inicializa "SoundFX"
        ctx: null,
        beep(f1, f2, dur) { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            const AudioCtx = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioCtx"
            if (!AudioCtx) return; // Evalúa condición
            if (!this.ctx) this.ctx = new AudioCtx(); // Evalúa condición
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            const now = this.ctx.currentTime; // Declara e inicializa "now"
            osc.type = 'sine'; // Asigna valor
            osc.frequency.setValueAtTime(f1, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(f2, now + dur); // Ejecuta llamada o método
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur); // Ejecuta llamada o método
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + dur); // Ejecuta llamada o método
        }
    };

    // Cambia a la diapositiva solicitada y actualiza barra de progreso y botones
    function goToSlide(n) { // Declara función
        if (n < 1) n = 1; // Evalúa condición
        if (n > AppState.totalSlides) n = AppState.totalSlides; // Evalúa condición
        AppState.currentSlide = n; // Asigna valor

        slides.forEach((s, idx) => s.classList.toggle('active', idx + 1 === n)); // Modifica clases CSS del elemento
        if (progressBar) progressBar.style.width = `${(n / AppState.totalSlides) * 100}%`; // Evalúa condición
        if (slideIndicator) slideIndicator.textContent = `${n} / ${AppState.totalSlides}`; // Evalúa condición
        if (btnPrev) btnPrev.disabled = n === 1; // Evalúa condición
        if (btnNext) btnNext.disabled = n === AppState.totalSlides; // Evalúa condición

        if (overviewGrid) { // Evalúa condición
            overviewGrid.querySelectorAll('.overview-card').forEach((card, idx) => { // Instrucción JavaScript
                card.classList.toggle('active', idx + 1 === n); // Modifica clases CSS del elemento
            });
        }

        SoundFX.beep(320, 480, 0.12); // Ejecuta llamada o método
        if (AppState.viewMode === 'slides') window.scrollTo({ top: 0, behavior: 'smooth' }); // Evalúa condición
    }

    // Genera las tarjetas del modal de índice rápido
    if (overviewGrid) { // Evalúa condición
        slides.forEach((s, idx) => { // Instrucción JavaScript
            const card = document.createElement('button'); // Crea nuevo elemento DOM "card"
            card.type = 'button'; // Asigna valor
            card.className = 'overview-card'; // Asigna valor
            const title = s.dataset.title || `Diapositiva ${idx + 1}`; // Declara e inicializa "title"
            card.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`; // Actualiza contenido en el DOM
            card.addEventListener('click', () => { // Registra escuchador de eventos
                if (AppState.viewMode === 'guide') toggleMode(); // Evalúa condición
                goToSlide(idx + 1); // Ejecuta llamada o método
                overviewModal.classList.remove('open'); // Modifica clases CSS del elemento
            });
            overviewGrid.appendChild(card); // Inserta nodo en el DOM
        });
    }

    // Alterna entre Modo Diapositivas y Modo Guía continua
    function toggleMode() { // Declara función
        AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides'; // Asigna valor
        document.body.classList.toggle('mode-presentation', AppState.viewMode === 'slides'); // Modifica clases CSS del elemento
        document.body.classList.toggle('mode-guide', AppState.viewMode === 'guide'); // Modifica clases CSS del elemento
        if (modeIcon) modeIcon.textContent = AppState.viewMode === 'slides' ? '📑' : '🎞️'; // Evalúa condición
        if (modeText) modeText.textContent = AppState.viewMode === 'slides' ? 'Modo Guía' : 'Modo Slides'; // Evalúa condición
        SoundFX.beep(480, 360, 0.1); // Ejecuta llamada o método
    }

    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(AppState.currentSlide - 1)); // Evalúa condición
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(AppState.currentSlide + 1)); // Evalúa condición
    if (btnToggleMode) btnToggleMode.addEventListener('click', toggleMode); // Evalúa condición
    if (btnToggleSound && soundIcon) { // Evalúa condición
        btnToggleSound.addEventListener('click', () => { // Registra escuchador de eventos
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
        });
    }
    if (btnOverview && overviewModal) { // Evalúa condición
        btnOverview.addEventListener('click', () => overviewModal.classList.toggle('open')); // Registra escuchador de eventos
        overviewModal.addEventListener('click', (e) => { // Registra escuchador de eventos
            if (e.target === overviewModal) overviewModal.classList.remove('open'); // Evalúa condición
        });
    }
    if (btnCloseOverview && overviewModal) { // Evalúa condición
        btnCloseOverview.addEventListener('click', () => overviewModal.classList.remove('open')); // Registra escuchador de eventos
    }
    if (btnFullscreen) { // Evalúa condición
        btnFullscreen.addEventListener('click', () => { // Registra escuchador de eventos
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); // Evalúa condición
            else document.exitFullscreen?.(); // Rama alternativa
        });
    }
    if (btnGoLab) { // Evalúa condición
        btnGoLab.addEventListener('click', () => { // Registra escuchador de eventos
            const labIdx = slides.findIndex(s => s.dataset.lab === 'true'); // Define función flecha "labIdx"
            if (labIdx !== -1) { // Evalúa condición
                if (AppState.viewMode === 'guide') slides[labIdx].scrollIntoView({ behavior: 'smooth' }); // Evalúa condición
                else goToSlide(labIdx + 1); // Rama alternativa
            }
        });
    }

    // Atajos de teclado globales
    document.addEventListener('keydown', (e) => { // Registra escuchador de eventos
        const tag = document.activeElement?.tagName; // Declara e inicializa "tag"
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return; // Evalúa condición

        if (e.key === 'ArrowRight' || e.key === ' ') { // Evalúa condición
            if (AppState.viewMode === 'slides') { e.preventDefault(); goToSlide(AppState.currentSlide + 1); }
        } else if (e.key === 'ArrowLeft') { // Instrucción JavaScript
            if (AppState.viewMode === 'slides') { e.preventDefault(); goToSlide(AppState.currentSlide - 1); }
        } else if (e.key.toLowerCase() === 'o' && overviewModal) { // Instrucción JavaScript
            overviewModal.classList.toggle('open'); // Modifica clases CSS del elemento
        } else if (e.key === 'Escape' && overviewModal) { // Instrucción JavaScript
            overviewModal.classList.remove('open'); // Modifica clases CSS del elemento
        } else if (e.key.toLowerCase() === 'f') { // Instrucción JavaScript
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); // Evalúa condición
            else document.exitFullscreen?.(); // Rama alternativa
        }
    });

    // =========================================================================
    // LABORATORIO EN VIVO DE window.screen
    // =========================================================================
    const mTotal = document.getElementById('mTotal'); // Obtiene referencia DOM para "mTotal"
    const mAvail = document.getElementById('mAvail'); // Obtiene referencia DOM para "mAvail"
    const mColorOrient = document.getElementById('mColorOrient'); // Obtiene referencia DOM para "mColorOrient"
    const screenConsole = document.getElementById('screenConsole'); // Obtiene referencia DOM para "screenConsole"
    let ultimoReporte = {}; // Declara e inicializa "ultimoReporte"

    function actualizarMetricasScreen() { // Declara función
        const dpr = window.devicePixelRatio || 1; // Declara e inicializa "dpr"
        const barraH = screen.height - screen.availHeight; // Declara e inicializa "barraH"
        const barraW = screen.width - screen.availWidth; // Declara e inicializa "barraW"
        const orient = screen.orientation?.type || 'no disponible'; // Declara e inicializa "orient"
        const angulo = screen.orientation?.angle ?? 0; // Declara e inicializa "angulo"

        ultimoReporte = { // Asigna valor
            screen: { // Instrucción JavaScript
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: `${orient} (${angulo}°)`
            },
            window: { // Instrucción JavaScript
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                devicePixelRatio: dpr
            },
            hardwareFisicoEstimado: `${Math.round(screen.width * dpr)} x ${Math.round(screen.height * dpr)} px`,
            espacioBarraSO: `${barraW}px ancho / ${barraH}px alto`
        };

        if (mTotal) mTotal.textContent = `${screen.width} × ${screen.height} px`; // Evalúa condición
        if (mAvail) mAvail.textContent = `${screen.availWidth} × ${screen.availHeight} px`; // Evalúa condición
        if (mColorOrient) mColorOrient.textContent = `${screen.colorDepth} bits · ${orient} (${angulo}°)`; // Evalúa condición
        if (screenConsole) screenConsole.textContent = JSON.stringify(ultimoReporte, null, 2); // Evalúa condición
    }

    document.getElementById('btnRefreshScreen')?.addEventListener('click', () => { // Registra escuchador de eventos
        actualizarMetricasScreen(); // Ejecuta llamada o método
        SoundFX.beep(520, 680, 0.09); // Ejecuta llamada o método
    });

    document.getElementById('btnCopyScreen')?.addEventListener('click', () => { // Registra escuchador de eventos
        navigator.clipboard?.writeText(JSON.stringify(ultimoReporte, null, 2)); // Ejecuta llamada o método
        SoundFX.beep(600, 760, 0.08); // Ejecuta llamada o método
    });

    window.addEventListener('resize', actualizarMetricasScreen); // Registra escuchador de eventos
    screen.orientation?.addEventListener('change', actualizarMetricasScreen); // Registra escuchador de eventos
    actualizarMetricasScreen(); // Ejecuta llamada o método

    // =========================================================================
    // QUIZ INTERACTIVO
    // =========================================================================
    const quizBox = document.getElementById('quizBox'); // Obtiene referencia DOM para "quizBox"
    if (quizBox) { // Evalúa condición
        const scoreEl = document.getElementById('quizScore'); // Obtiene referencia DOM para "scoreEl"
        const cards = Array.from(quizBox.querySelectorAll('[data-answer]')); // Obtiene referencia DOM para "cards"
        let okCount = 0; // Declara e inicializa "okCount"

        cards.forEach(card => { // Instrucción JavaScript
            const ans = card.dataset.answer; // Declara e inicializa "ans"
            const msg = card.querySelector('.quiz-msg'); // Obtiene referencia DOM para "msg"
            const opts = Array.from(card.querySelectorAll('.quiz-opt')); // Obtiene referencia DOM para "opts"
            opts.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', () => { // Registra escuchador de eventos
                    if (card.dataset.done === 'true') return; // Evalúa condición
                    card.dataset.done = 'true'; // Asigna valor
                    const right = btn.dataset.opt === ans; // Declara e inicializa "right"
                    opts.forEach(b => { b.disabled = true; }); // Ejecuta llamada o método
                    if (right) { // Evalúa condición
                        okCount++; // Instrucción JavaScript
                        btn.style.borderColor = '#00ff88'; // Asigna valor
                        btn.style.color = '#00ff88'; // Asigna valor
                        msg.textContent = '✅ ¡Correcto!'; // Actualiza contenido en el DOM
                        msg.style.color = '#00ff88'; // Asigna valor
                        SoundFX.beep(520, 740, 0.12); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        btn.style.borderColor = '#ff3358'; // Asigna valor
                        btn.style.color = '#ff3358'; // Asigna valor
                        msg.textContent = '❌ Revisa la teoría de las diapositivas anteriores.'; // Actualiza contenido en el DOM
                        msg.style.color = '#ff3358'; // Asigna valor
                        SoundFX.beep(240, 170, 0.14); // Ejecuta llamada o método
                    }
                    if (scoreEl) scoreEl.textContent = `Puntaje: ${okCount} / ${cards.length}`; // Evalúa condición
                });
            });
        });
    }

    // Inicia en la diapositiva 1
    goToSlide(1); // Ejecuta llamada o método
})(); // Ejecuta llamada o método
