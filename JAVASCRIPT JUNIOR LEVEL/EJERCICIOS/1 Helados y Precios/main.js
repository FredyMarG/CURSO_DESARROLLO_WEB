let roberto = document.getElementById("roberto"),
    pedro = document.getElementById("pedro"),
    cofla = document.getElementById("cofla"),
    roberto_helado = document.getElementById("roberto_helado"),
    pedro_helado = document.getElementById("pedro_helado"),
    cofla_helado = document.getElementById("cofla_helado")

function solucion(){
    let dineroRoberto = prompt("Cuanto dinero tiene Roberto?")
    let dineroPedro = prompt("Cuanto dinero tiene Pedro?")
    let dineroCofla = prompt("Cuanto dinero tiene Cofla?")
    //Prompt me devuelve un dato en string, con parse int o parsefloat lo convertimos a entero o decimal respectivamente
    dineroRoberto = parseFloat(dineroRoberto)
    dineroPedro = parseFloat(dineroPedro)
    dineroCofla = parseFloat(dineroCofla)

    roberto.innerHTML =`Roberto tiene ${dineroRoberto} USD`
    pedro.innerHTML = `Pedro tiene ${dineroPedro} USD`
    cofla.innerHTML = `Cofla tiene ${dineroCofla} USD`

    //tofixed me ayuda a limitar el numero de decimales, pero me devuelve un string, con number lo devuelvo a numero

    if (dineroRoberto >= 0.6 && dineroRoberto < 1) {
        roberto_helado.innerHTML =`Roberto, comprate el helado de agua y te sobran ` + (Number((dineroRoberto - 0.6).toFixed(3))) + " USD";
    }else if (dineroRoberto >= 1 && dineroRoberto < 1.6) {
        roberto_helado.innerHTML =`Roberto, comprate el helado de crema y te sobran `+ (Number((dineroRoberto - 1).toFixed(3))) + " USD";
    }
    else if (dineroRoberto >= 1.6 && dineroRoberto < 1.7) {
        roberto_helado.innerHTML =`Roberto, comprate el helado de heladix y te sobran ` + (Number((dineroRoberto - 1.6).toFixed(3))) + " USD";
    }
    else if (dineroRoberto >= 1.7 && dineroRoberto < 1.8) {
        roberto_helado.innerHTML =`Roberto, comprate el helado de heladovich y te sobran ` + (Number((dineroRoberto - 1.7).toFixed(3))) + " USD";
    }
    else if (dineroRoberto >= 1.8 && dineroRoberto < 2.9) {
        roberto_helado.innerHTML =`Roberto, comprate el helado de helardo y te sobran ` + (Number((dineroRoberto - 1.8).toFixed(3))) + " USD";
    }else if (dineroRoberto >= 2.9 ) {
        roberto_helado.innerHTML =`Roberto, comprate el helado con confites o el pote de 1/4 de kg y te sobran ` + (Number((dineroRoberto - 2.9).toFixed(3))) + " USD";
    }else{
        roberto_helado.innerHTML =` Roberto NO TIENES PARA NINGUN HELADO`;
    }

    if (dineroPedro >= 0.6 && dineroPedro < 1) {
        pedro_helado.innerHTML = `Pedro, comprate el helado de agua y te sobran ` + (Number((dineroPedro - 0.6).toFixed(3))) + " USD";
    }else if (dineroPedro >= 1 && dineroPedro < 1.6) {
        pedro_helado.innerHTML = `Pedro, comprate el helado de crema y te sobran ` + (Number((dineroPedro - 1).toFixed(3))) + " USD";
    }
    else if (dineroPedro >= 1.6 && dineroPedro < 1.7) {
        pedro_helado.innerHTML = `Pedro, comprate el helado de heladix y te sobran ` + (Number((dineroPedro - 1.6).toFixed(3))) + " USD";
    }
    else if (dineroPedro >= 1.7 && dineroPedro < 1.8) {
        pedro_helado.innerHTML = `Pedro, comprate el helado de heladovich y te sobran ` + (Number((dineroPedro - 1.7).toFixed(3))) + " USD";
    }
    else if (dineroPedro >= 1.8 && dineroPedro < 2.9) {
        pedro_helado.innerHTML = `Pedro, comprate el helado de helardo y te sobran ` + (Number((dineroPedro - 1.8).toFixed(3))) + " USD";
    }else if (dineroPedro >= 2.9 ) {
        pedro_helado.innerHTML = `Pedro, comprate el helado con confites o el pote de 1/4 de kg y te sobran ` + (Number((dineroPedro - 2.9).toFixed(3))) + " USD";
    }else{
        pedro_helado.innerHTML = `Pedro NO TIENES PARA NINGUN HELADO`;
    }

    if (dineroCofla >= 0.6 && dineroCofla < 1) {
        cofla_helado.innerHTML = `Cofla, comprate el helado de agua y te sobran ` + (Number((dineroCofla - 0.6).toFixed(3))) + " USD";
    }else if (dineroCofla >= 1 && dineroCofla < 1.6) {
        cofla_helado.innerHTML = `Cofla, comprate el helado de crema y te sobran ` + (Number((dineroCofla - 1).toFixed(3))) + " USD";
    }
    else if (dineroCofla >= 1.6 && dineroCofla < 1.7) {
        cofla_helado.innerHTML = `Cofla, comprate el helado de heladix y te sobran ` + (Number((dineroCofla - 1.6).toFixed(3))) + " USD";
    }
    else if (dineroCofla >= 1.7 && dineroCofla < 1.8) {
        cofla_helado.innerHTML = `Cofla, comprate el helado de heladovich y te sobran ` + (Number((dineroCofla - 1.7).toFixed(3))) + " USD";
    }
    else if (dineroCofla >= 1.8 && dineroCofla < 2.9) {
        cofla_helado.innerHTML = `Cofla, comprate el helado de helardo y te sobran ` + (Number((dineroCofla - 1.8).toFixed(3))) + " USD";
    }else if (dineroCofla >= 2.9 ) {
        cofla_helado.innerHTML = `Cofla, comprate el helado con confites o el pote de 1/4 de kg y te sobran ` + (Number((dineroCofla - 2.9).toFixed(3))) + " USD";
    }else{
        cofla_helado.innerHTML = `Cofla NO TIENES PARA NINGUN HELADO`;   
    }
}