// ============================================================================
// MÓDULO 02: REPL DE NODE.JS — PROTOTIPO DE CATÁLOGO EN MEMORIA
// Cargar dentro del REPL con: .load catalogo.js
// O ejecutar directamente con: node catalogo.js
// ============================================================================

// Arreglo en memoria que almacena los cursos registrados durante la sesión
const catalogo = [];

// Agrega un nuevo curso validando identificador, nombre y cantidad de lecciones
function agregarCurso(id, nombre, lecciones) {
  // Validamos que el ID sea un número entero positivo mayor que cero
  if (!Number.isInteger(id) || id <= 0) {
    // Lanzamos un error descriptivo si el identificador no cumple el formato
    throw new Error("El ID debe ser un entero positivo");
  } // Fin de validación del ID

  // Validamos que el nombre sea una cadena de texto no vacía
  if (!nombre || typeof nombre !== "string") {
    // Detenemos la ejecución si el nombre falta o no es string
    throw new Error("El nombre es obligatorio");
  } // Fin de validación del nombre

  // Validamos que la cantidad de lecciones sea un entero positivo
  if (!Number.isInteger(lecciones) || lecciones <= 0) {
    // Informamos que el total de lecciones debe ser mayor a cero
    throw new Error("Las lecciones deben ser un entero positivo");
  } // Fin de validación de lecciones

  // Verificamos con .some() si ya existe otro curso con el mismo ID
  if (catalogo.some((curso) => curso.id === id)) {
    // Evitamos duplicados lanzando una excepción controlada
    throw new Error("El ID ya existe");
  } // Fin de verificación de unicidad

  // Creamos el objeto curso con 0 lecciones completadas inicialmente
  const curso = {
    // Identificador numérico único del curso
    id,
    // Nombre descriptivo del curso
    nombre,
    // Cantidad total de lecciones del curso
    lecciones,
    // Contador inicial de lecciones completadas
    completadas: 0,
  }; // Fin de construcción del objeto curso

  // Guardamos el curso al final del arreglo catálogo en memoria
  catalogo.push(curso);
  // Retornamos el objeto curso recién creado para inspeccionarlo en el REPL
  return curso;
} // Fin de la función agregarCurso

// Actualiza la cantidad de lecciones completadas para un curso existente
function registrarAvance(id, completadas) {
  // Buscamos el curso en el catálogo comparando su identificador
  const curso = catalogo.find((item) => item.id === id);

  // Si no se encontró ningún curso con ese ID, lanzamos un error
  if (!curso) {
    // Notificamos que el identificador solicitado no existe en el catálogo
    throw new Error("Curso no encontrado");
  } // Fin de comprobación de existencia

  // Validamos que el avance sea un entero dentro del rango [0, curso.lecciones]
  if (!Number.isInteger(completadas) || completadas < 0 || completadas > curso.lecciones) {
    // Evitamos valores negativos o mayores al total de lecciones
    throw new Error("Avance fuera del rango permitido");
  } // Fin de validación de rango

  // Actualizamos la propiedad completadas del curso encontrado
  curso.completadas = completadas;
  // Retornamos el curso actualizado para confirmar el cambio
  return curso;
} // Fin de la función registrarAvance

// Calcula el porcentaje redondeado de avance de un curso
function calcularProgreso(curso) {
  // Evitamos división por cero si lecciones vale 0 y redondeamos el porcentaje
  return curso.lecciones === 0 ? 0 : Math.round((curso.completadas / curso.lecciones) * 100);
} // Fin de la función calcularProgreso

// Devuelve únicamente los cursos que alcanzaron el 100% de lecciones
function cursosFinalizados() {
  // Filtramos los cursos donde completadas coincide exactamente con lecciones
  return catalogo.filter((curso) => curso.completadas === curso.lecciones);
} // Fin de la función cursosFinalizados

// Ejecutamos una demostración automática solo cuando se corre con `node catalogo.js`
if (require.main === module) {
  // Agregamos el primer curso de prueba (Node.js con 26 lecciones)
  agregarCurso(1, "Node.js", 26);
  // Agregamos el segundo curso de prueba (JavaScript con 20 lecciones)
  agregarCurso(2, "JavaScript", 20);
  // Registramos un avance parcial de 13 lecciones en el curso 1
  registrarAvance(1, 13);
  // Registramos el total de 20 lecciones en el curso 2 para marcarlo finalizado
  registrarAvance(2, 20);
  // Mostramos el porcentaje de progreso del primer curso en consola
  console.log("Progreso Node.js:", calcularProgreso(catalogo[0]) + "%");
  // Mostramos el arreglo de cursos finalizados en consola
  console.log("Cursos finalizados:", cursosFinalizados());
} // Fin del bloque de ejecución directa
