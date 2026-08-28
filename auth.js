// ================================================================
// AUTH.JS — Firebase + autenticación + 6 idiomas
// Vaulty+
// ================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ================================================================
// FIREBASE
// ================================================================

const firebaseConfig = {
    apiKey: "AIzaSyBBepHzYPwHrw8wQuFNL_l1_AB5ESj9rio",
    authDomain: "vaulty-b424c.firebaseapp.com",
    projectId: "vaulty-b424c",
    storageBucket: "vaulty-b424c.firebasestorage.app",
    messagingSenderId: "809116620693",
    appId: "1:809116620693:web:392a1a0d9999f826c1489c",
    measurementId: "G-QKHD8GL492"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ================================================================
// IDIOMAS
// ================================================================

const AUTH_IDIOMAS = {

    es: {
        register: "Regístrate",
        login: "Iniciar sesión",
        profile: "Mi perfil",
        logout: "Cerrar sesión",
        memberSince: "Miembro desde",
        user: "usuario"
    },

    en: {
        register: "Sign up",
        login: "Log in",
        profile: "My profile",
        logout: "Log out",
        memberSince: "Member since",
        user: "user"
    },

    fr: {
        register: "S'inscrire",
        login: "Se connecter",
        profile: "Mon profil",
        logout: "Se déconnecter",
        memberSince: "Membre depuis",
        user: "utilisateur"
    },

    pt: {
        register: "Registre-se",
        login: "Iniciar sessão",
        profile: "Meu perfil",
        logout: "Sair",
        memberSince: "Membro desde",
        user: "usuário"
    },

    al: {
        register: "Registrieren",
        login: "Anmelden",
        profile: "Mein Profil",
        logout: "Abmelden",
        memberSince: "Mitglied seit",
        user: "Benutzer"
    },

    zh: {
        register: "注册",
        login: "登录",
        profile: "我的资料",
        logout: "退出登录",
        memberSince: "加入时间",
        user: "用户"
    }

};


// ================================================================
// OBTENER IDIOMA ACTUAL
// ================================================================

function obtenerIdioma() {

    const idioma =
        localStorage.getItem('lang') || 'es';

    return AUTH_IDIOMAS[idioma]
        ? idioma
        : 'es';
}

function T() {

    return AUTH_IDIOMAS[
        obtenerIdioma()
    ];
}


// ================================================================
// MESES
// ================================================================

const MESES = {

    es: [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],

    en: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ],

    fr: [
        'Janvier', 'Février', 'Mars', 'Avril',
        'Mai', 'Juin', 'Juillet', 'Août',
        'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],

    pt: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],

    al: [
        'Januar', 'Februar', 'März', 'April',
        'Mai', 'Juni', 'Juli', 'August',
        'September', 'Oktober', 'November', 'Dezember'
    ],

    zh: [
        '一月', '二月', '三月', '四月',
        '五月', '六月', '七月', '八月',
        '九月', '十月', '十一月', '十二月'
    ]

};


// ================================================================
// INICIALES
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


// ================================================================
// ⭐ AVATAR DEL USUARIO
// ================================================================
// Si tiene foto → muestra la foto.
// Si no tiene foto → muestra las iniciales.
//
// Esto hace que la misma foto elegida en perfil.html
// aparezca también en el Nav.
// ================================================================

function construirAvatarHTML(
    usuario,
    claseExtra = ''
) {

    const foto =
        usuario.photoURL || '';

    const nombre =
        usuario.nombre || 'Usuario';

    const inic =
        iniciales(nombre);


    if (foto) {

        return `
            <span
                class="auth-avatar ${claseExtra}"
            >
                <img
                    src="${foto}"
                    alt="Avatar de ${nombre}"
                    class="auth-avatar-img"
                >
            </span>
        `;

    }


    return `
        <span
            class="auth-avatar ${claseExtra}"
        >
            ${inic}
        </span>
    `;
}


// ================================================================
// ICONOS
// ================================================================

const ICONOS = {

    perfil: `
        <svg viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9V21h19.6v-1.7c0-3.3-6.5-4.9-9.8-4.9z"/>
        </svg>
    `,

    salir: `
        <svg viewBox="0 0 24 24">
            <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H10a2 2 0 00-2 2v4h2V5h9v14h-9v-4H8v4a2 2 0 002 2h9a2 2 0 002-2V5a2 2 0 00-2-2z"/>
        </svg>
    `

};


// ================================================================
// MENÚ DEL PERFIL
// SOLO "MI PERFIL"
// ================================================================

function menuItemsHTML() {

    const t = T();

    return `

        <li>

            <a href="perfil.html">

                ${ICONOS.perfil}

                <span>
                    ${t.profile}
                </span>

            </a>

        </li>

    `;
}


// ================================================================
// CERRAR SESIÓN
// ================================================================

async function cerrarSesion() {

    try {

        await signOut(auth);

    } catch (e) {

        console.error(
            'Error al cerrar sesión:',
            e
        );

    }

    window.location.href =
        'index.html';
}


// ================================================================
// API GLOBAL
// ================================================================

window.VaultyAuth = {

    cerrarSesion,
    auth,
    db

};


// ================================================================
// DATOS DEL USUARIO
// ================================================================

async function obtenerDatosUsuario(user) {

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

        miembroDesde: '',

        // ⭐ FOTO DESDE FIREBASE AUTH
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


            // ====================================================
            // ⭐ FOTO DESDE FIRESTORE
            // ====================================================
            // Tiene prioridad la foto guardada en Firestore.
            // Esto permite que los avatares personalizados
            // elegidos desde perfil.html aparezcan en el Nav.
            // ====================================================

            if (d.photoURL) {

                datos.photoURL =
                    d.photoURL;

            }


            if (
                d.createdAt &&
                typeof d.createdAt.toDate ===
                    'function'
            ) {

                const fecha =
                    d.createdAt.toDate();

                const idioma =
                    obtenerIdioma();


                datos.miembroDesde =
                    MESES[idioma][
                        fecha.getMonth()
                    ] +
                    ' ' +
                    fecha.getFullYear();

            }

        }

    } catch (e) {

        console.warn(
            'No se pudieron obtener los datos de Firestore.',
            e
        );

    }


    return datos;
}


// ================================================================
// DROPDOWN DEL PERFIL — ESCRITORIO
// ================================================================

function construirDropdownHTML(usuario) {

    const t = T();

    const nombre =
        usuario.nombre ||
        'Usuario';

    const primerNombre =
        nombre.split(' ')[0];


    return `

        <div
            class="auth-profile"
            id="authProfile"
        >

            <!-- =================================================
                 BOTÓN / CIRCULITO DEL PERFIL
                 ================================================= -->

            <button
                class="auth-profile-btn"
                id="authProfileBtn"
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
            >

                ${construirAvatarHTML(usuario)}

                <span class="auth-profile-name">
                    ${primerNombre}
                </span>

                <span
                    class="lang-chevron"
                    aria-hidden="true"
                >
                    ⌄
                </span>

            </button>


            <!-- =================================================
                 PANEL
                 ================================================= -->

            <div
                class="auth-dropdown"
                id="authDropdown"
            >

                <!-- INFORMACIÓN DEL USUARIO -->

                <div class="auth-dropdown-head">

                    ${construirAvatarHTML(
                        usuario,
                        'auth-avatar--lg'
                    )}

                    <div>

                        <p class="auth-dropdown-nombre">
                            ${nombre}
                        </p>

                        <p class="auth-dropdown-user">
                            @${usuario.usuario || t.user}
                        </p>

                        <p class="auth-dropdown-desde">

                            ${t.memberSince}

                            <span>
                                ${usuario.miembroDesde || ''}
                            </span>

                        </p>

                    </div>

                </div>


                <!-- SOLO MI PERFIL -->

                <ul class="auth-dropdown-menu">

                    ${menuItemsHTML()}

                </ul>


                <!-- CERRAR SESIÓN -->

                <button
                    type="button"
                    class="auth-logout"
                    id="authLogoutBtn"
                >

                    ${ICONOS.salir}

                    <span>
                        ${t.logout}
                    </span>

                </button>

            </div>

        </div>

    `;
}


// ================================================================
// SESIÓN — ESCRITORIO
// ================================================================

function activarSesionUIEscritorio(usuario) {

    const navRight =
        document.querySelector(
            '.nav-right'
        );

    const btnRegister =
        document.querySelector(
            '.btn-register'
        );

    const btnLogin =
        document.getElementById(
            'authLoginBtn'
        );


    if (!navRight) {

        return;

    }


    if (btnRegister) {

        btnRegister.style.display =
            'none';

    }


    if (btnLogin) {

        btnLogin.remove();

    }


    if (
        document.getElementById(
            'authProfile'
        )
    ) {

        return;

    }


    const contenedor =
        document.createElement(
            'div'
        );


    contenedor.className =
        'auth-area';


    contenedor.innerHTML =
        construirDropdownHTML(
            usuario
        );


    navRight.appendChild(
        contenedor
    );


    const btnPerfil =
        document.getElementById(
            'authProfileBtn'
        );

    const dropdown =
        document.getElementById(
            'authDropdown'
        );


    if (
        !btnPerfil ||
        !dropdown
    ) {

        return;

    }


    // ============================================================
    // ABRIR / CERRAR DROPDOWN
    // ============================================================

    btnPerfil.addEventListener(
        'click',
        event => {

            event.stopPropagation();


            const estabaAbierto =
                dropdown.classList.contains(
                    'open'
                );


            dropdown.classList.toggle(
                'open',
                !estabaAbierto
            );


            btnPerfil.setAttribute(
                'aria-expanded',
                String(
                    !estabaAbierto
                )
            );

        }
    );


    // ============================================================
    // CERRAR AL HACER CLICK FUERA
    // ============================================================

    document.addEventListener(
        'click',
        event => {

            if (
                !event.target.closest(
                    '#authProfile'
                )
            ) {

                dropdown.classList.remove(
                    'open'
                );


                btnPerfil.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }

        }
    );


    // ============================================================
    // CERRAR SESIÓN
    // ============================================================

    const logoutBtn =
        document.getElementById(
            'authLogoutBtn'
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            'click',
            event => {

                event.stopPropagation();

                cerrarSesion();

            }
        );

    }

}


// ================================================================
// INVITADO — ESCRITORIO
// ================================================================

function activarInvitadoUIEscritorio() {

    const btnRegister =
        document.querySelector(
            '.btn-register'
        );


    if (
        !btnRegister ||
        document.getElementById(
            'authLoginBtn'
        )
    ) {

        return;

    }


    const t = T();


    const btnLogin =
        document.createElement(
            'a'
        );


    btnLogin.href =
        'inicio_sesion.html';


    btnLogin.id =
        'authLoginBtn';


    btnLogin.className =
        'btn-login';


    // TRADUCCIONES

    btnLogin.setAttribute(
        'data-es',
        'Iniciar sesión'
    );

    btnLogin.setAttribute(
        'data-en',
        'Log in'
    );

    btnLogin.setAttribute(
        'data-fr',
        'Se connecter'
    );

    btnLogin.setAttribute(
        'data-pt',
        'Iniciar sessão'
    );

    btnLogin.setAttribute(
        'data-al',
        'Anmelden'
    );

    btnLogin.setAttribute(
        'data-zh',
        '登录'
    );


    btnLogin.textContent =
        t.login;


    btnRegister.parentNode.insertBefore(
        btnLogin,
        btnRegister
    );

}


// ================================================================
// SESIÓN — MÓVIL
// SOLO: MI PERFIL + CERRAR SESIÓN
// ================================================================

function activarSesionUIMovil(usuario) {

    const nav =
        document.getElementById(
            'mainNav'
        );


    if (
        !nav ||
        document.getElementById(
            'authMobileBlock'
        )
    ) {

        return;

    }


    const t = T();

    const nombre =
        usuario.nombre ||
        'Usuario';


    const bloque =
        document.createElement(
            'div'
        );


    bloque.className =
        'nav-auth-mobile';


    bloque.id =
        'authMobileBlock';


    bloque.innerHTML = `

        <!-- =====================================================
             INFORMACIÓN DEL USUARIO
             ===================================================== -->

        <div
            class="nav-auth-mobile-perfil"
        >

            ${construirAvatarHTML(usuario)}

            <div>

                <p
                    class="nav-auth-mobile-nombre"
                >
                    ${nombre}
                </p>

                <p
                    class="nav-auth-mobile-user"
                >
                    @${usuario.usuario || t.user}
                </p>

            </div>

        </div>


        <!-- =====================================================
             SOLO MI PERFIL
             ===================================================== -->

        <ul
            class="nav-auth-mobile-menu"
        >

            ${menuItemsHTML()}

        </ul>


        <!-- =====================================================
             CERRAR SESIÓN
             ===================================================== -->

        <button
            type="button"
            class="auth-logout"
            id="authLogoutBtnMovil"
        >

            ${ICONOS.salir}

            <span>
                ${t.logout}
            </span>

        </button>

    `;


    const referencia =
        nav.querySelector(
            '.nav-lang-mobile'
        );


    if (referencia) {

        referencia.insertAdjacentElement(
            'afterend',
            bloque
        );

    } else {

        nav.appendChild(
            bloque
        );

    }


    const logoutMovil =
        document.getElementById(
            'authLogoutBtnMovil'
        );


    if (logoutMovil) {

        logoutMovil.addEventListener(
            'click',
            cerrarSesion
        );

    }

}


// ================================================================
// INVITADO — MÓVIL
// ================================================================

function activarInvitadoUIMovil() {

    const nav =
        document.getElementById(
            'mainNav'
        );


    if (
        !nav ||
        document.getElementById(
            'authMobileBlock'
        )
    ) {

        return;

    }


    const t = T();


    const bloque =
        document.createElement(
            'div'
        );


    bloque.className =
        'nav-auth-mobile';


    bloque.id =
        'authMobileBlock';


    bloque.innerHTML = `

        <a
            href="registro.html"
            class="btn-register"

            data-es="Regístrate"
            data-en="Sign up"
            data-fr="S'inscrire"
            data-pt="Registre-se"
            data-al="Registrieren"
            data-zh="注册"
        >
            ${t.register}
        </a>


        <a
            href="inicio_sesion.html"
            class="btn-login"
            id="authLoginBtn"

            data-es="Iniciar sesión"
            data-en="Log in"
            data-fr="Se connecter"
            data-pt="Iniciar sessão"
            data-al="Anmelden"
            data-zh="登录"
        >
            ${t.login}
        </a>

    `;


    const referencia =
        nav.querySelector(
            '.nav-lang-mobile'
        );


    if (referencia) {

        referencia.insertAdjacentElement(
            'afterend',
            bloque
        );

    } else {

        nav.appendChild(
            bloque
        );

    }

}


// ================================================================
// LIMPIAR UI
// ================================================================

function limpiarUIAutenticada() {

    const area =
        document.querySelector(
            '.auth-area'
        );


    if (area) {

        area.remove();

    }


    const bloqueMovil =
        document.getElementById(
            'authMobileBlock'
        );


    if (bloqueMovil) {

        bloqueMovil.remove();

    }


    const btnLogin =
        document.getElementById(
            'authLoginBtn'
        );


    if (btnLogin) {

        btnLogin.remove();

    }


    const btnRegister =
        document.querySelector(
            '.btn-register'
        );


    if (btnRegister) {

        btnRegister.style.display =
            '';

    }

}


// ================================================================
// ACTUALIZAR AUTH CUANDO CAMBIA EL IDIOMA
// ================================================================

async function actualizarAuthIdioma() {

    limpiarUIAutenticada();


    const user =
        auth.currentUser;


    if (user) {

        const datos =
            await obtenerDatosUsuario(
                user
            );


        activarSesionUIEscritorio(
            datos
        );


        activarSesionUIMovil(
            datos
        );

    } else {

        activarInvitadoUIEscritorio();

        activarInvitadoUIMovil();

    }

}


// ================================================================
// DISPONIBLE PARA EL SISTEMA DE IDIOMAS
// ================================================================

window.actualizarAuthIdioma =
    actualizarAuthIdioma;


// ================================================================
// ARRANQUE — FIREBASE
// ================================================================

onAuthStateChanged(
    auth,
    async user => {

        limpiarUIAutenticada();


        if (user) {

            const datos =
                await obtenerDatosUsuario(
                    user
                );


            activarSesionUIEscritorio(
                datos
            );


            activarSesionUIMovil(
                datos
            );

        } else {

            activarInvitadoUIEscritorio();

            activarInvitadoUIMovil();

        }

    }
);
