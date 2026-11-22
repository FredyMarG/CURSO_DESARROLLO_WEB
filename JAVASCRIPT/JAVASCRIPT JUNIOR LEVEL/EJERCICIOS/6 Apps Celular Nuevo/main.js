/**
 * EJERCICIO: simulación de una "tienda de apps" con clase App.
 * Cada app puede instalarse, abrirse, cerrarse y desinstalarse; se listan en una tabla.
 */

let mobile = document.getElementById("mobile"),
    sol = document.getElementById("main-sol")
/** Representa una aplicación móvil con estado de instalación y ejecución */
class App { // Define clase
    constructor(descargas, puntuacion, peso) { // Instrucción JavaScript
        /** Número de descargas, estrellas y peso; banderas de estado de la app */
        this.descargas = descargas; // Asigna valor
        this.puntuacion = puntuacion; // Asigna valor
        this.peso = peso; // Asigna valor
        this.iniciada = false; // Asigna valor
        this.instalada = false; // Asigna valor
    }
    /** Marca la app como instalada si aún no lo estaba */
    instalar(){ // Instrucción JavaScript
        if (this.instalada === false) { // Evalúa condición
            this.instalada = true; // Asigna valor
            return "App Instalada Correctamente"; // Retorna resultado
        }
    }
    /** Quita la instalación si la app estaba instalada */
    desinstalar(){ // Instrucción JavaScript
        if (this.instalada === true) { // Evalúa condición
            this.instalada = false; // Asigna valor
            return "App Desinstalada Correctamente"; // Retorna resultado
        }
    }
    /** Inicia la app solo si está instalada y no estaba en ejecución */
    abrir(){ // Instrucción JavaScript
        if (this.iniciada === false && this.instalada === true) { // Evalúa condición
            this.iniciada = true; // Asigna valor
            return "App Iniciada"; // Retorna resultado
        }   
    }
    /** Cierra la app si estaba abierta e instalada */
    cerrar(){ // Instrucción JavaScript
        if (this.iniciada === true && this.instalada === true) { // Evalúa condición
            this.iniciada = false; // Asigna valor
            return "App Cerrada"; // Retorna resultado
        }
    }
    /** Devuelve un resumen HTML con descargas, puntuación y peso */
    appInfo(){ // Instrucción JavaScript
        return `
        Descargas: <b>${this.descargas}</b><br>
        Puntuación: <b>${this.puntuacion}</b><br>
        Peso: <b>${this.peso}</b><br>
        `;
    }
}

/**
 * Crea varias instancias de App, las recorre y escribe filas en la tabla del DOM.
 */
function mostrar(){ // Declara función
    let app = [
        new App("1.000", "5 estrellas", "900mb"),
        new App("5.000", "4 estrellas", "400mb"),
        new App("10000", "3 estrellas", "100mb"),
        new App("23.000", "4.5 estrellas", "1GB"),
        new App("900", "2.9 estrella", "250mb"),
        new App("17", "4.8 estrellas", "522mb"),
        new App("42.856", "3.7 estrellas", "723mb")]

        for (let i = 0; i < app.length; i++) { // Inicia bucle de iteración
            mobile.innerHTML += `<tr>
                            <td>${app[i].descargas}</td>
                            <td>${app[i].puntuacion}</td>
                            <td>${app[i].peso}</td>
                            <td>${app[i].instalar()}</td>
                            <td>${app[i].abrir()}</td>
                            <td>${app[i].cerrar()}</td>
                            <td>${app[i].desinstalar()}</td>
                        </tr>`;
        }

    sol.style.display = "block"; // Asigna valor
}