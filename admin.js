/* =========================================================
   PANEL ADMINISTRADOR
   MAPA DE CALOR DE LA SECCIÓN DE BANCOS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    const STORAGE_KEY = "heatmap_bancos";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const totalVisitas =
        document.getElementById("totalVisitas");

    const totalClics =
        document.getElementById("totalClics");

    const bancoMasClickeado =
        document.getElementById("bancoMasClickeado");

    const listaBancos =
        document.getElementById("listaBancos");

    const tablaClics =
        document.getElementById("tablaClics");

    const canvas =
        document.getElementById("heatmapCanvas");

    const btnActualizar =
        document.getElementById("btnActualizar");

    const btnEliminarDatos =
        document.getElementById("btnEliminarDatos");


    /* =====================================================
       OBTENER DATOS
    ===================================================== */

    function obtenerDatos() {

        const datos =
            localStorage.getItem(STORAGE_KEY);

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
       CONTAR CLICS POR BANCO
    ===================================================== */

    function contarBancos(clics) {

        const conteo = {};

        clics.forEach(click => {

            if (!conteo[click.banco]) {

                conteo[click.banco] = 0;

            }

            conteo[click.banco]++;

        });

        return conteo;

    }


    /* =====================================================
       MOSTRAR ESTADÍSTICAS
    ===================================================== */

    function mostrarEstadisticas(datos) {

        totalVisitas.textContent =
            datos.visitas;

        totalClics.textContent =
            datos.clics.length;


        const conteo =
            contarBancos(datos.clics);


        const bancos =
            Object.entries(conteo);


        if (bancos.length === 0) {

            bancoMasClickeado.textContent =
                "-";

            return;

        }


        bancos.sort(
            (a, b) => b[1] - a[1]
        );


        bancoMasClickeado.textContent =
            bancos[0][0];

    }


    /* =====================================================
       MOSTRAR BANCOS
    ===================================================== */

    function mostrarBancos(datos) {

        listaBancos.innerHTML = "";


        const conteo =
            contarBancos(datos.clics);


        const bancos = [

            "Banco Nacional de Panamá",

            "Caja de Ahorros",

            "Banco General",

            "Banistmo",

            "BAC",

            "Banesco",

            "Global Bank"

        ];


        let maximo = 0;


        bancos.forEach(banco => {

            const cantidad =
                conteo[banco] || 0;

            if (cantidad > maximo) {

                maximo = cantidad;

            }

        });


        bancos.forEach(banco => {

            const cantidad =
                conteo[banco] || 0;


            let porcentaje = 0;


            if (maximo > 0) {

                porcentaje =
                    (cantidad / maximo) * 100;

            }


            const fila =
                document.createElement("div");

            fila.className =
                "banco-row";


            fila.innerHTML = `

                <div class="banco-nombre">
                    ${banco}
                </div>

                <div class="barra-fondo">

                    <div
                        class="barra"
                        style="width: ${porcentaje}%">
                    </div>

                </div>

                <div class="banco-cantidad">
                    ${cantidad}
                </div>

            `;


            listaBancos.appendChild(fila);

        });

    }


    /* =====================================================
       TABLA DE CLICS
    ===================================================== */

    function mostrarTabla(datos) {

        tablaClics.innerHTML = "";


        const clics =
            [...datos.clics].reverse();


        clics.forEach(click => {

            const fila =
                document.createElement("tr");


            const fecha =
                new Date(click.fecha);


            fila.innerHTML = `

                <td>
                    ${click.banco}
                </td>

                <td>
                    ${fecha.toLocaleString()}
                </td>

                <td>
                    ${click.x.toFixed(2)}%
                </td>

                <td>
                    ${click.y.toFixed(2)}%
                </td>

            `;


            tablaClics.appendChild(fila);

        });

    }


    /* =====================================================
       PREPARAR CANVAS
    ===================================================== */

    function prepararCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;


        canvas.width =
            rect.width * dpr;

        canvas.height =
            rect.height * dpr;


        const ctx =
            canvas.getContext("2d");

        ctx.scale(dpr, dpr);

    }


    /* =====================================================
       DIBUJAR ESTRUCTURA DE LA SECCIÓN
       
       No es una copia pixel-perfect del HTML,
       sino una representación visual de la sección.
    ===================================================== */

    function dibujarSeccion(ctx, width, height) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* Fondo */

        ctx.fillStyle = "#f8fafc";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Título */

        ctx.fillStyle = "#172033";

        ctx.font =
            "bold 26px Arial";

        ctx.fillText(
            "¿Dónde podemos ahorrar en Panamá?",
            35,
            45
        );


        /* Introducción */

        ctx.fillStyle = "#64748b";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            "En Panamá existen bancos seguros y regulados donde puedes abrir cuentas y productos de ahorro.",
            35,
            75
        );


        /* Subtítulo */

        ctx.fillStyle = "#172033";

        ctx.font =
            "bold 19px Arial";

        ctx.fillText(
            "Formas de ahorrar",
            35,
            125
        );


        /* Tarjetas formas de ahorrar */

        const anchoTarjeta =
            (width - 100) / 3;


        for (let i = 0; i < 3; i++) {

            const x =
                25 + i * (anchoTarjeta + 25);

            ctx.fillStyle = "#ffffff";

            ctx.strokeStyle = "#dbe3ed";

            ctx.beginPath();

            ctx.roundRect(
                x,
                150,
                anchoTarjeta,
                115,
                10
            );

            ctx.fill();

            ctx.stroke();

        }


        /* Entidades */

        ctx.fillStyle = "#172033";

        ctx.font =
            "bold 19px Arial";

        ctx.fillText(
            "Entidades en Panamá",
            35,
            310
        );


        /* Bancos */

        const bancos = [

            "Banco Nacional",

            "Caja de Ahorros",

            "Banco General",

            "Banistmo",

            "BAC",

            "Banesco",

            "Global Bank"

        ];


        const columnas = 3;

        const filas =
            Math.ceil(
                bancos.length / columnas
            );


        const anchoBanco =
            (width - 100) / columnas;


        const altoBanco = 150;


        bancos.forEach((banco, index) => {

            const columna =
                index % columnas;

            const fila =
                Math.floor(index / columnas);


            const x =
                25 +
                columna *
                (anchoBanco + 25);


            const y =
                340 +
                fila *
                (altoBanco + 20);


            ctx.fillStyle =
                "#ffffff";

            ctx.strokeStyle =
                "#dbe3ed";


            ctx.beginPath();

            ctx.roundRect(
                x,
                y,
                anchoBanco,
                altoBanco,
                10
            );

            ctx.fill();

            ctx.stroke();


            ctx.fillStyle =
                "#172033";

            ctx.font =
                "bold 14px Arial";


            ctx.fillText(
                banco,
                x + 15,
                y + 30
            );


            ctx.fillStyle =
                "#2563eb";

            ctx.font =
                "13px Arial";


            ctx.fillText(
                "Sitio oficial",
                x + 15,
                y + 120
            );

        });


        /* Recuerda */

        const recuerdaY =
            340 +
            filas *
            (altoBanco + 20) +
            20;


        ctx.fillStyle =
            "#eff6ff";

        ctx.strokeStyle =
            "#bfdbfe";


        ctx.beginPath();

        ctx.roundRect(
            25,
            recuerdaY,
            width - 50,
            100,
            10
        );

        ctx.fill();

        ctx.stroke();


        ctx.fillStyle =
            "#172033";

        ctx.font =
            "bold 16px Arial";


        ctx.fillText(
            "Recuerda",
            45,
            recuerdaY + 30
        );


        ctx.font =
            "13px Arial";

        ctx.fillStyle =
            "#475569";


        ctx.fillText(
            "Compara las condiciones, intereses y requisitos de cada entidad.",
            45,
            recuerdaY + 58
        );

    }


    /* =====================================================
       DIBUJAR PUNTO DE CALOR
    ===================================================== */

    function dibujarPuntoCalor(
        ctx,
        x,
        y,
        intensidad
    ) {

        const radio =
            35 + intensidad * 20;


        const gradiente =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radio
            );


        gradiente.addColorStop(
            0,
            "rgba(239,68,68,0.75)"
        );


        gradiente.addColorStop(
            0.25,
            "rgba(249,115,22,0.60)"
        );


        gradiente.addColorStop(
            0.50,
            "rgba(234,179,8,0.40)"
        );


        gradiente.addColorStop(
            0.75,
            "rgba(34,197,94,0.22)"
        );


        gradiente.addColorStop(
            1,
            "rgba(59,130,246,0)"
        );


        ctx.fillStyle =
            gradiente;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radio,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    /* =====================================================
       MAPA DE CALOR
    ===================================================== */

    function dibujarHeatmap(datos) {

        prepararCanvas();


        const rect =
            canvas.getBoundingClientRect();


        const width =
            rect.width;

        const height =
            rect.height;


        const ctx =
            canvas.getContext("2d");


        /* Dibujar representación */

        dibujarSeccion(
            ctx,
            width,
            height
        );


        if (datos.clics.length === 0) {

            ctx.fillStyle =
                "rgba(100,116,139,0.8)";

            ctx.font =
                "16px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                "Todavía no existen clics registrados",
                width / 2,
                height / 2
            );


            ctx.textAlign =
                "left";

            return;

        }


        /* =================================================
           CALCULAR REPETICIONES
        ================================================= */

        const posiciones = {};


        datos.clics.forEach(click => {

            /*
             * Agrupamos puntos cercanos.
             */

            const gridX =
                Math.round(click.x * 2) / 2;

            const gridY =
                Math.round(click.y * 2) / 2;


            const key =
                `${gridX}_${gridY}`;


            if (!posiciones[key]) {

                posiciones[key] = {

                    x: click.x,

                    y: click.y,

                    cantidad: 0

                };

            }


            posiciones[key].cantidad++;

        });


        const puntos =
            Object.values(posiciones);


        let maximo = 0;


        puntos.forEach(punto => {

            if (
                punto.cantidad >
                maximo
            ) {

                maximo =
                    punto.cantidad;

            }

        });


        /* =================================================
           DIBUJAR CADA PUNTO
        ================================================= */

        puntos.forEach(punto => {

            const x =
                (punto.x / 100) *
                width;


            const y =
                (punto.y / 100) *
                height;


            const intensidad =
                punto.cantidad /
                maximo;


            dibujarPuntoCalor(
                ctx,
                x,
                y,
                intensidad
            );

        });

    }


    /* =====================================================
       ACTUALIZAR TODO
    ===================================================== */

    function actualizar() {

        const datos =
            obtenerDatos();


        mostrarEstadisticas(
            datos
        );


        mostrarBancos(
            datos
        );


        mostrarTabla(
            datos
        );


        dibujarHeatmap(
            datos
        );

    }


    /* =====================================================
       BOTÓN ACTUALIZAR
    ===================================================== */

    btnActualizar.addEventListener(
        "click",
        actualizar
    );


    /* =====================================================
       ELIMINAR DATOS
    ===================================================== */

    btnEliminarDatos.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "¿Seguro que deseas eliminar todos los datos?"
                );


            if (!confirmar) {
                return;
            }


            localStorage.removeItem(
                STORAGE_KEY
            );


            alert(
                "Los datos fueron eliminados."
            );


            actualizar();

        }
    );


    /* =====================================================
       REDIBUJAR SI CAMBIA EL TAMAÑO
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            const datos =
                obtenerDatos();

            dibujarHeatmap(
                datos
            );

        }
    );


    /* =====================================================
       INICIAR
    ===================================================== */

    actualizar();

});