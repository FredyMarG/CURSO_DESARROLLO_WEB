/**
 * PROGRAMACIÓN ORIENTADA A OBJETOS (POO)
 * Clase base, herencia con extends/super y getters/setters.
 */

console.log("%c--- LABORATORIO: POO ---", "color: #1a73e8; font-weight: bold; font-size: 12px;");

/**
 * CLASE BASE (Animal): Define la estructura común para cualquier animal.
 */
class Animal {
    constructor(especie, edad, color){
        this.especie = especie;
        this.edad = edad;
        this.color = color;
        /** Propiedad calculada durante la instanciación */
        this.info = `Soy ${this.especie}, tengo ${this.edad} años y soy de color ${this.color}`;
    }

    /* Método de instancia: imprime la información del animal */
    verInfo(){
        console.log(`%c[Animal]: %c${this.info}`, "color: #1a73e8; font-weight: bold;", "color: #111827;");
    }
}

/* Herencia: Perro extiende Animal y añade la noción de raza */
class Perro extends Animal{
    constructor(especie,edad,color,raza){
        // super(): Llama al constructor padre para reutilizar su lógica
        super(especie,edad,color);
        this.raza = raza;
    }

    /* SETTER: Permite modificar la raza de forma controlada */
    // Se usa como: perro.raza = "Nuevo Valor"
    set setRaza(newName) {
        this.raza = newName;
    }

    /* GETTER: Permite obtener la raza como si fuera una propiedad */
    // Se usa como: console.log(perro.raza)
    get getRaza() {
        return this.raza;
    }
}

/* --- PRUEBAS DE INSTANCIACIÓN --- */
const perro = new Perro("perro",5,"marron", "doberman")
const gato = new Animal("gato", 2, "negro")
const pajaro = new Animal("pajaro", 1, "verde")

perro.verInfo();
gato.verInfo();

// Uso del SETTER (se comporta como una asignación de propiedad)
perro.setRaza = "Golden Retriever";
// Uso del GETTER (se comporta como una propiedad de solo lectura)
console.log("%cNueva raza del perro (vía Getter):", "color: #1e40af; font-style: italic;", perro.getRaza);