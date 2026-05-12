/**
 * PROGRAMACIÓN ORIENTADA A OBJETOS (POO)
 * Clase base, herencia con extends/super y getters/setters.
 */

/* Clase base: define especie, edad, color y un texto informativo */
class Animal {
    constructor(especie, edad, color){
        /* Atributos de instancia disponibles en todos los métodos */
        this.especie = especie,
        this.edad = edad,
        this.color = color,
        this.info = `Soy ${this.especie}, tengo ${this.edad} años y soy de color ${this.color}`;
    }
    /* Método de instancia: imprime la información del animal en el documento */
    verInfo(){
        document.write(this.info + "<br>");
    }
}

/* Herencia: Perro extiende Animal y añade la noción de raza */
class Perro extends Animal{
    constructor(especie,edad,color,raza){
        super(especie,edad,color);
        this.raza = null
    }
    /* Setter: asigna el nombre de la raza desde fuera como si fuera una propiedad */
    set setRaza(newName){
        this.raza = newName
    }

    /* Getter: expone el valor actual de la raza */
    get getRaza(){
        return this.raza
    }
}
/* Instancias de ejemplo y uso del setter/getter de raza */
const perro = new Perro("perro",5,"marron", "doberman")
const gato = new Animal("gato", 2, "negro")
const pajaro = new Animal("pajaro", 1, "verde")
perro.setRaza = "Pedro"
document.write(perro.getRaza)