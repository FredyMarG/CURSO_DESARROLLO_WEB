/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: OBJETO SCREEN (window.screen)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO EN VIVO, QUIZ Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
(function () {
    // Activamos el modo estricto para prevenir errores silenciosos
    'use strict'; // Activa el modo estricto de JavaScript

    // Estado centralizado de la presentación
    const AppState = {
        currentSlide: 1,
        totalSlides: document.querySelectorAll('.slide').length,
        viewMode: 'slides',
        soundEnabled: true
    };

    // Referencias del DOM para navegación y controles
    const slides = Array.from(document.querySelectorAll('.slide')); // Declara e inicializa variable local
    const progressBar = document.getElementById('progressBar'); // Declara e inicializa variable local
    const slideIndicator = document.getElementById('slideIndicator'); // Declara e inicializa variable local
    const btnPrev = document.getElementById('btnPrev'); // Declara e inicializa variable local
    const btnNext = document.getElementById('btnNext'); // Declara e inicializa variable local
    const btnToggleMode = document.getElementById('btnToggleMode'); // Declara e inicializa variable local
    const modeIcon = document.getElementById('modeIcon'); // Declara e inicializa variable local
    const modeText = document.getElementById('modeText'); // Declara e inicializa variable local
    const btnToggleSound = document.getElementById('btnToggleSound'); // Declara e inicializa variable local
    const soundIcon = document.getElementById('soundIcon'); // Declara e inicializa variable local
    const btnOverview = document.getElementById('btnOverview'); // Declara e inicializa variable local
    const btnCloseOverview = document.getElementById('btnCloseOverview'); // Declara e inicializa variable local
    const overviewModal = document.getElementById('overviewModal'); // Declara e inicializa variable local
    const overviewGrid = document.getElementById('overviewGrid'); // Declara e inicializa variable local
    const btnFullscreen = document.getElementById('btnFullscreen'); // Declara e inicializa variable local
    const btnGoLab = document.getElementById('btnGoLab'); // Declara e inicializa variable local

    // Sintetizador ligero de sonido mediante Web Audio API
    const SoundFX = {
        ctx: null,
        beep(f1, f2, dur) {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            const AudioCtx = window.AudioContext || window.webkitAudioContext; // Declara e inicializa variable local
            if (!AudioCtx) return; // Evalúa condición lógica
            if (!this.ctx) this.ctx = new AudioCtx(); // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            const now = this.ctx.currentTime; // Declara e inicializa variable local
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f1, now);
            osc.frequency.exponentialRampToValueAtTime(f2, now + dur);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + dur);
        }
    };

    // Cambia a la diapositiva solicitada y actualiza barra de progreso y botones
    function goToSlide(n) { // Define función reutilizable
        if (n < 1) n = 1; // Evalúa condición lógica
        if (n > AppState.totalSlides) n = AppState.totalSlides; // Evalúa condición lógica
        AppState.currentSlide = n;

        slides.forEach((s, idx) => s.classList.toggle('active', idx + 1 === n));
        if (progressBar) progressBar.style.width = `${(n / AppState.totalSlides) * 100}%`; // Evalúa condición lógica
        if (slideIndicator) slideIndicator.textContent = `${n} / ${AppState.totalSlides}`; // Evalúa condición lógica
        if (btnPrev) btnPrev.disabled = n === 1; // Evalúa condición lógica
        if (btnNext) btnNext.disabled = n === AppState.totalSlides; // Evalúa condición lógica

        if (overviewGrid) { // Evalúa condición lógica
            overviewGrid.querySelectorAll('.overview-card').forEach((card, idx) => {
                card.classList.toggle('active', idx + 1 === n);
            });
        }

        SoundFX.beep(320, 480, 0.12);
        if (AppState.viewMode === 'slides') window.scrollTo({ top: 0, behavior: 'smooth' }); // Evalúa condición lógica
    }

    // Genera las tarjetas del modal de índice rápido
    if (overviewGrid) { // Evalúa condición lógica
        slides.forEach((s, idx) => {
            const card = document.createElement('button'); // Declara e inicializa variable local
            card.type = 'button';
            card.className = 'overview-card';
            const title = s.dataset.title || `Diapositiva ${idx + 1}`; // Declara e inicializa variable local
            card.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`; // Actualiza contenido en el DOM
            card.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                if (AppState.viewMode === 'guide') toggleMode(); // Evalúa condición lógica
                goToSlide(idx + 1);
                overviewModal.classList.remove('open');
            });
            overviewGrid.appendChild(card);
        });
    }

    // Alterna entre Modo Diapositivas y Modo Guía continua
    function toggleMode() { // Define función reutilizable
        AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides';
        document.body.classList.toggle('mode-presentation', AppState.viewMode === 'slides');
        document.body.classList.toggle('mode-guide', AppState.viewMode === 'guide');
        if (modeIcon) modeIcon.textContent = AppState.viewMode === 'slides' ? '📑' : '🎞️'; // Evalúa condición lógica
        if (modeText) modeText.textContent = AppState.viewMode === 'slides' ? 'Modo Guía' : 'Modo Slides'; // Evalúa condición lógica
        SoundFX.beep(480, 360, 0.1);
    }

    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(AppState.currentSlide - 1)); // Evalúa condición lógica
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(AppState.currentSlide + 1)); // Evalúa condición lógica
    if (btnToggleMode) btnToggleMode.addEventListener('click', toggleMode); // Evalúa condición lógica
    if (btnToggleSound && soundIcon) { // Evalúa condición lógica
        btnToggleSound.addEventListener('click', () => { // Registra escuchador de evento en el DOM
            AppState.soundEnabled = !AppState.soundEnabled;
            soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
        });
    }
    if (btnOverview && overviewModal) { // Evalúa condición lógica
        btnOverview.addEventListener('click', () => overviewModal.classList.toggle('open'));
        overviewModal.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
            if (e.target === overviewModal) overviewModal.classList.remove('open'); // Evalúa condición lógica
        });
    }
    if (btnCloseOverview && overviewModal) { // Evalúa condición lógica
        btnCloseOverview.addEventListener('click', () => overviewModal.classList.remove('open'));
    }
    if (btnFullscreen) { // Evalúa condición lógica
        btnFullscreen.addEventListener('click', () => { // Registra escuchador de evento en el DOM
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); // Evalúa condición lógica
            else document.exitFullscreen?.(); // Rama alternativa
        });
    }
    if (btnGoLab) { // Evalúa condición lógica
        btnGoLab.addEventListener('click', () => { // Registra escuchador de evento en el DOM
            const labIdx = slides.findIndex(s => s.dataset.lab === 'true'); // Declara e inicializa variable local
            if (labIdx !== -1) { // Evalúa condición lógica
                if (AppState.viewMode === 'guide') slides[labIdx].scrollIntoView({ behavior: 'smooth' }); // Evalúa condición lógica
                else goToSlide(labIdx + 1); // Rama alternativa
            }
        });
    }

    // Atajos de teclado globales
    document.addEventListener('keydown', (e) => { // Registra escuchador de evento en el DOM
        const tag = document.activeElement?.tagName; // Declara e inicializa variable local
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return; // Evalúa condición lógica

        if (e.key === 'ArrowRight' || e.key === ' ') { // Evalúa condición lógica
            if (AppState.viewMode === 'slides') { e.preventDefault(); goToSlide(AppState.currentSlide + 1); }
        } else if (e.key === 'ArrowLeft') {
            if (AppState.viewMode === 'slides') { e.preventDefault(); goToSlide(AppState.currentSlide - 1); }
        } else if (e.key.toLowerCase() === 'o' && overviewModal) {
            overviewModal.classList.toggle('open');
        } else if (e.key === 'Escape' && overviewModal) {
            overviewModal.classList.remove('open');
        } else if (e.key.toLowerCase() === 'f') {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); // Evalúa condición lógica
            else document.exitFullscreen?.(); // Rama alternativa
        }
    });

    // =========================================================================
    // LABORATORIO EN VIVO DE window.screen
    // =========================================================================
    const mTotal = document.getElementById('mTotal'); // Declara e inicializa variable local
    const mAvail = document.getElementById('mAvail'); // Declara e inicializa variable local
    const mColorOrient = document.getElementById('mColorOrient'); // Declara e inicializa variable local
    const screenConsole = document.getElementById('screenConsole'); // Declara e inicializa variable local
    let ultimoReporte = {}; // Declara e inicializa variable local

    function actualizarMetricasScreen() { // Define función reutilizable
        const dpr = window.devicePixelRatio || 1; // Declara e inicializa variable local
        const barraH = screen.height - screen.availHeight; // Declara e inicializa variable local
        const barraW = screen.width - screen.availWidth; // Declara e inicializa variable local
        const orient = screen.orientation?.type || 'no disponible'; // Declara e inicializa variable local
        const angulo = screen.orientation?.angle ?? 0; // Declara e inicializa variable local

        ultimoReporte = {
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: `${orient} (${angulo}°)`
            },
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                devicePixelRatio: dpr
            },
            hardwareFisicoEstimado: `${Math.round(screen.width * dpr)} x ${Math.round(screen.height * dpr)} px`,
            espacioBarraSO: `${barraW}px ancho / ${barraH}px alto`
        };

        if (mTotal) mTotal.textContent = `${screen.width} × ${screen.height} px`; // Evalúa condición lógica
        if (mAvail) mAvail.textContent = `${screen.availWidth} × ${screen.availHeight} px`; // Evalúa condición lógica
        if (mColorOrient) mColorOrient.textContent = `${screen.colorDepth} bits · ${orient} (${angulo}°)`; // Evalúa condición lógica
        if (screenConsole) screenConsole.textContent = JSON.stringify(ultimoReporte, null, 2); // Evalúa condición lógica
    }

    document.getElementById('btnRefreshScreen')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        actualizarMetricasScreen();
        SoundFX.beep(520, 680, 0.09);
    });

    document.getElementById('btnCopyScreen')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        navigator.clipboard?.writeText(JSON.stringify(ultimoReporte, null, 2));
        SoundFX.beep(600, 760, 0.08);
    });

    window.addEventListener('resize', actualizarMetricasScreen);
    screen.orientation?.addEventListener('change', actualizarMetricasScreen);
    actualizarMetricasScreen();

    // =========================================================================
    // QUIZ INTERACTIVO
    // =========================================================================
    const quizBox = document.getElementById('quizBox'); // Declara e inicializa variable local
    if (quizBox) { // Evalúa condición lógica
        const scoreEl = document.getElementById('quizScore'); // Declara e inicializa variable local
        const cards = Array.from(quizBox.querySelectorAll('[data-answer]')); // Declara e inicializa variable local
        let okCount = 0; // Declara e inicializa variable local

        cards.forEach(card => {
            const ans = card.dataset.answer; // Declara e inicializa variable local
            const msg = card.querySelector('.quiz-msg'); // Declara e inicializa variable local
            const opts = Array.from(card.querySelectorAll('.quiz-opt')); // Declara e inicializa variable local
            opts.forEach(btn => {
                btn.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    if (card.dataset.done === 'true') return; // Evalúa condición lógica
                    card.dataset.done = 'true';
                    const right = btn.dataset.opt === ans; // Declara e inicializa variable local
                    opts.forEach(b => { b.disabled = true; });
                    if (right) { // Evalúa condición lógica
                        okCount++;
                        btn.style.borderColor = '#00ff88';
                        btn.style.color = '#00ff88';
                        msg.textContent = '✅ ¡Correcto!'; // Actualiza contenido en el DOM
                        msg.style.color = '#00ff88';
                        SoundFX.beep(520, 740, 0.12);
                    } else {
                        btn.style.borderColor = '#ff3358';
                        btn.style.color = '#ff3358';
                        msg.textContent = '❌ Revisa la teoría de las diapositivas anteriores.'; // Actualiza contenido en el DOM
                        msg.style.color = '#ff3358';
                        SoundFX.beep(240, 170, 0.14);
                    }
                    if (scoreEl) scoreEl.textContent = `Puntaje: ${okCount} / ${cards.length}`; // Evalúa condición lógica
                });
            });
        });
    }

    // Inicia en la diapositiva 1
    goToSlide(1);
})();

