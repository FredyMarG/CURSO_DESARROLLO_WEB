/**
 * ============================================================================
 * MOTOR DE PRESENTACIONES INTERACTIVAS — HTML5 Y CSS3
 * Controla navegación de diapositivas, modo guía, índice rápido, sonido y lab
 * ============================================================================
 */
(function () {
    'use strict';

    // Lista de todas las diapositivas de la página actual
    const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlide = 1;
    let viewMode = 'slides';
    let soundEnabled = true;

    // Referencias a elementos de la barra superior y controles
    const progressBar = document.getElementById('progressBar');
    const slideIndicator = document.getElementById('slideIndicator');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnToggleMode = document.getElementById('btnToggleMode');
    const modeIcon = document.getElementById('modeIcon');
    const modeText = document.getElementById('modeText');
    const btnOverview = document.getElementById('btnOverview');
    const overviewModal = document.getElementById('overviewModal');
    const overviewGrid = document.getElementById('overviewGrid');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const btnToggleSound = document.getElementById('btnToggleSound');
    const soundIcon = document.getElementById('soundIcon');
    const btnGoLab = document.getElementById('btnGoLab');

    // Sintetizador ligero de sonido para transiciones y clics
    const SoundFX = {
        ctx: null,
        beep(freqStart, freqEnd, dur) {
            if (!soundEnabled) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!this.ctx) this.ctx = new AudioCtx();
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freqStart, now);
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + dur);
        }
    };

    // Muestra la diapositiva indicada y actualiza barra de progreso y botones
    function goToSlide(n) {
        if (n < 1) n = 1;
        if (n > totalSlides) n = totalSlides;
        currentSlide = n;

        slides.forEach((s, idx) => {
            s.classList.toggle('active', idx + 1 === currentSlide);
        });

        if (progressBar) progressBar.style.width = `${(currentSlide / totalSlides) * 100}%`;
        if (slideIndicator) slideIndicator.textContent = `${currentSlide} / ${totalSlides}`;
        if (btnPrev) btnPrev.disabled = currentSlide === 1;
        if (btnNext) btnNext.disabled = currentSlide === totalSlides;

        // Sincroniza tarjeta activa en el modal de índice
        if (overviewGrid) {
            overviewGrid.querySelectorAll('.overview-item').forEach((item, idx) => {
                item.classList.toggle('active', idx + 1 === currentSlide);
            });
        }

        SoundFX.beep(340, 480, 0.12);
        if (viewMode === 'slides') window.scrollTo({ top: 0, behavior: 'smooth' });
        if (currentSlide === totalSlides && totalSlides > 0) saveProgress({ completed: true });
    }

    // Guarda el progreso del módulo actual en localStorage
    function getModuleKey() {
        const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
        const idx = parts.findIndex(p => p === 'HTML y CSS' || p === 'JAVASCRIPT MID LEVEL' || p === 'JAVASCRIPT MASTER LEVEL' || p === 'JAVASCRIPT JUNIOR LEVEL');
        return idx !== -1 ? parts.slice(idx).join('/') : parts.slice(-2).join('/');
    }

    function saveProgress(patch) {
        try {
            const raw = localStorage.getItem('curso_web_progress');
            const data = raw ? JSON.parse(raw) : {};
            const key = getModuleKey();
            data[key] = Object.assign({ updatedAt: Date.now() }, data[key] || {}, patch);
            localStorage.setItem('curso_web_progress', JSON.stringify(data));
        } catch (_) {}
    }

    // Construye dinámicamente la cuadrícula de diapositivas (Overview)
    if (overviewGrid) {
        slides.forEach((s, idx) => {
            const btn = document.createElement('button');
            btn.className = 'overview-item';
            const title = s.dataset.title || `Diapositiva ${idx + 1}`;
            btn.innerHTML = `<span class="overview-num">SLIDE ${idx + 1}</span><strong>${title}</strong>`;
            btn.addEventListener('click', () => {
                if (viewMode === 'guide') toggleMode();
                goToSlide(idx + 1);
                overviewModal.classList.remove('open');
            });
            overviewGrid.appendChild(btn);
        });
    }

    function toggleMode() {
        viewMode = viewMode === 'slides' ? 'guide' : 'slides';
        document.body.classList.toggle('mode-presentation', viewMode === 'slides');
        document.body.classList.toggle('mode-guide', viewMode === 'guide');
        if (modeIcon) modeIcon.textContent = viewMode === 'slides' ? '📑' : '🎞️';
        if (modeText) modeText.textContent = viewMode === 'slides' ? 'Modo Guía' : 'Modo Slides';
        SoundFX.beep(480, 360, 0.1);
    }

    // Eventos de botones
    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    if (btnToggleMode) btnToggleMode.addEventListener('click', toggleMode);
    if (btnOverview && overviewModal) {
        btnOverview.addEventListener('click', () => overviewModal.classList.toggle('open'));
        overviewModal.addEventListener('click', (e) => {
            if (e.target === overviewModal) overviewModal.classList.remove('open');
        });
    }
    if (btnToggleSound && soundIcon) {
        btnToggleSound.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        });
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
                if (viewMode === 'guide') {
                    slides[labIdx].scrollIntoView({ behavior: 'smooth' });
                } else {
                    goToSlide(labIdx + 1);
                }
            }
        });
    }

    // Navegación por teclado (evitando interceptar cuando se escribe o interactúa en controles)
    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (viewMode === 'slides') { e.preventDefault(); goToSlide(currentSlide + 1); }
        } else if (e.key === 'ArrowLeft') {
            if (viewMode === 'slides') { e.preventDefault(); goToSlide(currentSlide - 1); }
        } else if (e.key.toLowerCase() === 'o' && overviewModal) {
            overviewModal.classList.toggle('open');
        } else if (e.key === 'Escape' && overviewModal) {
            overviewModal.classList.remove('open');
        } else if (e.key.toLowerCase() === 'f') {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.();
        }
    });

    // Inicializa el laboratorio HTML/CSS en vivo si existe en la página
    const labEditor = document.getElementById('labEditor');
    const labPreview = document.getElementById('labPreview');
    const presetBtns = document.querySelectorAll('.preset-btn[data-code]');

    function updatePreview() {
        if (labEditor && labPreview) {
            labPreview.srcdoc = labEditor.value;
        }
    }

    if (labEditor && labPreview) {
        labEditor.addEventListener('input', updatePreview);
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                labEditor.value = btn.dataset.code;
                updatePreview();
                SoundFX.beep(520, 620, 0.08);
            });
        });
        updatePreview();

        // Botones "Probar este ejemplo en el Lab" desde cualquier diapositiva
        document.querySelectorAll('.try-lab-btn[data-lab-code]').forEach(btn => {
            btn.addEventListener('click', () => {
                labEditor.value = btn.dataset.labCode;
                updatePreview();
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

    // Salto rápido desde tarjetas hero o botones con data-jump="N"
    document.querySelectorAll('[data-jump]').forEach(el => {
        el.addEventListener('click', () => {
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

    // Motor de Quiz Interactivo (.quiz-container)
    document.querySelectorAll('.quiz-container').forEach(container => {
        const questions = Array.from(container.querySelectorAll('.quiz-question'));
        const scoreEl = container.querySelector('.quiz-score');
        const resetBtn = container.querySelector('.quiz-reset-btn');
        let correctCount = 0;
        let answeredCount = 0;

        function updateScore() {
            if (scoreEl) {
                scoreEl.textContent = `Puntaje: ${correctCount} / ${questions.length} (${answeredCount} respondidas)`;
            }
        }

        questions.forEach(q => {
            const answer = q.dataset.answer;
            const explainOk = q.dataset.ok || '¡Correcto! Excelente comprensión del concepto.';
            const explainErr = q.dataset.err || 'Revisa la explicación de las diapositivas anteriores e inténtalo de nuevo.';
            const options = Array.from(q.querySelectorAll('.quiz-option'));
            const feedback = q.querySelector('.quiz-feedback');

            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    if (q.dataset.answered === 'true') return;
                    q.dataset.answered = 'true';
                    answeredCount++;

                    const isRight = opt.dataset.opt === answer;
                    options.forEach(o => {
                        o.disabled = true;
                        if (o.dataset.opt === answer) o.classList.add('is-correct');
                    });

                    if (isRight) {
                        correctCount++;
                        opt.classList.add('is-correct');
                        if (feedback) {
                            feedback.textContent = `✅ ${explainOk}`;
                            feedback.className = 'quiz-feedback show ok';
                        }
                        SoundFX.beep(520, 740, 0.14);
                    } else {
                        opt.classList.add('is-wrong');
                        if (feedback) {
                            feedback.textContent = `❌ ${explainErr}`;
                            feedback.className = 'quiz-feedback show err';
                        }
                        SoundFX.beep(240, 170, 0.16);
                    }
                    updateScore();
                    if (answeredCount === questions.length) {
                        saveProgress({ quizScore: correctCount, quizTotal: questions.length, completed: true });
                    }
                });
            });
        });

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

        updateScore();
    });

    // Botón Copiar en todos los bloques de código (.code-block)
    document.querySelectorAll('pre.code-block').forEach(pre => {
        if (pre.parentElement?.classList.contains('code-block-wrap')) return;
        const wrap = document.createElement('div');
        wrap.className = 'code-block-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy-btn';
        btn.textContent = 'Copiar';
        btn.addEventListener('click', () => {
            navigator.clipboard?.writeText(pre.textContent || '');
            btn.textContent = '¡Copiado!';
            SoundFX.beep(600, 760, 0.08);
            setTimeout(() => { btn.textContent = 'Copiar'; }, 1400);
        });
        wrap.appendChild(btn);
    });

    // Arranque en la diapositiva 1
    goToSlide(1);
})();
