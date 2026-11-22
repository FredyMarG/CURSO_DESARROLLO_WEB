/**
 * ============================================================================
 * LÓGICA DE FINANZAS APP — CONTROL DE INGRESOS, GASTOS Y GRÁFICO EN CANVAS
 * Comentado línea a línea de forma educativa en español
 * ============================================================================
 */

// 1. ESTADO INICIAL Y PERSISTENCIA
// Recupera las transacciones guardadas en el navegador (localStorage) usando la clave 'transacciones'.
// JSON.parse() convierte el texto guardado de vuelta en un arreglo de JavaScript; si no existe, inicia [].
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

// 2. REFERENCIAS AL DOM (Document Object Model)
const formularioTransaccion = document.getElementById('form-transaccion'); // Referencia al formulario principal
const inputMonto = document.getElementById('monto'); // Referencia al campo de texto donde se escribe el monto
const listaMovimientos = document.getElementById('lista'); // Referencia al contenedor <ul> de movimientos
const lienzoGrafico = document.getElementById('grafico-resumen'); // Referencia al elemento <canvas> del gráfico
const contextoGrafico = lienzoGrafico.getContext('2d'); // Contexto 2D necesario para dibujar formas y texto en el canvas

// 3. UTILIDADES DE FORMATO Y ENTRADA EN VIVO
// Convierte un número en texto con separador de miles y sin decimales (ej: 50000 -> "50.000").
function formatearMiles(numero) {
  return Math.round(numero).toLocaleString('es-CO', { // Redondea al entero más cercano y aplica formato regional
    maximumFractionDigits: 0 // Impide que se muestren decimales
  });
}

// Escucha cada pulsación en el campo de monto para aplicar el separador de miles en tiempo real.
inputMonto.addEventListener('input', () => {
  const soloDigitos = inputMonto.value.replace(/\D/g, ''); // Elimina todo carácter que no sea un dígito (0-9)

  if (soloDigitos === '') { // Si el usuario borró todo el contenido del campo
    inputMonto.value = ''; // Mantiene el campo vacío en lugar de mostrar "0"
    return; // Sale de la función para no intentar formatear una cadena vacía
  }

  const numeroEntero = parseInt(soloDigitos, 10); // Convierte los dígitos limpios a número entero en base 10
  inputMonto.value = formatearMiles(numeroEntero); // Muestra el número formateado con puntos de miles en el input
});

// 4. CÁLCULO DE TOTALES Y ACTUALIZACIÓN DEL RESUMEN
// Recorre el arreglo "transacciones" para calcular ingresos, gastos y balance final.
function actualizarTotales() {
  const totalIngresos = transacciones // Suma todos los montos de tipo 'ingreso'
    .filter((transaccion) => transaccion.tipo === 'ingreso') // Conserva solo las transacciones marcadas como ingreso
    .reduce((acumulador, transaccion) => acumulador + transaccion.monto, 0); // Acumula la suma empezando desde 0

  const totalGastos = transacciones // Suma todos los montos de tipo 'gasto'
    .filter((transaccion) => transaccion.tipo === 'gasto') // Conserva solo las transacciones marcadas como gasto
    .reduce((acumulador, transaccion) => acumulador + transaccion.monto, 0); // Acumula la suma empezando desde 0

  const balanceTotal = totalIngresos - totalGastos; // Calcula el saldo disponible restando gastos a los ingresos

  document.getElementById('ingresos').textContent = `$${formatearMiles(totalIngresos)}`; // Muestra ingresos formateados
  document.getElementById('gastos').textContent = `$${formatearMiles(totalGastos)}`; // Muestra gastos formateados
  document.getElementById('balance').textContent = `$${formatearMiles(balanceTotal)}`; // Muestra balance formateado

  dibujarGrafico(totalIngresos, totalGastos); // Actualiza el gráfico de dona con los nuevos totales
}

// 5. DIBUJO DEL GRÁFICO DE DONA EN HTML5 CANVAS
// Dibuja un gráfico circular proporcional entre ingresos y gastos sin librerías externas.
function dibujarGrafico(totalIngresos, totalGastos) {
  const sumaTotal = totalIngresos + totalGastos; // Total combinado para calcular proporciones (0% a 100%)
  const centroX = lienzoGrafico.width / 2; // Coordenada horizontal del centro del canvas
  const centroY = lienzoGrafico.height / 2; // Coordenada vertical del centro del canvas
  const radio = 66; // Radio del anillo circular en píxeles
  const grosorAnillo = 22; // Grosor del trazo para darle aspecto de dona

  contextoGrafico.clearRect(0, 0, lienzoGrafico.width, lienzoGrafico.height); // Borra el dibujo anterior del lienzo

  // Caso vacío: si no hay ingresos ni gastos, dibuja un anillo neutro con el texto "Sin datos".
  if (sumaTotal === 0) {
    contextoGrafico.beginPath(); // Inicia un nuevo camino de dibujo
    contextoGrafico.arc(centroX, centroY, radio, 0, Math.PI * 2); // Traza un círculo completo (0 a 2π radianes)
    contextoGrafico.strokeStyle = 'rgba(255, 255, 255, 0.1)'; // Color gris translúcido para el estado vacío
    contextoGrafico.lineWidth = grosorAnillo; // Aplica el grosor del anillo
    contextoGrafico.stroke(); // Dibuja el contorno del círculo

    contextoGrafico.fillStyle = '#94a3b8'; // Color gris azulado para el texto central
    contextoGrafico.font = '600 13px Outfit, sans-serif'; // Fuente, peso y tamaño del texto
    contextoGrafico.textAlign = 'center'; // Centra el texto horizontalmente en centroX
    contextoGrafico.textBaseline = 'middle'; // Centra el texto verticalmente en centroY
    contextoGrafico.fillText('Sin datos', centroX, centroY); // Dibuja el mensaje en el centro

    document.getElementById('porcentaje-ingresos').textContent = '0%'; // Reinicia porcentaje de ingresos en leyenda
    document.getElementById('porcentaje-gastos').textContent = '0%'; // Reinicia porcentaje de gastos en leyenda
    return; // Termina la función porque no hay datos que graficar
  }

  const proporcionIngresos = totalIngresos / sumaTotal; // Fracción entre 0 y 1 que representan los ingresos
  const porcentajeIngresos = Math.round(proporcionIngresos * 100); // Convierte la fracción a porcentaje entero
  const porcentajeGastos = 100 - porcentajeIngresos; // El complemento garantiza que ambos sumen exactamente 100%

  document.getElementById('porcentaje-ingresos').textContent = `${porcentajeIngresos}%`; // Actualiza leyenda ingresos
  document.getElementById('porcentaje-gastos').textContent = `${porcentajeGastos}%`; // Actualiza leyenda gastos

  const anguloInicial = -Math.PI / 2; // Comienza en las 12 en punto (-90 grados en radianes)
  const anguloFinIngresos = anguloInicial + proporcionIngresos * Math.PI * 2; // Ángulo final proporcional a ingresos

  // Dibuja el arco de INGRESOS (verde esmeralda) solo si hay al menos un ingreso.
  if (totalIngresos > 0) {
    contextoGrafico.beginPath(); // Inicia un nuevo trazo independiente
    contextoGrafico.arc(centroX, centroY, radio, anguloInicial, anguloFinIngresos); // Arco desde el inicio hasta su proporción
    contextoGrafico.strokeStyle = '#10b981'; // Color verde esmeralda
    contextoGrafico.lineWidth = grosorAnillo; // Grosor de la dona
    contextoGrafico.stroke(); // Pinta el arco de ingresos
  }

  // Dibuja el arco de GASTOS (rosa) continuando exactamente donde terminó el de ingresos.
  if (totalGastos > 0) {
    contextoGrafico.beginPath(); // Inicia otro trazo independiente
    contextoGrafico.arc(centroX, centroY, radio, anguloFinIngresos, anguloInicial + Math.PI * 2); // Completa el círculo
    contextoGrafico.strokeStyle = '#fb7185'; // Color rosa para gastos
    contextoGrafico.lineWidth = grosorAnillo; // Grosor de la dona
    contextoGrafico.stroke(); // Pinta el arco de gastos
  }

  contextoGrafico.fillStyle = '#f8fafc'; // Color blanco para el texto central
  contextoGrafico.font = '700 14px Outfit, sans-serif'; // Tipografía en negrita
  contextoGrafico.textAlign = 'center'; // Centra el texto horizontalmente
  contextoGrafico.textBaseline = 'middle'; // Centra el texto verticalmente
  contextoGrafico.fillText(`${transacciones.length} mov.`, centroX, centroY); // Muestra cantidad de movimientos
}

// 6. RENDERIZADO DE LA LISTA Y GUARDADO EN LOCALSTORAGE
// Dibuja todas las transacciones en el HTML, recalcula totales y guarda el estado actual.
function renderizarTransacciones() {
  listaMovimientos.innerHTML = ''; // Limpia la lista HTML para evitar duplicar elementos al volver a dibujar

  transacciones.forEach((transaccion) => { // Recorre cada objeto guardado en el arreglo "transacciones"
    const elementoLista = document.createElement('li'); // Crea un nuevo elemento <li> en memoria
    const esIngreso = transaccion.tipo === 'ingreso'; // Determina si el movimiento es un ingreso o un egreso
    const signo = esIngreso ? '+' : '-'; // Elige el signo "+" para ingresos y "-" para egresos

    elementoLista.className = esIngreso ? 'item-ingreso' : 'item-gasto'; // Asigna clase CSS verde o roja
    // Inserta el concepto, el monto con signo y color semántico, y el botón para eliminar por su ID único
    elementoLista.innerHTML = `<span>${transaccion.concepto}: <strong class="monto-item">${signo}$${formatearMiles(transaccion.monto)}</strong></span> <button onclick="borrar(${transaccion.id})">X</button>`;
    listaMovimientos.appendChild(elementoLista); // Agrega el <li> dentro del <ul> en el DOM
  });

  actualizarTotales(); // Recalcula balance, ingresos, gastos y redibuja el gráfico
  localStorage.setItem('transacciones', JSON.stringify(transacciones)); // Convierte el arreglo a texto JSON y lo guarda
}

// 7. MANEJO DEL ENVÍO DEL FORMULARIO
// Se ejecuta cuando el usuario envía el formulario (clic en "Agregar" o tecla Enter).
formularioTransaccion.addEventListener('submit', (evento) => {
  evento.preventDefault(); // Evita que el navegador recargue la página al enviar el formulario

  const montoLimpio = parseInt(inputMonto.value.replace(/\D/g, ''), 10); // Quita puntos de miles y convierte a entero

  if (!montoLimpio || montoLimpio <= 0) return; // Evita registrar montos vacíos, inválidos o iguales a cero

  const nuevaTransaccion = { // Construye el objeto que representa el nuevo movimiento
    id: Date.now(), // Genera un identificador numérico único usando los milisegundos actuales
    concepto: document.getElementById('concepto').value, // Toma la descripción escrita por el usuario
    monto: montoLimpio, // Guarda el número entero limpio para poder realizar sumas y restas exactas
    tipo: document.getElementById('tipo').value // Toma el tipo seleccionado ('ingreso' o 'gasto')
  };

  transacciones.push(nuevaTransaccion); // Añade la nueva transacción al final del arreglo
  renderizarTransacciones(); // Redibuja la lista, actualiza totales/gráfico y guarda en localStorage
  formularioTransaccion.reset(); // Limpia los campos del formulario para el próximo registro
});

// 8. ELIMINACIÓN DE TRANSACCIONES
// Se ejecuta al pulsar el botón "X" de cualquier movimiento en la lista.
function borrar(idTransaccion) {
  // Crea un nuevo arreglo excluyendo la transacción cuyo id coincida con el recibido
  transacciones = transacciones.filter((transaccion) => transaccion.id !== idTransaccion);
  renderizarTransacciones(); // Actualiza la interfaz, el gráfico y el almacenamiento local
}

// 9. INICIALIZACIÓN DE LA APLICACIÓN
renderizarTransacciones(); // Dibuja al instante los movimientos guardados al cargar la página
