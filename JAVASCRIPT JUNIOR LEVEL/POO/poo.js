// clase
class Animal {
    constructor(especie, edad, color){
        //atributos
        this.especie = especie,
        this.edad = edad,
        this.color = color,
        this.info = `Soy ${this.especie}, tengo ${this.edad} años y soy de color ${this.color}`;
    }
    //metodo
    verInfo(){
        document.write(this.info + "<br>");
    }
}

//herencia
class Perro extends Animal{
    constructor(especie,edad,color,raza){
        super(especie,edad,color);
        this.raza = null
    }
    set setRaza(newName){
        this.raza = newName
    }

    get getRaza(){
        return this.raza
    }
}
    const perro = new Perro("perro",5,"marron", "doberman")
    const gato = new Animal("gato", 2, "negro")
    const pajaro = new Animal("pajaro", 1, "verde")
perro.setRaza = "Pedro"
document.write(perro.getRaza)