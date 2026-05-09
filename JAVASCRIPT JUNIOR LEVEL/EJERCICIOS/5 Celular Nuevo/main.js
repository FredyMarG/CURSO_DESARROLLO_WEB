let mobiles = document.getElementById("mobile"),
    func = document.getElementById("func"),
    altag = document.getElementById("altag"),
    sol = document.getElementById("main-sol")
    
    class Celular{
        constructor(color,peso, tamaño, rdc,ram){
            this.color = color,
            this.peso = peso,
            this.tamaño  = tamaño,
            this.resolucionDeCamara = rdc,
            this.memoriaRam = ram,
            this.encendido = false
        }

        presionarBotonEncendido(){
            let estado;
            if (this.encendido === false) {
                estado = "Celular Encendido";             
                this.encendido = true;
            } else {
                estado = "Celular Apagado";
                this.encendido = false;
            }
            return estado;
        }

        reiniciar(){
            if (this.encendido = true) {                
                return "Reiniciando el Celular"
            }else{
                return "El celular esta apagado";
            }
        }
        
        tomarFoto(){
            return `Foto tomada en una resolución de ${this.resolucionDeCamara}`;
        }

        grabarVideo(){
            return `Grabando video en ${this.resolucionDeCamara}`;
        }
        mobileInfo(){
            return `
            Color: <b>${this.color}</b><br>
            Peso: <b>${this.peso}</b><br>
            Tamaño: <b>${this.tamaño}</b><br>
            resolución de Video: <b>${this.resolucionDeCamara}</b><br>
            Memoria Ram: <b>${this.memoriaRam}</b><br>
            `;
        }
    }

    class CelularAltaGama extends Celular{
        constructor(color,peso,tamaño,rdc,ram,rdce){
            super(color,peso,tamaño,rdc,ram);
            this.resolucionDeCamaraExtra = rdce;
        }
        grabarVideoLento(){
            return `Tiene Video en Cámara Lenta`;
        }
        reconocimientoFacial(){
            return "Tiene Reconocimiento Facial"
        }
        infoAltaGama(){
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

function mostrar(){
    for (let i = 0; i < celular.length; i++) {
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

    for (let i = 0; i < celag.length; i++) {
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