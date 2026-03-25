let mobiles = document.getElementById("mobile"),
    func = document.getElementById("func"),
    sol = document.getElementById("main-sol")
    
    class Celular{
        constructor(color,peso, tamaño, rdc,ram){
            this.color = color,
            this.peso = peso,
            this.tamaño  = tamaño,
            this.resolucionDeCamara = rdc,
            this.memoriaRam = ram,
            this.encendido = false;
        }
        presionarBotonEncendido(){
            let estado;
            if (this.encendido == false) {
                estado = "Celular Encendido";
                this.encendido == true
            }else{
                estado = "Celular Apagado";
                this.encendido == false
            }

            return estado
        }

        reiniciar(){
            if (this.encendido == true) {                
                return "El celular esta apagado";
            }else{
                return "Reiniciando el Celular"
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

celular1 = new Celular("rojo","150g","5'", "HD","1GB")
celular2 = new Celular("negro","155g","5.4'", "full HD","2GB")
celular3 = new Celular("blanco","146g","5.9'", "full HD","2GB")


function mostrar(){
    mobiles.innerHTML = `<tr>
                        <td>1</td>
                        <td>${celular1.color}</td>
                        <td>${celular1.peso}</td>
                        <td>${celular1.tamaño}</td>
                        <td>${celular1.resolucionDeCamara}</td>
                        <td>${celular1.memoriaRam}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>${celular2.color}</td>
                        <td>${celular2.peso}</td>
                        <td>${celular2.tamaño}</td>
                        <td>${celular2.resolucionDeCamara}</td>
                        <td>${celular2.memoriaRam}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>${celular3.color}</td>
                        <td>${celular3.peso}</td>
                        <td>${celular3.tamaño}</td>
                        <td>${celular3.resolucionDeCamara}</td>
                        <td>${celular3.memoriaRam}</td>
                    </tr>`;

    func.innerHTML = `<tr>
                        <td>1</td>
                        <td>${celular1.presionarBotonEncendido()}</td>
                        <td>${celular1.reiniciar()}</td>
                        <td>${celular1.presionarBotonEncendido()}</td>
                        <td>${celular1.tomarFoto()}</td>
                        <td>${celular1.grabarVideo()}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>${celular2.presionarBotonEncendido()}</td>
                        <td>${celular2.reiniciar()}</td>
                        <td>${celular2.presionarBotonEncendido()}</td>
                        <td>${celular2.tomarFoto()}</td>
                        <td>${celular2.grabarVideo()}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>${celular3.presionarBotonEncendido()}</td>
                        <td>${celular3.reiniciar()}</td>
                        <td>${celular3.presionarBotonEncendido()}</td>
                        <td>${celular3.tomarFoto()}</td>
                        <td>${celular3.grabarVideo()}</td>
                    </tr>`;
    sol.style.display = "block"
}