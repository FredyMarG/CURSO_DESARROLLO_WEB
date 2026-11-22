// ============================================================================
// MÓDULO 01: FUNDAMENTOS DE NODE.JS — SERVIDOR HTTP NATIVO (API DE BIENVENIDA)
// Ejecutar en terminal con: node servidor.js
// Probar en navegador: http://localhost:3000/api/bienvenida
// ============================================================================

// Importamos el módulo nativo HTTP usando el prefijo recomendado 'node:'
const http = require("node:http");

// Definimos el puerto TCP en el que escuchará nuestro servidor local
const PUERTO = 3000;

// Arreglo en memoria que simula un catálogo de cursos antes de usar base de datos
const cursos = [
  // Primer curso del catálogo
  { id: 1, nombre: "HTML y CSS", nivel: "Fundamentos" },
  // Segundo curso del catálogo
  { id: 2, nombre: "JavaScript", nivel: "Fundamentos" },
  // Tercer curso del catálogo
  { id: 3, nombre: "Node.js", nivel: "Principiante a avanzado" },
]; // Fin del catálogo simulado

// Creamos el servidor HTTP registrando el callback que atenderá cada petición
const servidor = http.createServer((req, res) => {
  // Construimos un objeto URL para separar la ruta (pathname) de posibles parámetros
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Configuramos la cabecera Content-Type para responder siempre en formato JSON UTF-8
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // Verificamos si la petición es GET hacia la ruta /api/bienvenida
  if (req.method === "GET" && url.pathname === "/api/bienvenida") {
    // Enviamos el código de estado HTTP 200 (OK)
    res.writeHead(200);
    // Finalizamos la respuesta enviando el objeto JSON serializado y salimos con return
    return res.end(
      JSON.stringify({
        // Mensaje principal de bienvenida
        mensaje: "Bienvenido al curso de Node.js",
        // Nombre del módulo actual
        moduloActual: "Fundamentos de Node.js",
        // Versión activa de Node.js en el servidor
        versionNode: process.version,
      })
    );
  } // Fin de la ruta /api/bienvenida

  // Verificamos si la petición es GET hacia la ruta /api/cursos
  if (req.method === "GET" && url.pathname === "/api/cursos") {
    // Enviamos el código de estado HTTP 200 (OK)
    res.writeHead(200);
    // Devolvemos el total de cursos junto con el arreglo completo en JSON
    return res.end(JSON.stringify({ total: cursos.length, cursos }));
  } // Fin de la ruta /api/cursos

  // Verificamos si la petición es GET hacia la ruta /api/estado
  if (req.method === "GET" && url.pathname === "/api/estado") {
    // Enviamos el código de estado HTTP 200 (OK)
    res.writeHead(200);
    // Devolvemos un indicador booleano confirmando que la API está activa
    return res.end(JSON.stringify({ activo: true }));
  } // Fin de la ruta /api/estado

  // Si ninguna ruta coincidió, respondemos con código HTTP 404 (No encontrado)
  res.writeHead(404);
  // Enviamos el mensaje de error en formato JSON y cerramos la respuesta
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
}); // Fin de http.createServer

// Ponemos el servidor a escuchar conexiones entrantes en el puerto configurado
servidor.listen(PUERTO, () => {
  // Confirmamos en consola que el servidor está listo
  console.log(`API lista en http://localhost:${PUERTO}`);
  // Mostramos una URL de ejemplo para probar rápidamente en el navegador
  console.log(`Prueba: http://localhost:${PUERTO}/api/bienvenida`);
}); // Fin de servidor.listen
