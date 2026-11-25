/**
 * CLIENTE WEB EN EL NAVEGADOR (public/app.js)
 * - Detecta automáticamente si está corriendo bajo src/server.js (/api/tareas):
 *   · Modo Node.js (localhost:3000): persiste en data/tareas.json y data/eventos.ndjson reales.
 *   · Modo Demo (portal estático / file://): simula la misma persistencia con localStorage.
 * - Optimizado con requestJson() compartido, DocumentFragment para pintar la lista en un solo
 *   reflow y ejecutarAccion() para capturar errores en cualquier botón.
 */
(function () {
  const form = document.getElementById('taskForm'); // Declara e inicializa variable local
  const input = document.getElementById('taskInput'); // Declara e inicializa variable local
  const listEl = document.getElementById('taskList'); // Declara e inicializa variable local
  const errorBox = document.getElementById('errorBox'); // Declara e inicializa variable local
  const jsonPreview = document.getElementById('jsonPreview'); // Declara e inicializa variable local
  const ndjsonPreview = document.getElementById('ndjsonPreview'); // Declara e inicializa variable local
  const modeBadge = document.getElementById('modeBadge'); // Declara e inicializa variable local
  const serverHint = document.getElementById('serverHint'); // Declara e inicializa variable local

  const LS_TAREAS = 'curso_node_tareas_demo'; // Declara e inicializa variable local
  const LS_EVENTOS = 'curso_node_eventos_demo'; // Declara e inicializa variable local
  let useNodeApi = false; // Declara e inicializa variable local

  // Helper único para peticiones fetch JSON con manejo consistente de errores
  async function requestJson(url, options) { // Define función asíncrona
    const res = await fetch(url, options); // Declara e inicializa variable local
    const data = await res.json(); // Declara e inicializa variable local
    if (!res.ok) throw new Error(data.error || 'Error en la petición al servidor'); // Evalúa condición lógica
    return data; // Retorna el resultado de la función
  }

  // Comprueba si el servidor HTTP de Node.js (src/server.js) está respondiendo en /api/tareas
  async function detectBackend() { // Define función asíncrona
    if (location.protocol === 'file:') return false; // Evalúa condición lógica
    try {
      const res = await fetch('/api/tareas', { method: 'GET' }); // Declara e inicializa variable local
      const ct = res.headers.get('content-type') || ''; // Declara e inicializa variable local
      return res.ok && ct.includes('application/json'); // Retorna el resultado de la función
    } catch {
      return false; // Retorna el resultado de la función
    }
  }

  // --- Helpers del Modo Demo (localStorage) ---
  function demoRead(key) { // Define función reutilizable
    return JSON.parse(localStorage.getItem(key) || '[]'); // Retorna el resultado de la función
  }
  function demoWrite(key, value) { // Define función reutilizable
    localStorage.setItem(key, JSON.stringify(value));
  }
  function demoPushEvento(evento) { // Define función reutilizable
    const ev = demoRead(LS_EVENTOS); // Declara e inicializa variable local
    ev.push({ ts: new Date().toISOString(), ...evento });
    demoWrite(LS_EVENTOS, ev);
  }

  // Ejecuta una acción asíncrona limpiando errores previos, re-renderizando y capturando fallos
  async function ejecutarAccion(accion) { // Define función asíncrona
    errorBox.textContent = ''; // Actualiza texto plano en el DOM
    try {
      await accion();
      await render();
    } catch (err) {
      errorBox.textContent = `❌ ${err.message}`; // Actualiza texto plano en el DOM
    }
  }

  // Operaciones unificadas (API real de Node.js o Modo Demo en navegador)
  async function apiListar() { // Define función asíncrona
    if (useNodeApi) { // Evalúa condición lógica
      const [tareas, eventos] = await Promise.all([
        requestJson('/api/tareas'),
        requestJson('/api/eventos'),
      ]);
      return { tareas, eventos }; // Retorna el resultado de la función
    }
    return { tareas: demoRead(LS_TAREAS), eventos: demoRead(LS_EVENTOS) }; // Retorna el resultado de la función
  }

  async function apiCrear(descripcion) { // Define función asíncrona
    if (useNodeApi) { // Evalúa condición lógica
      return await requestJson('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });
    }
    const limpia = String(descripcion || '').trim(); // Declara e inicializa variable local
    if (!limpia) throw new Error('La descripción es requerida'); // Evalúa condición lógica
    const tareas = demoRead(LS_TAREAS); // Declara e inicializa variable local
    const nueva = {
      id: crypto.randomUUID(),
      descripcion: limpia,
      completada: false,
      creadoEn: new Date().toISOString(),
    };
    tareas.push(nueva);
    demoWrite(LS_TAREAS, tareas);
    demoPushEvento({ tipo: 'tarea:creada', id: nueva.id, descripcion: nueva.descripcion });
    return nueva; // Retorna el resultado de la función
  }

  async function apiCompletar(id) { // Define función asíncrona
    if (useNodeApi) { // Evalúa condición lógica
      return await requestJson(`/api/tareas/${encodeURIComponent(id)}`, { method: 'PATCH' }); // Retorna el resultado de la función
    }
    const tareas = demoRead(LS_TAREAS); // Declara e inicializa variable local
    const tarea = tareas.find((item) => item.id === id); // Declara e inicializa variable local
    if (!tarea) throw new Error('Tarea no encontrada'); // Evalúa condición lógica
    tarea.completada = true;
    demoWrite(LS_TAREAS, tareas);
    demoPushEvento({ tipo: 'tarea:completada', id: tarea.id });
  }

  async function apiEliminar(id) { // Define función asíncrona
    if (useNodeApi) { // Evalúa condición lógica
      return await requestJson(`/api/tareas/${encodeURIComponent(id)}`, { method: 'DELETE' }); // Retorna el resultado de la función
    }
    demoWrite(LS_TAREAS, demoRead(LS_TAREAS).filter((item) => item.id !== id));
    demoPushEvento({ tipo: 'tarea:eliminada', id });
  }

  // Construye un <li> seguro usando textContent (sin innerHTML sobre datos del usuario)
  function crearElementoTarea(t) { // Define función reutilizable
    const li = document.createElement('li'); // Declara e inicializa variable local
    li.className = 'task-item';

    const info = document.createElement('div'); // Declara e inicializa variable local
    info.className = 'task-info';

    const desc = document.createElement('span'); // Declara e inicializa variable local
    desc.className = `task-desc${t.completada ? ' done' : ''}`;
    desc.textContent = `${t.completada ? '✅' : '⏳'} ${t.descripcion}`; // Actualiza texto plano en el DOM

    const meta = document.createElement('span'); // Declara e inicializa variable local
    meta.className = 'task-meta';
    meta.textContent = `id: ${t.id.slice(0, 8)} · ${new Date(t.creadoEn).toLocaleString()}`; // Actualiza texto plano en el DOM
    info.append(desc, meta);

    const btns = document.createElement('div'); // Declara e inicializa variable local
    btns.className = 'task-btns';

    if (!t.completada) { // Evalúa condición lógica
      const btnDone = document.createElement('button'); // Declara e inicializa variable local
      btnDone.type = 'button';
      btnDone.className = 'mini-btn btn-done';
      btnDone.textContent = 'Completar'; // Actualiza texto plano en el DOM
      btnDone.addEventListener('click', () => ejecutarAccion(() => apiCompletar(t.id)));
      btns.appendChild(btnDone);
    }

    const btnDel = document.createElement('button'); // Declara e inicializa variable local
    btnDel.type = 'button';
    btnDel.className = 'mini-btn btn-del';
    btnDel.textContent = 'Eliminar'; // Actualiza texto plano en el DOM
    btnDel.addEventListener('click', () => ejecutarAccion(() => apiEliminar(t.id)));
    btns.appendChild(btnDel);

    li.append(info, btns);
    return li; // Retorna el resultado de la función
  }

  // Dibuja la lista de tareas en un único DocumentFragment y actualiza los visores JSON/NDJSON
  async function render() { // Define función asíncrona
    const { tareas, eventos } = await apiListar(); // Declara e inicializa variable local
    const frag = document.createDocumentFragment(); // Declara e inicializa variable local

    if (tareas.length === 0) { // Evalúa condición lógica
      const empty = document.createElement('li'); // Declara e inicializa variable local
      empty.className = 'hint';
      empty.textContent = '📭 No hay tareas todavía. Agrega una arriba.'; // Actualiza texto plano en el DOM
      frag.appendChild(empty);
    } else {
      for (const t of tareas) { // Itera sobre elementos o rango
        frag.appendChild(crearElementoTarea(t));
      }
    }

    listEl.replaceChildren(frag);
    jsonPreview.textContent = JSON.stringify(tareas, null, 2); // Actualiza texto plano en el DOM
    ndjsonPreview.textContent = eventos.length
      ? eventos.map((e) => JSON.stringify(e)).join('\n')
      : '(sin eventos)';
  }

  form.addEventListener('submit', async (e) => { // Registra escuchador de evento en el DOM
    e.preventDefault();
    await ejecutarAccion(async () => {
      await apiCrear(input.value);
      input.value = '';
    });
  });

  (async function init() {
    useNodeApi = await detectBackend();
    if (useNodeApi) { // Evalúa condición lógica
      document.getElementById('btnProjects').href = '/index.html?filter=proyectos'; // Obtiene referencia al elemento del DOM
      document.getElementById('btnPortal').href = '/index.html'; // Obtiene referencia al elemento del DOM
      modeBadge.textContent = '🟢 Conectado a Node.js (data/ real)'; // Actualiza texto plano en el DOM
      serverHint.innerHTML = 'Guardando en <code>data/tareas.json</code> y <code>data/eventos.ndjson</code> mediante <code>src/server.js</code>.'; // Actualiza estructura HTML interna
    } else {
      modeBadge.textContent = '🟡 Modo Demo Navegador'; // Actualiza texto plano en el DOM
      serverHint.innerHTML = 'Para guardar en disco real con Node.js, ejecuta <code>npm run web</code> en <code>NODE/Proyectos/Tareas</code> y abre <code>http://localhost:3000</code>.';
    }
    await render();
  })();
})();

