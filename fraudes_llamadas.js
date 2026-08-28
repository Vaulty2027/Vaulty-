// ============================================
// IDIOMAS
// ============================================

const IDIOMAS = {
    es: { code: 'ES', label: 'Español' },
    en: { code: 'EN', label: 'English' },
    fr: { code: 'FR', label: 'French' },
    pt: { code: 'PT', label: 'Portuguese' },
    al: { code: 'AL', label: 'German' },
    zh: { code: 'ZH', label: 'Chinese' }
};

let idiomaActual = localStorage.getItem('lang') || 'es';


// ============================================
// CAMBIAR IDIOMA
// ============================================

function setLang(lang) {

    if (!IDIOMAS[lang]) {
        lang = 'es';
    }

    idiomaActual = lang;
    const info = IDIOMAS[lang];

    // ----------------------------------------
    // TRADUCIR TEXTOS
    // ----------------------------------------
    document.querySelectorAll('[data-es]').forEach(element => {
        if (element.querySelector('[data-es]')) return;
        element.textContent = element.dataset[lang] || element.dataset.es || '';
    });

    // ----------------------------------------
    // IMÁGENES CON VERSIÓN POR IDIOMA
    // (solo existen versiones ES/EN de los diagramas; el resto de
    // idiomas usa la versión ES como respaldo)
    // ----------------------------------------
    document.querySelectorAll('[data-img-es]').forEach(img => {
        const clave = 'img' + lang.charAt(0).toUpperCase() + lang.slice(1);
        img.src = img.dataset[clave] || img.dataset.imgEs;
    });

    // ----------------------------------------
    // CAMBIAR NOMBRE DEL IDIOMA (píldoras)
    // ----------------------------------------
    document.querySelectorAll('[data-lang-label]').forEach(element => {
        element.textContent = info.label;
    });
    document.querySelectorAll('[data-lang-code]').forEach(element => {
        element.textContent = info.code;
    });

    // ----------------------------------------
    // CAMBIAR BANDERA
    // ----------------------------------------
    document.querySelectorAll('[data-lang-flag]').forEach(currentFlag => {
        const selectedOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (!selectedOption) return;
        const selectedImage = selectedOption.querySelector('img');
        if (!selectedImage) return;
        currentFlag.src = selectedImage.src;
        currentFlag.alt = selectedImage.alt || info.label;
    });

    // ----------------------------------------
    // MARCAR IDIOMA ACTIVO EN LOS DROPDOWNS
    // ----------------------------------------
    document.querySelectorAll('.lang-option').forEach(button => {
        button.classList.toggle('is-active', button.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'al' ? 'de' : (lang === 'zh' ? 'zh-CN' : lang);
    localStorage.setItem('lang', lang);

    // ----------------------------------------
    // ACTUALIZAR STRIX
    // ----------------------------------------
    if (typeof renderPreguntasAsistente === 'function') {
        renderPreguntasAsistente();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const idiomaGuardado = localStorage.getItem('lang') || 'es';
    setLang(idiomaGuardado);
    setActiveNavLink();
});


// ============================================
// CONFIGURAR SELECTOR DE IDIOMA (abre/cierra)
// ============================================

function configurarSelectorIdioma(botonId, listaId) {

    const boton = document.getElementById(botonId);
    const lista = document.getElementById(listaId);
    if (!boton || !lista) return;

    boton.addEventListener('click', event => {
        event.stopPropagation();
        const estabaAbierta = lista.classList.contains('open');

        document.querySelectorAll('.lang-dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
        document.querySelectorAll('.lang-current[aria-expanded="true"]').forEach(button => {
            button.setAttribute('aria-expanded', 'false');
        });

        if (!estabaAbierta) {
            lista.classList.add('open');
            boton.setAttribute('aria-expanded', 'true');
        }
    });

    lista.querySelectorAll('.lang-option').forEach(opcion => {
        opcion.addEventListener('click', event => {
            event.stopPropagation();
            setLang(opcion.dataset.lang);
            lista.classList.remove('open');
            boton.setAttribute('aria-expanded', 'false');
        });
    });
}

function cerrarSelectorIdioma() {
    document.querySelectorAll('.lang-dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
    });
    document.querySelectorAll('.lang-current[aria-expanded="true"]').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
}

configurarSelectorIdioma('langToggleDesktop', 'langDropdownDesktop');
configurarSelectorIdioma('langToggleTop', 'langDropdownTop');
configurarSelectorIdioma('langTogglePanel', 'langDropdownPanel');

document.addEventListener('click', event => {
    if (
        !event.target.closest('.nav-lang-desktop') &&
        !event.target.closest('.nav-lang-topbar') &&
        !event.target.closest('.nav-lang-mobile')
    ) {
        cerrarSelectorIdioma();
    }
});


// ============================================
// DROPDOWNS DE NAVEGACIÓN
// ============================================

document.querySelectorAll('.nav-item.dropdown').forEach(item => {

    let timer;
    const trigger = item.querySelector(':scope > a');

    // ========================================
    // ESCRITORIO
    // ========================================

    item.addEventListener('mouseenter', () => {

        const esTouch = window.matchMedia('(hover: none)').matches;

        if (esTouch) return;

        clearTimeout(timer);

        // Cerrar otros dropdowns
        document.querySelectorAll('.nav-item.dropdown.open').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('open');
            }
        });

        item.classList.add('open');
    });


    // ========================================
    // ESCRITORIO — CERRAR AL SALIR
    // ========================================

    item.addEventListener('mouseleave', () => {

        const esTouch = window.matchMedia('(hover: none)').matches;

        if (esTouch) return;

        timer = setTimeout(() => {
            item.classList.remove('open');
        }, 150);

    });


    // ========================================
    // MÓVIL
    // ========================================

    if (trigger) {

        trigger.addEventListener('click', event => {

            const esMobile =
                window.matchMedia('(max-width: 900px)').matches;

            // En computadora no modificamos
            // el comportamiento normal del enlace.
            if (!esMobile) return;


            // ====================================
            // PRIMER TOQUE
            // ====================================

            if (!item.classList.contains('open')) {

                /*
                 * Primer toque:
                 * NO entrar todavía a la página.
                 * Solamente abrir el submenú.
                 */

                event.preventDefault();

                // Cerrar otros dropdowns
                document.querySelectorAll('.nav-item.dropdown.open').forEach(openItem => {

                    if (openItem !== item) {
                        openItem.classList.remove('open');
                    }

                });

                item.classList.add('open');

            }

            // ====================================
            // SEGUNDO TOQUE
            // ====================================

            else {

                /*
                 * El dropdown ya está abierto.
                 *
                 * No usamos preventDefault().
                 * Por lo tanto el enlace funciona
                 * normalmente y abre:
                 *
                 * finanzas.html
                 * aprende.html
                 */

                item.classList.remove('open');

            }

        });

    }

});

// ============================================
// MENÚ HAMBURGUESA
// ============================================

const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const mainNav = document.getElementById('mainNav');
const navBackdrop = document.getElementById('navBackdrop');

function abrirMenuMovil() {
    if (!mainNav || !navBackdrop || !navToggle) return;
    mainNav.classList.add('nav-open');
    navBackdrop.classList.add('visible');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-no-scroll');
}

function cerrarMenuMovil() {
    if (!mainNav || !navBackdrop || !navToggle) return;
    mainNav.classList.remove('nav-open');
    navBackdrop.classList.remove('visible');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-no-scroll');

    document.querySelectorAll('.nav-item.dropdown.open').forEach(item => {
        item.classList.remove('open');
    });
    cerrarSelectorIdioma();
}

if (navToggle && mainNav && navBackdrop) {

    navToggle.addEventListener('click', () => {
        const abierto = mainNav.classList.contains('nav-open');
        abierto ? cerrarMenuMovil() : abrirMenuMovil();
    });

    if (navClose) navClose.addEventListener('click', cerrarMenuMovil);
    navBackdrop.addEventListener('click', cerrarMenuMovil);

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            const esMobile = window.matchMedia('(max-width: 900px)').matches;
            const padre = link.closest('.nav-item.dropdown');
            const esTrigger = padre && padre.querySelector(':scope > a') === link;
            if (esMobile && esTrigger) return;
            cerrarMenuMovil();
        });
    });
}


// ============================================
// HEADER AL HACER SCROLL
// ============================================

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


// ============================================
// LINK ACTIVO SEGÚN LA PÁGINA
// ============================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage);
    });
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('nav a').forEach(other => other.classList.remove('active'));
        link.classList.add('active');
    });
});


// ============================================
// SCROLLSPY (secciones con id + links con #)
// ============================================

(() => {
    const secciones = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('nav a[href*="#"]');
    if (!secciones.length || !links.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            links.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('active', href === `#${id}` || (href && href.endsWith(`#${id}`)));
            });
        });
    }, { threshold: 0.35, rootMargin: '-90px 0px -40% 0px' });

    secciones.forEach(section => observer.observe(section));
})();


// ============================================
// BARRA DE PROGRESO DE SCROLL
// ============================================

(() => {
    const progress = document.querySelector('.vaulty-page-progress');
    if (!progress) return;

    let frame = null;

    function actualizarProgreso() {
        const page = document.documentElement;
        const altura = page.scrollHeight - window.innerHeight;
        const progreso = altura > 0 ? window.scrollY / altura : 1;
        const valor = Math.min(Math.max(progreso, 0), 1);
        progress.style.setProperty('--vaulty-progress', valor);
        frame = null;
    }

    function solicitarActualizacion() {
        if (frame !== null) return;
        frame = window.requestAnimationFrame(actualizarProgreso);
    }

    window.addEventListener('scroll', solicitarActualizacion, { passive: true });
    window.addEventListener('resize', solicitarActualizacion);
    window.addEventListener('load', solicitarActualizacion);
    solicitarActualizacion();
})();


// ============================================
// ANIMACIONES REVEAL AL HACER SCROLL
// ============================================

(() => {
    const elementos = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elementos.length) return;

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducirMovimiento) {
        elementos.forEach(element => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(element => observer.observe(element));
})();


// ============================================
// CURSOR PERSONALIZADO (magnético)
// ============================================

(() => {
    const tieneMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!tieneMouse || reducirMovimiento) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let activado = false;

    window.addEventListener('mousemove', event => {
        if (!activado) {
            document.body.classList.add('vaulty-cursor-active');
            activado = true;
        }
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function animarAnillo() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animarAnillo);
    }
    animarAnillo();

    document.querySelectorAll('a, button, .card, .herramientas-card, #strix-btn').forEach(element => {
        element.addEventListener('mouseenter', () => {
            dot.classList.add('is-magnetic');
            ring.classList.add('is-magnetic');
        });
        element.addEventListener('mouseleave', () => {
            dot.classList.remove('is-magnetic');
            ring.classList.remove('is-magnetic');
        });
    });
})();


// ============================================
// TARJETAS 3D (inclinación al mover el mouse)
// ============================================

(() => {
    const tieneMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!tieneMouse || reducirMovimiento) return;

    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', event => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            const maxTilt = 4;
            const tiltY = (px - 0.5) * maxTilt * 2;
            const tiltX = (0.5 - py) * maxTilt * 2;

            card.style.setProperty('--tilt-x', `${tiltX}deg`);
            card.style.setProperty('--tilt-y', `${tiltY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    });
})();


// ============================================
// MÉTODOS COMUNES — toggle de tarjetas
// ============================================

document.querySelectorAll('.metodo-item').forEach(item => {
    const trigger = item.querySelector('.card-metodo');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
        document.querySelectorAll('.metodo-item').forEach(card => {
            if (card !== item) card.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});


// ============================================
// STRIX — PREGUNTAS POR IDIOMA
// ============================================

const PREGUNTAS_POR_IDIOMA = {

    es: [
        { pregunta: "¿Qué es una llamada fraudulenta?", respuesta: "Es una llamada de alguien que se hace pasar por tu banco u otra institución para engañarte y obtener tu información personal o financiera." },
        { pregunta: "¿Qué nunca debo dar por teléfono?", respuesta: "Nunca compartas contraseñas, PIN o códigos de verificación por teléfono. Ninguna institución seria te los pedirá así." },
        { pregunta: "¿Qué hago si recibo una llamada sospechosa?", respuesta: "Cuelga y comunícate tú mismo al número oficial de la institución antes de dar cualquier información." },
        { pregunta: "¿Puede estar falsificado el número que veo en pantalla?", respuesta: "Sí. Los estafadores pueden falsificar el número que aparece, así que no confíes solo en eso." }
    ],

    en: [
        { pregunta: "What is a fraudulent call?", respuesta: "It's a call from someone impersonating your bank or another institution to deceive you and obtain your personal or financial information." },
        { pregunta: "What should I never give over the phone?", respuesta: "Never share passwords, PINs, or verification codes over the phone. No serious institution will ask for them that way." },
        { pregunta: "What do I do if I get a suspicious call?", respuesta: "Hang up and call the institution's official number yourself before giving any information." },
        { pregunta: "Can the number on my screen be fake?", respuesta: "Yes. Scammers can spoof the number that shows up, so don't rely on that alone." }
    ],

    fr: [
        { pregunta: "Qu'est-ce qu'un appel frauduleux ?", respuesta: "C'est un appel de quelqu'un qui se fait passer pour votre banque ou une autre institution afin de vous tromper et d'obtenir vos informations personnelles ou financières." },
        { pregunta: "Que ne dois-je jamais donner par téléphone ?", respuesta: "Ne partagez jamais de mots de passe, codes PIN ou codes de vérification par téléphone. Aucune institution sérieuse ne vous les demandera ainsi." },
        { pregunta: "Que faire si je reçois un appel suspect ?", respuesta: "Raccrochez et appelez vous-même le numéro officiel de l'institution avant de donner la moindre information." },
        { pregunta: "Le numéro affiché peut-il être falsifié ?", respuesta: "Oui. Les escrocs peuvent falsifier le numéro affiché, ne vous fiez donc pas uniquement à cela." }
    ],

    pt: [
        { pregunta: "O que é uma chamada fraudulenta?", respuesta: "É uma chamada de alguém que finge ser seu banco ou outra instituição para enganá-lo e obter suas informações pessoais ou financeiras." },
        { pregunta: "O que eu nunca devo dar por telefone?", respuesta: "Nunca compartilhe senhas, PIN ou códigos de verificação por telefone. Nenhuma instituição séria pedirá isso dessa forma." },
        { pregunta: "O que fazer se eu receber uma chamada suspeita?", respuesta: "Desligue e ligue você mesmo para o número oficial da instituição antes de fornecer qualquer informação." },
        { pregunta: "O número que aparece na tela pode ser falso?", respuesta: "Sim. Os golpistas podem falsificar o número exibido, então não confie apenas nisso." }
    ],

    al: [
        { pregunta: "Was ist ein betrügerischer Anruf?", respuesta: "Es ist ein Anruf von jemandem, der sich als Ihre Bank oder eine andere Institution ausgibt, um Sie zu täuschen und an Ihre persönlichen oder finanziellen Daten zu gelangen." },
        { pregunta: "Was sollte ich niemals am Telefon preisgeben?", respuesta: "Geben Sie niemals Passwörter, PINs oder Verifizierungscodes am Telefon weiter. Keine seriöse Institution wird danach so fragen." },
        { pregunta: "Was tue ich bei einem verdächtigen Anruf?", respuesta: "Legen Sie auf und rufen Sie selbst die offizielle Nummer der Institution an, bevor Sie irgendwelche Informationen geben." },
        { pregunta: "Kann die angezeigte Nummer gefälscht sein?", respuesta: "Ja. Betrüger können die angezeigte Nummer fälschen, verlassen Sie sich also nicht allein darauf." }
    ],

    zh: [
        { pregunta: "什么是欺诈电话？", respuesta: "这是有人冒充你的银行或其他机构打来的电话，目的是欺骗你并获取你的个人或财务信息。" },
        { pregunta: "在电话中我绝不应该提供什么？", respuesta: "永远不要在电话中透露密码、PIN码或验证码。任何正规机构都不会这样索要。" },
        { pregunta: "如果接到可疑电话该怎么办？", respuesta: "挂断电话，自己拨打该机构的官方号码，之后再提供任何信息。" },
        { pregunta: "屏幕上显示的号码可能是假的吗？", respuesta: "是的。诈骗者可以伪造显示的号码，所以不要仅凭号码来判断。" }
    ]
};


function renderPreguntasAsistente() {
    const contenedor = document.getElementById('preguntas-strix') || document.getElementById('preguntas');
    if (!contenedor) return;

    const preguntas = PREGUNTAS_POR_IDIOMA[idiomaActual] || PREGUNTAS_POR_IDIOMA.es;
    contenedor.innerHTML = '';

    preguntas.forEach(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'strix-pregunta';
        button.textContent = item.pregunta;
        button.dataset.respuesta = item.respuesta;
        contenedor.appendChild(button);
    });
}


// ============================================
// ABRIR / CERRAR EL CHAT DE STRIX
// ============================================

const strixBtn = document.getElementById('strix-btn');
const cerrarChatBtn = document.getElementById('cerrar-chat');
const asistente = document.getElementById('asistente');
const mensajesDiv = document.getElementById('mensajes');

if (strixBtn && asistente) {
    strixBtn.addEventListener('click', () => {
        asistente.classList.toggle('abierto');
    });
}

if (cerrarChatBtn && asistente) {
    cerrarChatBtn.addEventListener('click', () => {
        asistente.classList.remove('abierto');
    });
}

function mostrarRespuestaStrix(pregunta, respuesta) {
    if (!mensajesDiv) return;

    const preguntaUsuario = document.createElement('div');
    preguntaUsuario.classList.add('pregunta-usuario');
    preguntaUsuario.textContent = pregunta;
    mensajesDiv.appendChild(preguntaUsuario);
    mensajesDiv.scrollTop = mensajesDiv.scrollHeight;

    setTimeout(() => {
        const respuestaBot = document.createElement('div');
        respuestaBot.classList.add('respuesta');
        respuestaBot.textContent = respuesta;
        mensajesDiv.appendChild(respuestaBot);
        mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
    }, 450);
}

document.addEventListener('click', event => {
    const pregunta = event.target.closest('.strix-pregunta');
    if (!pregunta) return;

    const respuesta = pregunta.dataset.respuesta;
    if (!respuesta) return;

    mostrarRespuestaStrix(pregunta.textContent, respuesta);
});


// ============================================
// FINALIZAR CONFIGURACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderPreguntasAsistente === 'function') {
        renderPreguntasAsistente();
    }
});