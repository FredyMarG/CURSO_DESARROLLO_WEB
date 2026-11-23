/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: HTML5 CANVAS 2D API
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
    const slides = Array.from(document.querySelectorAll('.slide'));
    const progressBar = document.getElementById('progressBar');
    const slideIndicator = document.getElementById('slideIndicator');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnToggleMode = document.getElementById('btnToggleMode');
    const modeIcon = document.getElementById('modeIcon');
    const modeText = document.getElementById('modeText');
    const btnToggleSound = document.getElementById('btnToggleSound');
    const soundIcon = document.getElementById('soundIcon');
    const btnOverview = document.getElementById('btnOverview');
    const btnCloseOverview = document.getElementById('btnCloseOverview');
    const overviewModal = document.getElementById('overviewModal');
    const overviewGrid = document.getElementById('overviewGrid');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const btnGoLab = document.getElementById('btnGoLab');

    // Sintetizador ligero de sonido mediante Web Audio API
    const SoundFX = {
        ctx: null,
        beep(f1, f2, dur) {
            if (!AppState.soundEnabled) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!this.ctx) this.ctx = new AudioCtx();
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
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
    function goToSlide(n) {
        if (n < 1) n = 1;
        if (n > AppState.totalSlides) n = AppState.totalSlides;
        AppState.currentSlide = n;

        slides.forEach((s, idx) => s.classList.toggle('active', idx + 1 === n));
        if (progressBar) progressBar.style.width = `${(n / AppState.totalSlides) * 100}%`;
        if (slideIndicator) slideIndicator.textContent = `${n} / ${AppState.totalSlides}`;
        if (btnPrev) btnPrev.disabled = n === 1;
        if (btnNext) btnNext.disabled = n === AppState.totalSlides;

        if (overviewGrid) {
            overviewGrid.querySelectorAll('.overview-card').forEach((card, idx) => {
                card.classList.toggle('active', idx + 1 === n);
            });
        }

        SoundFX.beep(320, 480, 0.12);
        if (AppState.viewMode === 'slides') window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Genera las tarjetas del modal de índice rápido
    if (overviewGrid) {
        slides.forEach((s, idx) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'overview-card';
            const title = s.dataset.title || `Diapositiva ${idx + 1}`;
            card.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`; // Actualiza contenido en el DOM
            card.addEventListener('click', () => {
                if (AppState.viewMode === 'guide') toggleMode();
                goToSlide(idx + 1);
                overviewModal.classList.remove('open');
            });
            overviewGrid.appendChild(card);
        });
    }

    // Alterna entre Modo Diapositivas y Modo Guía continua
    function toggleMode() {
        AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides';
        document.body.classList.toggle('mode-presentation', AppState.viewMode === 'slides');
        document.body.classList.toggle('mode-guide', AppState.viewMode === 'guide');
        if (modeIcon) modeIcon.textContent = AppState.viewMode === 'slides' ? '📑' : '🎞️';
        if (modeText) modeText.textContent = AppState.viewMode === 'slides' ? 'Modo Guía' : 'Modo Slides';
        SoundFX.beep(480, 360, 0.1);
    }

    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(AppState.currentSlide - 1));
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(AppState.currentSlide + 1));
    if (btnToggleMode) btnToggleMode.addEventListener('click', toggleMode);
    if (btnToggleSound && soundIcon) {
        btnToggleSound.addEventListener('click', () => {
            AppState.soundEnabled = !AppState.soundEnabled;
            soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
        });
    }
    if (btnOverview && overviewModal) {
        btnOverview.addEventListener('click', () => overviewModal.classList.toggle('open'));
        overviewModal.addEventListener('click', (e) => {
            if (e.target === overviewModal) overviewModal.classList.remove('open');
        });
    }
    if (btnCloseOverview && overviewModal) {
        btnCloseOverview.addEventListener('click', () => overviewModal.classList.remove('open'));
    }
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.(); // Rama alternativa
        });
    }
    if (btnGoLab) {
        btnGoLab.addEventListener('click', () => {
            const labIdx = slides.findIndex(s => s.dataset.lab === 'true');
            if (labIdx !== -1) {
                if (AppState.viewMode === 'guide') slides[labIdx].scrollIntoView({ behavior: 'smooth' });
                else goToSlide(labIdx + 1); // Rama alternativa
            }
        });
    }

    // Atajos de teclado globales
    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (AppState.viewMode === 'slides') { e.preventDefault(); goToSlide(AppState.currentSlide + 1); }
        } else if (e.key === 'ArrowLeft') {
            if (AppState.viewMode === 'slides') { e.preventDefault(); goToSlide(AppState.currentSlide - 1); }
        } else if (e.key.toLowerCase() === 'o' && overviewModal) {
            overviewModal.classList.toggle('open');
        } else if (e.key === 'Escape' && overviewModal) {
            overviewModal.classList.remove('open');
        } else if (e.key.toLowerCase() === 'f') {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.(); // Rama alternativa
        }
    });

    // =========================================================================
    // LABORATORIO EN VIVO DE window.screen
    // =========================================================================
    const mTotal = document.getElementById('mTotal');
    const mAvail = document.getElementById('mAvail');
    const mColorOrient = document.getElementById('mColorOrient');
    const screenConsole = document.getElementById('screenConsole');
    let ultimoReporte = {};

    function actualizarMetricasScreen() {
        const dpr = window.devicePixelRatio || 1;
        const barraH = screen.height - screen.availHeight;
        const barraW = screen.width - screen.availWidth;
        const orient = screen.orientation?.type || 'no disponible';
        const angulo = screen.orientation?.angle ?? 0;

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

        if (mTotal) mTotal.textContent = `${screen.width} × ${screen.height} px`;
        if (mAvail) mAvail.textContent = `${screen.availWidth} × ${screen.availHeight} px`;
        if (mColorOrient) mColorOrient.textContent = `${screen.colorDepth} bits · ${orient} (${angulo}°)`;
        if (screenConsole) screenConsole.textContent = JSON.stringify(ultimoReporte, null, 2);
    }

    document.getElementById('btnRefreshScreen')?.addEventListener('click', () => {
        actualizarMetricasScreen();
        SoundFX.beep(520, 680, 0.09);
    });

    document.getElementById('btnCopyScreen')?.addEventListener('click', () => {
        navigator.clipboard?.writeText(JSON.stringify(ultimoReporte, null, 2));
        SoundFX.beep(600, 760, 0.08);
    });

    window.addEventListener('resize', actualizarMetricasScreen);
    screen.orientation?.addEventListener('change', actualizarMetricasScreen);
    actualizarMetricasScreen();

    // =========================================================================
    // QUIZ INTERACTIVO
    // =========================================================================
    const quizBox = document.getElementById('quizBox');
    if (quizBox) {
        const scoreEl = document.getElementById('quizScore');
        const cards = Array.from(quizBox.querySelectorAll('[data-answer]'));
        let okCount = 0;

        cards.forEach(card => {
            const ans = card.dataset.answer;
            const msg = card.querySelector('.quiz-msg');
            const opts = Array.from(card.querySelectorAll('.quiz-opt'));
            opts.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (card.dataset.done === 'true') return;
                    card.dataset.done = 'true';
                    const right = btn.dataset.opt === ans;
                    opts.forEach(b => { b.disabled = true; });
                    if (right) {
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
                    if (scoreEl) scoreEl.textContent = `Puntaje: ${okCount} / ${cards.length}`;
                });
            });
        });
    }

    // Inicia en la diapositiva 1
    goToSlide(1);
})();
