/**
 * GUÍA INTERACTIVA: PROGRAMACIÓN ORIENTADA A OBJETOS (ES2022+)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console");

function registrar(mensaje, tipo = "ok") {
    const linea = document.createElement("div");
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. Clases, Herencia y Polimorfismo
class Animal { // Define clase
    constructor(nombre, especie) {
        this.nombre = nombre;
        this.especie = especie;
    }

    sonido() {
        return "Sonido genérico";
    }

    describir() {
        return `${this.nombre} (${this.especie}) dice: ${this.sonido()}`;
    }
}

class Perro extends Animal { // Define clase
    constructor(nombre, raza) {
        super(nombre, "Perro");
        this.raza = raza;
    }

    sonido() {
        return "¡Guau!";
    }
}

document.getElementById("btn-crear-perro").addEventListener("click", () => {
    const nombre = document.getElementById("poo-nombre").value.trim() || "Rex";
    const raza = document.getElementById("poo-raza").value.trim() || "Mestizo";
    const perro = new Perro(nombre, raza);

    document.getElementById("out-poo-herencia").textContent =
        `${perro.describir()}\nRaza: ${perro.raza}\n` +
        `perro instanceof Perro:  ${perro instanceof Perro}\n` +
        `perro instanceof Animal: ${perro instanceof Animal}`;
    registrar(`Instanciado Perro("${nombre}", "${raza}").`);
});

// 2. Encapsulamiento con #campoPrivado
class CuentaBancaria { // Define clase
    #saldo = 100;

    get saldo() {
        return this.#saldo;
    }

    depositar(monto) {
        if (Number.isNaN(monto) || monto <= 0) {
            throw new Error("El depósito debe ser mayor a 0."); // Lanza excepción controlada
        }
        this.#saldo += monto;
    }

    retirar(monto) {
        if (Number.isNaN(monto) || monto <= 0) {
            throw new Error("El retiro debe ser mayor a 0."); // Lanza excepción controlada
        }
        if (monto > this.#saldo) {
            throw new Error("Fondos insuficientes."); // Lanza excepción controlada
        }
        this.#saldo -= monto;
    }
}

const cuenta = new CuentaBancaria();
const outCuenta = document.getElementById("out-poo-cuenta");

document.getElementById("btn-depositar").addEventListener("click", () => {
    const monto = Number(document.getElementById("poo-monto").value);
    try { // Inicia bloque protegido contra errores
        cuenta.depositar(monto);
        outCuenta.textContent = `✅ Depósito de $${monto} exitoso.\nSaldo actual (getter): $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(`Depósito $${monto} -> Saldo: $${cuenta.saldo}`);
    } catch (err) {
        outCuenta.textContent = `❌ ${err.message}\nSaldo actual: $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(err.message, "err");
    }
});

document.getElementById("btn-retirar").addEventListener("click", () => {
    const monto = Number(document.getElementById("poo-monto").value);
    try { // Inicia bloque protegido contra errores
        cuenta.retirar(monto);
        outCuenta.textContent = `✅ Retiro de $${monto} exitoso.\nSaldo actual (getter): $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(`Retiro $${monto} -> Saldo: $${cuenta.saldo}`);
    } catch (err) {
        outCuenta.textContent = `❌ ${err.message}\nSaldo actual: $${cuenta.saldo}`; // Actualiza contenido en el DOM
        registrar(err.message, "err");
    }
});

// 3. Métodos estáticos
class Validador { // Define clase
    static MIN_CARACTERES = 3;

    static esNombreValido(texto) {
        return typeof texto === "string" && texto.trim().length >= this.MIN_CARACTERES;
    }
}

document.getElementById("btn-static").addEventListener("click", () => {
    const texto = document.getElementById("poo-validar-nombre").value;
    const valido = Validador.esNombreValido(texto);
    document.getElementById("out-poo-static").textContent =
        `Validador.esNombreValido(${JSON.stringify(texto)}) -> ${valido} (mín. ${Validador.MIN_CARACTERES} caracteres)`;
    registrar(`Validador.esNombreValido("${texto}") -> ${valido}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de POO listo.");
