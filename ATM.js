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

    document.querySelectorAll('[data-es]').forEach(element => {
        if (element.querySelector('[data-es]')) return;
        element.textContent = element.dataset[lang] || element.dataset.es || '';
    });

    document.querySelectorAll('[data-lang-label]').forEach(element => {
        element.textContent = info.label;
    });
    document.querySelectorAll('[data-lang-code]').forEach(element => {
        element.textContent = info.code;
    });

    document.querySelectorAll('[data-lang-flag]').forEach(currentFlag => {
        const selectedOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (!selectedOption) return;
        const selectedImage = selectedOption.querySelector('img');
        if (!selectedImage) return;
        currentFlag.src = selectedImage.src;
        currentFlag.alt = selectedImage.alt || info.label;
    });

    document.querySelectorAll('.lang-option').forEach(button => {
        button.classList.toggle('is-active', button.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'al' ? 'de' : (lang === 'zh' ? 'zh-CN' : lang);
    localStorage.setItem('lang', lang);

    if (typeof renderPreguntasAsistente === 'function') {
        renderPreguntasAsistente();
    }
    // Si hay un fraude activo, refresca su texto al idioma nuevo
    if (typeof actualizarFraudeActivo === 'function') {
        actualizarFraudeActivo();
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
// ANIMACIÓN ESCALONADA DE TARJETAS
// ============================================

(() => {
    const grupos = document.querySelectorAll('.servicios-grid, .faq-bento-grid');
    if (!grupos.length) return;

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducirMovimiento) return;

    grupos.forEach(grupo => {
        Array.from(grupo.children).forEach((tarjeta, index) => {
            tarjeta.style.setProperty('--animation-delay', `${index * 80}ms`);
            tarjeta.classList.add('stagger-item');
        });
    });
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

    document.querySelectorAll('a, button, .banco-card, .faq-bento-item, #strix-btn').forEach(element => {
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
// CARRUSEL BANCOS — DRAG & DROP + BOTONES
// ============================================

const bancosTrack = document.getElementById('bancosTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (bancosTrack) {

    const cardWidth = () => {
        const card = bancosTrack.querySelector('.banco-card');
        return card ? card.offsetWidth + 24 : 340;
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            bancosTrack.scrollBy({ left: cardWidth(), behavior: 'smooth' });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            bancosTrack.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
        });
    }

    let isDown = false;
    let startX;
    let scrollLeft;
    let dragThreshold = false;

    bancosTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        dragThreshold = false;
        bancosTrack.classList.add('active-drag');
        startX = e.pageX - bancosTrack.offsetLeft;
        scrollLeft = bancosTrack.scrollLeft;
        bancosTrack.style.scrollBehavior = 'auto';
    });

    bancosTrack.addEventListener('mouseleave', () => {
        isDown = false;
        bancosTrack.classList.remove('active-drag');
        bancosTrack.style.scrollBehavior = 'smooth';
    });

    bancosTrack.addEventListener('mouseup', () => {
        isDown = false;
        bancosTrack.classList.remove('active-drag');
        bancosTrack.style.scrollBehavior = 'smooth';
    });

    bancosTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        dragThreshold = true;
        const x = e.pageX - bancosTrack.offsetLeft;
        const walk = (x - startX) * 1.5;
        bancosTrack.scrollLeft = scrollLeft - walk;
    });

    bancosTrack.querySelectorAll('.banco-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (dragThreshold) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
}


// ============================================
// FAQ BENTO GRID — INTERACCIONES
// ============================================

document.querySelectorAll('.faq-bento-item').forEach(item => {
    const btn = item.querySelector('.faq-bento-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        item.classList.toggle('is-open');
    });
});


// ============================================
// DETECTOR DE CAJERO FALSIFICADO — hotspots
// ============================================

const FRAUDES_POR_IDIOMA = {

    es: {
        camara: { badge: 'Cámara oculta', titulo: 'Cámara espía en el panel superior', desc: 'Se instala un pequeño orificio con una micro cámara sobre el teclado para grabar el PIN mientras lo digitas.', tip: 'Cubre siempre el teclado con tu mano libre al ingresar tu PIN.' },
        skimmer: { badge: 'Skimmer', titulo: 'Lector de tarjetas clonado', desc: 'Un dispositivo falso se coloca sobre la ranura original para copiar la banda magnética de tu tarjeta.', tip: 'Antes de insertar tu tarjeta, jala suavemente la ranura para comprobar que no esté suelta.' },
        teclado: { badge: 'Teclado falso', titulo: 'Sobre-teclado que graba tu PIN', desc: 'Se coloca una capa plástica encima del teclado original que registra cada tecla que presionas.', tip: 'Si el teclado se siente más grueso o blando de lo normal, no lo uses y repórtalo.' }
    },
    en: {
        camara: { badge: 'Hidden camera', titulo: 'Spy camera on the upper panel', desc: 'A tiny pinhole camera is installed above the keypad to record your PIN as you type it.', tip: 'Always cover the keypad with your free hand when entering your PIN.' },
        skimmer: { badge: 'Skimmer', titulo: 'Cloned card reader', desc: 'A fake device is placed over the original card slot to copy your card\u2019s magnetic stripe.', tip: 'Before inserting your card, gently pull the slot to check it isn\u2019t loose.' },
        teclado: { badge: 'Fake keypad', titulo: 'Overlay keypad that records your PIN', desc: 'A thin plastic layer is placed over the real keypad to log every key you press.', tip: 'If the keypad feels thicker or softer than usual, don\u2019t use it and report it.' }
    },
    fr: {
        camara: { badge: 'Caméra cachée', titulo: 'Caméra espion sur le panneau supérieur', desc: 'Une minuscule caméra est installée au-dessus du clavier pour enregistrer votre code PIN pendant que vous le tapez.', tip: 'Couvrez toujours le clavier avec votre main libre en saisissant votre code PIN.' },
        skimmer: { badge: 'Skimmer', titulo: 'Lecteur de carte cloné', desc: 'Un faux dispositif est placé sur la fente d\u2019origine pour copier la piste magnétique de votre carte.', tip: 'Avant d\u2019insérer votre carte, tirez légèrement sur la fente pour vérifier qu\u2019elle n\u2019est pas mal fixée.' },
        teclado: { badge: 'Faux clavier', titulo: 'Surcouche de clavier qui enregistre votre code', desc: 'Une fine couche plastique est posée sur le vrai clavier pour enregistrer chaque touche pressée.', tip: 'Si le clavier semble plus épais ou plus mou que d\u2019habitude, ne l\u2019utilisez pas et signalez-le.' }
    },
    pt: {
        camara: { badge: 'Câmera oculta', titulo: 'Câmera espiã no painel superior', desc: 'Uma pequena câmera é instalada acima do teclado para gravar seu PIN enquanto você o digita.', tip: 'Cubra sempre o teclado com a mão livre ao digitar seu PIN.' },
        skimmer: { badge: 'Skimmer', titulo: 'Leitor de cartão clonado', desc: 'Um dispositivo falso é colocado sobre a fecha original para copiar a tarja magnética do seu cartão.', tip: 'Antes de inserir seu cartão, puxe suavemente a fenda para verificar se não está solta.' },
        teclado: { badge: 'Teclado falso', titulo: 'Sobreposição que grava seu PIN', desc: 'Uma camada plástica é colocada sobre o teclado original que registra cada tecla pressionada.', tip: 'Se o teclado parecer mais grosso ou macio que o normal, não use e reporte.' }
    },
    al: {
        camara: { badge: 'Versteckte Kamera', titulo: 'Spionagekamera am oberen Panel', desc: 'Eine winzige Lochkamera wird über der Tastatur angebracht, um Ihre PIN beim Eintippen aufzuzeichnen.', tip: 'Decken Sie die Tastatur bei der PIN-Eingabe immer mit der freien Hand ab.' },
        skimmer: { badge: 'Skimmer', titulo: 'Geklonter Kartenleser', desc: 'Ein gefälschtes Gerät wird über dem originalen Kartenschlitz angebracht, um den Magnetstreifen zu kopieren.', tip: 'Ziehen Sie vor dem Einführen der Karte vorsichtig am Schlitz, um zu prüfen, ob er locker ist.' },
        teclado: { badge: 'Gefälschte Tastatur', titulo: 'Tastaturaufsatz, der Ihre PIN aufzeichnet', desc: 'Eine dünne Kunststoffschicht wird über die echte Tastatur gelegt, um jeden gedrückten Knopf zu erfassen.', tip: 'Fühlt sich die Tastatur dicker oder weicher als gewöhnlich an, nutzen Sie sie nicht und melden Sie es.' }
    },
    zh: {
        camara: { badge: '隐藏摄像头', titulo: '安装在上方面板的偷拍摄像头', desc: '在键盘上方安装一个微型针孔摄像头，用来在您输入密码时录下画面。', tip: '输入密码时请务必用空闲的手遮住键盘。' },
        skimmer: { badge: '读卡器盗刷装置', titulo: '克隆读卡器', desc: '在原装插卡口上安装一个假装置，用来复制您卡片的磁条信息。', tip: '插卡前先轻轻拉一下插卡口，检查是否松动。' },
        teclado: { badge: '虚假键盘', titulo: '记录密码的覆盖键盘', desc: '在原装键盘上覆盖一层薄塑料，记录您按下的每一个键。', tip: '如果键盘感觉比平常厚或软，请勿使用并举报。' }
    }
};

let fraudeActivoActual = null;

function actualizarFraudeActivo() {
    if (!fraudeActivoActual) return;
    mostrarFraude(fraudeActivoActual, false);
}

function mostrarFraude(tipo, animar) {
    const datos = (FRAUDES_POR_IDIOMA[idiomaActual] || FRAUDES_POR_IDIOMA.es)[tipo];
    if (!datos) return;

    const initialState = document.getElementById('initialState');
    const activeState = document.getElementById('activeState');
    const badge = document.getElementById('fraudBadge');
    const titulo = document.getElementById('fraudTitle');
    const desc = document.getElementById('fraudDesc');
    const tip = document.getElementById('fraudTip');

    if (!initialState || !activeState || !badge || !titulo || !desc || !tip) return;

    badge.textContent = datos.badge;
    titulo.textContent = datos.titulo;
    desc.textContent = datos.desc;
    tip.textContent = datos.tip;

    initialState.style.display = 'none';
    activeState.style.display = 'block';

    if (animar !== false) {
        activeState.classList.remove('fade-in');
        void activeState.offsetWidth;
        activeState.classList.add('fade-in');
    }

    fraudeActivoActual = tipo;
}

document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', () => {
        document.querySelectorAll('.hotspot.active').forEach(h => h.classList.remove('active'));
        hotspot.classList.add('active');
        mostrarFraude(hotspot.dataset.fraud, true);
    });
});


// ============================================
// STRIX — PREGUNTAS POR IDIOMA
// ============================================

const PREGUNTAS_POR_IDIOMA = {

    es: [
        { pregunta: "¿Qué es un presupuesto?", respuesta: "Un presupuesto es un plan que te ayuda a organizar tus ingresos y gastos para administrar mejor tu dinero." },
        { pregunta: "¿Qué es el ahorro?", respuesta: "El ahorro consiste en guardar una parte de tu dinero para cumplir metas o enfrentar imprevistos en el futuro." },
        { pregunta: "¿Qué es una tarjeta de crédito?", respuesta: "Es un medio de pago que te permite comprar ahora y pagar después. Si no pagas a tiempo, pueden generarse intereses." },
        { pregunta: "¿Qué es un fondo de emergencia?", respuesta: "Es dinero reservado para cubrir gastos inesperados." },
        { pregunta: "¿Por qué es importante invertir?", respuesta: "Invertir permite que tu dinero pueda crecer con el tiempo y ayudarte a alcanzar metas financieras." },
        { pregunta: "¿Qué es la inflación?", respuesta: "Es el aumento general de los precios con el tiempo, lo que hace que tu dinero pierda poder de compra." },
        { pregunta: "¿Qué es el interés compuesto?", respuesta: "Es cuando ganas intereses no solo sobre tu dinero inicial, sino también sobre los intereses acumulados." },
        { pregunta: "¿Qué es el historial crediticio?", respuesta: "Es un registro de cómo has manejado tus deudas y pagos." },
        { pregunta: "¿Cómo puedo empezar a ahorrar?", respuesta: "Empieza por anotar tus gastos, definir una meta clara y separar una cantidad fija de tus ingresos." },
        { pregunta: "¿Qué diferencia hay entre ahorrar e invertir?", respuesta: "Ahorrar es guardar dinero. Invertir busca que ese dinero pueda crecer con el tiempo." }
    ],

    en: [
        { pregunta: "What is a budget?", respuesta: "A budget is a plan that helps you organize your income and expenses so you can manage your money better." },
        { pregunta: "What is saving?", respuesta: "Saving means keeping part of your money to reach goals or deal with unexpected expenses." },
        { pregunta: "What is a credit card?", respuesta: "It is a payment method that allows you to buy now and pay later. Interest may apply if you do not pay on time." },
        { pregunta: "What is an emergency fund?", respuesta: "It is money set aside for unexpected expenses." },
        { pregunta: "Why is investing important?", respuesta: "Investing can help your money grow over time and help you reach financial goals." },
        { pregunta: "What is inflation?", respuesta: "Inflation is the general increase in prices over time, which reduces the purchasing power of money." },
        { pregunta: "What is compound interest?", respuesta: "Compound interest means earning interest on your original money and on the interest already accumulated." },
        { pregunta: "What is a credit history?", respuesta: "It is a record of how you have managed debts and payments." },
        { pregunta: "How can I start saving?", respuesta: "Start by tracking your expenses, setting a clear goal, and saving a fixed amount of your income." },
        { pregunta: "What is the difference between saving and investing?", respuesta: "Saving means keeping money. Investing aims to make that money grow over time." }
    ],

    fr: [
        { pregunta: "Qu'est-ce qu'un budget ?", respuesta: "Un budget est un plan qui vous aide à organiser vos revenus et vos dépenses afin de mieux gérer votre argent." },
        { pregunta: "Qu'est-ce que l'épargne ?", respuesta: "Épargner consiste à mettre de côté une partie de votre argent pour atteindre vos objectifs ou faire face aux imprévus." },
        { pregunta: "Qu'est-ce qu'une carte de crédit ?", respuesta: "C'est un moyen de paiement qui permet d'acheter maintenant et de payer plus tard." },
        { pregunta: "Qu'est-ce qu'un fonds d'urgence ?", respuesta: "C'est de l'argent réservé aux dépenses imprévues." },
        { pregunta: "Pourquoi investir est-il important ?", respuesta: "Investir peut permettre à votre argent de croître avec le temps et vous aider à atteindre vos objectifs financiers." },
        { pregunta: "Qu'est-ce que l'inflation ?", respuesta: "L'inflation est l'augmentation générale des prix au fil du temps." },
        { pregunta: "Qu'est-ce que les intérêts composés ?", respuesta: "Les intérêts composés permettent de gagner des intérêts sur votre argent initial ainsi que sur les intérêts accumulés." },
        { pregunta: "Qu'est-ce qu'un historique de crédit ?", respuesta: "C'est un registre de la manière dont vous avez géré vos dettes et vos paiements." },
        { pregunta: "Comment commencer à épargner ?", respuesta: "Commencez par suivre vos dépenses, définir un objectif et mettre régulièrement de l'argent de côté." },
        { pregunta: "Quelle est la différence entre épargner et investir ?", respuesta: "Épargner consiste à conserver de l'argent. Investir cherche à faire croître cet argent avec le temps." }
    ],

    pt: [
        { pregunta: "O que é um orçamento?", respuesta: "Um orçamento é um plano que ajuda você a organizar sua renda e suas despesas para administrar melhor seu dinheiro." },
        { pregunta: "O que é poupar?", respuesta: "Poupar significa guardar parte do seu dinheiro para alcançar objetivos ou lidar com despesas inesperadas." },
        { pregunta: "O que é um cartão de crédito?", respuesta: "É um meio de pagamento que permite comprar agora e pagar depois." },
        { pregunta: "O que é um fundo de emergência?", respuesta: "É um dinheiro reservado para despesas inesperadas." },
        { pregunta: "Por que investir é importante?", respuesta: "Investir pode ajudar seu dinheiro a crescer com o tempo e alcançar objetivos financeiros." },
        { pregunta: "O que é inflação?", respuesta: "Inflação é o aumento geral dos preços ao longo do tempo." },
        { pregunta: "O que são juros compostos?", respuesta: "Juros compostos são juros calculados sobre o dinheiro inicial e também sobre os juros acumulados." },
        { pregunta: "O que é histórico de crédito?", respuesta: "É um registro de como você administra suas dívidas e pagamentos." },
        { pregunta: "Como posso começar a poupar?", respuesta: "Comece acompanhando suas despesas, definindo uma meta e guardando uma quantia regularmente." },
        { pregunta: "Qual é a diferença entre poupar e investir?", respuesta: "Poupar significa guardar dinheiro. Investir busca fazer esse dinheiro crescer com o tempo." }
    ],

    al: [
        { pregunta: "Was ist ein Budget?", respuesta: "Ein Budget ist ein Plan, der Ihnen hilft, Einnahmen und Ausgaben zu organisieren und Ihr Geld besser zu verwalten." },
        { pregunta: "Was bedeutet Sparen?", respuesta: "Sparen bedeutet, einen Teil Ihres Geldes zurückzulegen, um Ziele zu erreichen oder unerwartete Ausgaben zu bewältigen." },
        { pregunta: "Was ist eine Kreditkarte?", respuesta: "Eine Kreditkarte ist ein Zahlungsmittel, mit dem Sie jetzt kaufen und später bezahlen können." },
        { pregunta: "Was ist ein Notfallfonds?", respuesta: "Ein Notfallfonds ist Geld, das für unerwartete Ausgaben zurückgelegt wird." },
        { pregunta: "Warum ist Investieren wichtig?", respuesta: "Investieren kann dazu beitragen, dass Ihr Geld mit der Zeit wächst und langfristige finanzielle Ziele erreicht werden." },
        { pregunta: "Was ist Inflation?", respuesta: "Inflation ist der allgemeine Anstieg der Preise im Laufe der Zeit." },
        { pregunta: "Was sind Zinseszinsen?", respuesta: "Zinseszinsen entstehen, wenn Sie nicht nur auf Ihr ursprüngliches Geld, sondern auch auf bereits erhaltene Zinsen Zinsen verdienen." },
        { pregunta: "Was ist eine Kredithistorie?", respuesta: "Sie zeigt, wie Sie bisher mit Schulden und Zahlungen umgegangen sind." },
        { pregunta: "Wie kann ich mit dem Sparen beginnen?", respuesta: "Beginnen Sie damit, Ihre Ausgaben zu verfolgen, ein klares Ziel festzulegen und regelmäßig Geld zurückzulegen." },
        { pregunta: "Was ist der Unterschied zwischen Sparen und Investieren?", respuesta: "Sparen bedeutet, Geld zurückzulegen. Investieren zielt darauf ab, dieses Geld langfristig wachsen zu lassen." }
    ],

    zh: [
        { pregunta: "什么是预算？", respuesta: "预算是一个帮助你组织收入和支出、更好地管理资金的计划。" },
        { pregunta: "什么是储蓄？", respuesta: "储蓄是指留出部分资金，用于实现目标或应对未来的意外支出。" },
        { pregunta: "什么是信用卡？", respuesta: "信用卡是一种支付方式，可以先消费后付款。如果不按时还款，会产生利息。" },
        { pregunta: "什么是应急基金？", respuesta: "应急基金是为应对意外支出而预留的资金。" },
        { pregunta: "为什么投资很重要？", respuesta: "投资可以让你的钱随着时间增长，帮助你实现财务目标。" },
        { pregunta: "什么是通货膨胀？", respuesta: "通货膨胀是指物价随时间普遍上涨，导致货币购买力下降。" },
        { pregunta: "什么是复利？", respuesta: "复利是指你不仅从本金中获得利息，还能从已累积的利息中继续获得利息。" },
        { pregunta: "什么是信用记录？", respuesta: "信用记录是你偿还债务和账单情况的记录。" },
        { pregunta: "我该如何开始储蓄？", respuesta: "从记录支出开始，设定明确目标，并固定拿出一部分收入进行储蓄。" },
        { pregunta: "储蓄和投资有什么区别？", respuesta: "储蓄是保留资金，而投资则是让资金随时间增长。" }
    ]
};


// ============================================
// RENDERIZAR PREGUNTAS DE STRIX
// ============================================

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