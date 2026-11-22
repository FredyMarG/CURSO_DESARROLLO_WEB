/**
 * EJERCICIO: modelado de celulares normales y de gama alta (herencia).
 * Se listan en tablas HTML y se prueban métodos como encendido, fotos y video.
 */

let mobiles = document.getElementById("mobile"),
    func = document.getElementById("func"),
    altag = document.getElementById("altag"),
    sol = document.getElementById("main-sol")
    
    class Celular{ // Define clase
        /** Guarda las características físicas y de hardware del teléfono */
        constructor(color,peso, tamaño, rdc,ram){ // Instrucción JavaScript
            this.color = color,
            this.peso = peso,
            this.tamaño  = tamaño,
            this.resolucionDeCamara = rdc,
            this.memoriaRam = ram,
            this.encendido = false
        }

    /** Alterna encendido/apagado y devuelve un mensaje descriptivo */
        presionarBotonEncendido(){ // Instrucción JavaScript
            let estado; // Declara e inicializa "estado"
            if (this.encendido === false) { // Evalúa condición
                estado = "Celular Encendido";              // Asigna valor
                this.encendido = true; // Asigna valor
            } else { // Instrucción JavaScript
                estado = "Celular Apagado"; // Asigna valor
                this.encendido = false; // Asigna valor
            }
            return estado; // Retorna resultado
        }

        /** Solicita reinicio si el equipo está encendido (ojo: usa asignación = en la condición) */
        reiniciar(){ // Instrucción JavaScript
            if (this.encendido = true) {                 // Evalúa condición
                return "Reiniciando el Celular"
            }else{ // Instrucción JavaScript
                return "El celular esta apagado"; // Retorna resultado
            }
        }
        
        /** Mensaje simulado de captura de foto con la resolución configurada */
        tomarFoto(){ // Instrucción JavaScript
            return `Foto tomada en una resolución de ${this.resolucionDeCamara}`; // Retorna resultado
        }

        /** Mensaje simulado de grabación de video */
        grabarVideo(){ // Instrucción JavaScript
            return `Grabando video en ${this.resolucionDeCamara}`; // Retorna resultado
        }
        /** Resumen HTML con color, peso, tamaño, cámara y RAM */
        mobileInfo(){ // Instrucción JavaScript
            return `
            Color: <b>${this.color}</b><br>
            Peso: <b>${this.peso}</b><br>
            Tamaño: <b>${this.tamaño}</b><br>
            resolución de Video: <b>${this.resolucionDeCamara}</b><br>
            Memoria Ram: <b>${this.memoriaRam}</b><br>
            `;
        }
    }

    /** Extiende Celular con cámara extra y funciones premium */
    class CelularAltaGama extends Celular{ // Define clase
        constructor(color,peso,tamaño,rdc,ram,rdce){ // Instrucción JavaScript
            super(color,peso,tamaño,rdc,ram); // Ejecuta llamada o método
            this.resolucionDeCamaraExtra = rdce; // Asigna valor
        }
        grabarVideoLento(){ // Instrucción JavaScript
            return `Tiene Video en Cámara Lenta`; // Retorna resultado
        }
        reconocimientoFacial(){ // Instrucción JavaScript
            return "Tiene Reconocimiento Facial"
        }
        infoAltaGama(){ // Instrucción JavaScript
            return this.mobileInfo() + `Resolución de cámara extra: <b>${this.resolucionDeCamaraExtra}</b>`
        }
    }

celular = [
    new Celular("rojo","150g","5'", "HD","1GB"),
    new Celular("negro","155g","5.4'", "Full HD","2GB"),
    new Celular("blanco","146g","5.9'", "Full HD","2GB")
]

celag = [
    new CelularAltaGama("Rojo", "130g", "5.2'","3GB","4K","Full HD"),
    new CelularAltaGama("Negro", "140g", "6'","4GB","4K"," HD"),
    new CelularAltaGama("Azul", "136g", "5.5'", "16G", "8K","Full HD")
]

/**
 * Rellena las tablas del DOM con datos de celulares básicos y de gama alta.
 */
function mostrar(){ // Declara función
    for (let i = 0; i < celular.length; i++) { // Inicia bucle de iteración
        mobiles.innerHTML += `<tr>
                        <td>${i+1}</td>
                        <td>${celular[i].color}</td>
                        <td>${celular[i].peso}</td>
                        <td>${celular[i].tamaño}</td>
                        <td>${celular[i].resolucionDeCamara}</td>
                        <td>${celular[i].memoriaRam}</td>
                    </tr>`
        func.innerHTML += `<tr>
                        <td>${i+1}</td>
                        <td>${celular[i].presionarBotonEncendido()}</td>
                        <td>${celular[i].reiniciar()}</td>
                        <td>${celular[i].presionarBotonEncendido()}</td>
                        <td>${celular[i].tomarFoto()}</td>
                        <td>${celular[i].grabarVideo()}</td>
                    </tr>`
    }

    for (let i = 0; i < celag.length; i++) { // Inicia bucle de iteración
        altag.innerHTML += ` <tr>
                            <td>${i+1}</td>
                            <td>${celag[i].color}</td>
                            <td>${celag[i].peso}</td>
                            <td>${celag[i].tamaño}</td>
                            <td>${celag[i].resolucionDeCamara}</td>
                            <td>${celag[i].memoriaRam}</td>
                            <td>${celag[i].reconocimientoFacial()}</td>
                            <td>${celag[i].resolucionDeCamaraExtra}</td>
                            <td>${celag[i].grabarVideoLento()}</td>
                        </tr>`
    }
    sol.style.display = "block"
}