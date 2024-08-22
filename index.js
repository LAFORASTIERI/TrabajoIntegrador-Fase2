document.addEventListener("DOMContentLoaded", function () {
    // Variables de selección de elementos del DOM
    const tipoSeguro = document.getElementById("tipoSeguro");
    const inmuebleFields = document.getElementById("inmuebleFields");
    const vehiculoFields = document.getElementById("vehiculoFields");
    const tipoInmueble = document.getElementById("tipoInmueble");
    const metrosCuadrados = document.getElementById("metrosCuadrados");
    const tipoVehiculo = document.getElementById("tipoVehiculo");
    const marca = document.getElementById("marca");
    const anio = document.getElementById("anio");
    const btnCotizar = document.getElementById("btnCotizar");
    const precioEstimado = document.getElementById("precioEstimado");
    const btnContactar = document.getElementById("btnContactar");
    const dolarPrecio = document.getElementById("dolarPrecio");

    // Mostrar/ocultar campos según el tipo de seguro seleccionado
    tipoSeguro.addEventListener("change", function () {
        if (tipoSeguro.value === "inmueble") {
            inmuebleFields.classList.remove("d-none");
            vehiculoFields.classList.add("d-none");
        } else if (tipoSeguro.value === "vehiculo") {
            inmuebleFields.classList.add("d-none");
            vehiculoFields.classList.remove("d-none");
        } else {
            inmuebleFields.classList.add("d-none");
            vehiculoFields.classList.add("d-none");
        }
    });

    // Función para calcular la cotización
    function calcularCotizacion() {
        let precioBase;
        let cotizacion;

        if (tipoSeguro.value === "inmueble") {
            const tipo = tipoInmueble.value;
            const metros = parseInt(metrosCuadrados.value);
            
            if (isNaN(metros) || metros <= 0) {
                alert("Por favor, ingrese una cantidad válida de metros cuadrados.");
                return;
            }

            switch (tipo) {
                case "casa":
                    precioBase = 10;
                    break;
                case "departamento":
                    precioBase = 8;
                    break;
                case "localComercial":
                    precioBase = 12;
                    break;
                default:
                    precioBase = 0;
            }

            cotizacion = (precioBase * metros).toFixed(2);

        } else if (tipoSeguro.value === "vehiculo") {
            const tipo = tipoVehiculo.value;
            const marcaValor = marca.value;
            const anioValor = parseInt(anio.value);

            if (!marcaValor || isNaN(anioValor) || anioValor < 1900) {
                alert("Por favor, complete todos los campos del vehículo correctamente.");
                return;
            }

            switch (tipo) {
                case "auto":
                    precioBase = 20;
                    break;
                case "camioneta":
                    precioBase = 25;
                    break;
                default:
                    precioBase = 0;
            }

            cotizacion = (precioBase * (2024 - anioValor)).toFixed(2);

        } else {
            cotizacion = "0.00";
        }

        // resultado
        precioEstimado.textContent = `USD ${cotizacion}`;
        btnContactar.classList.remove("d-none");
    }

    // Evento botón de cotizar
    btnCotizar.addEventListener("click", calcularCotizacion);

    
    // Evento botón de contactar en el modal
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Formulario de contacto enviado. Un ejecutivo se pondrá en contacto contigo.");
        $('#modalContactar').modal('hide');
    });

    function obtenerPrecioDolar() {
        fetch("https://api.bluelytics.com.ar/v2/latest")
            .then(response => response.json())
            .then(data => {
                const dolarBlue = data.blue.value_sell;
                const dolarOficial = data.oficial.value_sell;
                dolarPrecio.innerHTML = `
                    <p>USD ${dolarBlue} (Dólar Blue)</p>
                    <p>USD ${dolarOficial} (Dólar Oficial)</p>
                `;
            })
            .catch(error => {
                console.error("Error al obtener el precio del dólar:", error);
                dolarPrecio.textContent = "No se pudo obtener el precio del dólar.";
            });
    }
    
    obtenerPrecioDolar();
});