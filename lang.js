// ============================================
// LANG.JS — Selector de idioma compartido
// (usado por inicio_sesion.html y registro.html)
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
    // TEXTOS NORMALES
    // ----------------------------------------
    document.querySelectorAll('[data-es]').forEach(element => {
        if (element.querySelector('[data-es]')) return;
        element.textContent = element.dataset[lang] || element.dataset.es || '';
    });

    // ----------------------------------------
    // PLACEHOLDERS DE INPUTS
    // ----------------------------------------
    document.querySelectorAll('[data-es-placeholder]').forEach(element => {
        const clave = lang + 'Placeholder';
        element.placeholder = element.dataset[clave] || element.dataset.esPlaceholder || '';
    });

    // ----------------------------------------
    // ARIA-LABEL
    // ----------------------------------------
    document.querySelectorAll('[data-es-aria]').forEach(element => {
        const clave = lang + 'Aria';
        element.setAttribute('aria-label', element.dataset[clave] || element.dataset.esAria || '');
    });

    // ----------------------------------------
    // TÍTULO DE LA PESTAÑA
    // ----------------------------------------
    const claveTitulo = 'title' + lang.charAt(0).toUpperCase() + lang.slice(1);
    if (document.body.dataset[claveTitulo]) {
        document.title = document.body.dataset[claveTitulo];
    }

    // ----------------------------------------
    // CAMBIAR NOMBRE DEL IDIOMA (píldora)
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
    // MARCAR IDIOMA ACTIVO EN EL DROPDOWN
    // ----------------------------------------
    document.querySelectorAll('.lang-option').forEach(button => {
        button.classList.toggle('is-active', button.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'al' ? 'de' : (lang === 'zh' ? 'zh-CN' : lang);
    localStorage.setItem('lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const idiomaGuardado = localStorage.getItem('lang') || 'es';
    setLang(idiomaGuardado);
});

// ============================================
// ABRIR / CERRAR EL SELECTOR
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

document.addEventListener('click', event => {
    if (!event.target.closest('.nav-lang-desktop')) {
        cerrarSelectorIdioma();
    }
});
