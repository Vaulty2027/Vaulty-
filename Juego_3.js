 // ============================================
    // LÓGICA DEL JUEGO (con soporte de idiomas ES/EN)
    // ============================================
    const SAVE_KEY = "vidaDeAhorrosSaveV2";
    const CAMPAIGN_MONTHS = 36;
    const $ = (id) => document.getElementById(id);
    const screens = { start: $("startScreen"), creator: $("creatorScreen"), game: $("gameScreen"), result: $("resultScreen") };
    let state = null;
    let jobOffers = [];
    let currentMiniGame = null;
    let tutorialStep = 0;

    // --------------------------------------------
    // IDIOMA (comparte la clave 'lang' con el resto de la web)
    // --------------------------------------------
    const LANGUAGES = ["es", "en"]; // Cuando traduzcas a más idiomas, agrégalos aquí (fr, pt, al, zh...)

    function langActual() {
        const guardado = localStorage.getItem("lang");
        return LANGUAGES.includes(guardado) ? guardado : "es";
    }

    // Admite: "texto plano", { es: "...", en: "..." } y { es: fn, en: fn }
    function T(campo) {
        if (campo == null) return "";
        if (typeof campo !== "object") return String(campo);
        return campo[langActual()] ?? campo.es ?? "";
    }

    // --------------------------------------------
    // TEXTOS ESTÁTICOS DEL HTML (por selector CSS)
    // Formato: [español, inglés, modo?] — modo: "html" | "aria-label" | "placeholder"
    // --------------------------------------------
    const TRAD = {
        ".brand-lockup span:not(.brand-mark)": ["Vaulty presenta", "Vaulty presents"],
        "#startScreen .eyebrow": ["simulador narrativo de vida financiera", "a narrative financial life simulator"],
        "#startScreen h1": ["Tu vida.<br><span>Mil caminos.</span>", "Your life.<br><span>A thousand paths.</span>", "html"],
        "#startScreen .lead": ["El dinero importa, pero no lo es todo. Construye una carrera, cuida tu salud, crea amistades reales y decide qué significa para ti vivir bien.", "Money matters, but it isn't everything. Build a career, take care of your health, create real friendships and decide what living well means to you."],
        ".feature-pills span:nth-child(1)": ["✦ Decisiones ramificadas", "✦ Branching decisions"],
        ".feature-pills span:nth-child(2)": ["☺ Relaciones vivas", "☺ Living relationships"],
        ".feature-pills span:nth-child(3)": ["↗ Progreso que se guarda", "↗ Progress that saves"],
        "#startBtn": ["Crear mi historia <span>→</span>", "Create my story <span>→</span>", "html"],
        "#continueBtn": ["Continuar partida", "Continue game"],
        ".preview-window-bar span": ["Capítulo 08", "Chapter 08"],
        ".preview-balance small": ["Patrimonio", "Net worth"],
        ".preview-story small": ["UNA DECISIÓN DIFÍCIL", "A HARD DECISION"],
        ".preview-story strong": ["Tu amiga necesita que la escuches", "Your friend needs you to listen"],
        ".preview-story p": ["El tiempo también es una inversión.", "Time is also an investment."],
        ".preview-choice.active": ["Acompañarla esta tarde", "Keep her company this afternoon"],
        ".preview-choice:not(.active)": ["Priorizar el trabajo", "Prioritize work"],
        ".preview-people p strong": ["3 vínculos", "3 bonds"],
        ".preview-people p small": ["Tu red también crece contigo", "Your network grows with you"],
        ".creator-heading .eyebrow": ["antes del primer capítulo", "before the first chapter"],
        ".creator-heading h2": ["¿Quién quieres ser?", "Who do you want to be?"],
        ".creator-heading p:last-child": ["Tu punto de partida abre oportunidades diferentes. Ningún camino es perfecto.", "Your starting point opens different opportunities. No path is perfect."],
        "#backToStartBtn": ["Volver al inicio", "Back to start", "aria-label"],
        "#playerName": ["Ej: Alex", "e.g. Alex", "placeholder"],
        "#creatorForm button[type='submit']": ["Comenzar el capítulo 1 <span>→</span>", "Start chapter 1 <span>→</span>", "html"],
        ".creator-guide .eyebrow": ["tu brújula", "your compass"],
        ".creator-guide h3": ["El éxito tiene más de una forma", "Success has more than one shape"],
        ".creator-guide > p:not(.eyebrow)": ["Cada mes tendrás tres puntos de tiempo. Podrás usarlos para trabajar en ti, ganar dinero o cuidar a las personas importantes.", "Each month you get three time points. Use them to work on yourself, earn money or care for the people who matter."],
        ".creator-guide li:nth-child(1)": ["<span>◉</span> Tus amistades recuerdan cómo las trataste.", "<span>◉</span> Your friends remember how you treated them.", "html"],
        ".creator-guide li:nth-child(2)": ["<span>◉</span> El estrés, la salud y la felicidad cambian tus opciones.", "<span>◉</span> Stress, health and happiness change your options.", "html"],
        ".creator-guide li:nth-child(3)": ["<span>◉</span> Ahorrar ayuda, pero algunas oportunidades no se repiten.", "<span>◉</span> Saving helps, but some opportunities never come back.", "html"],
        ".dashboard .money-card:nth-child(1) span": ["Dinero disponible", "Available money"],
        ".dashboard .money-card:nth-child(2) span": ["Ingresos", "Income"],
        ".dashboard .money-card:nth-child(3) span": ["Gastos", "Expenses"],
        ".dashboard .money-card:nth-child(4) span": ["Deuda", "Debt"],
        ".dashboard .money-card:nth-child(5) span": ["Patrimonio", "Net worth"],
        "#cashTrend": ["Listo para decidir", "Ready to decide"],
        ".dashboard .money-card:nth-child(2) small": ["al mes", "per month"],
        "#expenseHint": ["estimados", "estimated"],
        "#debtHint": ["bajo control", "under control"],
        ".dashboard .money-card:nth-child(5) small": ["tu progreso real", "your real progress"],
        ".pulse-strip > div:nth-child(1) small": ["Tiempo este mes", "Time this month"],
        ".pulse-strip > div:nth-child(2) small": ["Red de apoyo", "Support network"],
        ".pulse-strip > div:nth-child(3) small": ["Sueño principal", "Main dream"],
        ".stats-panel h3": ["Cómo estás", "How you're doing"],
        "#overallMood": ["En equilibrio", "In balance"],
        ".chapter-panel h3": ["Tu recorrido", "Your journey"],
        ".goals-panel h3": ["Metas vivas", "Living goals"],
        "#achievementCount": ["0 desbloqueados", "0 unlocked"],
        ".tab[data-tab='life']": ["<span>✦</span> Historia", "<span>✦</span> Story", "html"],
        ".tab[data-tab='relationships']": ["<span>☺</span> Personas", "<span>☺</span> People", "html"],
        ".tab[data-tab='work']": ["<span>▣</span> Trabajo", "<span>▣</span> Work", "html"],
        ".tab[data-tab='market']": ["<span>◇</span> Mercado", "<span>◇</span> Market", "html"],
        ".tab[data-tab='investments']": ["<span>↗</span> Inversiones", "<span>↗</span> Investments", "html"],
        ".tab[data-tab='history']": ["<span>≡</span> Mi vida", "<span>≡</span> My life", "html"],
        ".action-panel .eyebrow": ["elige cómo usar tu tiempo", "choose how to use your time"],
        ".action-panel h3": ["Acciones del mes", "This month's actions"],
        ".plan-panel .eyebrow": ["piloto automático", "autopilot"],
        ".plan-panel h3": ["Tu plan financiero", "Your financial plan"],
        ".plan-panel > p:not(.eyebrow)": ["Al cerrar cada mes se aplicará este plan después de pagar tus gastos.", "When you close each month, this plan is applied after paying your expenses."],
        ".month-footer .eyebrow": ["cuando estés listo", "when you're ready"],
        ".month-footer h3": ["Cierra el mes y descubre las consecuencias", "Close the month and discover the consequences"],
        "#eventText": ["Primero toma la decisión principal de este capítulo.", "First, make this chapter's main decision."],
        "#advanceMonthBtn": ["Cerrar mes <span>→</span>", "Close month <span>→</span>", "html"],
        "#relationships .eyebrow": ["tu red de apoyo", "your support network"],
        "#relationships h3": ["Las personas también son parte de tu patrimonio", "People are also part of your net worth"],
        "#relationships .split-panel > div > p:not(.eyebrow)": ["Comparte tiempo, escucha y construye confianza. Cada persona tiene su propia historia.", "Share time, listen and build trust. Every person has their own story."],
        "#relationshipSummary": ["2 personas conocidas", "2 people known"],
        "#work .eyebrow": ["carrera y propósito", "career and purpose"],
        "#work h3": ["Elige un trabajo que encaje con tu vida", "Choose a job that fits your life"],
        "#work .split-panel > div > p:not(.eyebrow)": ["El salario importa, pero también el estrés, el tiempo y las oportunidades.", "Salary matters, but so do stress, time and opportunities."],
        "#newJobOffersBtn": ["Buscar nuevas ofertas · 1⚡", "Search new offers · 1⚡"],
        "#market .eyebrow": ["decisiones de consumo", "spending decisions"],
        "#market h3": ["Compra cosas que mejoren tu historia", "Buy things that improve your story"],
        "#market .split-panel > div > p:not(.eyebrow)": ["Algunas compras abren caminos; otras añaden gastos que tendrás que sostener.", "Some purchases open paths; others add expenses you'll have to keep paying."],
        "#investments .eyebrow": ["riesgo y recompensa", "risk and reward"],
        "#investments h3": ["Haz crecer el dinero sin perder la calma", "Grow your money without losing your calm"],
        "#investments .split-panel > div > p:not(.eyebrow)": ["Diversifica y conserva un fondo de emergencia. El mercado cambia cada mes.", "Diversify and keep an emergency fund. The market changes every month."],
        "#riskProfile": ["Perfil equilibrado", "Balanced profile"],
        "#investments .panel-heading h3": ["Cartera actual", "Current portfolio"],
        "#history .panel-heading h3": ["Logros", "Achievements"],
        "#history .history-columns .panel:nth-child(1) h3": ["Activos y posesiones", "Assets & possessions"],
        "#history .history-columns .panel:nth-child(2) h3": ["Diario de decisiones", "Decision journal"],
        "#resultLabel": ["el final de esta etapa", "the end of this chapter"],
        "#resultTitle": ["Tu historia", "Your story"],
        "#playAgainBtn": ["Vivir otra historia", "Live another story"],
        "#continueAfterEndBtn": ["Seguir en modo libre", "Continue in free mode"],
        "#tutorialNextBtn": ["Entendido <span>→</span>", "Got it <span>→</span>", "html"],
        ".month-dialog .eyebrow": ["resumen del mes", "month summary"],
        "#monthDialogTitle": ["Un mes más de historia", "Another month of story"],
        "#closeMonthDialog": ["Abrir el siguiente capítulo", "Open the next chapter"]
    };

    // Labels que contienen inputs/selects: solo se cambia el nodo de texto inicial
    const TRAD_LABELS = {
        playerName: ["¿Cómo te llamas?", "What's your name?"],
        playerAge: ["Edad inicial", "Starting age"],
        educationSelect: ["Formación", "Education"],
        lifestyleSelect: ["Relación con el dinero", "Relationship with money"],
        originSelect: ["Tu comienzo", "Your starting point"],
        aspirationSelect: ["Tu gran sueño", "Your big dream"],
        savingRate: ["Ahorro automático ", "Automatic saving "],
        debtPayment: ["Pago extra a deuda ", "Extra debt payment "]
    };

    // Opciones de los <select> (por value)
    const TRAD_OPTIONS = {
        educationSelect: { secundaria: ["Secundaria", "High school"], tecnico: ["Técnico", "Trade school"], universidad: ["Universidad", "University"], posgrado: ["Posgrado", "Graduate degree"] },
        lifestyleSelect: { ahorrador: ["Planifico cada dólar", "I plan every dollar"], equilibrado: ["Busco equilibrio", "I look for balance"], gastador: ["Vivo el presente", "I live in the present"] },
        originSelect: { familia: ["Vivo con mi familia", "I live with my family"], independiente: ["Me independicé", "I moved out on my own"], nuevo: ["Llegué a una nueva ciudad", "I arrived in a new city"], emprendedor: ["Tengo una pequeña idea", "I have a small idea"] },
        aspirationSelect: { libertad: ["Libertad financiera", "Financial freedom"], hogar: ["Tener un hogar propio", "Owning a home"], carrera: ["Una carrera extraordinaria", "An extraordinary career"], comunidad: ["Una vida llena de vínculos", "A life full of connections"] }
    };

    const TRAD_TITULO = ["Vida de Ahorros — Tu historia, tus decisiones", "Life of Savings — Your story, your decisions"];

    function aplicarTraduccionEstatica() {
        const i = langActual() === "en" ? 1 : 0;

        Object.entries(TRAD).forEach(([selector, def]) => {
            const texto = def[i];
            const modo = def[2];
            document.querySelectorAll(selector).forEach(el => {
                if (modo === "html") el.innerHTML = texto;
                else if (modo === "aria-label") el.setAttribute("aria-label", texto);
                else if (modo === "placeholder") el.setAttribute("placeholder", texto);
                else el.textContent = texto;
            });
        });

        Object.entries(TRAD_LABELS).forEach(([id, def]) => {
            const control = document.getElementById(id);
            const label = control && control.closest("label");
            if (label && label.firstChild && label.firstChild.nodeType === Node.TEXT_NODE) {
                label.firstChild.textContent = def[i];
            }
        });

        Object.entries(TRAD_OPTIONS).forEach(([selectId, opciones]) => {
            Object.entries(opciones).forEach(([valor, def]) => {
                const opcion = document.querySelector(`#${selectId} option[value='${valor}']`);
                if (opcion) opcion.textContent = def[i];
            });
        });

        document.title = TRAD_TITULO[i];
        document.documentElement.lang = langActual();
    }

    function reaplicarIdioma() {
        aplicarTraduccionEstatica();
        if (state) renderAll();
        if ($("tutorialTooltip").classList.contains("active")) showTutorialStep();
    }

    // --------------------------------------------
    // FRASES DINÁMICAS (con variables)
    // --------------------------------------------
    const UI = {
        vidaDe: { es: n => `La vida de ${n}`, en: n => `${n}'s life` },
        anioEdad: { es: (a, e) => `Año ${a} · ${e} años`, en: (a, e) => `Year ${a} · ${e} years old` },
        capituloMes: { es: (m, mes) => `capítulo ${m} · ${mes}`, en: (m, mes) => `chapter ${m} · ${mes}` },
        deAcciones: { es: e => `${e} de 3 acciones`, en: e => `${e} of 3 actions` },
        disponibles: { es: e => `${e} disponible${e === 1 ? "" : "s"}`, en: e => `${e} available` },
        capituloUpper: { es: m => `CAPÍTULO ${m}`, en: m => `CHAPTER ${m}` },
        buscoCamino: { es: "Buscando mi camino", en: "Finding my way" },
        personasCerca: { es: n => n === 1 ? "Una persona cerca" : `${n} personas cerca`, en: n => n === 1 ? "One person close" : `${n} people close` },
        hecho: { es: "Hecho", en: "Done" },
        aceptar: { es: "Aceptar", en: "Accept" },
        porMes: { es: "/mes", en: "/mo" },
        estresTag: { es: s => `Estrés ${s}`, en: s => `Stress ${s}` },
        sinOfertas: { es: "No hay ofertas ahora. Usa una acción para buscar.", en: "No offers right now. Use an action to search." },
        compraUnica: { es: "compra única", en: "one-time purchase" },
        comprar: { es: p => `Comprar · ${p}`, en: p => `Buy · ${p}` },
        riesgoPalabra: { es: "riesgo", en: "risk" },
        consecuencia: { es: "Consecuencia", en: "Outcome" },
        resumenIngresos: { es: "Ingresos", en: "Income" },
        resumenGastos: { es: "Gastos", en: "Expenses" },
        resumenAhorro: { es: "Ahorro", en: "Saved" },
        cerasteCapitulo: { es: m => `Cerraste el capítulo ${m}`, en: m => `You closed chapter ${m}` },
        hInicio: { es: "Inicio", en: "Start" },
        hDecision: { es: "Decisión", en: "Decision" },
        hAccion: { es: "Acción", en: "Action" },
        hTrabajo: { es: "Trabajo", en: "Job" },
        hCompra: { es: "Compra", en: "Purchase" },
        hAlerta: { es: "Alerta", en: "Alert" },
        histDeficit: { es: "El déficit se convirtió en deuda.", en: "The deficit turned into debt." },
        toastGuardado: { es: "Partida guardada.", en: "Game saved." },
        toastErrorCargar: { es: "No se pudo recuperar la partida anterior.", en: "Couldn't restore your previous game." },
        toastTutorial: { es: "Tutorial completado. ¡Tu historia comienza ahora!", en: "Tutorial complete. Your story starts now!" },
        toastRepetida: { es: "Ya realizaste esta acción este mes.", en: "You already did this action this month." },
        toastSinEnergia: { es: "No te queda suficiente tiempo este mes.", en: "You don't have enough time left this month." },
        toastAccionInvalida: { es: "Ahora mismo no puedes completar esa acción.", en: "You can't complete that action right now." },
        toastBuscarSinEnergia: { es: "Necesitas una acción de tiempo para buscar ofertas.", en: "You need a time action to search for offers." },
        toastOfertas: { es: "Encontraste nuevas oportunidades laborales.", en: "You found new job opportunities." },
        toastNuevoTrabajo: { es: t => `Nuevo trabajo: ${t}.`, en: t => `New job: ${t}.` },
        toastFaltaDinero: { es: p => `Necesitas ${p} para esta compra.`, en: p => `You need ${p} for this purchase.` },
        toastCompra: { es: t => `${t} ahora forma parte de tu vida.`, en: t => `${t} is now part of your life.` },
        toastSinMonto: { es: "No tienes disponible el monto necesario.", en: "You don't have the required amount available." },
        toastInversion: { es: (a, t) => `Invertiste ${a} en ${t}.`, en: (a, t) => `You invested ${a} in ${t}.` },
        toastVenta: { es: a => `Recuperaste ${a} en efectivo.`, en: a => `You got ${a} back in cash.` },
        toastDecisionPendiente: { es: "Primero elige qué hacer con la decisión principal.", en: "First choose what to do with the main decision." },
        confirmNuevaVida: { es: "¿Empezar una vida nueva?", en: "Start a new life?" }
    };

    // --------------------------------------------
    // DATA DEL JUEGO (bilingüe)
    // --------------------------------------------
    const educationProfiles = { secundaria: { label: { es: "Secundaria", en: "High school" }, cash: 1450, debt: 0, education: 28, skill: 26, reputation: 28 }, tecnico: { label: { es: "Técnico", en: "Trade school" }, cash: 1180, debt: 350, education: 43, skill: 42, reputation: 34 }, universidad: { label: { es: "Universidad", en: "University" }, cash: 850, debt: 1800, education: 60, skill: 49, reputation: 42 }, posgrado: { label: { es: "Posgrado", en: "Graduate degree" }, cash: 650, debt: 3300, education: 76, skill: 60, reputation: 50 } };
    const lifestyleProfiles = { ahorrador: { label: { es: "Planificador", en: "Planner" }, cash: 520, expenseMod: .84, happiness: -3, stress: 3, reputation: 0 }, equilibrado: { label: { es: "Equilibrado", en: "Balanced" }, cash: 270, expenseMod: 1, happiness: 3, stress: 0, reputation: 1 }, gastador: { label: { es: "Espontáneo", en: "Spontaneous" }, cash: 80, expenseMod: 1.22, happiness: 10, stress: -2, reputation: 3 } };
    const originProfiles = { familia: { label: { es: "Vivo con mi familia", en: "Living with family" }, cash: 620, debt: 0, rent: 280, happiness: 4, stress: -3, social: 8, sideIncome: 0 }, independiente: { label: { es: "Me independicé", en: "Living on my own" }, cash: 120, debt: 250, rent: 650, happiness: 3, stress: 4, social: 0, sideIncome: 0 }, nuevo: { label: { es: "Nueva ciudad", en: "New city" }, cash: 330, debt: 0, rent: 570, happiness: -2, stress: 5, social: -7, sideIncome: 0 }, emprendedor: { label: { es: "Pequeña idea", en: "Small idea" }, cash: -120, debt: 650, rent: 520, happiness: 5, stress: 6, social: 1, sideIncome: 105 } };
    const aspirations = { libertad: { label: { es: "Libertad financiera", en: "Financial freedom" }, icon: "↗" }, hogar: { label: { es: "Un hogar propio", en: "A home of your own" }, icon: "⌂" }, carrera: { label: { es: "Una carrera extraordinaria", en: "An extraordinary career" }, icon: "★" }, comunidad: { label: { es: "Una vida llena de vínculos", en: "A life full of connections" }, icon: "☺" } };
    const jobs = [ { id: "cashier", title: { es: "Cajero de minimercado", en: "Corner store cashier" }, tier: { es: "Inicial", en: "Entry-level" }, salary: 850, hours: "8 h", stress: 25, benefits: { es: "10% menos en comida", en: "10% off food" }, layoffRisk: .07, growth: .08, minEducation: 0, minSkill: 0 }, { id: "delivery", title: { es: "Repartidor urbano", en: "Urban courier" }, tier: { es: "Inicial", en: "Entry-level" }, salary: 980, hours: "Flexible", stress: 34, benefits: { es: "Propinas variables", en: "Variable tips" }, layoffRisk: .09, growth: .06, minEducation: 0, minSkill: 8 }, { id: "assistant", title: { es: "Asistente administrativo", en: "Administrative assistant" }, tier: { es: "Inicial", en: "Entry-level" }, salary: 1220, hours: { es: "9 a 5", en: "9 to 5" }, stress: 26, benefits: { es: "Seguro parcial", en: "Partial insurance" }, layoffRisk: .06, growth: .11, minEducation: 25, minSkill: 18 }, { id: "community", title: { es: "Coordinador comunitario", en: "Community coordinator" }, tier: { es: "Medio", en: "Mid-level" }, salary: 1450, hours: "Flexible", stress: 30, benefits: { es: "+2 social al mes", en: "+2 social per month" }, layoffRisk: .05, growth: .13, minEducation: 30, minSkill: 28, minReputation: 35 }, { id: "sales", title: { es: "Asesor comercial", en: "Sales advisor" }, tier: { es: "Medio", en: "Mid-level" }, salary: 1650, hours: "9 h", stress: 43, benefits: { es: "Comisiones", en: "Commissions" }, layoffRisk: .1, growth: .14, minEducation: 34, minSkill: 30 }, { id: "technician", title: { es: "Técnico de soporte", en: "IT support technician" }, tier: { es: "Medio", en: "Mid-level" }, salary: 1950, hours: { es: "Turnos", en: "Shifts" }, stress: 38, benefits: { es: "Cursos internos", en: "Internal training" }, layoffRisk: .07, growth: .17, minEducation: 43, minSkill: 42 }, { id: "designer", title: { es: "Diseñador junior", en: "Junior designer" }, tier: { es: "Medio", en: "Mid-level" }, salary: 2250, hours: { es: "Híbrido", en: "Hybrid" }, stress: 35, benefits: { es: "Equipo laboral", en: "Work equipment" }, layoffRisk: .08, growth: .18, minEducation: 48, minSkill: 50 }, { id: "analyst", title: { es: "Analista financiero", en: "Financial analyst" }, tier: { es: "Avanzado", en: "Advanced" }, salary: 3250, hours: { es: "Oficina", en: "Office" }, stress: 50, benefits: { es: "Bono trimestral", en: "Quarterly bonus" }, layoffRisk: .07, growth: .2, minEducation: 61, minSkill: 58 }, { id: "developer", title: { es: "Desarrollador web", en: "Web developer" }, tier: { es: "Avanzado", en: "Advanced" }, salary: 4200, hours: { es: "Remoto", en: "Remote" }, stress: 47, benefits: { es: "Horario flexible", en: "Flexible schedule" }, layoffRisk: .06, growth: .22, minEducation: 58, minSkill: 66 }, { id: "manager", title: { es: "Gerente de operaciones", en: "Operations manager" }, tier: { es: "Liderazgo", en: "Leadership" }, salary: 5700, hours: { es: "Alta demanda", en: "High demand" }, stress: 67, benefits: { es: "Seguro completo", en: "Full insurance" }, layoffRisk: .08, growth: .18, minEducation: 72, minSkill: 70, minReputation: 55 }, { id: "director", title: { es: "Director de estrategia", en: "Strategy director" }, tier: { es: "Élite", en: "Elite" }, salary: 7800, hours: "Variable", stress: 75, benefits: { es: "Bono y acciones", en: "Bonus and stock" }, layoffRisk: .07, growth: .14, minEducation: 84, minSkill: 82, minReputation: 70 } ];
    const marketItems = [ { id: "phone", icon: "▣", title: { es: "Celular confiable", en: "Reliable phone" }, price: 390, desc: { es: "Mantente conectado y mejora el acceso a oportunidades.", en: "Stay connected and improve your access to opportunities." }, repeat: false, effect: { reputation: 4, social: 2, happiness: 2 } }, { id: "laptop", icon: "⌘", title: { es: "Laptop de trabajo", en: "Work laptop" }, price: 920, desc: { es: "Estudiar y hacer trabajos extra será más efectivo.", en: "Studying and side gigs become more effective." }, repeat: false, effect: { skill: 5, education: 3 } }, { id: "bike", icon: "○", title: { es: "Bicicleta", en: "Bicycle" }, price: 340, desc: { es: "Reduce transporte y mejora tu salud cada mes.", en: "Cuts transport costs and improves your health monthly." }, repeat: false, effect: { health: 5 } }, { id: "insurance", icon: "+", title: { es: "Seguro médico", en: "Health insurance" }, price: 610, desc: { es: "Protege tu fondo ante emergencias de salud.", en: "Protects your savings against health emergencies." }, repeat: false, upkeep: 38, effect: { health: 5, stress: -4 } }, { id: "course", icon: "◆", title: { es: "Curso certificado", en: "Certified course" }, price: 680, desc: { es: "Sube formación y habilidad para mejores trabajos.", en: "Boosts education and skill for better jobs." }, repeat: true, effect: { education: 9, skill: 7, stress: 3 } }, { id: "clothes", icon: "◇", title: { es: "Ropa profesional", en: "Professional clothes" }, price: 290, desc: { es: "Mejora entrevistas y primeras impresiones.", en: "Improves interviews and first impressions." }, repeat: true, effect: { reputation: 5, happiness: 2 } }, { id: "furniture", icon: "⌂", title: { es: "Espacio cómodo", en: "Comfortable space" }, price: 760, desc: { es: "Descansar en casa recupera más bienestar.", en: "Resting at home restores more well-being." }, repeat: false, effect: { happiness: 8, stress: -5 } }, { id: "tools", icon: "⚒", title: { es: "Herramientas para emprender", en: "Business starter tools" }, price: 1180, desc: { es: "Crea una pequeña fuente de ingresos extra.", en: "Creates a small source of extra income." }, repeat: false, effect: { skill: 5, sideIncome: 110 } }, { id: "car", icon: "▰", title: { es: "Carro usado", en: "Used car" }, price: 4300, desc: { es: "Abre opciones laborales, pero cuesta mantenerlo.", en: "Opens job options, but costs money to maintain." }, repeat: false, upkeep: 145, effect: { reputation: 6, stress: -2 } }, { id: "pet", icon: "♥", title: { es: "Adoptar una mascota", en: "Adopt a pet" }, price: 260, desc: { es: "Compañía y felicidad a cambio de un gasto mensual.", en: "Companionship and happiness for a monthly expense." }, repeat: false, upkeep: 55, effect: { happiness: 10, stress: -5, social: 3 } }, { id: "house", icon: "⌂", title: { es: "Entrada para una casa", en: "Home down payment" }, price: 7200, desc: { es: "Patrimonio real, hipoteca y un lugar propio.", en: "Real net worth, a mortgage and a place of your own." }, repeat: false, upkeep: 185, financeDebt: 39000, assetValue: 48000, effect: { happiness: 13, stress: -7, reputation: 7 } } ];
    const investmentTypes = [ { id: "savings", icon: "▤", title: { es: "Depósito a plazo", en: "Term deposit" }, risk: { es: "Bajo", en: "Low" }, min: 100, range: [.001, .007], desc: { es: "Crecimiento lento y estable.", en: "Slow and steady growth." } }, { id: "bonds", icon: "▥", title: { es: "Bonos diversificados", en: "Diversified bonds" }, risk: { es: "Bajo medio", en: "Low-medium" }, min: 200, range: [-.008, .022], desc: { es: "Menos emoción, más estabilidad.", en: "Less thrill, more stability." } }, { id: "stocks", icon: "↗", title: { es: "Fondo de acciones", en: "Stock fund" }, risk: { es: "Medio", en: "Medium" }, min: 250, range: [-.05, .085], desc: { es: "Variación amplia con potencial a largo plazo.", en: "Wide swings with long-term potential." } }, { id: "business", icon: "◆", title: { es: "Negocio pequeño", en: "Small business" }, risk: { es: "Medio alto", en: "Medium-high" }, min: 500, range: [-.09, .13], desc: { es: "Puede crear flujo y contactos.", en: "Can create cash flow and connections." } }, { id: "crypto", icon: "◇", title: { es: "Activo digital ficticio", en: "Fictional digital asset" }, risk: { es: "Alto", en: "High" }, min: 150, range: [-.24, .28], desc: { es: "Muy volátil; nunca inviertas lo esencial.", en: "Very volatile; never invest essential money." } }, { id: "realestate", icon: "⌂", title: { es: "Fondo inmobiliario", en: "Real estate fund" }, risk: { es: "Medio", en: "Medium" }, min: 1400, range: [-.025, .06], desc: { es: "Requiere capital y estabiliza patrimonio.", en: "Needs capital and stabilizes net worth." } } ];
    const people = { luna: { name: "Luna", initials: "LU", role: { es: "Vecina y amiga creativa", en: "Neighbor and creative friend" }, color: "#ffd276", unlock: () => true, unlockText: { es: "Está cerca desde el primer capítulo.", en: "She has been around since chapter one." }, perk: { es: "Con 55 de cercanía: el apoyo mutuo reduce $45 de gastos y mejora el ánimo.", en: "At 55 closeness: mutual support cuts $45 of expenses and lifts your mood." }, note: { es: "Siempre tiene una idea nueva, aunque a veces necesita que alguien la aterrice.", en: "She always has a new idea, though sometimes she needs someone to ground it." } }, diego: { name: "Diego", initials: "DI", role: { es: "Primo y confidente", en: "Cousin and confidant" }, color: "#74e5a4", unlock: () => true, unlockText: { es: "Tu familia sigue a una llamada de distancia.", en: "Your family is still one call away." }, perk: { es: "Con 60 de confianza: te ayuda una vez ante una emergencia grave.", en: "At 60 trust: he helps you once during a serious emergency." }, note: { es: "No siempre entiende tus planes, pero aparece cuando de verdad importa.", en: "He doesn't always get your plans, but he shows up when it truly matters." } }, mateo: { name: "Mateo", initials: "MA", role: { es: "Compañero de trabajo", en: "Coworker" }, color: "#78c9ff", unlock: () => state && (!!state.job || state.month >= 4), unlockText: { es: "Conseguir trabajo o llegar al mes 4.", en: "Get a job or reach month 4." }, perk: { es: "Con 55 de confianza: mejores ofertas y requisitos laborales más flexibles.", en: "At 55 trust: better offers and more flexible job requirements." }, note: { es: "Ambicioso, sociable y muy bueno conectando personas.", en: "Ambitious, sociable and great at connecting people." } }, sofia: { name: "Sofía", initials: "SO", role: { es: "Mentora financiera", en: "Financial mentor" }, color: "#c4a7ff", unlock: () => state && (state.stats.education >= 48 || owns("course")), unlockText: { es: "Alcanza 48 de formación o compra un curso.", en: "Reach 48 education or buy a course." }, perk: { es: "Con 55 de confianza: estudiar da +2 habilidad y las inversiones se entienden mejor.", en: "At 55 trust: studying gives +2 skill and investments make more sense." }, note: { es: "Hace preguntas incómodas que suelen llevarte a respuestas útiles.", en: "She asks uncomfortable questions that often lead to useful answers." } }, vale: { name: "Valentina", initials: "VA", role: { es: "Líder de la comunidad", en: "Community leader" }, color: "#ff9eb5", unlock: () => state && (state.storyFlags.community || state.stats.reputation >= 48), unlockText: { es: "Participa en la comunidad o alcanza 48 de reputación.", en: "Join community activities or reach 48 reputation." }, perk: { es: "Con 55 de cercanía: tu red genera $45 mensuales en oportunidades.", en: "At 55 closeness: your network generates $45 a month in opportunities." }, note: { es: "Conoce el barrio, sus problemas y a la gente que intenta resolverlos.", en: "She knows the neighborhood, its problems and the people trying to solve them." } }, camila: { name: "Camila", initials: "CA", role: { es: "Emprendedora e inversora", en: "Entrepreneur and investor" }, color: "#ffaf70", unlock: () => state && (state.storyFlags.startup || calculateNetWorth() >= 8000), unlockText: { es: "Apoya un emprendimiento o llega a $8,000 de patrimonio.", en: "Back a startup or reach $8,000 net worth." }, perk: { es: "Con 60 de confianza: los negocios tienen un pequeño impulso mensual.", en: "At 60 trust: businesses get a small monthly boost." }, note: { es: "Piensa en grande, se mueve rápido y respeta a quien cumple su palabra.", en: "She thinks big, moves fast and respects people who keep their word." } } };
    const goals = [ { id: "save1000", title: { es: "Primer colchón", en: "First cushion" }, desc: { es: "Ten $1,000 separados.", en: "Have $1,000 set aside." }, reward: 140, check: () => state.savings >= 1000 }, { id: "friend", title: { es: "Amistad verdadera", en: "True friendship" }, desc: { es: "Alcanza 60 de cercanía con alguien.", en: "Reach 60 closeness with someone." }, reward: 160, check: () => unlockedPeople().some(id => state.relationships[id].closeness >= 60) }, { id: "betterjob", title: { es: "Salto profesional", en: "Career leap" }, desc: { es: "Consigue un salario de $2,000 o más.", en: "Reach a salary of $2,000 or more." }, reward: 220, check: () => state.job && state.job.salary >= 2000 }, { id: "debtfree", title: { es: "Respirar sin deudas", en: "Breathe debt-free" }, desc: { es: "Elimina toda tu deuda después del mes 3.", en: "Pay off all your debt after month 3." }, reward: 280, check: () => state.debt <= 0 && state.month > 3 }, { id: "emergency", title: { es: "Tres meses de calma", en: "Three months of calm" }, desc: { es: "Ahorra tres meses de gastos.", en: "Save three months of expenses." }, reward: 380, check: () => state.savings >= calculateExpenses().total * 3 }, { id: "net10k", title: { es: "Cinco cifras", en: "Five figures" }, desc: { es: "Llega a $10,000 de patrimonio.", en: "Reach $10,000 net worth." }, reward: 450, check: () => calculateNetWorth() >= 10000 }, { id: "balanced", title: { es: "Vida en equilibrio", en: "A balanced life" }, desc: { es: "En el mes 12, mantén salud, felicidad y vida social sobre 60.", en: "In month 12, keep health, happiness and social life above 60." }, reward: 520, check: () => state.month >= 12 && state.stats.health >= 60 && state.stats.happiness >= 60 && state.stats.social >= 60 }, { id: "home", title: { es: "Un lugar propio", en: "A place of your own" }, desc: { es: "Compra una casa.", en: "Buy a house." }, reward: 700, check: () => owns("house") } ];
    const achievements = [ { id: "first_choice", icon: "✦", title: { es: "Primer paso", en: "First step" }, desc: { es: "Tomaste tu primera decisión.", en: "You made your first decision." }, check: () => state.decisionHistory.length >= 1 }, { id: "social_butterfly", icon: "☺", title: { es: "Red que sostiene", en: "A network that holds" }, desc: { es: "Conoce a cinco personas.", en: "Meet five people." }, check: () => unlockedPeople().length >= 5 }, { id: "best_friend", icon: "♥", title: { es: "Mejor amistad", en: "Best friendship" }, desc: { es: "Cercanía y confianza sobre 75.", en: "Closeness and trust above 75." }, check: () => unlockedPeople().some(id => state.relationships[id].closeness >= 75 && state.relationships[id].trust >= 75) }, { id: "investor", icon: "↗", title: { es: "Primer inversor", en: "First investor" }, desc: { es: "Crea una cartera de $1,000.", en: "Build a $1,000 portfolio." }, check: () => portfolioValue() >= 1000 }, { id: "diversified", icon: "◆", title: { es: "Sin una sola canasta", en: "Not one basket" }, desc: { es: "Invierte en tres tipos de activo.", en: "Invest in three asset types." }, check: () => state.investments.length >= 3 }, { id: "healthy", icon: "+", title: { es: "Cuerpo primero", en: "Body first" }, desc: { es: "Alcanza 90 de salud.", en: "Reach 90 health." }, check: () => state.stats.health >= 90 }, { id: "career", icon: "★", title: { es: "En ascenso", en: "On the rise" }, desc: { es: "Gana $3,000 o más al mes.", en: "Earn $3,000 or more per month." }, check: () => state.job && state.job.salary >= 3000 }, { id: "homeowner", icon: "⌂", title: { es: "Llaves propias", en: "Your own keys" }, desc: { es: "Compra una casa.", en: "Buy a house." }, check: () => owns("house") }, { id: "debt_slayer", icon: "✓", title: { es: "Cuenta saldada", en: "Debt cleared" }, desc: { es: "Paga una deuda de más de $1,000.", en: "Pay off debt of more than $1,000." }, check: () => state.storyFlags.hadBigDebt && state.debt <= 0 }, { id: "resilient", icon: "◉", title: { es: "Volver a levantarse", en: "Bouncing back" }, desc: { es: "Recupérate después de estar bajo $0.", en: "Recover after dropping below $0." }, check: () => state.storyFlags.wasNegative && state.cash >= 1000 }, { id: "community", icon: "◎", title: { es: "Dejar huella", en: "Leaving a mark" }, desc: { es: "Reputación y vida social sobre 75.", en: "Reputation and social life above 75." }, check: () => state.stats.reputation >= 75 && state.stats.social >= 75 }, { id: "freedom", icon: "∞", title: { es: "Dinero con propósito", en: "Money with purpose" }, desc: { es: "Tus ingresos pasivos cubren los gastos.", en: "Your passive income covers your expenses." }, check: () => calculatePassiveIncome() >= calculateExpenses().total && calculateNetWorth() >= 15000 } ];
    const lifeActions = [ { id: "freelance", icon: "$", title: { es: "Trabajo extra", en: "Side gig" }, desc: { es: "Gana dinero usando una acción.", en: "Earn money using one action." }, cost: 1, run() { const laptop = owns("laptop"); const gain = Math.round(random(laptop ? 170 : 90, laptop ? 330 : 210)); state.cash += gain; adjustStats({ skill: 2, stress: 4 }); return { es: `Ganaste ${money(gain)} y mejoraste tu experiencia.`, en: `You earned ${money(gain)} and improved your experience.` }; } }, { id: "study", icon: "◆", title: { es: "Aprender algo nuevo", en: "Learn something new" }, desc: { es: "Formación y habilidad, con un pequeño costo.", en: "Education and skill, for a small cost." }, cost: 1, run() { if (!pay(45)) return false; const mentor = hasPerk("sofia", 55); const laptop = owns("laptop"); adjustStats({ education: laptop ? 5 : 3, skill: 4 + (mentor ? 2 : 0), stress: 2 }); return { es: "Invertiste en una habilidad que abrirá opciones futuras.", en: "You invested in a skill that will open future options." }; } }, { id: "exercise", icon: "+", title: { es: "Mover el cuerpo", en: "Get moving" }, desc: { es: "Recupera salud y reduce estrés.", en: "Regain health and reduce stress." }, cost: 1, run() { adjustStats({ health: owns("bike") ? 9 : 7, stress: -5, happiness: 2 }); return { es: "Terminaste con más energía y la mente despejada.", en: "You finished with more energy and a clear head." }; } }, { id: "rest", icon: "☾", title: { es: "Descansar de verdad", en: "Truly rest" }, desc: { es: "Recupera bienestar sin sentir culpa.", en: "Recover well-being without guilt." }, cost: 1, run() { adjustStats({ happiness: owns("furniture") ? 8 : 5, stress: owns("furniture") ? -11 : -8, health: 3 }); return { es: "Protegiste tu energía antes de llegar al límite.", en: "You protected your energy before hitting the limit." }; } }, { id: "budget", icon: "▤", title: { es: "Ordenar las cuentas", en: "Tidy up your finances" }, desc: { es: "Separa hasta $120 y baja el estrés.", en: "Set aside up to $120 and lower stress." }, cost: 1, run() { const amount = Math.min(120, Math.max(0, state.cash)); if (amount < 20) return false; state.cash -= amount; state.savings += amount; adjustStats({ stress: -4, reputation: 1 }); return { es: `Separaste ${money(amount)} para tu futuro.`, en: `You set aside ${money(amount)} for your future.` }; } }, { id: "community", icon: "☺", title: { es: "Participar en tu comunidad", en: "Join your community" }, desc: { es: "Crea vínculos y reputación.", en: "Build bonds and reputation." }, cost: 1, run() { state.storyFlags.community = true; adjustStats({ social: 7, reputation: 4, happiness: 4 }); return { es: "Conociste gente nueva y aportaste algo valioso.", en: "You met new people and contributed something valuable." }; } } ];
    const decisions = [ { id: "weekend_friend", category: { es: "AMISTAD", en: "FRIENDSHIP" }, icon: "☕", title: { es: "Luna necesita una pausa", en: "Luna needs a break" }, text: { es: "Tu vecina tuvo una semana terrible y te invita a hablar. Tú también tienes pendientes.", en: "Your neighbor had a terrible week and invites you to talk. You have things to do too." }, context: [{ es: "Tiempo vs. vínculo", en: "Time vs. connection" }, { es: "Consecuencia emocional", en: "Emotional consequences" }], options: [ { label: { es: "Acompañarla esta tarde", en: "Keep her company this afternoon" }, hint: { es: "Cuesta $22, fortalece mucho la amistad.", en: "Costs $22, greatly strengthens the friendship." }, require: { cash: 22 }, effect: { cash: -22, happiness: 4, social: 6, stress: -2 }, relation: { luna: [10, 6] }, outcome: { es: "La conversación se alargó. No resolviste sus problemas, pero Luna dejó de sentirse sola.", en: "The conversation ran long. You didn't solve her problems, but Luna stopped feeling alone." } }, { label: { es: "Escucharla por llamada", en: "Listen over the phone" }, hint: { es: "Una opción equilibrada y sin costo.", en: "A balanced option with no cost." }, effect: { social: 3, happiness: 1 }, relation: { luna: [5, 4] }, outcome: { es: "No fue un plan perfecto, pero estuviste presente sin abandonar tus responsabilidades.", en: "It wasn't a perfect plan, but you were there without dropping your responsibilities." } }, { label: { es: "Decir que hoy no puedes", en: "Say you can't today" }, hint: { es: "Ganas concentración, pierdes cercanía.", en: "You gain focus, lose closeness." }, effect: { skill: 2, stress: -1, social: -3 }, relation: { luna: [-5, -2] }, outcome: { es: "Terminaste tus pendientes. Luna dijo entenderlo, aunque la conversación quedó fría.", en: "You finished your tasks. Luna said she understood, though the conversation turned cold." } } ] }, { id: "unexpected_bill", category: { es: "DINERO", en: "MONEY" }, icon: "!", title: { es: "Una factura que no esperabas", en: "A bill you didn't expect" }, text: { es: "Aparece un cobro de $310 justo antes de cerrar el mes. Puedes pagarlo, negociarlo o ignorarlo.", en: "A $310 charge appears right before the month closes. You can pay it, negotiate it or ignore it." }, context: [{ es: "Riesgo de deuda", en: "Debt risk" }, { es: "Reputación financiera", en: "Financial reputation" }], options: [ { label: { es: "Pagarlo completo", en: "Pay it in full" }, hint: { es: "Cuesta $310 y te da tranquilidad.", en: "Costs $310 and gives you peace of mind." }, require: { cash: 310 }, effect: { cash: -310, stress: -4, reputation: 3 }, outcome: { es: "Dolió ver salir el dinero, pero el problema terminó aquí.", en: "It hurt to see the money go, but the problem ended here." } }, { label: { es: "Negociar dos pagos", en: "Negotiate two payments" }, hint: { es: "Pagas $155 ahora y sumas un pequeño saldo.", en: "You pay $155 now and add a small balance." }, require: { cash: 155 }, effect: { cash: -155, debt: 170, skill: 2, stress: 1 }, outcome: { es: "La llamada fue incómoda, pero lograste un acuerdo razonable.", en: "The call was awkward, but you reached a reasonable agreement." } }, { label: { es: "Dejarlo para después", en: "Leave it for later" }, hint: { es: "Conservas efectivo, pero la deuda crece.", en: "You keep cash, but debt grows." }, effect: { debt: 365, stress: 6, reputation: -4 }, outcome: { es: "El dinero sigue en tu cuenta, pero también la preocupación y un recargo.", en: "The money stays in your account, but so do the worry and a late fee." } } ] }, { id: "quiet_month", category: { es: "REFLEXIÓN", en: "REFLECTION" }, icon: "☾", title: { es: "Un mes sin crisis", en: "A month without crisis" }, text: { es: "Por una vez nada urgente exige tu atención. ¿En qué quieres convertir este espacio?", en: "For once nothing urgent demands your attention. What do you want to make of this space?" }, context: [{ es: "Prioridad personal", en: "Personal priority" }, { es: "Sin opción perfecta", en: "No perfect option" }], repeatable: true, options: [ { label: { es: "Cuidar tus relaciones", en: "Care for your relationships" }, hint: { es: "Mejora todos los vínculos y la vida social.", en: "Improves all bonds and your social life." }, effect: { social: 6, happiness: 4 }, relationAll: [3, 2], outcome: { es: "Mandaste mensajes, aceptaste una invitación y recordaste que estar presente también construye futuro.", en: "You sent messages, accepted an invitation and remembered that showing up also builds the future." } }, { label: { es: "Acelerar tus metas", en: "Push your goals" }, hint: { es: "Más habilidad y dinero; también presión.", en: "More skill and money; also pressure." }, effect: { cash: 140, skill: 4, stress: 5 }, outcome: { es: "Aprovechaste cada hora. El progreso fue visible, igual que el cansancio.", en: "You used every hour. Progress was visible, and so was the fatigue." } }, { label: { es: "No hacer nada productivo", en: "Do nothing productive" }, hint: { es: "Gran recuperación de bienestar.", en: "A big well-being recovery." }, effect: { health: 5, happiness: 6, stress: -9 }, outcome: { es: "El descanso no produjo un número, pero sí una versión más entera de ti.", en: "Rest didn't produce a number, but it produced a more complete version of you." } } ] } ];
    const monthNames = { es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] };

    function nombreMes(indice) {
        const lista = monthNames[langActual()] || monthNames.es;
        return lista[indice] ?? lista[0];
    }

    // --- SISTEMA DEL TUTORIAL (bilingüe) ---
    const tutorialSteps = [
      { selector: null, title: { es: "¡Bienvenido a tu nueva vida!", en: "Welcome to your new life!" }, text: { es: "Aquí tus decisiones moldean tu futuro. El dinero importa, pero tu salud, felicidad y amistades también. Repasemos lo básico para que empieces con buen pie.", en: "Here your decisions shape your future. Money matters, but so do your health, happiness and friendships. Let's go over the basics so you start on the right foot." } },
      { selector: ".dashboard", title: { es: "1. Tus Finanzas", en: "1. Your Finances" }, text: { es: "Aquí verás tu dinero disponible, ingresos, gastos y patrimonio. Cuida que tus gastos no superen tus ingresos, o entrarás en deuda.", en: "Here you'll see your available money, income, expenses and net worth. Make sure expenses don't exceed income, or you'll go into debt." } },
      { selector: "#decisionCard", title: { es: "2. La Decisión del Mes", en: "2. The Decision of the Month" }, text: { es: "Cada mes tendrás un dilema urgente en esta tarjeta. Debes elegir una opción antes de poder avanzar al siguiente mes. Tus elecciones abren o cierran puertas.", en: "Each month you'll face an urgent dilemma in this card. You must choose an option before moving on. Your choices open and close doors." } },
      { selector: ".action-panel", title: { es: "3. Acciones de Vida", en: "3. Life Actions" }, text: { es: "Tienes 3 puntos de energía (⚡) al mes. Úsalos para hacer trabajo extra, estudiar, descansar o hacer comunidad. Si no los gastas, se pierden.", en: "You have 3 energy points (⚡) per month. Use them for side gigs, studying, resting or community. Unused points are lost." } },
      { selector: ".month-footer", title: { es: "4. Cerrar el Mes", en: "4. Close the Month" }, text: { es: "Cuando hayas tomado tu decisión y gastado tus energías, haz clic aquí para avanzar el tiempo y descubrir las consecuencias de tus actos.", en: "Once you've made your decision and spent your energy, click here to move time forward and discover the consequences." } }
    ];

    function startTutorial() { tutorialStep = 0; showTutorialStep(); }

    function showTutorialStep() {
      const step = tutorialSteps[tutorialStep];
      const tooltip = $("tutorialTooltip");
      $("tutorialTitle").textContent = T(step.title);
      $("tutorialText").textContent = T(step.text);
      tooltip.classList.add("active");
      document.querySelectorAll('.tutorial-highlighted').forEach(el => el.classList.remove('tutorial-highlighted'));

      if (step.selector) {
        const target = document.querySelector(step.selector);
        if (target) {
          target.classList.add('tutorial-highlighted');
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            const rect = target.getBoundingClientRect();
            let top = rect.bottom + 15;
            if (top + 250 > window.innerHeight) top = rect.top - 250;
            tooltip.style.top = `${Math.max(20, top)}px`;
            tooltip.style.left = `50%`;
            tooltip.style.transform = `translateX(-50%)`;
          }, 300);
        }
      } else {
        tooltip.style.top = `50%`;
        tooltip.style.left = `50%`;
        tooltip.style.transform = `translate(-50%, -50%)`;
      }
    }

    function nextTutorialStep() {
      tutorialStep++;
      if (tutorialStep < tutorialSteps.length) {
        showTutorialStep();
      } else {
        $("tutorialTooltip").classList.remove("active");
        document.querySelectorAll('.tutorial-highlighted').forEach(el => el.classList.remove('tutorial-highlighted'));
        toast(T(UI.toastTutorial));
      }
    }

    // --- FUNCIONES BÁSICAS DEL JUEGO ---
    function showScreen(name) {
      Object.entries(screens).forEach(([key, el]) => el.classList.toggle("active", key === name));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function switchTab(tabId) {
      document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === tabId));
      document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === tabId));
    }
    function createNewLife() {
      const name = $("playerName").value.trim() || "Alex";
      const age = clamp($("playerAge").value, 18, 55);
      const educationKey = $("educationSelect").value;
      const lifestyleKey = $("lifestyleSelect").value;
      const originKey = $("originSelect").value;
      const aspirationKey = $("aspirationSelect").value;
      const education = educationProfiles[educationKey];
      const lifestyle = lifestyleProfiles[lifestyleKey];
      const origin = originProfiles[originKey];

      state = {
        version: 2, name, age, startingAge: age, month: 1, year: 1, educationKey, lifestyleKey, originKey, aspirationKey,
        cash: Math.max(120, education.cash + lifestyle.cash + origin.cash), savings: 0,
        debt: education.debt + origin.debt, rent: origin.rent, sideIncome: origin.sideIncome,
        job: null, energy: 3, expenseMod: lifestyle.expenseMod,
        stats: { health: 76, happiness: clamp(61 + lifestyle.happiness + origin.happiness, 0, 100), stress: clamp(25 + lifestyle.stress + origin.stress, 0, 100), education: education.education, skill: education.skill, reputation: education.reputation + lifestyle.reputation, social: clamp(48 + origin.social, 0, 100) },
        inventory: [], assets: [], investments: [], goalsDone: [], achievements: [],
        history: [], decisionHistory: [], usedDecisions: [], pendingDecision: null,
        monthActions: [], relationships: createRelationships(originKey), storyFlags: {},
        autoSaveRate: lifestyleKey === "ahorrador" ? 20 : lifestyleKey === "gastador" ? 5 : 10,
        extraDebtPayment: education.debt + origin.debt > 0 ? 50 : 0,
        freePlay: false, endingSeen: false, lastMonthDelta: 0
      };
      if (state.debt >= 1000) state.storyFlags.hadBigDebt = true;
      addHistory(UI.hInicio, {
        es: `${name} comenzó una nueva historia: ${education.label.es}, ${origin.label.es.toLowerCase()} y el sueño de ${aspirations[aspirationKey].label.es.toLowerCase()}.`,
        en: `${name} started a new story: ${education.label.en}, ${origin.label.en.toLowerCase()}, dreaming of ${aspirations[aspirationKey].label.en.toLowerCase()}.`
      });
      jobOffers = generateJobOffers();
      queueDecision();
      showScreen("game");
      switchTab("life");
      renderAll();
      saveGame();
      setTimeout(() => startTutorial(), 500);
    }

    function createRelationships(originKey) {
      return {
        luna: { unlocked: true, closeness: originKey === "nuevo" ? 32 : 25, trust: 22, lastInteraction: 0 },
        diego: { unlocked: true, closeness: originKey === "familia" ? 42 : 30, trust: originKey === "familia" ? 40 : 32, lastInteraction: 0 },
        mateo: { unlocked: false, closeness: 12, trust: 10, lastInteraction: 0 },
        sofia: { unlocked: false, closeness: 10, trust: 14, lastInteraction: 0 },
        vale: { unlocked: false, closeness: 12, trust: 10, lastInteraction: 0 },
        camila: { unlocked: false, closeness: 10, trust: 8, lastInteraction: 0 }
      };
    }

    function queueDecision() {
      const candidates = decisions.filter(item => !item.condition || item.condition());
      const fallback = decisions.find(item => item.id === "quiet_month");
      const pool = candidates.length ? candidates : [fallback];
      const selected = pool[Math.floor(Math.random() * pool.length)];
      state.pendingDecision = { id: selected.id, resolved: false, choice: null, outcome: "" };
    }

    function chooseDecision(index) {
      if (!state || state.pendingDecision.resolved) return;
      const decision = decisions.find(item => item.id === state.pendingDecision?.id) || decisions[0];
      const option = decision.options[index];
      if (!option) return;
      applyEffect(option.effect || {});
      applyRelationshipChanges(option.relation || {});
      if (option.relationAll) unlockedPeople().forEach(id => changeRelationship(id, option.relationAll[0], option.relationAll[1]));
      state.pendingDecision.resolved = true;
      state.pendingDecision.choice = index;
      if (!decision.repeatable && !state.usedDecisions.includes(decision.id)) state.usedDecisions.push(decision.id);
      state.decisionHistory.unshift({ month: state.month, decisionId: decision.id, optionIndex: index });
      addHistory(UI.hDecision, { es: `${decision.title.es}: ${option.label.es}.`, en: `${decision.title.en}: ${option.label.en}.` });
      renderAll(); saveGame();
    }

    function applyEffect(effect) {
      ["cash", "savings", "debt", "rent", "sideIncome", "energy"].forEach(key => { if (effect[key] !== undefined) state[key] += effect[key]; });
      if (effect.addInventory && !owns(effect.addInventory)) state.inventory.push(effect.addInventory);
      if (effect.addAsset) state.assets.push({ ...effect.addAsset });
      adjustStats(effect);
      state.debt = Math.max(0, state.debt);
      state.rent = Math.max(0, state.rent);
    }

    function applyRelationshipChanges(changes) { Object.entries(changes).forEach(([id, values]) => changeRelationship(id, values[0], values[1])); }
    function changeRelationship(id, closeness, trust) {
      const relation = state.relationships[id]; if (!relation) return;
      relation.closeness = clamp(relation.closeness + closeness, 0, 100);
      relation.trust = clamp(relation.trust + trust, 0, 100);
      relation.lastInteraction = state.month;
    }

    function useLifeAction(actionId) {
      const action = lifeActions.find(item => item.id === actionId); if (!action) return;
      const key = `action-${actionId}`;
      if (state.monthActions.includes(key)) { toast(T(UI.toastRepetida), "warn"); return; }
      if (state.energy < action.cost) { toast(T(UI.toastSinEnergia), "warn"); return; }
      const beforeCash = state.cash;
      const result = action.run();
      if (result === false) { state.cash = beforeCash; toast(T(UI.toastAccionInvalida), "warn"); return; }
      state.energy -= action.cost; state.monthActions.push(key);
      addHistory(UI.hAccion, { es: `${action.title.es}: ${result.es}`, en: `${action.title.en}: ${result.en}` });
      renderAll(); saveGame(); toast(T(result));
    }

    function generateJobOffers() {
      if (!state) return [];
      const eligible = jobs.filter(job => state.stats.education >= job.minEducation && state.stats.skill >= job.minSkill && state.stats.reputation >= (job.minReputation || 0));
      return [...eligible].sort(() => Math.random() - .5).slice(0, 3).map(job => ({ ...job }));
    }

    function searchJobs() {
      if (state.energy < 1) { toast(T(UI.toastBuscarSinEnergia), "warn"); return; }
      state.energy -= 1; jobOffers = generateJobOffers();
      adjustStats({ stress: 1, reputation: 1 }); renderAll(); saveGame(); toast(T(UI.toastOfertas));
    }

    function acceptJob(index) {
      const offer = jobOffers[index]; if (!offer) return;
      state.job = { ...offer }; adjustStats({ happiness: 5, reputation: 4, stress: -2 });
      addHistory(UI.hTrabajo, { es: `Empezaste como ${offer.title.es} por ${money(offer.salary)} al mes.`, en: `You started as ${offer.title.en} earning ${money(offer.salary)} per month.` });
      renderAll(); saveGame(); toast(T(UI.toastNuevoTrabajo)(T(offer.title)));
    }

    function buyItem(itemId) {
      const item = marketItems.find(entry => entry.id === itemId);
      if (!item || (!item.repeat && owns(item.id))) return;
      if (!pay(item.price)) { toast(T(UI.toastFaltaDinero)(money(item.price)), "warn"); return; }
      if (!owns(item.id)) state.inventory.push(item.id);
      if (item.assetValue) state.assets.push({ id: item.id, title: item.title, value: item.assetValue });
      if (item.financeDebt) { state.debt += item.financeDebt; state.storyFlags.hadBigDebt = true; }
      if (item.id === "house") state.rent = 0;
      applyEffect(item.effect || {});
      addHistory(UI.hCompra, { es: `${item.title.es}: -${money(item.price)}.`, en: `${item.title.en}: -${money(item.price)}.` });
      renderAll(); saveGame(); toast(T(UI.toastCompra)(T(item.title)));
    }

    function invest(typeId, amount) {
      const type = investmentTypes.find(item => item.id === typeId);
      if (!type || amount < type.min || !pay(amount)) { toast(T(UI.toastSinMonto), "warn"); return; }
      addInvestment({ type: typeId, invested: amount, value: amount });
      adjustStats({ stress: type.id === "crypto" ? 3 : 1, education: 1 });
      renderAll(); saveGame(); toast(T(UI.toastInversion)(money(amount), T(type.title)));
    }

    function addInvestment(investment) {
      const existing = state.investments.find(item => item.type === investment.type);
      if (existing) { existing.invested += investment.invested; existing.value += investment.value; }
      else state.investments.push({ ...investment });
    }

    function sellInvestment(typeId, portion) {
      const investment = state.investments.find(item => item.type === typeId); if (!investment) return;
      const amount = Math.max(1, Math.round(investment.value * portion));
      investment.value -= amount; state.cash += amount;
      if (investment.value < 5) state.investments = state.investments.filter(item => item !== investment);
      renderAll(); saveGame(); toast(T(UI.toastVenta)(money(amount)));
    }

    function advanceMonth() {
      if (!state.pendingDecision.resolved) { toast(T(UI.toastDecisionPendiente), "warn"); return; }
      const openingCash = state.cash;
      const income = calculateIncome(); const expenses = calculateExpenses();
      state.cash += income.total; state.cash -= expenses.total;
      state.debt = Math.max(0, state.debt - expenses.debtMinimum);
      state.debt += Math.round(state.debt * .0075);
      const extraDebt = Math.min(state.debt, state.extraDebtPayment, Math.max(0, state.cash));
      state.cash -= extraDebt; state.debt -= extraDebt;
      const autoSave = Math.min(Math.max(0, state.cash), Math.round(income.total * state.autoSaveRate / 100));
      state.cash -= autoSave; state.savings += autoSave;
      if (state.cash < 0) { state.debt += Math.round(Math.abs(state.cash) * 1.08); state.cash = 0; adjustStats({ stress: 7 }); addHistory(UI.hAlerta, UI.histDeficit); }

      state.lastMonthDelta = state.cash - openingCash;
      state.month += 1; state.year = Math.floor((state.month - 1) / 12) + 1;
      state.age = state.startingAge + Math.floor((state.month - 1) / 12);
      state.energy = 3; state.monthActions = [];
      queueDecision();
      renderAll(); saveGame();
      showMonthSummary(state.month - 1, { income: income.total, expenses: expenses.total, saved: autoSave, cashDelta: state.lastMonthDelta });
    }

    function calculateIncome() { return { total: (state.job ? state.job.salary : 0) + state.sideIncome + calculatePassiveIncome() }; }
    function calculateExpenses() {
      const lifestyle = lifestyleProfiles[state.lifestyleKey] || lifestyleProfiles.equilibrado;
      const food = 255; const transport = owns("bike") ? 48 : 125;
      const essentials = Math.round((food + transport + 145) * (state.expenseMod || lifestyle.expenseMod));
      const upkeep = marketItems.filter(item => owns(item.id)).reduce((sum, item) => sum + (item.upkeep || 0), 0);
      const debtMinimum = state.debt > 0 ? Math.min(480, Math.max(25, Math.round(state.debt * .014))) : 0;
      const total = Math.max(0, Math.round(state.rent + essentials + upkeep + debtMinimum));
      return { rent: state.rent, essentials, upkeep, debtMinimum, total };
    }
    function calculatePassiveIncome() { return Math.round(state.investments.reduce((sum, inv) => sum + inv.value * .005, 0)); }
    function calculateNetWorth() { return Math.round(state.cash + state.savings + portfolioValue() + state.assets.reduce((s, a) => s + a.value, 0) - state.debt); }
    function portfolioValue() { return state ? Math.round(state.investments.reduce((sum, item) => sum + item.value, 0)) : 0; }

    function showMonthSummary(closedMonth, summary) {
      const dialog = $("monthDialog");
      $("monthDialogTitle").textContent = T(UI.cerasteCapitulo)(closedMonth);
      $("monthDialogSummary").innerHTML = `
        <div class="summary-stat"><small>${T(UI.resumenIngresos)}</small><strong>${money(summary.income)}</strong></div>
        <div class="summary-stat"><small>${T(UI.resumenGastos)}</small><strong>-${money(summary.expenses)}</strong></div>
        <div class="summary-stat"><small>${T(UI.resumenAhorro)}</small><strong>${money(summary.saved)}</strong></div>`;
      if (typeof dialog.showModal === "function") dialog.showModal();
    }

    // --- RENDERIZADO UI ---
    function renderAll() {
      if (!state) return;
      $("lifeSubtitle").textContent = T(UI.capituloMes)(state.month, nombreMes((state.month - 1) % 12));
      $("playerTitle").textContent = T(UI.vidaDe)(state.name);
      $("timeBadge").textContent = T(UI.anioEdad)(state.year, state.age);
      $("playerNameLabel").textContent = state.name;
      $("avatarInitial").textContent = state.name.charAt(0).toUpperCase();
      $("jobBadge").textContent = state.job ? T(state.job.title) : T(UI.buscoCamino);
      $("aspirationBadge").textContent = T(aspirations[state.aspirationKey].label);
      $("socialPulse").textContent = T(UI.personasCerca)(unlockedPeople().length);

      const income = calculateIncome(); const expenses = calculateExpenses();
      $("cashValue").textContent = money(state.cash);
      $("incomeValue").textContent = money(income.total);
      $("expensesValue").textContent = money(expenses.total);
      $("debtValue").textContent = money(state.debt);
      $("netWorthValue").textContent = money(calculateNetWorth());
      $("energyValue").textContent = T(UI.deAcciones)(state.energy);
      $("actionPoints").textContent = T(UI.disponibles)(state.energy);

      const decision = decisions.find(item => item.id === state.pendingDecision?.id) || decisions[0];
      $("decisionCategory").textContent = T(decision.category);
      $("decisionChapter").textContent = T(UI.capituloUpper)(state.month);
      $("decisionIcon").textContent = decision.icon;
      $("decisionTitle").textContent = T(decision.title);
      $("decisionText").textContent = T(decision.text);
      $("decisionContext").innerHTML = decision.context.map(c => `<span class="context-tag">${esc(T(c))}</span>`).join("");
      $("decisionChoices").hidden = state.pendingDecision.resolved;
      $("decisionChoices").innerHTML = decision.options.map((option, index) => `<button class="choice-btn" data-choice="${index}"><span class="choice-number">0${index + 1}</span><strong>${esc(T(option.label))}</strong><small>${esc(T(option.hint))}</small></button>`).join("");
      const outcomeBox = $("decisionOutcome");
      if (state.pendingDecision.resolved) {
        const opcion = decision.options[state.pendingDecision.choice];
        outcomeBox.hidden = false;
        outcomeBox.innerHTML = `<strong>${T(UI.consecuencia)}</strong><p>${esc(T(opcion.outcome))}</p>`;
      } else {
        outcomeBox.hidden = true;
      }

      $("actionList").innerHTML = lifeActions.map(action => {
        const used = state.monthActions.includes(`action-${action.id}`);
        return `<div class="action-item"><span class="action-symbol">${action.icon}</span><div><strong>${T(action.title)}</strong><small>${T(action.desc)}</small></div><button data-action="${action.id}" ${used || state.energy < action.cost ? "disabled" : ""}>${used ? T(UI.hecho) : `${action.cost} ⚡`}</button></div>`;
      }).join("");

      $("jobOffers").innerHTML = jobOffers.map((job, index) => `<article class="game-card"><div><p class="eyebrow">${T(job.tier)}</p><h4>${T(job.title)}</h4><p>${T(job.hours)} · ${T(job.benefits)}</p><div class="tag-row"><span class="tag">${money(job.salary)}${T(UI.porMes)}</span><span class="tag">${T(UI.estresTag)(job.stress)}</span></div></div><div class="card-actions"><button data-job="${index}">${T(UI.aceptar)}</button></div></article>`).join("") || `<div class="panel"><p>${T(UI.sinOfertas)}</p></div>`;

      $("marketItems").innerHTML = marketItems.map(item => `<article class="game-card"><div><p class="eyebrow">${item.icon} ${item.upkeep ? `+ ${money(item.upkeep)}${T(UI.porMes)}` : T(UI.compraUnica)}</p><h4>${T(item.title)}</h4><p>${T(item.desc)}</p></div><div class="card-actions"><button data-buy="${item.id}" ${state.cash < item.price ? "disabled" : ""}>${T(UI.comprar)(money(item.price))}</button></div></article>`).join("");

      $("investmentItems").innerHTML = investmentTypes.map(type => `<article class="game-card"><div><p class="eyebrow">${type.icon} ${T(UI.riesgoPalabra)} ${T(type.risk)}</p><h4>${T(type.title)}</h4></div><div class="card-actions"><button data-invest="${type.id}" data-amount="${type.min}">${money(type.min)}</button></div></article>`).join("");
    }

    // --- UTILIDADES Y HELPERS ---
    function adjustStats(changes) { Object.entries(changes).forEach(([key, value]) => { if (state.stats[key] !== undefined) state.stats[key] = clamp(state.stats[key] + value, 0, 100); }); }
    function pay(amount) { if (amount <= 0) return true; if (state.cash < amount) return false; state.cash -= amount; return true; }
    function owns(itemId) { return !!state && state.inventory.includes(itemId); }
    function hasPerk(id, threshold) { const r = state?.relationships?.[id]; return !!r?.unlocked && r.closeness >= threshold; }
    function unlockedPeople() { return state ? Object.keys(people).filter(id => state.relationships[id]?.unlocked) : []; }
    function addHistory(type, text) { if (!state) return; state.history.unshift({ month: state.month, type, text }); state.history = state.history.slice(0, 100); }
    function saveGame() { if (!state) return; localStorage.setItem(SAVE_KEY, JSON.stringify({ state, jobOffers })); }
    function loadGame() {
      const raw = localStorage.getItem(SAVE_KEY); if (!raw) return;
      try { const payload = JSON.parse(raw); state = payload.state; jobOffers = payload.jobOffers || []; showScreen("game"); renderAll(); }
      catch (e) { console.error(e); toast(T(UI.toastErrorCargar), "bad"); }
    }
    function resetGame() { if (state && !confirm(T(UI.confirmNuevaVida))) return; localStorage.removeItem(SAVE_KEY); state = null; jobOffers = []; showScreen("start"); }
    function updateContinueButton() { $("continueBtn").disabled = !localStorage.getItem(SAVE_KEY); }
    function toast(message, tone = "") { const el = document.createElement("div"); el.className = `toast ${tone}`; el.textContent = message; $("toastRegion").appendChild(el); setTimeout(() => el.remove(), 3800); }
    function money(value) { const n = Math.round(Number(value) || 0); return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`; }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, Number(v) || 0)); }
    function random(min, max) { return min + Math.random() * (max - min); }
    function esc(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }

    // --- INICIALIZACIÓN Y EVENTOS ---
    $("startBtn").addEventListener("click", () => showScreen("creator"));
    $("continueBtn").addEventListener("click", loadGame);
    $("backToStartBtn").addEventListener("click", () => showScreen("start"));
    $("creatorForm").addEventListener("submit", e => { e.preventDefault(); createNewLife(); });
    $("saveBtn").addEventListener("click", () => { saveGame(); toast(T(UI.toastGuardado)); });
    $("resetBtn").addEventListener("click", resetGame);
    $("advanceMonthBtn").addEventListener("click", advanceMonth);
    $("newJobOffersBtn").addEventListener("click", searchJobs);
    $("closeMonthDialog").addEventListener("click", () => $("monthDialog").close());
    $("tutorialNextBtn").addEventListener("click", nextTutorialStep);

    document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
    $("savingRate").addEventListener("input", e => { if (!state) return; state.autoSaveRate = Number(e.target.value); renderAll(); });
    $("debtPayment").addEventListener("input", e => { if (!state) return; state.extraDebtPayment = Number(e.target.value); renderAll(); });

    document.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button || button.disabled || !state) return;
      if (button.dataset.choice !== undefined) chooseDecision(Number(button.dataset.choice));
      else if (button.dataset.action) useLifeAction(button.dataset.action);
      else if (button.dataset.job !== undefined) acceptJob(Number(button.dataset.job));
      else if (button.dataset.buy) buyItem(button.dataset.buy);
      else if (button.dataset.invest) invest(button.dataset.invest, Number(button.dataset.amount));
      else if (button.dataset.sell) sellInvestment(button.dataset.sell, Number(button.dataset.portion));
    });

    // --- IDIOMA: aplicar al cargar y reaccionar a cambios ---
    aplicarTraduccionEstatica();
    window.addEventListener("storage", evento => { if (evento.key === "lang") reaplicarIdioma(); });
    document.addEventListener("langchange", reaplicarIdioma);

    updateContinueButton();
