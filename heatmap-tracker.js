/* =========================================================
   MAPA DE CALOR - SECCIÓN ¿DÓNDE PODEMOS AHORRAR?
   Guarda los clics utilizando localStorage
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const seccion = document.querySelector(".donde-ahorrar-section");

    // Si la sección no existe, no hacemos nada
    if (!seccion) {
        return;
    }

    const STORAGE_KEY = "heatmap_bancos";

    /* =====================================================
       OBTENER DATOS EXISTENTES
    ===================================================== */

    function obtenerDatos() {

        const datos = localStorage.getItem(STORAGE_KEY);

        if (!datos) {
            return {
                visitas: 0,
                clics: []
            };
        }

        try {
            return JSON.parse(datos);
        } catch (error) {

            console.error("Error leyendo localStorage:", error);

            return {
                visitas: 0,
                clics: []
            };
        }
    }


    /* =====================================================
       REGISTRAR VISITA
    ===================================================== */

    const datos = obtenerDatos();

    datos.visitas++;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(datos)
    );


    /* =====================================================
       DETECTAR CLICS
       
       Usamos delegación de eventos para que funcione
       incluso si posteriormente tu JS modifica el HTML.
    ===================================================== */

    seccion.addEventListener("click", (event) => {

        const enlace = event.target.closest("a");

        // Si el clic no fue en un <a>, ignorarlo
        if (!enlace) {
            return;
        }

        // Confirmar que el enlace pertenece a esta sección
        if (!seccion.contains(enlace)) {
            return;
        }


        /* =================================================
           IDENTIFICAR BANCO
        ================================================= */

        const tarjeta = enlace.closest(".entidad-banco-card");

        let banco = "Desconocido";

        if (tarjeta) {

            const titulo = tarjeta.querySelector("h4");

            if (titulo) {
                banco = titulo.textContent.trim();
            }
        }


        /* =================================================
           POSICIÓN DEL CLIC
           
           La posición se guarda de forma relativa a la
           sección para que posteriormente podamos dibujar
           el mapa de calor independientemente del tamaño
           de la pantalla.
        ================================================= */

        const rect = seccion.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Convertimos a porcentaje
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;


        /* =================================================
           CREAR REGISTRO
        ================================================= */

        const nuevoClick = {

            banco: banco,

            x: xPercent,

            y: yPercent,

            fecha: new Date().toISOString(),

            pagina: window.location.pathname

        };


        /* =================================================
           GUARDAR
        ================================================= */

        const datosActualizados = obtenerDatos();

        datosActualizados.clics.push(nuevoClick);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(datosActualizados)
        );


        console.log(
            `Click registrado: ${banco}`,
            nuevoClick
        );

    });

});