// ================================================================
// PERFIL.JS — Lógica de la página "Mi perfil"
// Vaulty+
// ================================================================

import {
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ================================================================
// TEXTOS
// ================================================================

const T = {

    es: {
        guardado: "¡Foto actualizada!",
        errorFoto: "No se pudo guardar la foto.",
        guardadoInfo: "¡Cambios guardados!",
        meses: [
            'Enero','Febrero','Marzo','Abril','Mayo','Junio',
            'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
        ],
        idiomas: {
            es: 'Español',
            en: 'English',
            fr: 'Francés',
            pt: 'Portugués',
            al: 'Alemán',
            zh: 'Chino'
        },
        usuario: 'usuario'
    },

    en: {
        guardado: "Photo updated!",
        errorFoto: "Couldn't save the photo.",
        guardadoInfo: "Changes saved!",
        meses: [
            'January','February','March','April','May','June',
            'July','August','September','October','November','December'
        ],
        idiomas: {
            es: 'Spanish',
            en: 'English',
            fr: 'French',
            pt: 'Portuguese',
            al: 'German',
            zh: 'Chinese'
        },
        usuario: 'user'
    },

    fr: {
        guardado: "Photo mise à jour !",
        errorFoto: "Impossible d'enregistrer la photo.",
        guardadoInfo: "Modifications enregistrées !",
        meses: [
            'Janvier','Février','Mars','Avril','Mai','Juin',
            'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
        ],
        idiomas: {
            es: 'Espagnol',
            en: 'Anglais',
            fr: 'Français',
            pt: 'Portugais',
            al: 'Allemand',
            zh: 'Chinois'
        },
        usuario: 'utilisateur'
    },

    pt: {
        guardado: "Foto atualizada!",
        errorFoto: "Não foi possível salvar a foto.",
        guardadoInfo: "Alterações salvas!",
        meses: [
            'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
            'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
        ],
        idiomas: {
            es: 'Espanhol',
            en: 'Inglês',
            fr: 'Francês',
            pt: 'Português',
            al: 'Alemão',
            zh: 'Chinês'
        },
        usuario: 'usuário'
    },

    al: {
        guardado: "Foto aktualisiert!",
        errorFoto: "Foto konnte nicht gespeichert werden.",
        guardadoInfo: "Änderungen gespeichert!",
        meses: [
            'Januar','Februar','März','April','Mai','Juni',
            'Juli','August','September','Oktober','November','Dezember'
        ],
        idiomas: {
            es: 'Spanisch',
            en: 'Englisch',
            fr: 'Französisch',
            pt: 'Portugiesisch',
            al: 'Deutsch',
            zh: 'Chinesisch'
        },
        usuario: 'Benutzer'
    },

    zh: {
        guardado: "头像已更新！",
        errorFoto: "无法保存照片。",
        guardadoInfo: "更改已保存！",
        meses: [
            '一月','二月','三月','四月','五月','六月',
            '七月','八月','九月','十月','十一月','十二月'
        ],
        idiomas: {
            es: '西班牙语',
            en: '英语',
            fr: '法语',
            pt: '葡萄牙语',
            al: '德语',
            zh: '中文'
        },
        usuario: '用户'
    }
};


// ================================================================
// IDIOMA
// ================================================================

function idiomaActivo() {

    const l = localStorage.getItem('lang');

    return T[l] ? l : 'es';
}

function t() {

    return T[idiomaActivo()];
}


// ================================================================
// PALETA VAULTY+
// ================================================================

const PALETA = {

    navy950: '#070c1a',
    navy800: '#16233f',
    navy700: '#1c2c4d',
    gold: '#d9a441',
    goldLight: '#f2c874'
};


// ================================================================
// ICONOS FINANCIEROS
// ================================================================

const ICONOS_FINANZAS = {

    ahorro: (fg) =>
        `<circle cx="12" cy="12" r="9"/>
         <text x="12" y="16.2"
         text-anchor="middle"
         font-size="11"
         font-weight="700"
         font-family="Arial, sans-serif"
         fill="${fg}"
         stroke="none">$</text>`,

    monedas: () =>
        `<ellipse cx="12" cy="17" rx="7" ry="2.4"/>
         <ellipse cx="12" cy="13" rx="7" ry="2.4"/>
         <ellipse cx="12" cy="9" rx="7" ry="2.4"/>`,

    metas: (fg) =>
        `<circle cx="12" cy="12" r="9"/>
         <circle cx="12" cy="12" r="5.2"/>
         <circle cx="12" cy="12" r="1.6"
         fill="${fg}" stroke="none"/>`,

    seguridad: () =>
        `<path d="M12 3l7 3v6c0 5-3.2 8.4-7 9.8C8.2 20.4 5 17 5 12V6l7-3z"/>
         <path d="M9 12.3l2.2 2.2 4-4.3"/>`,

    inversion: () =>
        `<path d="M4 16l6-6 4 4 6-7"/>
         <path d="M14 6h6v6"/>`,

    billetera: (fg) =>
        `<rect x="3" y="7" width="18" height="12" rx="2.2"/>
         <path d="M3 10.5h18"/>
         <circle cx="16.5" cy="14" r="1.3"
         fill="${fg}" stroke="none"/>`,

    educacion: () =>
        `<path d="M12 4L3 9l9 5 9-5-9-5z"/>
         <path d="M7 11.3V16c0 1.7 2.6 3 5 3s5-1.3 5-3v-4.7"/>`,

    valor: () =>
        `<path d="M4 9l4-5h8l4 5-8 11-8-11z"/>
         <path d="M4 9h16M9.5 4l-1 5 3.5 11 3.5-11-1-5"/>`,

    interes: () =>
        `<circle cx="7.5" cy="7.5" r="2.4"/>
         <circle cx="16.5" cy="16.5" r="2.4"/>
         <path d="M18 6L6 18"/>`,

    vivienda: () =>
        `<path d="M4 11.5L12 5l8 6.5"/>
         <path d="M6 10.5V19h12v-8.5"/>
         <path d="M10 19v-5.5h4V19"/>`
};


// ================================================================
// AVATARES FINANCIEROS SVG
// ================================================================

const AVATARES_FINANZAS = [

    {
        id: 'ahorro',
        nombre: 'Ahorro',
        bg: PALETA.gold,
        fg: PALETA.navy950
    },

    {
        id: 'monedas',
        nombre: 'Monedas',
        bg: PALETA.navy700,
        fg: PALETA.goldLight
    },

    {
        id: 'metas',
        nombre: 'Metas',
        bg: PALETA.goldLight,
        fg: PALETA.navy950
    },

    {
        id: 'seguridad',
        nombre: 'Seguridad',
        bg: PALETA.navy800,
        fg: PALETA.gold
    },

    {
        id: 'inversion',
        nombre: 'Inversión',
        bg: PALETA.gold,
        fg: PALETA.navy950
    },

    {
        id: 'billetera',
        nombre: 'Billetera',
        bg: PALETA.navy700,
        fg: PALETA.goldLight
    },

    {
        id: 'educacion',
        nombre: 'Educación',
        bg: PALETA.goldLight,
        fg: PALETA.navy950
    },

    {
        id: 'valor',
        nombre: 'Valor',
        bg: PALETA.navy800,
        fg: PALETA.gold
    },

    {
        id: 'interes',
        nombre: 'Interés',
        bg: PALETA.gold,
        fg: PALETA.navy950
    },

    {
        id: 'vivienda',
        nombre: 'Metas de vivienda',
        bg: PALETA.navy700,
        fg: PALETA.goldLight
    }
];


// ================================================================
// AVATARES CON IMÁGENES
// ================================================================

const AVATARES_IMAGENES = [

    {
        id: 'aguila',
        nombre: 'Águila',
        url: 'avatar/Aguilita.png'
    },

    {
        id: 'buho',
        nombre: 'Búho',
        url: 'avatar/buho.png'
    },

    {
        id: 'zorro',
        nombre: 'Zorro',
        url: 'avatar/zorro.png'
    },

    {
        id: 'puerco',
        nombre: 'Puerco',
        url: 'avatar/puerco.png'
    },

    {
        id: 'gato',
        nombre: 'Gato',
        url: 'avatar/gato.png'
    },

    {
        id: 'perro',
        nombre: 'Perro',
        url: 'avatar/perro.png'
    },

    {
        id: 'tortuga',
        nombre: 'Tortuga',
        url: 'avatar/tortuga.png'
    },

    {
        id: 'oso',
        nombre: 'Oso',
        url: 'avatar/oso.png'
    },

    {
        id: 'mariposa',
        nombre: 'Mariposa',
        url: 'avatar/mariposa.png'
    },

    {
        id: 'delfin',
        nombre: 'Delfin',
        url: 'avatar/delfin.png'
    },

    {
        id: 'dinero',
        nombre: 'Dinero',
        url: 'avatar/dinero.png'
    },

    {
        id: 'moneda',
        nombre: 'Moneda',
        url: 'avatar/moneda.png'
    },

    {
        id: 'alcancia',
        nombre: 'Alcancia',
        url: 'avatar/alcancia.png'
    },

    {
        id: 'billetera',
        nombre: 'Billetera',
        url: 'avatar/billetera.png'
    },

    {
        id: 'banco',
        nombre: 'Banco',
        url: 'avatar/banco.png'
    }
];


// ================================================================
// CREAR SVG COMO DATA URI
// ================================================================

function avatarDataUri(avatar) {

    const dibujarIcono =
        ICONOS_FINANZAS[avatar.id];

    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +

        `<circle cx="32" cy="32" r="32" fill="${avatar.bg}"/>` +

        `<g transform="translate(14,14) scale(1.5)"
        fill="none"
        stroke="${avatar.fg}"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round">` +

        dibujarIcono(avatar.fg) +

        `</g></svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}


// ================================================================
// ELEMENTOS
// ================================================================

const $ = (id) =>
    document.getElementById(id);

const elAvatar =
    $('perfilAvatar');

const elNombreCorto =
    $('perfilNombreCorto');

const elMiembroDesde =
    $('perfilMiembroDesde');

const elAvatarEstado =
    $('perfilAvatarEstado');

const elEstilosPanel =
    $('perfilEstilosPanel');

const elEstilosTabs =
    $('perfilEstilosTabs');

const elAvatarGrid =
    $('perfilAvatarGrid');

const elValorNombre =
    $('valorNombre');

const elValorUsuario =
    $('valorUsuario');

const elValorCorreo =
    $('valorCorreo');

const elValorFecha =
    $('valorFecha');

const elValorIdioma =
    $('valorIdioma');

const inputNombre =
    $('inputNombre');

const inputUsuario =
    $('inputUsuario');

const btnEditarInfo =
    $('btnEditarInfo');

const perfilGuardarWrap =
    $('perfilGuardarWrap');

const formInfoPersonal =
    $('formInfoPersonal');

const btnCancelarInfo =
    $('btnCancelarInfo');

const inputCamara =
    $('inputCamara');

const inputGaleria =
    $('inputGaleria');

const btnAvatarCam =
    $('perfilAvatarCamBtn');


// ================================================================
// ESTADO
// ================================================================

let usuarioActual = null;
let datosPerfil = null;


// ================================================================
// ESPERAR AUTH.JS
// ================================================================

function esperarVaultyAuth() {

    return new Promise((resolve) => {

        if (window.VaultyAuth) {

            return resolve(
                window.VaultyAuth
            );
        }

        const intervalo =
            setInterval(() => {

                if (window.VaultyAuth) {

                    clearInterval(intervalo);

                    resolve(
                        window.VaultyAuth
                    );
                }

            }, 30);
    });
}


// ================================================================
// UTILIDADES
// ================================================================

function iniciales(nombre) {

    return (nombre || 'U')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            p => p[0].toUpperCase()
        )
        .join('');
}


function pintarAvatar(url) {

    elAvatar.innerHTML = url

        ? `<img src="${url}" alt="Avatar">`

        : `<span>${iniciales(
            datosPerfil?.nombre
        )}</span>`;
}


function mostrarEstadoAvatar(msg) {

    elAvatarEstado.textContent = msg;

    if (msg) {

        setTimeout(() => {

            if (
                elAvatarEstado.textContent === msg
            ) {

                elAvatarEstado.textContent = '';
            }

        }, 3200);
    }
}


function docUsuarioRef() {

    const { db } =
        window.VaultyAuth;

    return doc(
        db,
        'users',
        usuarioActual.uid
    );
}


// ================================================================
// CARGAR DATOS DEL USUARIO
// ================================================================

async function cargarDatosUsuario(user) {

    const { db } =
        window.VaultyAuth;

    const datos = {

        nombre:
            user.displayName ||
            (
                user.email
                    ? user.email.split('@')[0]
                    : 'Usuario'
            ),

        usuario:
            user.email
                ? user.email.split('@')[0]
                : '',

        correo:
            user.email || '',

        fechaRegistro:
            user.metadata?.creationTime
                ? new Date(
                    user.metadata.creationTime
                )
                : null,

        photoURL:
            user.photoURL || ''
    };


    try {

        const snap =
            await getDoc(
                doc(
                    db,
                    'users',
                    user.uid
                )
            );


        if (snap.exists()) {

            const d =
                snap.data();


            if (d.fullName) {

                datos.nombre =
                    d.fullName;
            }


            if (d.username) {

                datos.usuario =
                    d.username;
            }


            if (d.photoURL) {

                datos.photoURL =
                    d.photoURL;
            }


            if (
                d.createdAt &&
                typeof d.createdAt.toDate ===
                    'function'
            ) {

                datos.fechaRegistro =
                    d.createdAt.toDate();
            }
        }

    } catch (e) {

        console.warn(
            'No se pudieron obtener datos de Firestore.',
            e
        );
    }


    return datos;
}


// ================================================================
// FECHAS
// ================================================================

function formatearFecha(fecha) {

    if (!fecha) return '—';

    const meses =
        t().meses;

    return `${fecha.getDate()} de ${meses[
        fecha.getMonth()
    ].toLowerCase()} de ${fecha.getFullYear()}`;
}


function formatearMesAno(fecha) {

    if (!fecha) return '—';

    const meses =
        t().meses;

    return `${meses[
        fecha.getMonth()
    ]} ${fecha.getFullYear()}`;
}


// ================================================================
// RENDER PERFIL
// ================================================================

function renderPerfil() {

    if (!datosPerfil) return;


    pintarAvatar(
        datosPerfil.photoURL
    );


    elNombreCorto.textContent =
        datosPerfil.nombre;


    elMiembroDesde.textContent =
        formatearMesAno(
            datosPerfil.fechaRegistro
        );


    elValorNombre.textContent =
        datosPerfil.nombre;


    elValorUsuario.textContent =
        '@' +
        (
            datosPerfil.usuario ||
            t().usuario
        );


    elValorCorreo.textContent =
        datosPerfil.correo || '—';


    elValorFecha.textContent =
        formatearFecha(
            datosPerfil.fechaRegistro
        );


    elValorIdioma.textContent =
        t().idiomas[
            idiomaActivo()
        ];


    inputNombre.value =
        datosPerfil.nombre;


    inputUsuario.value =
        datosPerfil.usuario;


    if (!elEstilosPanel.hidden) {

        renderGridAvatares();
    }
}


// ================================================================
// GRID DE AVATARES
// ================================================================

function renderGridAvatares() {

    const textos = {

        es: 'Elige un avatar',
        en: 'Choose an avatar',
        fr: 'Choisissez un avatar',
        pt: 'Escolha um avatar',
        al: 'Wähle einen Avatar',
        zh: '选择头像'
    };


    elEstilosTabs.innerHTML =

        `<p class="perfil-estilos-label">
            ${textos[idiomaActivo()]}
        </p>`;


    // ============================================================
    // AVATARES SVG
    // ============================================================

    const avataresSVG =
        AVATARES_FINANZAS
            .map(avatar => {

                const url =
                    avatarDataUri(
                        avatar
                    );


                const activo =
                    datosPerfil?.photoURL === url
                        ? ' is-active'
                        : '';


                const icono =
                    ICONOS_FINANZAS[
                        avatar.id
                    ](
                        avatar.fg
                    );


                return `

                    <button
                        type="button"
                        class="perfil-avatar-opcion${activo}"
                        data-avatar-url="${url.replace(
                            /"/g,
                            '&quot;'
                        )}"
                        title="${avatar.nombre}"
                        aria-label="${avatar.nombre}">

                        <svg
                            viewBox="0 0 64 64"
                            style="background:${avatar.bg}">

                            <g
                                transform="translate(14,14) scale(1.5)"
                                fill="none"
                                stroke="${avatar.fg}"
                                stroke-width="1.6"
                                stroke-linecap="round"
                                stroke-linejoin="round">

                                ${icono}

                            </g>

                        </svg>

                    </button>

                `;
            })
            .join('');


    // ============================================================
    // AVATARES DE IMAGEN
    // ============================================================

    const avataresImagen =
        AVATARES_IMAGENES
            .map(avatar => {

                const activo =
                    datosPerfil?.photoURL === avatar.url
                        ? ' is-active'
                        : '';


                return `

                    <button
                        type="button"
                        class="perfil-avatar-opcion${activo}"
                        data-avatar-url="${avatar.url}"
                        title="${avatar.nombre}"
                        aria-label="${avatar.nombre}">

                        <img
                            src="${avatar.url}"
                            alt="${avatar.nombre}"
                            loading="lazy">

                    </button>

                `;
            })
            .join('');


    // ============================================================
    // MOSTRAR TODOS
    // ============================================================

    elAvatarGrid.innerHTML =
        avataresSVG +
        avataresImagen;
}


// ================================================================
// GUARDAR FOTO DE PERFIL
// ================================================================

async function guardarFotoPerfil(url) {

    try {

        await setDoc(

            docUsuarioRef(),

            {
                photoURL: url
            },

            {
                merge: true
            }
        );


        datosPerfil.photoURL =
            url;


        pintarAvatar(url);


        if (!elEstilosPanel.hidden) {

            renderGridAvatares();
        }


        mostrarEstadoAvatar(
            t().guardado
        );


        try {

            await updateProfile(

                usuarioActual,

                {
                    photoURL: url
                }
            );

        } catch (errorSync) {

            console.warn(
                'No se pudo sincronizar la foto con Firebase Auth.',
                errorSync
            );
        }


        document.dispatchEvent(

            new CustomEvent(
                'vaulty:perfil-actualizado',
                {
                    detail: {
                        photoURL: url,
                        nombre:
                            datosPerfil.nombre
                    }
                }
            )
        );


    } catch (e) {

        console.error(e);

        mostrarEstadoAvatar(
            t().errorFoto
        );
    }
}


// ================================================================
// REDIMENSIONAR IMAGEN
// ================================================================

function imagenACuadradoBase64(

    dataUrlOriginal,
    lado = 320,
    calidad = 0.85

) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            img.onload = () => {

                const canvas =
                    document.createElement(
                        'canvas'
                    );


                canvas.width =
                    lado;

                canvas.height =
                    lado;


                const ctx =
                    canvas.getContext(
                        '2d'
                    );


                const escala =
                    Math.max(

                        lado /
                            img.naturalWidth,

                        lado /
                            img.naturalHeight
                    );


                const w =
                    img.naturalWidth *
                    escala;


                const h =
                    img.naturalHeight *
                    escala;


                ctx.drawImage(

                    img,

                    (lado - w) / 2,

                    (lado - h) / 2,

                    w,

                    h
                );


                resolve(

                    canvas.toDataURL(
                        'image/jpeg',
                        calidad
                    )
                );
            };


            img.onerror =
                reject;


            img.src =
                dataUrlOriginal;
        }
    );
}


// ================================================================
// MANEJAR ARCHIVO
// ================================================================

async function manejarArchivoSeleccionado(
    archivo
) {

    if (!archivo) return;


    try {

        const lector =
            new FileReader();


        const dataUrlOriginal =
            await new Promise(
                (res, rej) => {

                    lector.onload =
                        () =>
                            res(
                                lector.result
                            );


                    lector.onerror =
                        rej;


                    lector.readAsDataURL(
                        archivo
                    );
                }
            );


        const cuadrada =
            await imagenACuadradoBase64(
                dataUrlOriginal
            );


        await guardarFotoPerfil(
            cuadrada
        );


    } catch (e) {

        console.error(e);

        mostrarEstadoAvatar(
            t().errorFoto
        );
    }
}


// ================================================================
// CÁMARA / FOTOTECA
// ================================================================

$('btnTomarFoto')
    .addEventListener(
        'click',
        () =>
            inputCamara.click()
    );


$('btnFototeca')
    .addEventListener(
        'click',
        () =>
            inputGaleria.click()
    );


if (btnAvatarCam) {

    btnAvatarCam.addEventListener(
        'click',
        () =>
            inputGaleria.click()
    );
}


inputCamara.addEventListener(
    'change',
    () => {

        manejarArchivoSeleccionado(
            inputCamara.files?.[0]
        );

        inputCamara.value = '';
    }
);


inputGaleria.addEventListener(
    'change',
    () => {

        manejarArchivoSeleccionado(
            inputGaleria.files?.[0]
        );

        inputGaleria.value = '';
    }
);


// ================================================================
// ABRIR AVATARES
// ================================================================

$('btnEstilos')
    .addEventListener(
        'click',
        () => {

            const abrir =
                elEstilosPanel.hidden;


            elEstilosPanel.hidden =
                !abrir;


            if (abrir) {

                renderGridAvatares();
            }
        }
    );


// ================================================================
// SELECCIONAR AVATAR
// ================================================================

elAvatarGrid.addEventListener(
    'click',
    (ev) => {

        const boton =
            ev.target.closest(
                '[data-avatar-url]'
            );


        if (!boton) return;


        guardarFotoPerfil(
            boton.dataset.avatarUrl
        );
    }
);


// ================================================================
// EDITAR INFORMACIÓN PERSONAL
// ================================================================

function activarModoEdicion(
    activar
) {

    [
        elValorNombre,
        elValorUsuario
    ]
        .forEach(el => {

            el.hidden =
                activar;
        });


    [
        inputNombre,
        inputUsuario
    ]
        .forEach(el => {

            el.hidden =
                !activar;
        });


    perfilGuardarWrap.hidden =
        !activar;


    btnEditarInfo.classList.toggle(
        'is-activo',
        activar
    );


    btnEditarInfo.hidden =
        activar;


    if (activar) {

        inputNombre.focus();
    }
}


btnEditarInfo.addEventListener(
    'click',
    () =>
        activarModoEdicion(true)
);


btnCancelarInfo.addEventListener(
    'click',
    () => {

        inputNombre.value =
            datosPerfil.nombre;

        inputUsuario.value =
            datosPerfil.usuario;

        activarModoEdicion(false);
    }
);


// ================================================================
// GUARDAR INFORMACIÓN
// ================================================================

formInfoPersonal.addEventListener(
    'submit',
    async (ev) => {

        ev.preventDefault();


        const nuevoNombre =
            inputNombre.value.trim() ||
            datosPerfil.nombre;


        const nuevoUsuario =
            inputUsuario.value
                .trim()
                .replace(/\s+/g, '') ||
            datosPerfil.usuario;


        try {

            const cambios = {

                fullName:
                    nuevoNombre,

                username:
                    nuevoUsuario
            };


            if (
                !datosPerfil.fechaRegistro
            ) {

                cambios.createdAt =
                    serverTimestamp();
            }


            await setDoc(

                docUsuarioRef(),

                cambios,

                {
                    merge: true
                }
            );


            if (
                usuarioActual.displayName !==
                nuevoNombre
            ) {

                await updateProfile(

                    usuarioActual,

                    {
                        displayName:
                            nuevoNombre
                    }
                );
            }


            datosPerfil.nombre =
                nuevoNombre;


            datosPerfil.usuario =
                nuevoUsuario;


            renderPerfil();


            activarModoEdicion(
                false
            );


            mostrarEstadoAvatar(
                t().guardadoInfo
            );


            document.dispatchEvent(

                new CustomEvent(
                    'vaulty:perfil-actualizado',
                    {
                        detail: {

                            photoURL:
                                datosPerfil.photoURL,

                            nombre:
                                nuevoNombre
                        }
                    }
                )
            );


        } catch (e) {

            console.error(e);
        }
    }
);


// ================================================================
// CERRAR SESIÓN
// ================================================================

$('perfilLogout')
    .addEventListener(
        'click',
        () =>
            window.VaultyAuth
                .cerrarSesion()
    );


// ================================================================
// ACTUALIZAR AL CAMBIAR IDIOMA
// ================================================================

document.addEventListener(
    'click',
    (ev) => {

        if (
            !ev.target.closest(
                '.lang-option'
            )
        ) {

            return;
        }


        setTimeout(
            () => {

                if (datosPerfil) {

                    renderPerfil();
                }

            },
            0
        );
    }
);


// ================================================================
// ARRANQUE
// ================================================================

esperarVaultyAuth()
    .then(({ auth }) => {

        onAuthStateChanged(

            auth,

            async (user) => {

                if (!user) {

                    window.location.href =
                        'inicio_sesion.html';

                    return;
                }


                usuarioActual =
                    user;


                datosPerfil =
                    await cargarDatosUsuario(
                        user
                    );


                renderPerfil();
            }
        );
    });
