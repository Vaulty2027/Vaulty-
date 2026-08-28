// ============================================
// IDIOMAS
// ============================================

const IDIOMAS = {
    es: { code: 'ES', label: 'Español' },
    en: { code: 'EN', label: 'English' },
    fr: { code: 'FR', label: 'Frances' },
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

        element.textContent =
            element.dataset[lang] ||
            element.dataset.es ||
            '';
    });


    // ----------------------------------------
    // CAMBIAR IMÁGENES SEGÚN EL IDIOMA
    // ----------------------------------------

    document.querySelectorAll('[data-img-es]').forEach(img => {

        const imagenes = {
            es: img.dataset.imgEs,
            en: img.dataset.imgEn,
            pt: img.dataset.imgPt,
            fr: img.dataset.imgFr,
            al: img.dataset.imgAl,
            zh: img.dataset.imgZh
        };

        const nuevaImagen =
            imagenes[lang] ||
            imagenes.es;

        if (nuevaImagen) {
            img.src = nuevaImagen;
        }
    });


    // ----------------------------------------
    // CAMBIAR NOMBRE DEL IDIOMA
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

        const selectedOption =
            document.querySelector(`.lang-option[data-lang="${lang}"]`);

        if (!selectedOption) return;

        const selectedImage =
            selectedOption.querySelector('img');

        if (!selectedImage) return;

        currentFlag.src = selectedImage.src;
        currentFlag.alt =
            selectedImage.alt ||
            info.label;
    });


    // ----------------------------------------
    // MARCAR IDIOMA ACTIVO
    // ----------------------------------------

    document.querySelectorAll('.lang-option').forEach(button => {

        button.classList.toggle(
            'is-active',
            button.dataset.lang === lang
        );

    });


    // ----------------------------------------
    // IDIOMA DEL DOCUMENTO
    // ----------------------------------------

    document.documentElement.lang =
        lang === 'al'
            ? 'de'
            : (lang === 'zh' ? 'zh-CN' : lang);


    // ----------------------------------------
    // GUARDAR IDIOMA
    // ----------------------------------------

    localStorage.setItem('lang', lang);


    // ----------------------------------------
    // ACTUALIZAR STRIX
    // ----------------------------------------

    if (typeof renderPreguntasAsistente === 'function') {
        renderPreguntasAsistente();
    }


    // ----------------------------------------
    // ACTUALIZAR FRASE ROTATIVA
    // ----------------------------------------

    if (typeof reiniciarTagline === 'function') {
        reiniciarTagline();
    }
}


// ============================================
// CARGAR IDIOMA GUARDADO
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    const idiomaGuardado =
        localStorage.getItem('lang') || 'es';

    setLang(idiomaGuardado);

    setActiveNavLink();

});


// ============================================
// SELECTOR DE IDIOMA
// ============================================

function configurarSelectorIdioma(botonId, listaId) {

    const boton = document.getElementById(botonId);
    const lista = document.getElementById(listaId);

    if (!boton || !lista) return;


    boton.addEventListener('click', event => {

        event.stopPropagation();

        const estabaAbierta =
            lista.classList.contains('open');


        document
            .querySelectorAll('.lang-dropdown.open')
            .forEach(dropdown => {

                dropdown.classList.remove('open');

            });


        document
            .querySelectorAll('.lang-current[aria-expanded="true"]')
            .forEach(button => {

                button.setAttribute(
                    'aria-expanded',
                    'false'
                );

            });


        if (!estabaAbierta) {

            lista.classList.add('open');

            boton.setAttribute(
                'aria-expanded',
                'true'
            );

        }

    });


    lista
        .querySelectorAll('.lang-option')
        .forEach(opcion => {

            opcion.addEventListener('click', event => {

                event.stopPropagation();

                setLang(opcion.dataset.lang);

                lista.classList.remove('open');

                boton.setAttribute(
                    'aria-expanded',
                    'false'
                );

            });

        });

}


function cerrarSelectorIdioma() {

    document
        .querySelectorAll('.lang-dropdown.open')
        .forEach(dropdown => {

            dropdown.classList.remove('open');

        });


    document
        .querySelectorAll('.lang-current[aria-expanded="true"]')
        .forEach(button => {

            button.setAttribute(
                'aria-expanded',
                'false'
            );

        });

}


// ============================================
// TRES SELECTORES
// ============================================

configurarSelectorIdioma(
    'langToggleDesktop',
    'langDropdownDesktop'
);

configurarSelectorIdioma(
    'langToggleTop',
    'langDropdownTop'
);

configurarSelectorIdioma(
    'langTogglePanel',
    'langDropdownPanel'
);


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

document
    .querySelectorAll('.nav-item.dropdown')
    .forEach(item => {

        let timer;

        const trigger =
            item.querySelector(':scope > a');


        // ----------------------------------------
        // ESCRITORIO
        // ----------------------------------------

        item.addEventListener('mouseenter', () => {

            const esTouch =
                window.matchMedia('(hover: none)').matches;

            if (esTouch) return;

            clearTimeout(timer);


            document
                .querySelectorAll('.nav-item.dropdown.open')
                .forEach(openItem => {

                    if (openItem !== item) {
                        openItem.classList.remove('open');
                    }

                });


            item.classList.add('open');

        });


        // ----------------------------------------
        // CERRAR AL SALIR
        // ----------------------------------------

        item.addEventListener('mouseleave', () => {

            const esTouch =
                window.matchMedia('(hover: none)').matches;

            if (esTouch) return;


            timer = setTimeout(() => {

                item.classList.remove('open');

            }, 150);

        });


        // ----------------------------------------
        // MÓVIL
        // ----------------------------------------

        if (trigger) {

            trigger.addEventListener('click', event => {

                const esMobile =
                    window.matchMedia(
                        '(max-width: 900px)'
                    ).matches;


                if (!esMobile) return;


                if (!item.classList.contains('open')) {

                    event.preventDefault();


                    document
                        .querySelectorAll(
                            '.nav-item.dropdown.open'
                        )
                        .forEach(openItem => {

                            if (openItem !== item) {
                                openItem.classList.remove('open');
                            }

                        });


                    item.classList.add('open');

                } else {

                    item.classList.remove('open');

                }

            });

        }

    });


// ============================================
// MENÚ HAMBURGUESA
// ============================================

const navToggle =
    document.getElementById('navToggle');

const navClose =
    document.getElementById('navClose');

const mainNav =
    document.getElementById('mainNav');

const navBackdrop =
    document.getElementById('navBackdrop');


function abrirMenuMovil() {

    if (!mainNav || !navBackdrop || !navToggle) return;

    mainNav.classList.add('nav-open');

    navBackdrop.classList.add('visible');

    navToggle.classList.add('is-active');

    navToggle.setAttribute(
        'aria-expanded',
        'true'
    );

    document.body.classList.add(
        'nav-no-scroll'
    );

}


function cerrarMenuMovil() {

    if (!mainNav || !navBackdrop || !navToggle) return;

    mainNav.classList.remove('nav-open');

    navBackdrop.classList.remove('visible');

    navToggle.classList.remove('is-active');

    navToggle.setAttribute(
        'aria-expanded',
        'false'
    );

    document.body.classList.remove(
        'nav-no-scroll'
    );


    document
        .querySelectorAll('.nav-item.dropdown.open')
        .forEach(item => {

            item.classList.remove('open');

        });


    cerrarSelectorIdioma();

}


if (navToggle && mainNav && navBackdrop) {

    navToggle.addEventListener('click', () => {

        const abierto =
            mainNav.classList.contains('nav-open');

        abierto
            ? cerrarMenuMovil()
            : abrirMenuMovil();

    });


    if (navClose) {
        navClose.addEventListener(
            'click',
            cerrarMenuMovil
        );
    }


    navBackdrop.addEventListener(
        'click',
        cerrarMenuMovil
    );


    mainNav
        .querySelectorAll('a')
        .forEach(link => {

            link.addEventListener('click', () => {

                const esMobile =
                    window.matchMedia(
                        '(max-width: 900px)'
                    ).matches;


                const padre =
                    link.closest(
                        '.nav-item.dropdown'
                    );


                const esTrigger =
                    padre &&
                    padre.querySelector(
                        ':scope > a'
                    ) === link;


                if (esMobile && esTrigger) return;

                cerrarMenuMovil();

            });

        });

}


// ============================================
// HEADER AL HACER SCROLL
// ============================================

window.addEventListener(
    'scroll',
    () => {

        const header =
            document.getElementById('header');

        if (!header) return;

        header.classList.toggle(
            'scrolled',
            window.scrollY > 50
        );

    },
    { passive: true }
);


// ============================================
// LINK ACTIVO SEGÚN LA PÁGINA
// ============================================
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));

    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            const dropdownPadre = link.closest('.nav-item.dropdown');
            if (dropdownPadre) {
                const trigger = dropdownPadre.querySelector(':scope > a');
                if (trigger) trigger.classList.add('active');
            }
        }
    });
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});
// ============================================
// SCROLLSPY
// ============================================

(() => {

    const secciones =
        document.querySelectorAll(
            'section[id]'
        );

    const links =
        document.querySelectorAll(
            'nav a[href*="#"]'
        );


    if (!secciones.length || !links.length) return;


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    const id =
                        entry.target.id;


                    links.forEach(link => {

                        const href =
                            link.getAttribute('href');


                        link.classList.toggle(
                            'active',
                            href === `#${id}` ||
                            (
                                href &&
                                href.endsWith(`#${id}`)
                            )
                        );

                    });

                });

            },
            {
                threshold: 0.35,
                rootMargin:
                    '-90px 0px -40% 0px'
            }
        );


    secciones.forEach(section =>
        observer.observe(section)
    );

})();


// ============================================
// BARRA DE PROGRESO
// ============================================

(() => {

    const progress =
        document.querySelector(
            '.vaulty-page-progress'
        );

    if (!progress) return;


    let frame = null;


    function actualizarProgreso() {

        const page =
            document.documentElement;


        const altura =
            page.scrollHeight -
            window.innerHeight;


        const progreso =
            altura > 0
                ? window.scrollY / altura
                : 1;


        const valor =
            Math.min(
                Math.max(progreso, 0),
                1
            );


        progress.style.setProperty(
            '--vaulty-progress',
            valor
        );


        frame = null;

    }


    function solicitarActualizacion() {

        if (frame !== null) return;

        frame =
            window.requestAnimationFrame(
                actualizarProgreso
            );

    }


    window.addEventListener(
        'scroll',
        solicitarActualizacion,
        { passive: true }
    );

    window.addEventListener(
        'resize',
        solicitarActualizacion
    );

    window.addEventListener(
        'load',
        solicitarActualizacion
    );


    solicitarActualizacion();

})();


// ============================================
// ANIMACIONES REVEAL
// ============================================

(() => {

    const elementos =
        document.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .reveal-scale'
        );


    if (!elementos.length) return;


    const reducirMovimiento =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (reducirMovimiento) {

        elementos.forEach(element =>
            element.classList.add('is-visible')
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add(
                        'is-visible'
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.15,
                rootMargin:
                    '0px 0px -40px 0px'
            }
        );


    elementos.forEach(element =>
        observer.observe(element)
    );

})();


// ============================================
// ANIMACIÓN ESCALONADA DE TARJETAS
// ============================================

(() => {

    const grupos =
        document.querySelectorAll(
            '.cards-grid, .features-grid, .entidades-lista, .cards-container, .hero-features'
        );


    if (!grupos.length) return;


    const reducirMovimiento =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (reducirMovimiento) return;


    grupos.forEach(grupo => {

        Array
            .from(grupo.children)
            .forEach((tarjeta, index) => {

                tarjeta.style.setProperty(
                    '--animation-delay',
                    `${index * 100}ms`
                );

                tarjeta.classList.add(
                    'stagger-item'
                );

            });

    });

})();


// ============================================
// PARALLAX DEL HERO
// ============================================

(() => {

    const heroImg =
        document.querySelector(
            '.hero-inicio-img'
        );


    if (!heroImg) return;


    const reducirMovimiento =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (reducirMovimiento) return;


    let frame = null;


    function actualizarHero() {

        const desplazamiento =
            Math.min(
                window.scrollY * 0.25,
                120
            );


        heroImg.style.transform =
            `translateY(${desplazamiento}px) scale(1.08)`;


        frame = null;

    }


    window.addEventListener(
        'scroll',
        () => {

            if (frame !== null) return;

            frame =
                requestAnimationFrame(
                    actualizarHero
                );

        },
        { passive: true }
    );

})();


// ============================================
// CURSOR PERSONALIZADO
// ============================================

(() => {

    const tieneMouse =
        window.matchMedia(
            '(hover: hover) and (pointer: fine)'
        ).matches;


    const reducirMovimiento =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (!tieneMouse || reducirMovimiento) return;


    const dot =
        document.getElementById(
            'cursorDot'
        );

    const ring =
        document.getElementById(
            'cursorRing'
        );


    if (!dot || !ring) return;


    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    let activado = false;


    window.addEventListener(
        'mousemove',
        event => {

            if (!activado) {

                document.body.classList.add(
                    'vaulty-cursor-active'
                );

                activado = true;

            }


            mouseX = event.clientX;
            mouseY = event.clientY;


            dot.style.transform =
                `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

        },
        { passive: true }
    );


    function animarAnillo() {

        ringX +=
            (mouseX - ringX) * 0.18;

        ringY +=
            (mouseY - ringY) * 0.18;


        ring.style.transform =
            `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;


        requestAnimationFrame(
            animarAnillo
        );

    }


    animarAnillo();


    document
        .querySelectorAll(
            'a, button, .entidad-card, .card, #strix-btn'
        )
        .forEach(element => {

            element.addEventListener(
                'mouseenter',
                () => {

                    dot.classList.add(
                        'is-magnetic'
                    );

                    ring.classList.add(
                        'is-magnetic'
                    );

                }
            );


            element.addEventListener(
                'mouseleave',
                () => {

                    dot.classList.remove(
                        'is-magnetic'
                    );

                    ring.classList.remove(
                        'is-magnetic'
                    );

                }
            );

        });

})();


// ============================================
// TARJETAS 3D
// ============================================

(() => {

    const tieneMouse =
        window.matchMedia(
            '(hover: hover) and (pointer: fine)'
        ).matches;


    const reducirMovimiento =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (!tieneMouse || reducirMovimiento) return;


    document
        .querySelectorAll('[data-tilt]')
        .forEach(card => {

            card.addEventListener(
                'mousemove',
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const px =
                        (event.clientX - rect.left) /
                        rect.width;


                    const py =
                        (event.clientY - rect.top) /
                        rect.height;


                    const maxTilt = 4;


                    const tiltY =
                        (px - 0.5) *
                        maxTilt *
                        2;


                    const tiltX =
                        (0.5 - py) *
                        maxTilt *
                        2;


                    card.style.setProperty(
                        '--tilt-x',
                        `${tiltX}deg`
                    );


                    card.style.setProperty(
                        '--tilt-y',
                        `${tiltY}deg`
                    );


                    card.style.setProperty(
                        '--mx',
                        `${px * 100}%`
                    );


                    card.style.setProperty(
                        '--my',
                        `${py * 100}%`
                    );

                }
            );


            card.addEventListener(
                'mouseleave',
                () => {

                    card.style.setProperty(
                        '--tilt-x',
                        '0deg'
                    );

                    card.style.setProperty(
                        '--tilt-y',
                        '0deg'
                    );

                }
            );

        });

})();


// ============================================
// FRASE ROTATIVA DEL HERO
// ============================================

const TAGLINES_POR_IDIOMA = {

    es: [
        'Ahorra con propósito.',
        'Invierte con confianza.',
        'Crece sin miedo.',
        'Aprende a tu ritmo.'
    ],

    en: [
        'Save with purpose.',
        'Invest with confidence.',
        'Grow without fear.',
        'Learn at your pace.'
    ],

    fr: [
        'Épargnez avec un but.',
        'Investissez en confiance.',
        'Grandissez sans crainte.',
        'Apprenez à votre rythme.'
    ],

    pt: [
        'Poupe com propósito.',
        'Invista com confiança.',
        'Cresça sem medo.',
        'Aprenda no seu ritmo.'
    ],

    al: [
        'Sparen mit Ziel.',
        'Investieren mit Vertrauen.',
        'Wachsen ohne Angst.',
        'Lernen im eigenen Tempo.'
    ],

    zh: [
        '有目标地储蓄。',
        '自信地投资。',
        '无畏地成长。',
        '按自己的节奏学习。'
    ]

};


let taglineTimer = null;
let taglineIndex = 0;


function reiniciarTagline() {

    const contenedor =
        document.getElementById(
            'heroTaglineWord'
        );


    if (!contenedor) return;


    const frases =
        TAGLINES_POR_IDIOMA[idiomaActual] ||
        TAGLINES_POR_IDIOMA.es;


    taglineIndex = 0;


    if (taglineTimer) {
        clearInterval(taglineTimer);
    }


    contenedor.textContent =
        frases[0];


    contenedor.classList.remove(
        'leaving'
    );


    const reducirMovimiento =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    if (
        reducirMovimiento ||
        frases.length < 2
    ) return;


    taglineTimer =
        setInterval(() => {

            contenedor.classList.add(
                'leaving'
            );


            setTimeout(() => {

                taglineIndex =
                    (taglineIndex + 1) %
                    frases.length;


                contenedor.textContent =
                    frases[taglineIndex];


                contenedor.classList.remove(
                    'leaving'
                );


                contenedor.style.animation =
                    'none';


                void contenedor.offsetWidth;


                contenedor.style.animation =
                    '';

            }, 350);

        }, 3200);

}


document.addEventListener(
    'DOMContentLoaded',
    reiniciarTagline
);


// ============================================
// STRIX — PREGUNTAS POR IDIOMA
// ============================================

const PREGUNTAS_POR_IDIOMA = {

    es: [
        {
            pregunta: "¿Qué es un presupuesto?",
            respuesta: "Un presupuesto es un plan que te ayuda a organizar tus ingresos y gastos para administrar mejor tu dinero."
        },
        {
            pregunta: "¿Qué es el ahorro?",
            respuesta: "El ahorro consiste en guardar una parte de tu dinero para cumplir metas o enfrentar imprevistos en el futuro."
        },
        {
            pregunta: "¿Qué es una tarjeta de crédito?",
            respuesta: "Es un medio de pago que te permite comprar ahora y pagar después. Si no pagas a tiempo, pueden generarse intereses."
        },
        {
            pregunta: "¿Qué es un fondo de emergencia?",
            respuesta: "Es dinero reservado para cubrir gastos inesperados."
        },
        {
            pregunta: "¿Por qué es importante invertir?",
            respuesta: "Invertir permite que tu dinero pueda crecer con el tiempo y ayudarte a alcanzar metas financieras."
        },
        {
            pregunta: "¿Qué es la inflación?",
            respuesta: "Es el aumento general de los precios con el tiempo, lo que hace que tu dinero pierda poder de compra."
        },
        {
            pregunta: "¿Qué es el interés compuesto?",
            respuesta: "Es cuando ganas intereses no solo sobre tu dinero inicial, sino también sobre los intereses acumulados."
        },
        {
            pregunta: "¿Qué es el historial crediticio?",
            respuesta: "Es un registro de cómo has manejado tus deudas y pagos."
        },
        {
            pregunta: "¿Cómo puedo empezar a ahorrar?",
            respuesta: "Empieza por anotar tus gastos, definir una meta clara y separar una cantidad fija de tus ingresos."
        },
        {
            pregunta: "¿Qué diferencia hay entre ahorrar e invertir?",
            respuesta: "Ahorrar es guardar dinero. Invertir busca que ese dinero pueda crecer con el tiempo."
        }
    ],

    en: [
        {
            pregunta: "What is a budget?",
            respuesta: "A budget is a plan that helps you organize your income and expenses so you can manage your money better."
        },
        {
            pregunta: "What is saving?",
            respuesta: "Saving means keeping part of your money to reach goals or deal with unexpected expenses."
        },
        {
            pregunta: "What is a credit card?",
            respuesta: "It is a payment method that allows you to buy now and pay later. Interest may apply if you do not pay on time."
        },
        {
            pregunta: "What is an emergency fund?",
            respuesta: "It is money set aside for unexpected expenses."
        },
        {
            pregunta: "Why is investing important?",
            respuesta: "Investing can help your money grow over time and help you reach financial goals."
        },
        {
            pregunta: "What is inflation?",
            respuesta: "Inflation is the general increase in prices over time, which reduces the purchasing power of money."
        },
        {
            pregunta: "What is compound interest?",
            respuesta: "Compound interest means earning interest on your original money and on the interest already accumulated."
        },
        {
            pregunta: "What is a credit history?",
            respuesta: "It is a record of how you have managed debts and payments."
        },
        {
            pregunta: "How can I start saving?",
            respuesta: "Start by tracking your expenses, setting a clear goal, and saving a fixed amount of your income."
        },
        {
            pregunta: "What is the difference between saving and investing?",
            respuesta: "Saving means keeping money. Investing aims to make that money grow over time."
        }
    ],

    fr: [
        {
            pregunta: "Qu'est-ce qu'un budget ?",
            respuesta: "Un budget est un plan qui vous aide à organiser vos revenus et vos dépenses afin de mieux gérer votre argent."
        },
        {
            pregunta: "Qu'est-ce que l'épargne ?",
            respuesta: "Épargner consiste à mettre de côté une partie de votre argent pour atteindre vos objectifs ou faire face aux imprévus."
        },
        {
            pregunta: "Qu'est-ce qu'une carte de crédit ?",
            respuesta: "C'est un moyen de paiement qui permet d'acheter maintenant et de payer plus tard."
        },
        {
            pregunta: "Qu'est-ce qu'un fonds d'urgence ?",
            respuesta: "C'est de l'argent réservé aux dépenses imprévues."
        },
        {
            pregunta: "Pourquoi investir est-il important ?",
            respuesta: "Investir peut permettre à votre argent de croître avec le temps et vous aider à atteindre vos objectifs financiers."
        },
        {
            pregunta: "Qu'est-ce que l'inflation ?",
            respuesta: "L'inflation est l'augmentation générale des prix au fil du temps."
        },
        {
            pregunta: "Qu'est-ce que les intérêts composés ?",
            respuesta: "Les intérêts composés permettent de gagner des intérêts sur votre argent initial ainsi que sur les intérêts accumulés."
        },
        {
            pregunta: "Qu'est-ce qu'un historique de crédit ?",
            respuesta: "C'est un registre de la manière dont vous avez géré vos dettes et vos paiements."
        },
        {
            pregunta: "Comment commencer à épargner ?",
            respuesta: "Commencez par suivre vos dépenses, définir un objectif et mettre régulièrement de l'argent de côté."
        },
        {
            pregunta: "Quelle est la différence entre épargner et investir ?",
            respuesta: "Épargner consiste à conserver de l'argent. Investir cherche à faire croître cet argent avec le temps."
        }
    ],

    pt: [
        {
            pregunta: "O que é um orçamento?",
            respuesta: "Um orçamento é um plano que ajuda você a organizar sua renda e suas despesas para administrar melhor seu dinheiro."
        },
        {
            pregunta: "O que é poupar?",
            respuesta: "Poupar significa guardar parte do seu dinheiro para alcançar objetivos ou lidar com despesas inesperadas."
        },
        {
            pergunta: "O que é um cartão de crédito?",
            respuesta: "É um meio de pagamento que permite comprar agora e pagar depois."
        },
        {
            pregunta: "O que é um fundo de emergência?",
            resposta: "É um dinheiro reservado para despesas inesperadas."
        },
        {
            pregunta: "Por que investir é importante?",
            respuesta: "Investir pode ajudar seu dinheiro a crescer com o tempo e alcançar objetivos financeiros."
        },
        {
            pregunta: "O que é inflação?",
            respuesta: "Inflação é o aumento geral dos preços ao longo do tempo."
        },
        {
            pregunta: "O que são juros compostos?",
            respuesta: "Juros compostos são juros calculados sobre o dinheiro inicial e também sobre os juros acumulados."
        },
        {
            pregunta: "O que é histórico de crédito?",
            respuesta: "É um registro de como você administra suas dívidas e pagamentos."
        },
        {
            pregunta: "Como posso começar a poupar?",
            respuesta: "Comece acompanhando suas despesas, definindo uma meta e guardando uma quantia regularmente."
        },
        {
            pergunta: "Qual é a diferença entre poupar e investir?",
            resposta: "Poupar significa guardar dinheiro. Investir busca fazer esse dinheiro crescer com o tempo."
        }
    ],

    al: [
        {
            pregunta: "Was ist ein Budget?",
            respuesta: "Ein Budget ist ein Plan, der Ihnen hilft, Einnahmen und Ausgaben zu organisieren und Ihr Geld besser zu verwalten."
        },
        {
            pregunta: "Was bedeutet Sparen?",
            respuesta: "Sparen bedeutet, einen Teil Ihres Geldes zurückzulegen, um Ziele zu erreichen oder unerwartete Ausgaben zu bewältigen."
        },
        {
            pregunta: "Was ist eine Kreditkarte?",
            respuesta: "Eine Kreditkarte ist ein Zahlungsmittel, mit dem Sie jetzt kaufen und später bezahlen können."
        },
        {
            pregunta: "Was ist ein Notfallfonds?",
            respuesta: "Ein Notfallfonds ist Geld, das für unerwartete Ausgaben zurückgelegt wird."
        },
        {
            pregunta: "Warum ist Investieren wichtig?",
            respuesta: "Investieren kann dazu beitragen, dass Ihr Geld mit der Zeit wächst und langfristige finanzielle Ziele erreicht werden."
        },
        {
            pregunta: "Was ist Inflation?",
            respuesta: "Inflation ist der allgemeine Anstieg der Preise im Laufe der Zeit."
        },
        {
            pregunta: "Was sind Zinseszinsen?",
            respuesta: "Zinseszinsen entstehen, wenn Sie nicht nur auf Ihr ursprüngliches Geld, sondern auch auf bereits erhaltene Zinsen Zinsen verdienen."
        },
        {
            pregunta: "Was ist eine Kredithistorie?",
            respuesta: "Sie zeigt, wie Sie bisher mit Schulden und Zahlungen umgegangen sind."
        },
        {
            pregunta: "Wie kann ich mit dem Sparen beginnen?",
            respuesta: "Beginnen Sie damit, Ihre Ausgaben zu verfolgen, ein klares Ziel festzulegen und regelmäßig Geld zurückzulegen."
        },
        {
            pregunta: "Was ist der Unterschied zwischen Sparen und Investieren?",
            respuesta: "Sparen bedeutet, Geld zurückzulegen. Investieren zielt darauf ab, dieses Geld langfristig wachsen zu lassen."
        }
    ],

    zh: [
        {
            pregunta: "什么是预算？",
            respuesta: "预算是一个帮助你组织收入和支出、更好地管理资金的计划。"
        },
        {
            pregunta: "什么是储蓄？",
            respuesta: "储蓄是指留出部分资金，用于实现目标或应对未来的意外支出。"
        },
        {
            pregunta: "什么是信用卡？",
            respuesta: "信用卡是一种支付方式，可以先消费后付款。如果不按时还款，会产生利息。"
        },
        {
            pregunta: "什么是应急基金？",
            respuesta: "应急基金是为应对意外支出而预留的资金。"
        },
        {
            pregunta: "为什么投资很重要？",
            respuesta: "投资可以让你的钱随着时间增长，帮助你实现财务目标。"
        },
        {
            pregunta: "什么是通货膨胀？",
            respuesta: "通货膨胀是指物价随时间普遍上涨，导致货币购买力下降。"
        },
        {
            pregunta: "什么是复利？",
            respuesta: "复利是指你不仅从本金中获得利息，还能从已累积的利息中继续获得利息。"
        },
        {
            pregunta: "什么是信用记录？",
            respuesta: "信用记录是你偿还债务和账单情况的记录。"
        },
        {
            pregunta: "我该如何开始储蓄？",
            respuesta: "从记录支出开始，设定明确目标，并固定拿出一部分收入进行储蓄。"
        },
        {
            pregunta: "储蓄和投资有什么区别？",
            respuesta: "储蓄是保留资金，而投资则是让资金随时间增长。"
        }
    ]

};


// ============================================
// RENDERIZAR PREGUNTAS DE STRIX
// ============================================

function renderPreguntasAsistente() {

    const contenedor =
        document.getElementById('preguntas-strix') ||
        document.getElementById('preguntas');


    if (!contenedor) return;


    const preguntas =
        PREGUNTAS_POR_IDIOMA[idiomaActual] ||
        PREGUNTAS_POR_IDIOMA.es;


    contenedor.innerHTML = '';


    preguntas.forEach(item => {

        const button =
            document.createElement('button');


        button.type = 'button';

        button.className =
            'strix-pregunta';

        button.textContent =
            item.pregunta;

        button.dataset.respuesta =
            item.respuesta;


        contenedor.appendChild(button);

    });

}


// ============================================
// ABRIR / CERRAR CHAT DE STRIX
// ============================================

const strixBtn =
    document.getElementById('strix-btn');

const cerrarChatBtn =
    document.getElementById('cerrar-chat');

const asistente =
    document.getElementById('asistente');

const mensajesDiv =
    document.getElementById('mensajes');


if (strixBtn && asistente) {

    strixBtn.addEventListener(
        'click',
        () => {

            asistente.classList.toggle(
                'abierto'
            );

        }
    );

}


if (cerrarChatBtn && asistente) {

    cerrarChatBtn.addEventListener(
        'click',
        () => {

            asistente.classList.remove(
                'abierto'
            );

        }
    );

}


function mostrarRespuestaStrix(
    pregunta,
    respuesta
) {

    if (!mensajesDiv) return;


    const preguntaUsuario =
        document.createElement('div');


    preguntaUsuario.classList.add(
        'pregunta-usuario'
    );


    preguntaUsuario.textContent =
        pregunta;


    mensajesDiv.appendChild(
        preguntaUsuario
    );


    mensajesDiv.scrollTop =
        mensajesDiv.scrollHeight;


    setTimeout(() => {

        const respuestaBot =
            document.createElement('div');


        respuestaBot.classList.add(
            'respuesta'
        );


        respuestaBot.textContent =
            respuesta;


        mensajesDiv.appendChild(
            respuestaBot
        );


        mensajesDiv.scrollTop =
            mensajesDiv.scrollHeight;

    }, 450);

}


document.addEventListener(
    'click',
    event => {

        const pregunta =
            event.target.closest(
                '.strix-pregunta'
            );


        if (!pregunta) return;


        const respuesta =
            pregunta.dataset.respuesta;


        if (!respuesta) return;


        mostrarRespuestaStrix(
            pregunta.textContent,
            respuesta
        );

    }
);


// ============================================
// FINALIZAR CONFIGURACIÓN
// ============================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        if (
            typeof renderPreguntasAsistente ===
            'function'
        ) {

            renderPreguntasAsistente();

        }

    }
);