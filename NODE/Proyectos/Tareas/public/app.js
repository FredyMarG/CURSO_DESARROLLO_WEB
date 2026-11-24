/**
 * CLIENTE WEB EN EL NAVEGADOR (public/app.js)
 * - Detecta automáticamente si está corriendo bajo src/server.js (/api/tareas):
 *   · Modo Node.js (localhost:3000): persiste en data/tareas.json y data/eventos.ndjson reales.
 *   · Modo Demo (portal estático / file://): simula la misma persistencia con localStorage.
 * - Optimizado con requestJson() compartido, DocumentFragment para pintar la lista en un solo
 *   reflow y ejecutarAccion() para capturar errores en cualquier botón.
 */
(function () {
  const form = document.getElementById('taskForm');
  const input = document.getElementById('taskInput');
  const listEl = document.getElementById('taskList');
  const errorBox = document.getElementById('errorBox');
  const jsonPreview = document.getElementById('jsonPreview');
  const ndjsonPreview = document.getElementById('ndjsonPreview');
  const modeBadge = document.getElementById('modeBadge');
  const serverHint = document.getElementById('serverHint');

  const LS_TAREAS = 'curso_node_tareas_demo';
  const LS_EVENTOS = 'curso_node_eventos_demo';
  let useNodeApi = false;

  // Helper único para peticiones fetch JSON con manejo consistente de errores
  async function requestJson(url, options) {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la petición al servidor');
    return data;
  }

  // Comprueba si el servidor HTTP de Node.js (src/server.js) está respondiendo en /api/tareas
  async function detectBackend() {
    if (location.protocol === 'file:') return false;
    try {
      const res = await fetch('/api/tareas', { method: 'GET' });
      const ct = res.headers.get('content-type') || '';
      return res.ok && ct.includes('application/json');
    } catch {
      return false;
    }
  }

  // --- Helpers del Modo Demo (localStorage) ---
  function demoRead(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function demoWrite(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function demoPushEvento(evento) {
    const ev = demoRead(LS_EVENTOS);
    ev.push({ ts: new Date().toISOString(), ...evento });
    demoWrite(LS_EVENTOS, ev);
  }

  // Ejecuta una acción asíncrona limpiando errores previos, re-renderizando y capturando fallos
  async function ejecutarAccion(accion) {
    errorBox.textContent = '';
    try {
      await accion();
      await render();
    } catch (err) {
      errorBox.textContent = `❌ ${err.message}`;
    }
  }

  // Operaciones unificadas (API real de Node.js o Modo Demo en navegador)
  async function apiListar() {
    if (useNodeApi) {
      const [tareas, eventos] = await Promise.all([
        requestJson('/api/tareas'),
        requestJson('/api/eventos'),
      ]);
      return { tareas, eventos };
    }
    return { tareas: demoRead(LS_TAREAS), eventos: demoRead(LS_EVENTOS) };
  }

  async function apiCrear(descripcion) {
    if (useNodeApi) {
      return await requestJson('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });
    }
    const limpia = String(descripcion || '').trim();
    if (!limpia) throw new Error('La descripción es requerida');
    const tareas = demoRead(LS_TAREAS);
    const nueva = {
      id: crypto.randomUUID(),
      descripcion: limpia,
      completada: false,
      creadoEn: new Date().toISOString(),
    };
    tareas.push(nueva);
    demoWrite(LS_TAREAS, tareas);
    demoPushEvento({ tipo: 'tarea:creada', id: nueva.id, descripcion: nueva.descripcion });
    return nueva;
  }

  async function apiCompletar(id) {
    if (useNodeApi) {
      return await requestJson(`/api/tareas/${encodeURIComponent(id)}`, { method: 'PATCH' });
    }
    const tareas = demoRead(LS_TAREAS);
    const tarea = tareas.find((item) => item.id === id);
    if (!tarea) throw new Error('Tarea no encontrada');
    tarea.completada = true;
    demoWrite(LS_TAREAS, tareas);
    demoPushEvento({ tipo: 'tarea:completada', id: tarea.id });
  }

  async function apiEliminar(id) {
    if (useNodeApi) {
      return await requestJson(`/api/tareas/${encodeURIComponent(id)}`, { method: 'DELETE' });
    }
    demoWrite(LS_TAREAS, demoRead(LS_TAREAS).filter((item) => item.id !== id));
    demoPushEvento({ tipo: 'tarea:eliminada', id });
  }

  // Construye un <li> seguro usando textContent (sin innerHTML sobre datos del usuario)
  function crearElementoTarea(t) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const info = document.createElement('div');
    info.className = 'task-info';

    const desc = document.createElement('span');
    desc.className = `task-desc${t.completada ? ' done' : ''}`;
    desc.textContent = `${t.completada ? '✅' : '⏳'} ${t.descripcion}`;

    const meta = document.createElement('span');
    meta.className = 'task-meta';
    meta.textContent = `id: ${t.id.slice(0, 8)} · ${new Date(t.creadoEn).toLocaleString()}`;
    info.append(desc, meta);

    const btns = document.createElement('div');
    btns.className = 'task-btns';

    if (!t.completada) {
      const btnDone = document.createElement('button');
      btnDone.type = 'button';
      btnDone.className = 'mini-btn btn-done';
      btnDone.textContent = 'Completar';
      btnDone.addEventListener('click', () => ejecutarAccion(() => apiCompletar(t.id)));
      btns.appendChild(btnDone);
    }

    const btnDel = document.createElement('button');
    btnDel.type = 'button';
    btnDel.className = 'mini-btn btn-del';
    btnDel.textContent = 'Eliminar';
    btnDel.addEventListener('click', () => ejecutarAccion(() => apiEliminar(t.id)));
    btns.appendChild(btnDel);

    li.append(info, btns);
    return li;
  }

  // Dibuja la lista de tareas en un único DocumentFragment y actualiza los visores JSON/NDJSON
  async function render() {
    const { tareas, eventos } = await apiListar();
    const frag = document.createDocumentFragment();

    if (tareas.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'hint';
      empty.textContent = '📭 No hay tareas todavía. Agrega una arriba.';
      frag.appendChild(empty);
    } else {
      for (const t of tareas) {
        frag.appendChild(crearElementoTarea(t));
      }
    }

    listEl.replaceChildren(frag);
    jsonPreview.textContent = JSON.stringify(tareas, null, 2);
    ndjsonPreview.textContent = eventos.length
      ? eventos.map((e) => JSON.stringify(e)).join('\n')
      : '(sin eventos)';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await ejecutarAccion(async () => {
      await apiCrear(input.value);
      input.value = '';
    });
  });

  (async function init() {
    useNodeApi = await detectBackend();
    if (useNodeApi) {
      document.getElementById('btnProjects').href = '/index.html?filter=proyectos';
      document.getElementById('btnPortal').href = '/index.html';
      modeBadge.textContent = '🟢 Conectado a Node.js (data/ real)';
      serverHint.innerHTML = 'Guardando en <code>data/tareas.json</code> y <code>data/eventos.ndjson</code> mediante <code>src/server.js</code>.';
    } else {
      modeBadge.textContent = '🟡 Modo Demo Navegador';
      serverHint.innerHTML = 'Para guardar en disco real con Node.js, ejecuta <code>npm run web</code> en <code>NODE/Proyectos/Tareas</code> y abre <code>http://localhost:3000</code>.';
    }
    await render();
  })();
})();
