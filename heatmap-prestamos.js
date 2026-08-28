/* =========================================================
   ANALÍTICA DE LA SECCIÓN DE BANCOS
   Guarda clics en localStorage
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const seccion = document.querySelector(".bancos-section");

    if (!seccion) {
        return;
    }

    const STORAGE_KEY = "heatmap_seccion_bancos";


    /* =====================================================
       OBTENER DATOS
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

            console.error(
                "Error leyendo datos:",
                error
            );

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
    ===================================================== */

    seccion.addEventListener("click", (event) => {

        const enlace =
            event.target.closest("a");


        if (!enlace) {
            return;
        }


        if (!seccion.contains(enlace)) {
            return;
        }


        /* =================================================
           OBTENER BANCO
        ================================================= */

        const tarjeta =
            enlace.closest(".banco-card");


        if (!tarjeta) {
            return;
        }


        const banco =
            tarjeta.dataset.banco ||
            "Banco desconocido";


        /* =================================================
           IDENTIFICAR TIPO DE ENLACE
        ================================================= */

        let tipo = "Otro";


        const claseRequisitos =
            enlace.classList.contains(
                "banco-requisitos-link"
            );


        if (claseRequisitos) {

            tipo = "Ver requisitos";

        } else {

            tipo = "Más información";

        }


        /* =================================================
           POSICIÓN DEL CLIC
        ================================================= */

        const rect =
            seccion.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        /* =================================================
           CONVERTIR A PORCENTAJE
        ================================================= */

        const xPercent =
            (x / rect.width) * 100;


        const yPercent =
            (y / rect.height) * 100;


        /* =================================================
           CREAR REGISTRO
        ================================================= */

        const nuevoClick = {

            banco: banco,

            tipo: tipo,

            x: xPercent,

            y: yPercent,

            fecha:
                new Date().toISOString(),

            pagina:
                window.location.pathname

        };


        /* =================================================
           GUARDAR
        ================================================= */

        const datosActualizados =
            obtenerDatos();


        datosActualizados.clics.push(
            nuevoClick
        );


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                datosActualizados
            )
        );


        console.log(
            "Clic registrado:",
            nuevoClick
        );

    });

});