/**
 * EJERCICIO: simulación de una "tienda de apps" con clase App.
 * Cada app puede instalarse, abrirse, cerrarse y desinstalarse; se listan en una tabla.
 */

let mobile = document.getElementById("mobile"),
    sol = document.getElementById("main-sol")
/** Representa una aplicación móvil con estado de instalación y ejecución */
class App {
    constructor(descargas, puntuacion, peso) {
        /** Número de descargas, estrellas y peso; banderas de estado de la app */
        this.descargas = descargas;
        this.puntuacion = puntuacion;
        this.peso = peso;
        this.iniciada = false;
        this.instalada = false;
    }
    /** Marca la app como instalada si aún no lo estaba */
    instalar(){
        if (this.instalada === false) {
            this.instalada = true;
            return "App Instalada Correctamente";
        }
    }
    /** Quita la instalación si la app estaba instalada */
    desinstalar(){
        if (this.instalada === true) {
            this.instalada = false;
            return "App Desinstalada Correctamente";
        }
    }
    /** Inicia la app solo si está instalada y no estaba en ejecución */
    abrir(){
        if (this.iniciada === false && this.instalada === true) {
            this.iniciada = true;
            return "App Iniciada";
        }   
    }
    /** Cierra la app si estaba abierta e instalada */
    cerrar(){
        if (this.iniciada === true && this.instalada === true) {
            this.iniciada = false;
            return "App Cerrada";
        }
    }
    /** Devuelve un resumen HTML con descargas, puntuación y peso */
    appInfo(){
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
function mostrar(){
    let app = [
        new App("1.000", "5 estrellas", "900mb"),
        new App("5.000", "4 estrellas", "400mb"),
        new App("10000", "3 estrellas", "100mb"),
        new App("23.000", "4.5 estrellas", "1GB"),
        new App("900", "2.9 estrella", "250mb"),
        new App("17", "4.8 estrellas", "522mb"),
        new App("42.856", "3.7 estrellas", "723mb")]

        for (let i = 0; i < app.length; i++) {
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

    sol.style.display = "block";
}