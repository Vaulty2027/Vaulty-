/* =========================================================
   ADMINISTRADOR - SECCIÓN DE BANCOS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    const STORAGE_KEY =
        "heatmap_seccion_bancos";


    const bancos = [

        "Global Bank",

        "Banistmo",

        "Banco General",

        "Caja de Ahorros",

        "BAC Credomatic",

        "Banco Nacional"

    ];


    const totalVisitas =
        document.getElementById(
            "totalVisitas"
        );


    const totalClics =
        document.getElementById(
            "totalClics"
        );


    const bancoMasClickeado =
        document.getElementById(
            "bancoMasClickeado"
        );


    const accionMasUtilizada =
        document.getElementById(
            "accionMasUtilizada"
        );


    const listaBancos =
        document.getElementById(
            "listaBancos"
        );


    const detalleBancos =
        document.getElementById(
            "detalleBancos"
        );


    const tablaClics =
        document.getElementById(
            "tablaClics"
        );


    const canvas =
        document.getElementById(
            "heatmapCanvas"
        );


    /* =====================================================
       OBTENER DATOS
    ===================================================== */

    function obtenerDatos() {

        const datos =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!datos) {

            return {
                visitas: 0,
                clics: []
            };

        }


        try {

            return JSON.parse(datos);

        } catch {

            return {
                visitas: 0,
                clics: []
            };

        }

    }


    /* =====================================================
       CONTAR POR BANCO
    ===================================================== */

    function contarBancos(clics) {

        const resultado = {};


        bancos.forEach(banco => {

            resultado[banco] = 0;

        });


        clics.forEach(click => {

            if (
                resultado[click.banco]
                !== undefined
            ) {

                resultado[click.banco]++;

            }

        });


        return resultado;

    }


    /* =====================================================
       ESTADÍSTICAS
    ===================================================== */

    function actualizarEstadisticas(datos) {

        totalVisitas.textContent =
            datos.visitas;


        totalClics.textContent =
            datos.clics.length;


        const conteo =
            contarBancos(
                datos.clics
            );


        let bancoMayor = "-";

        let cantidadMayor = 0;


        Object.entries(
            conteo
        ).forEach(
            ([banco, cantidad]) => {

                if (
                    cantidad >
                    cantidadMayor
                ) {

                    cantidadMayor =
                        cantidad;

                    bancoMayor =
                        banco;

                }

            }
        );


        bancoMasClickeado.textContent =
            bancoMayor;


        let masInfo = 0;

        let requisitos = 0;


        datos.clics.forEach(
            click => {

                if (
                    click.tipo ===
                    "Más información"
                ) {

                    masInfo++;

                }


                if (
                    click.tipo ===
                    "Ver requisitos"
                ) {

                    requisitos++;

                }

            }
        );


        accionMasUtilizada.textContent =
            masInfo >= requisitos
                ? "Más información"
                : "Ver requisitos";

    }


    /* =====================================================
       BARRAS POR BANCO
    ===================================================== */

    function mostrarBancos(datos) {

        listaBancos.innerHTML = "";


        const conteo =
            contarBancos(
                datos.clics
            );


        const maximo =
            Math.max(
                ...Object.values(
                    conteo
                ),
                1
            );


        bancos.forEach(banco => {

            const cantidad =
                conteo[banco];


            const porcentaje =
                (cantidad / maximo) *
                100;


            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "banco-row";


            fila.innerHTML = `

                <div class="banco-nombre">
                    ${banco}
                </div>

                <div class="barra-fondo">

                    <div
                        class="barra"
                        style="width:${porcentaje}%">
                    </div>

                </div>

                <strong>
                    ${cantidad}
                </strong>

            `;


            listaBancos.appendChild(
                fila
            );

        });

    }


    /* =====================================================
       DETALLE DE ACCIONES
    ===================================================== */

    function mostrarDetalle(datos) {

        detalleBancos.innerHTML = "";


        bancos.forEach(banco => {

            let informacion = 0;

            let requisitos = 0;


            datos.clics.forEach(
                click => {

                    if (
                        click.banco ===
                        banco
                    ) {

                        if (
                            click.tipo ===
                            "Más información"
                        ) {

                            informacion++;

                        }


                        if (
                            click.tipo ===
                            "Ver requisitos"
                        ) {

                            requisitos++;

                        }

                    }

                }
            );


            const fila =
                document.createElement(
                    "div"
                );


            fila.className =
                "detalle-row";


            fila.innerHTML = `

                <div>

                    <strong>
                        ${banco}
                    </strong>

                </div>

                <div>
                    Más información:
                    <strong>
                        ${informacion}
                    </strong>
                </div>

                <div>
                    Ver requisitos:
                    <strong>
                        ${requisitos}
                    </strong>
                </div>

            `;


            detalleBancos.appendChild(
                fila
            );

        });

    }


    /* =====================================================
       TABLA
    ===================================================== */

    function mostrarTabla(datos) {

        tablaClics.innerHTML = "";


        const clics =
            [...datos.clics]
            .reverse();


        clics.forEach(click => {

            const fila =
                document.createElement(
                    "tr"
                );


            const fecha =
                new Date(
                    click.fecha
                );


            fila.innerHTML = `

                <td>
                    ${click.banco}
                </td>

                <td>
                    ${click.tipo}
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


            tablaClics.appendChild(
                fila
            );

        });

    }


    /* =====================================================
       CANVAS
    ===================================================== */

    function prepararCanvas() {

        const rect =
            canvas.getBoundingClientRect();


        const dpr =
            window.devicePixelRatio ||
            1;


        canvas.width =
            rect.width * dpr;


        canvas.height =
            rect.height * dpr;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.scale(
            dpr,
            dpr
        );

    }


    /* =====================================================
       DIBUJAR SECCIÓN
    ===================================================== */

    function dibujarSeccion(
        ctx,
        width,
        height
    ) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* Fondo */

        ctx.fillStyle =
            "#f8fafc";


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Título */

        ctx.fillStyle =
            "#172033";


        ctx.font =
            "bold 26px Arial";


        ctx.fillText(
            "Bancos aliados",
            30,
            45
        );


        /* Bancos */

        const columnas = 3;

        const ancho =
            (width - 90) /
            columnas;


        const alto = 190;


        bancos.forEach(
            (banco, index) => {

                const columna =
                    index %
                    columnas;


                const fila =
                    Math.floor(
                        index /
                        columnas
                    );


                const x =
                    20 +
                    columna *
                    (ancho + 25);


                const y =
                    80 +
                    fila *
                    (alto + 25);


                /* Card */

                ctx.fillStyle =
                    "#ffffff";


                ctx.strokeStyle =
                    "#dbe3ed";


                ctx.beginPath();


                ctx.roundRect(
                    x,
                    y,
                    ancho,
                    alto,
                    12
                );


                ctx.fill();

                ctx.stroke();


                /* Nombre */

                ctx.fillStyle =
                    "#172033";


                ctx.font =
                    "bold 16px Arial";


                ctx.fillText(
                    banco,
                    x + 15,
                    y + 35
                );


                /* Botones */

                ctx.fillStyle =
                    "#2563eb";


                ctx.font =
                    "13px Arial";


                ctx.fillText(
                    "Más información",
                    x + 15,
                    y + alto - 50
                );


                ctx.fillStyle =
                    "#475569";


                ctx.fillText(
                    "Ver requisitos",
                    x + 15,
                    y + alto - 25
                );

            }
        );

    }


    /* =====================================================
       PUNTOS DE CALOR
    ===================================================== */

    function dibujarPunto(
        ctx,
        x,
        y,
        intensidad
    ) {

        const radio =
            30 +
            intensidad * 30;


        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radio
            );


        gradient.addColorStop(
            0,
            "rgba(239,68,68,0.80)"
        );


        gradient.addColorStop(
            0.25,
            "rgba(249,115,22,0.65)"
        );


        gradient.addColorStop(
            0.50,
            "rgba(234,179,8,0.45)"
        );


        gradient.addColorStop(
            0.75,
            "rgba(34,197,94,0.20)"
        );


        gradient.addColorStop(
            1,
            "rgba(59,130,246,0)"
        );


        ctx.fillStyle =
            gradient;


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
            canvas.getContext(
                "2d"
            );


        dibujarSeccion(
            ctx,
            width,
            height
        );


        if (
            datos.clics.length === 0
        ) {

            ctx.fillStyle =
                "#64748b";


            ctx.font =
                "16px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                "Todavía no hay clics registrados",
                width / 2,
                height / 2
            );


            ctx.textAlign =
                "left";


            return;

        }


        /* Agrupar clics cercanos */

        const posiciones = {};


        datos.clics.forEach(
            click => {

                const x =
                    Math.round(
                        click.x * 2
                    ) / 2;


                const y =
                    Math.round(
                        click.y * 2
                    ) / 2;


                const key =
                    `${x}_${y}`;


                if (
                    !posiciones[key]
                ) {

                    posiciones[key] = {

                        x: click.x,

                        y: click.y,

                        cantidad: 0

                    };

                }


                posiciones[key]
                    .cantidad++;

            }
        );


        const puntos =
            Object.values(
                posiciones
            );


        const maximo =
            Math.max(
                ...puntos.map(
                    p =>
                        p.cantidad
                ),
                1
            );


        puntos.forEach(
            punto => {

                const x =
                    (
                        punto.x /
                        100
                    ) * width;


                const y =
                    (
                        punto.y /
                        100
                    ) * height;


                const intensidad =
                    punto.cantidad /
                    maximo;


                dibujarPunto(
                    ctx,
                    x,
                    y,
                    intensidad
                );

            }
        );

    }


    /* =====================================================
       ACTUALIZAR
    ===================================================== */

    function actualizar() {

        const datos =
            obtenerDatos();


        actualizarEstadisticas(
            datos
        );


        mostrarBancos(
            datos
        );


        mostrarDetalle(
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

    document
        .getElementById(
            "btnActualizar"
        )
        .addEventListener(
            "click",
            actualizar
        );


    /* =====================================================
       ELIMINAR DATOS
    ===================================================== */

    document
        .getElementById(
            "btnEliminarDatos"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "¿Eliminar todos los datos?"
                    )
                ) {

                    return;

                }


                localStorage.removeItem(
                    STORAGE_KEY
                );


                actualizar();


                alert(
                    "Datos eliminados."
                );

            }
        );


    /* =====================================================
       REDIMENSIONAR
    ===================================================== */

    window.addEventListener(
        "resize",
        actualizar
    );


    /* =====================================================
       INICIAR
    ===================================================== */

    actualizar();

});