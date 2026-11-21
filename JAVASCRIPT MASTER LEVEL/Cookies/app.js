/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: COOKIES (document.cookie)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO EN VIVO, QUIZ Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
(function () {
    // Activamos el modo estricto para evitar errores silenciosos y variables globales accidentales
    'use strict';

    // Estado centralizado de la presentación
    const AppState = {
        currentSlide: 1,
        totalSlides: document.querySelectorAll('.slide').length,
        viewMode: 'slides',
        soundEnabled: true,
        overviewOpen: false
    };

    // Referencias principales de navegación
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

    // Sintetizador procedural ligero con Web Audio API
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

    // Navega a la diapositiva n y actualiza la interfaz
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

    // Construye dinámicamente la cuadrícula de índice rápido
    if (overviewGrid) {
        slides.forEach((s, idx) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'overview-card';
            const title = s.dataset.title || `Diapositiva ${idx + 1}`;
            card.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`;
            card.addEventListener('click', () => {
                if (AppState.viewMode === 'guide') toggleMode();
                goToSlide(idx + 1);
                overviewModal.classList.remove('open');
            });
            overviewGrid.appendChild(card);
        });
    }

    // Alterna entre modo diapositivas y modo guía continua
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
            soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
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
            else document.exitFullscreen?.();
        });
    }
    if (btnGoLab) {
        btnGoLab.addEventListener('click', () => {
            const labIdx = slides.findIndex(s => s.dataset.lab === 'true');
            if (labIdx !== -1) {
                if (AppState.viewMode === 'guide') slides[labIdx].scrollIntoView({ behavior: 'smooth' });
                else goToSlide(labIdx + 1);
            }
        });
    }

    // Atajos de teclado
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
            else document.exitFullscreen?.();
        }
    });

    // =========================================================================
    // LABORATORIO INTERACTIVO DE COOKIES (document.cookie + respaldo file://)
    // =========================================================================
    const ckName = document.getElementById('ckName');
    const ckValue = document.getElementById('ckValue');
    const ckMaxAge = document.getElementById('ckMaxAge');
    const ckSameSite = document.getElementById('ckSameSite');
    const ckEncode = document.getElementById('ckEncode');
    const ckConsole = document.getElementById('ckConsole');

    // Almacén espejo en memoria por si el navegador bloquea document.cookie en protocolo file://
    const memoryCookies = new Map();

    function escribirCookie(nombre, valor, maxAge, sameSite, usarEncode) {
        const k = usarEncode ? encodeURIComponent(nombre) : nombre;
        const v = usarEncode ? encodeURIComponent(valor) : valor;
        const cadena = `${k}=${v}; max-age=${maxAge}; path=/; SameSite=${sameSite}`;
        document.cookie = cadena;

        if (Number(maxAge) <= 0) memoryCookies.delete(k);
        else memoryCookies.set(k, v);
        return cadena;
    }

    function leerCookiesActuales() {
        const nativas = document.cookie ? document.cookie.split('; ').filter(Boolean) : [];
        if (nativas.length > 0) return nativas.join('; ');
        // Si file:// bloquea document.cookie, muestra las del almacén espejo
        return Array.from(memoryCookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
    }

    function obtenerPorNombre(nombre) {
        const clave = encodeURIComponent(nombre) + '=';
        const raw = leerCookiesActuales();
        for (const item of raw.split('; ')) {
            if (item.startsWith(clave)) return decodeURIComponent(item.slice(clave.length));
            if (item.startsWith(nombre + '=')) return item.slice(nombre.length + 1);
        }
        return null;
    }

    function logLab(accion) {
        if (!ckConsole) return;
        const actuales = leerCookiesActuales() || '(sin cookies activas)';
        ckConsole.textContent = `${accion}\n\n📌 document.cookie actual:\n${actuales}`;
    }

    document.getElementById('btnSetCookie')?.addEventListener('click', () => {
        const n = (ckName.value || '').trim();
        if (!n) return logLab('⚠️ Ingresa un nombre de cookie.');
        const cadena = escribirCookie(n, ckValue.value, ckMaxAge.value || 3600, ckSameSite.value, ckEncode.checked);
        SoundFX.beep(520, 680, 0.1);
        logLab(`✅ Cookie guardada:\ndocument.cookie = "${cadena}"`);
    });

    document.getElementById('btnGetCookie')?.addEventListener('click', () => {
        const n = (ckName.value || '').trim();
        const val = obtenerPorNombre(n);
        SoundFX.beep(440, 560, 0.08);
        logLab(val !== null ? `🔍 obtenerCookie("${n}") => "${val}"` : `❌ La cookie "${n}" no existe.`);
    });

    document.getElementById('btnDelCookie')?.addEventListener('click', () => {
        const n = (ckName.value || '').trim();
        if (!n) return;
        const cadena = escribirCookie(n, '', 0, ckSameSite.value, true);
        SoundFX.beep(260, 180, 0.12);
        logLab(`🗑️ Cookie eliminada:\ndocument.cookie = "${cadena}"`);
    });

    document.getElementById('presetTema')?.addEventListener('click', () => {
        ckName.value = 'tema';
        ckValue.value = 'oscuro-neon';
        ckMaxAge.value = '86400';
        ckEncode.checked = true;
        document.getElementById('btnSetCookie').click();
    });

    document.getElementById('presetEspecial')?.addEventListener('click', () => {
        ckName.value = 'perfil';
        ckValue.value = 'María José; rol=admin';
        ckMaxAge.value = '3600';
        ckEncode.checked = true;
        document.getElementById('btnSetCookie').click();
    });

    document.getElementById('presetBorrar')?.addEventListener('click', () => {
        ['tema', 'perfil'].forEach(n => escribirCookie(n, '', 0, 'Lax', true));
        logLab('🧹 Cookies de demostración eliminadas.');
    });

    logLab('💡 Listo para probar document.cookie en tiempo real.');

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
                        msg.textContent = '✅ ¡Correcto!';
                        msg.style.color = '#00ff88';
                        SoundFX.beep(520, 740, 0.12);
                    } else {
                        btn.style.borderColor = '#ff3358';
                        btn.style.color = '#ff3358';
                        msg.textContent = '❌ Revisa la teoría de las diapositivas anteriores.';
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
