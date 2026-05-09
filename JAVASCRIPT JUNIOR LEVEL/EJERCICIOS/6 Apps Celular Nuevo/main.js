let mobile = document.getElementById("mobile"),
    sol = document.getElementById("main-sol")
class App {
    constructor(descargas, puntuacion, peso) {
        this.descargas = descargas;
        this.puntuacion = puntuacion;
        this.peso = peso;
        this.iniciada = false;
        this.instalada = false;
    }
    instalar(){
        if (this.instalada === false) {
            this.instalada = true;
            return "App Instalada Correctamente";
        }
    }
    desinstalar(){
        if (this.instalada === true) {
            this.instalada = false;
            return "App Desinstalada Correctamente";
        }
    }
    abrir(){
        if (this.iniciada === false && this.instalada === true) {
            this.iniciada = true;
            return "App Iniciada";
        }   
    }
    cerrar(){
        if (this.iniciada === true && this.instalada === true) {
            this.iniciada = false;
            return "App Cerrada";
        }
    }
    appInfo(){
        return `
        Descargas: <b>${this.descargas}</b><br>
        Puntuación: <b>${this.puntuacion}</b><br>
        Peso: <b>${this.peso}</b><br>
        `;
    }
}

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