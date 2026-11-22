/**
 * GUÍA INTERACTIVA: PROGRAMACIÓN ORIENTADA A OBJETOS (ES2022+)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

function registrar(mensaje, tipo = "ok") { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = `log-line ${tipo}`; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
    console.log(mensaje); // Imprime salida en consola
}

// 1. Clases, Herencia y Polimorfismo
class Animal { // Define clase
    constructor(nombre, especie) { // Instrucción JavaScript
        this.nombre = nombre; // Asigna valor
        this.especie = especie; // Asigna valor
    }

    sonido() { // Instrucción JavaScript
        return "Sonido genérico"; // Retorna resultado
    }

    describir() { // Instrucción JavaScript
        return `${this.nombre} (${this.especie}) dice: ${this.sonido()}`; // Retorna resultado
    }
}

class Perro extends Animal { // Define clase
    constructor(nombre, raza) { // Instrucción JavaScript
        super(nombre, "Perro"); // Ejecuta llamada o método
        this.raza = raza; // Asigna valor
    }

    sonido() { // Instrucción JavaScript
        return "¡Guau!"; // Retorna resultado
    }
}

document.getElementById("btn-crear-perro").addEventListener("click", () => { // Registra escuchador de eventos
    const nombre = document.getElementById("poo-nombre").value.trim() || "Rex"; // Obtiene referencia DOM para "nombre"
    const raza = document.getElementById("poo-raza").value.trim() || "Mestizo"; // Obtiene referencia DOM para "raza"
    const perro = new Perro(nombre, raza); // Declara e inicializa "perro"

    document.getElementById("out-poo-herencia").textContent =
        `${perro.describir()}\nRaza: ${perro.raza}\n` +
        `perro instanceof Perro:  ${perro instanceof Perro}\n` +
        `perro instanceof Animal: ${perro instanceof Animal}`; // Instrucción JavaScript
    registrar(`Instanciado Perro("${nombre}", "${raza}").`); // Ejecuta llamada o método
});

// 2. Encapsulamiento con #campoPrivado
class CuentaBancaria { // Define clase
    #saldo = 100; // Instrucción JavaScript

    get saldo() { // Instrucción JavaScript
        return this.#saldo; // Retorna resultado
    }

    depositar(monto) { // Instrucción JavaScript
        if (Number.isNaN(monto) || monto <= 0) { // Evalúa condición
            throw new Error("El depósito debe ser mayor a 0."); // Lanza excepción controlada
        }
        this.#saldo += monto; // Instrucción JavaScript
    }

    retirar(monto) { // Instrucción JavaScript
        if (Number.isNaN(monto) || monto <= 0) { // Evalúa condición
            throw new Error("El retiro debe ser mayor a 0."); // Lanza excepción controlada
        }
        if (monto > this.#saldo) { // Evalúa condición
            throw new Error("Fondos insuficientes."); // Lanza excepción controlada
        }
        this.#saldo -= monto; // Instrucción JavaScript
    }
}

const cuenta = new CuentaBancaria(); // Declara e inicializa "cuenta"
const outCuenta = document.getElementById("out-poo-cuenta"); // Obtiene referencia DOM para "outCuenta"

document.getElementById("btn-depositar").addEventListener("click", () => { // Registra escuchador de eventos
    const monto = Number(document.getElementById("poo-monto").value); // Obtiene referencia DOM para "monto"
    try { // Inicia bloque protegido contra errores
        cuenta.depositar(monto); // Ejecuta llamada o método
        outCuenta.textContent = `✅ Depósito de $${monto} exitoso.\nSaldo actual (getter): $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(`Depósito $${monto} -> Saldo: $${cuenta.saldo}`); // Ejecuta llamada o método
    } catch (err) { // Instrucción JavaScript
        outCuenta.textContent = `❌ ${err.message}\nSaldo actual: $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(err.message, "err"); // Ejecuta llamada o método
    }
});

document.getElementById("btn-retirar").addEventListener("click", () => { // Registra escuchador de eventos
    const monto = Number(document.getElementById("poo-monto").value); // Obtiene referencia DOM para "monto"
    try { // Inicia bloque protegido contra errores
        cuenta.retirar(monto); // Ejecuta llamada o método
        outCuenta.textContent = `✅ Retiro de $${monto} exitoso.\nSaldo actual (getter): $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(`Retiro $${monto} -> Saldo: $${cuenta.saldo}`); // Ejecuta llamada o método
    } catch (err) { // Instrucción JavaScript
        outCuenta.textContent = `❌ ${err.message}\nSaldo actual: $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(err.message, "err"); // Ejecuta llamada o método
    }
});

// 3. Métodos estáticos
class Validador { // Define clase
    static MIN_CARACTERES = 3; // Instrucción JavaScript

    static esNombreValido(texto) { // Instrucción JavaScript
        return typeof texto === "string" && texto.trim().length >= this.MIN_CARACTERES; // Retorna resultado
    }
}

document.getElementById("btn-static").addEventListener("click", () => { // Registra escuchador de eventos
    const texto = document.getElementById("poo-validar-nombre").value; // Obtiene referencia DOM para "texto"
    const valido = Validador.esNombreValido(texto); // Declara e inicializa "valido"
    document.getElementById("out-poo-static").textContent =
        `Validador.esNombreValido(${JSON.stringify(texto)}) -> ${valido} (mín. ${Validador.MIN_CARACTERES} caracteres)`; // Instrucción JavaScript
    registrar(`Validador.esNombreValido("${texto}") -> ${valido}`); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de POO listo."); // Ejecuta llamada o método
