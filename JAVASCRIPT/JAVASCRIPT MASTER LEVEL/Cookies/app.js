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
    'use strict'; // Activa el modo estricto de JavaScript

    // Estado centralizado de la presentación
    const AppState = {
        currentSlide: 1,
        totalSlides: document.querySelectorAll('.slide').length,
        viewMode: 'slides',
        soundEnabled: true,
        overviewOpen: false
    };

    // Referencias principales de navegación
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

    // Sintetizador procedural ligero con Web Audio API
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

    // Navega a la diapositiva n y actualiza la interfaz
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

    // Construye dinámicamente la cuadrícula de índice rápido
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

    // Alterna entre modo diapositivas y modo guía continua
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

    // Atajos de teclado
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
    // LABORATORIO INTERACTIVO DE COOKIES (document.cookie + respaldo file://)
    // =========================================================================
    const ckName = document.getElementById('ckName'); // Declara e inicializa variable local
    const ckValue = document.getElementById('ckValue'); // Declara e inicializa variable local
    const ckMaxAge = document.getElementById('ckMaxAge'); // Declara e inicializa variable local
    const ckSameSite = document.getElementById('ckSameSite'); // Declara e inicializa variable local
    const ckEncode = document.getElementById('ckEncode'); // Declara e inicializa variable local
    const ckConsole = document.getElementById('ckConsole'); // Declara e inicializa variable local

    // Almacén espejo en memoria por si el navegador bloquea document.cookie en protocolo file://
    const memoryCookies = new Map(); // Declara e inicializa variable local

    function escribirCookie(nombre, valor, maxAge, sameSite, usarEncode) { // Define función reutilizable
        const k = usarEncode ? encodeURIComponent(nombre) : nombre; // Declara e inicializa variable local
        const v = usarEncode ? encodeURIComponent(valor) : valor; // Declara e inicializa variable local
        const cadena = `${k}=${v}; max-age=${maxAge}; path=/; SameSite=${sameSite}`; // Declara e inicializa variable local
        document.cookie = cadena;

        if (Number(maxAge) <= 0) memoryCookies.delete(k); // Evalúa condición lógica
        else memoryCookies.set(k, v); // Rama alternativa
        return cadena; // Retorna el resultado de la función
    }

    function leerCookiesActuales() { // Define función reutilizable
        const nativas = document.cookie ? document.cookie.split('; ').filter(Boolean) : []; // Declara e inicializa variable local
        if (nativas.length > 0) return nativas.join('; '); // Evalúa condición lógica
        // Si file:// bloquea document.cookie, muestra las del almacén espejo
        return Array.from(memoryCookies.entries()).map(([k, v]) => `${k}=${v}`).join('; '); // Retorna el resultado de la función
    }

    function obtenerPorNombre(nombre) { // Define función reutilizable
        const clave = encodeURIComponent(nombre) + '='; // Declara e inicializa variable local
        const raw = leerCookiesActuales(); // Declara e inicializa variable local
        for (const item of raw.split('; ')) { // Itera sobre elementos o rango
            if (item.startsWith(clave)) return decodeURIComponent(item.slice(clave.length)); // Evalúa condición lógica
            if (item.startsWith(nombre + '=')) return item.slice(nombre.length + 1); // Evalúa condición lógica
        }
        return null; // Retorna el resultado de la función
    }

    function logLab(accion) { // Define función reutilizable
        if (!ckConsole) return; // Evalúa condición lógica
        const actuales = leerCookiesActuales() || '(sin cookies activas)'; // Declara e inicializa variable local
        ckConsole.textContent = `${accion}\n\n📌 document.cookie actual:\n${actuales}`; // Actualiza contenido en el DOM
    }

    document.getElementById('btnSetCookie')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        const n = (ckName.value || '').trim(); // Declara e inicializa variable local
        if (!n) return logLab('⚠️ Ingresa un nombre de cookie.'); // Evalúa condición lógica
        const cadena = escribirCookie(n, ckValue.value, ckMaxAge.value || 3600, ckSameSite.value, ckEncode.checked); // Declara e inicializa variable local
        SoundFX.beep(520, 680, 0.1);
        logLab(`✅ Cookie guardada:\ndocument.cookie = "${cadena}"`);
    });

    document.getElementById('btnGetCookie')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        const n = (ckName.value || '').trim(); // Declara e inicializa variable local
        const val = obtenerPorNombre(n); // Declara e inicializa variable local
        SoundFX.beep(440, 560, 0.08);
        logLab(val !== null ? `🔍 obtenerCookie("${n}") => "${val}"` : `❌ La cookie "${n}" no existe.`);
    });

    document.getElementById('btnDelCookie')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        const n = (ckName.value || '').trim(); // Declara e inicializa variable local
        if (!n) return; // Evalúa condición lógica
        const cadena = escribirCookie(n, '', 0, ckSameSite.value, true); // Declara e inicializa variable local
        SoundFX.beep(260, 180, 0.12);
        logLab(`🗑️ Cookie eliminada:\ndocument.cookie = "${cadena}"`);
    });

    document.getElementById('presetTema')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        ckName.value = 'tema';
        ckValue.value = 'oscuro-neon';
        ckMaxAge.value = '86400';
        ckEncode.checked = true;
        document.getElementById('btnSetCookie').click(); // Obtiene referencia al elemento del DOM
    });

    document.getElementById('presetEspecial')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        ckName.value = 'perfil';
        ckValue.value = 'María José; rol=admin';
        ckMaxAge.value = '3600';
        ckEncode.checked = true;
        document.getElementById('btnSetCookie').click(); // Obtiene referencia al elemento del DOM
    });

    document.getElementById('presetBorrar')?.addEventListener('click', () => { // Registra escuchador de evento en el DOM
        ['tema', 'perfil'].forEach(n => escribirCookie(n, '', 0, 'Lax', true));
        logLab('🧹 Cookies de demostración eliminadas.');
    });

    logLab('💡 Listo para probar document.cookie en tiempo real.');

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

