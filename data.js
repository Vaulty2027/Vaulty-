export const SAVE_KEY = "vidaDeAhorrosSaveV3";
export const CAMPAIGN_MONTHS = 36;

export const difficulties = {
  facil: { label: "Fácil", cashMod: 1.5, inflation: 0.005, layoffMod: 0.5, offerMod: 1.5 },
  normal: { label: "Normal", cashMod: 1.0, inflation: 0.015, layoffMod: 1.0, offerMod: 1.0 },
  dificil: { label: "Difícil", cashMod: 0.7, inflation: 0.03, layoffMod: 1.5, offerMod: 0.7 },
  realista: { label: "Realista", cashMod: 0.5, inflation: 0.05, layoffMod: 2.5, offerMod: 0.4 }
};

export const educationProfiles = {
  secundaria: { label: "Secundaria", cash: 1450, debt: 0, education: 28, skill: 26, reputation: 28 },
  tecnico: { label: "Técnico", cash: 1180, debt: 350, education: 43, skill: 42, reputation: 34 },
  universidad: { label: "Universidad", cash: 850, debt: 1800, education: 60, skill: 49, reputation: 42 },
  posgrado: { label: "Posgrado", cash: 650, debt: 3300, education: 76, skill: 60, reputation: 50 }
};

export const lifestyleProfiles = {
  ahorrador: { label: "Planificador", cash: 520, expenseMod: .84, happiness: -3, stress: 3, reputation: 0 },
  equilibrado: { label: "Equilibrado", cash: 270, expenseMod: 1, happiness: 3, stress: 0, reputation: 1 },
  gastador: { label: "Espontáneo", cash: 80, expenseMod: 1.22, happiness: 10, stress: -2, reputation: 3 }
};

export const originProfiles = {
  familia: { label: "Vivo con mi familia", cash: 620, debt: 0, rent: 280, happiness: 4, stress: -3, social: 8, sideIncome: 0 },
  independiente: { label: "Me independicé", cash: 120, debt: 250, rent: 650, happiness: 3, stress: 4, social: 0, sideIncome: 0 },
  nuevo: { label: "Nueva ciudad", cash: 330, debt: 0, rent: 570, happiness: -2, stress: 5, social: -7, sideIncome: 0 },
  emprendedor: { label: "Pequeña idea", cash: -120, debt: 650, rent: 520, happiness: 5, stress: 6, social: 1, sideIncome: 105 }
};

export const aspirations = {
  libertad: { label: "Libertad financiera", icon: "↗" },
  hogar: { label: "Un hogar propio", icon: "⌂" },
  carrera: { label: "Una carrera extraordinaria", icon: "★" },
  comunidad: { label: "Una vida llena de vínculos", icon: "☺" }
};

export const jobs = [
  { id: "cashier", title: "Cajero de minimercado", tier: "Inicial", salary: 850, hours: "8 h", stress: 25, benefits: "10% menos en comida", layoffRisk: .07, growth: .08, minEducation: 0, minSkill: 0 },
  { id: "delivery", title: "Repartidor urbano", tier: "Inicial", salary: 980, hours: "Flexible", stress: 34, benefits: "Propinas variables", layoffRisk: .09, growth: .06, minEducation: 0, minSkill: 8 },
  { id: "assistant", title: "Asistente administrativo", tier: "Inicial", salary: 1220, hours: "9 a 5", stress: 26, benefits: "Seguro parcial", layoffRisk: .06, growth: .11, minEducation: 25, minSkill: 18 },
  { id: "community", title: "Coordinador comunitario", tier: "Medio", salary: 1450, hours: "Flexible", stress: 30, benefits: "+2 social al mes", layoffRisk: .05, growth: .13, minEducation: 30, minSkill: 28, minReputation: 35 },
  { id: "sales", title: "Asesor comercial", tier: "Medio", salary: 1650, hours: "9 h", stress: 43, benefits: "Comisiones", layoffRisk: .1, growth: .14, minEducation: 34, minSkill: 30 },
  { id: "technician", title: "Técnico de soporte", tier: "Medio", salary: 1950, hours: "Turnos", stress: 38, benefits: "Cursos internos", layoffRisk: .07, growth: .17, minEducation: 43, minSkill: 42 },
  { id: "designer", title: "Diseñador junior", tier: "Medio", salary: 2250, hours: "Híbrido", stress: 35, benefits: "Equipo laboral", layoffRisk: .08, growth: .18, minEducation: 48, minSkill: 50 },
  { id: "analyst", title: "Analista financiero", tier: "Avanzado", salary: 3250, hours: "Oficina", stress: 50, benefits: "Bono trimestral", layoffRisk: .07, growth: .2, minEducation: 61, minSkill: 58 },
  { id: "developer", title: "Desarrollador web", tier: "Avanzado", salary: 4200, hours: "Remoto", stress: 47, benefits: "Horario flexible", layoffRisk: .06, growth: .22, minEducation: 58, minSkill: 66 },
  { id: "manager", title: "Gerente de operaciones", tier: "Liderazgo", salary: 5700, hours: "Alta demanda", stress: 67, benefits: "Seguro completo", layoffRisk: .08, growth: .18, minEducation: 72, minSkill: 70, minReputation: 55 },
  { id: "director", title: "Director de estrategia", tier: "Élite", salary: 7800, hours: "Variable", stress: 75, benefits: "Bono y acciones", layoffRisk: .07, growth: .14, minEducation: 84, minSkill: 82, minReputation: 70 }
];

export const marketItems = [
  { id: "phone", icon: "▣", title: "Celular confiable", price: 390, desc: "Mantente conectado y mejora el acceso a oportunidades.", repeat: false, effect: { reputation: 4, social: 2, happiness: 2 } },
  { id: "laptop", icon: "⌘", title: "Laptop de trabajo", price: 920, desc: "Estudiar y hacer trabajos extra será más efectivo.", repeat: false, effect: { skill: 5, education: 3 } },
  { id: "bike", icon: "○", title: "Bicicleta", price: 340, desc: "Reduce transporte y mejora tu salud cada mes.", repeat: false, effect: { health: 5 } },
  { id: "insurance", icon: "+", title: "Seguro médico", price: 610, desc: "Protege tu fondo ante emergencias de salud.", repeat: false, upkeep: 38, effect: { health: 5, stress: -4 } },
  { id: "course", icon: "◆", title: "Curso certificado", price: 680, desc: "Sube formación y habilidad para mejores trabajos.", repeat: true, effect: { education: 9, skill: 7, stress: 3 } },
  { id: "clothes", icon: "◇", title: "Ropa profesional", price: 290, desc: "Mejora entrevistas y primeras impresiones.", repeat: true, effect: { reputation: 5, happiness: 2 } },
  { id: "furniture", icon: "⌂", title: "Espacio cómodo", price: 760, desc: "Descansar en casa recupera más bienestar.", repeat: false, effect: { happiness: 8, stress: -5 } },
  { id: "tools", icon: "⚒", title: "Herramientas para emprender", price: 1180, desc: "Crea una pequeña fuente de ingresos extra.", repeat: false, effect: { skill: 5, sideIncome: 110 } },
  { id: "car", icon: "▰", title: "Carro usado", price: 4300, desc: "Abre opciones laborales, pero cuesta mantenerlo.", repeat: false, upkeep: 145, effect: { reputation: 6, stress: -2 } },
  { id: "pet", icon: "♥", title: "Adoptar una mascota", price: 260, desc: "Compañía y felicidad a cambio de un gasto mensual.", repeat: false, upkeep: 55, effect: { happiness: 10, stress: -5, social: 3 } },
  { id: "house", icon: "⌂", title: "Entrada para una casa", price: 7200, desc: "Patrimonio real, hipoteca y un lugar propio.", repeat: false, upkeep: 185, financeDebt: 39000, assetValue: 48000, effect: { happiness: 13, stress: -7, reputation: 7 } }
];

export const investmentTypes = [
  { id: "savings", icon: "▤", title: "Depósito a plazo", risk: "Bajo", min: 100, range: [.001, .007], desc: "Crecimiento lento y estable." },
  { id: "bonds", icon: "▥", title: "Bonos diversificados", risk: "Bajo medio", min: 200, range: [-.008, .022], desc: "Menos emoción, más estabilidad." },
  { id: "stocks", icon: "↗", title: "Fondo de acciones", risk: "Medio", min: 250, range: [-.05, .085], desc: "Variación amplia con potencial a largo plazo." },
  { id: "business", icon: "◆", title: "Negocio pequeño", risk: "Medio alto", min: 500, range: [-.09, .13], desc: "Puede crear flujo y contactos." },
  { id: "crypto", icon: "◇", title: "Activo digital ficticio", risk: "Alto", min: 150, range: [-.24, .28], desc: "Muy volátil; nunca inviertas lo esencial." },
  { id: "realestate", icon: "⌂", title: "Fondo inmobiliario", risk: "Medio", min: 1400, range: [-.025, .06], desc: "Requiere capital y estabiliza patrimonio." }
];

// Motor de IA: NPCs con metas y economía propia
export const people = {
  luna: { name: "Luna", initials: "LU", role: "Vecina y amiga creativa", color: "#ffd276", unlock: (s) => true, unlockText: "Está cerca desde el primer capítulo.", perk: "Con 55 de cercanía: el apoyo mutuo reduce $45 de gastos y mejora el ánimo.", note: "Siempre tiene una idea nueva, aunque a veces necesita que alguien la aterrice.", baseIncome: 1200, baseExpenses: 800 },
  diego: { name: "Diego", initials: "DI", role: "Primo y confidente", color: "#74e5a4", unlock: (s) => true, unlockText: "Tu familia sigue a una llamada de distancia.", perk: "Con 60 de confianza: te ayuda una vez ante una emergencia grave.", note: "No siempre entiende tus planes, pero aparece cuando de verdad importa.", baseIncome: 900, baseExpenses: 700 },
  mateo: { name: "Mateo", initials: "MA", role: "Compañero de trabajo", color: "#78c9ff", unlock: (s) => s && (!!s.job || s.month >= 4), unlockText: "Conseguir trabajo o llegar al mes 4.", perk: "Con 55 de confianza: mejores ofertas y requisitos laborales más flexibles.", note: "Ambicioso, sociable y muy bueno conectando personas.", baseIncome: 1500, baseExpenses: 1000 },
  sofia: { name: "Sofía", initials: "SO", role: "Mentora financiera", color: "#c4a7ff", unlock: (s) => s && (s.stats.education >= 48 || s.inventory.includes("course")), unlockText: "Alcanza 48 de formación o compra un curso.", perk: "Con 55 de confianza: estudiar da +2 habilidad y las inversiones se entienden mejor.", note: "Hace preguntas incómodas que suelen llevarte a respuestas útiles.", baseIncome: 2500, baseExpenses: 1200 },
  vale: { name: "Valentina", initials: "VA", role: "Líder de la comunidad", color: "#ff9eb5", unlock: (s) => s && (s.storyFlags.community || s.stats.reputation >= 48), unlockText: "Participa en la comunidad o alcanza 48 de reputación.", perk: "Con 55 de cercanía: tu red genera $45 mensuales en oportunidades.", note: "Conoce el barrio, sus problemas y a la gente que intenta resolverlos.", baseIncome: 1000, baseExpenses: 600 },
  camila: { name: "Camila", initials: "CA", role: "Emprendedora e inversora", color: "#ffaf70", unlock: (s) => s && (s.storyFlags.startup || s.cash + s.savings >= 8000), unlockText: "Apoya un emprendimiento o llega a $8,000 de patrimonio.", perk: "Con 60 de confianza: los negocios tienen un pequeño impulso mensual.", note: "Piensa en grande, se mueve rápido y respeta a quien cumple su palabra.", baseIncome: 3000, baseExpenses: 1500 }
};

export const goalTemplates = [
  { id: "save1000", title: "Primer colchón", desc: "Ten $1,000 separados.", reward: 140, check: (s) => s.savings >= 1000, weight: (s) => s.savings < 1000 ? 3 : 0 },
  { id: "friend", title: "Amistad verdadera", desc: "Alcanza 60 de cercanía con alguien.", reward: 160, check: (s) => Object.values(s.relationships).some(r => r.closeness >= 60), weight: (s) => 2 },
  { id: "betterjob", title: "Salto profesional", desc: "Consigue un salario de $2,000 o más.", reward: 220, check: (s) => s.job && s.job.salary >= 2000, weight: (s) => s.job && s.job.salary < 2000 ? 2 : 0 },
  { id: "debtfree", title: "Respirar sin deudas", desc: "Elimina toda tu deuda después del mes 3.", reward: 280, check: (s) => s.debt <= 0 && s.month > 3, weight: (s) => s.debt > 0 && s.month > 3 ? 4 : 0 },
  { id: "emergency", title: "Tres meses de calma", desc: "Ahorra tres meses de gastos.", reward: 380, check: (s, e) => s.savings >= e.calculateExpenses().total * 3, weight: (s) => 2 },
  { id: "net10k", title: "Cinco cifras", desc: "Llega a $10,000 de patrimonio.", reward: 450, check: (s, e) => e.calculateNetWorth() >= 10000, weight: (s, e) => e.calculateNetWorth() < 10000 ? 1 : 0 },
  { id: "balanced", title: "Vida en equilibrio", desc: "Salud, felicidad y vida social sobre 60.", reward: 520, check: (s) => s.stats.health >= 60 && s.stats.happiness >= 60 && s.stats.social >= 60, weight: (s) => s.month >= 6 ? 3 : 0 },
  { id: "home", title: "Un lugar propio", desc: "Compra una casa.", reward: 700, check: (s) => s.inventory.includes("house"), weight: (s) => s.cash > 3000 ? 2 : 0 },
  // Nuevas metas dinámicas
  { id: "learn_english", title: "Aprender inglés", desc: "Alcanza 65 de formación.", reward: 300, check: (s) => s.stats.education >= 65, weight: (s) => s.stats.education < 65 && s.month > 2 ? 3 : 0 },
  { id: "reduce_stress", title: "Reducir el estrés", desc: "Baja tu estrés a 40 o menos.", reward: 250, check: (s) => s.stats.stress <= 40, weight: (s) => s.stats.stress > 60 ? 5 : 0 },
  { id: "find_partner", title: "Conseguir pareja", desc: "Alcanza 70 de cercanía con alguien.", reward: 400, check: (s) => Object.values(s.relationships).some(r => r.closeness >= 70), weight: (s) => s.age >= 22 && Object.values(s.relationships).every(r => r.closeness < 70) ? 2 : 0 },
  { id: "open_business", title: "Abrir un negocio", desc: "Invierte en la categoría 'Negocio pequeño'.", reward: 500, check: (s) => s.investments.some(i => i.type === "business"), weight: (s) => s.stats.skill >= 50 && s.cash > 500 ? 4 : 0 },
  { id: "help_family", title: "Ayudar a la familia", desc: "Presta dinero a Diego cuando te lo pida.", reward: 350, check: (s) => s.storyFlags.helpedDiego, weight: (s) => !s.storyFlags.helpedDiego && s.month > 2 ? 2 : 0 }
];

export const lifeActions = [
  { id: "freelance", icon: "$", title: "Trabajo extra", desc: "Gana dinero usando una acción.", cost: 1, run: (s, e) => { const laptop = s.inventory.includes("laptop"); const gain = Math.round(e.random(laptop ? 170 : 90, laptop ? 330 : 210)); s.cash += gain; e.adjustStats({ skill: 2, stress: 4 }); return `Ganaste ${e.money(gain)} y mejoraste tu experiencia.`; } },
  { id: "study", icon: "◆", title: "Aprender algo nuevo", desc: "Formación y habilidad, con un pequeño costo.", cost: 1, run: (s, e) => { if (!e.pay(45)) return false; const mentor = e.hasPerk("sofia", 55); const laptop = s.inventory.includes("laptop"); e.adjustStats({ education: laptop ? 5 : 3, skill: 4 + (mentor ? 2 : 0), stress: 2 }); return "Invertiste en una habilidad que abrirá opciones futuras."; } },
  { id: "exercise", icon: "+", title: "Mover el cuerpo", desc: "Recupera salud y reduce estrés.", cost: 1, run: (s, e) => { e.adjustStats({ health: s.inventory.includes("bike") ? 9 : 7, stress: -5, happiness: 2 }); return "Terminaste con más energía y la mente despejada."; } },
  { id: "rest", icon: "☾", title: "Descansar de verdad", desc: "Recupera bienestar sin sentir culpa.", cost: 1, run: (s, e) => { e.adjustStats({ happiness: s.inventory.includes("furniture") ? 8 : 5, stress: s.inventory.includes("furniture") ? -11 : -8, health: 3 }); return "Protegiste tu energía antes de llegar al límite."; } },
  { id: "budget", icon: "▤", title: "Ordenar las cuentas", desc: "Separa hasta $120 y baja el estrés.", cost: 1, run: (s, e) => { const amount = Math.min(120, Math.max(0, s.cash)); if (amount < 20) return false; s.cash -= amount; s.savings += amount; e.adjustStats({ stress: -4, reputation: 1 }); return `Separaste ${e.money(amount)} para tu futuro.`; } },
  { id: "community", icon: "☺", title: "Participar en tu comunidad", desc: "Crea vínculos y reputación.", cost: 1, run: (s, e) => { s.storyFlags.community = true; e.adjustStats({ social: 7, reputation: 4, happiness: 4 }); return "Conociste gente nueva y aportaste algo valioso."; } }
];

export const decisions = [
  { id: "weekend_friend", category: "AMISTAD", icon: "☕", title: "Luna necesita una pausa", text: "Tu vecina tuvo una semana terrible y te invita a hablar. Tú también tienes pendientes.", context: ["Tiempo vs. vínculo", "Consecuencia emocional"], options: [
    { label: "Acompañarla esta tarde", hint: "Cuesta $22, fortalece mucho la amistad.", require: { cash: 22 }, effect: { cash: -22, happiness: 4, social: 6, stress: -2 }, relation: { luna: [10, 6] }, outcome: "La conversación se alargó. No resolviste sus problemas, pero Luna dejó de sentirse sola." },
    { label: "Escucharla por llamada", hint: "Una opción equilibrada y sin costo.", effect: { social: 3, happiness: 1 }, relation: { luna: [5, 4] }, outcome: "No fue un plan perfecto, pero estuviste presente sin abandonar tus responsabilidades." },
    { label: "Decir que hoy no puedes", hint: "Ganas concentración, pierdes cercanía.", effect: { skill: 2, stress: -1, social: -3 }, relation: { luna: [-5, -2] }, outcome: "Terminaste tus pendientes. Luna dijo entenderlo, aunque la conversación quedó fría." }
  ]},
  { id: "unexpected_bill", category: "DINERO", icon: "!", title: "Una factura que no esperabas", text: "Aparece un cobro de $310 justo antes de cerrar el mes. Puedes pagarlo, negociarlo o ignorarlo.", context: ["Riesgo de deuda", "Reputación financiera"], options: [
    { label: "Pagarlo completo", hint: "Cuesta $310 y te da tranquilidad.", require: { cash: 310 }, effect: { cash: -310, stress: -4, reputation: 3 }, outcome: "Dolió ver salir el dinero, pero el problema terminó aquí." },
    { label: "Negociar dos pagos", hint: "Pagas $155 ahora y sumas un pequeño saldo.", require: { cash: 155 }, effect: { cash: -155, debt: 170, skill: 2, stress: 1 }, outcome: "La llamada fue incómoda, pero lograste un acuerdo razonable." },
    { label: "Dejarlo para después", hint: "Conservas efectivo, pero la deuda crece.", effect: { debt: 365, stress: 6, reputation: -4 }, outcome: "El dinero sigue en tu cuenta, pero también la preocupación y un recargo." }
  ]},
  { id: "family_help", category: "FAMILIA", icon: "♥", title: "Diego te pide un favor", text: "Necesita $240 para resolver una urgencia y promete devolverlos pronto. Sabes que ha tenido meses difíciles.", context: ["Dinero y límites", "Confianza"], options: [
    { label: "Prestarle el dinero", hint: "Cuesta $240; la devolución no es segura.", require: { cash: 240 }, effect: { cash: -240, happiness: 2 }, relation: { diego: [7, 10] }, flags: { helpedDiego: true }, outcome: "Diego respiró aliviado. Acordaron una fecha y dejaron todo claro por escrito." },
    { label: "Ayudar con $80 sin préstamo", hint: "Apoyo menor, sin cuentas pendientes.", require: { cash: 80 }, effect: { cash: -80, stress: -1 }, relation: { diego: [5, 6] }, outcome: "No solucionaste todo, pero diste ayuda sin poner en riesgo la relación." },
    { label: "No mezclar familia y dinero", hint: "Proteges tu presupuesto; la confianza baja.", effect: { stress: 1, reputation: 1 }, relation: { diego: [-5, -6] }, outcome: "Tu límite fue claro. Diego se quedó callado y la conversación terminó rápido." }
  ]},
  { id: "health_warning", category: "BIENESTAR", icon: "+", title: "Tu cuerpo está enviando señales", text: "Cansancio, dolores de cabeza y poco sueño. Puedes atenderlo ahora o seguir al mismo ritmo.", context: ["Salud", "Rendimiento futuro"], condition: (s) => s.stats.stress > 45 || s.stats.health < 68, options: [
    { label: "Consulta y descanso", hint: "Cuesta $120; gran recuperación.", require: { cash: 120 }, effect: { cash: -120, health: 13, stress: -12, happiness: 3 }, outcome: "No era una emergencia, pero sí una advertencia. Cambiaste hábitos antes de empeorar." },
    { label: "Tomarte un día libre", hint: "Pierdes $55 y recuperas equilibrio.", require: { cash: 55 }, effect: { cash: -55, health: 7, stress: -8, happiness: 4 }, outcome: "Dormir, caminar y desconectarte resultó más productivo de lo que parecía." },
    { label: "Seguir hasta terminar todo", hint: "Ganas algo de dinero; salud y estrés empeoran.", effect: { cash: 130, health: -8, stress: 11, skill: 2 }, outcome: "Terminaste el trabajo, pero el cansancio no desapareció al cerrar la computadora." }
  ]},
  { id: "startup", category: "EMPRENDIMIENTO", icon: "↗", title: "Camila tiene una propuesta", text: "Está probando un servicio local. No promete hacerse rica, pero necesita a alguien que aporte capital o experiencia.", context: ["Riesgo compartido", "Consecuencias a largo plazo"], condition: (s, e) => e.isUnlocked("camila"), options: [
    { label: "Invertir $500 como socio", hint: "Riesgo alto; añade un activo y posibles ingresos.", require: { cash: 500 }, effect: { cash: -500, addAsset: { id: "startupShare", title: "Participación en emprendimiento", value: 500 }, sideIncome: 55, stress: 4 }, relation: { camila: [7, 9] }, flags: { startup: true }, consequence: { delay: 6, type: 'startup_result', data: { invested: 500 } }, outcome: "Firmaron un acuerdo simple. El negocio es pequeño, pero ahora una parte también depende de ti. Descubrirás cómo fue en 6 meses." },
    { label: "Aportar tus habilidades", hint: "Sin dinero; usa esfuerzo y crea reputación.", effect: { skill: 5, reputation: 5, stress: 5, sideIncome: 25 }, relation: { camila: [8, 7] }, flags: { startup: true }, outcome: "Cambiaste dinero por trabajo. La experiencia podría valer más que el pago inicial." },
    { label: "Agradecer y no participar", hint: "Evitas riesgo, no daña la relación.", effect: { stress: -1 }, relation: { camila: [0, 1] }, outcome: "Hiciste preguntas y fuiste honesto. Camila prefirió un no claro a un sí sin compromiso." }
  ]},
  { id: "quiet_month", category: "REFLEXIÓN", icon: "☾", title: "Un mes sin crisis", text: "Por una vez nada urgente exige tu atención. ¿En qué quieres convertir este espacio?", context: ["Prioridad personal", "Sin opción perfecta"], repeatable: true, options: [
    { label: "Cuidar tus relaciones", hint: "Mejora todos los vínculos y la vida social.", effect: { social: 6, happiness: 4 }, relationAll: [3, 2], outcome: "Mandaste mensajes, aceptaste una invitación y recordaste que estar presente también construye futuro." },
    { label: "Acelerar tus metas", hint: "Más habilidad y dinero; también presión.", effect: { cash: 140, skill: 4, stress: 5 }, outcome: "Aprovechaste cada hora. El progreso fue visible, igual que el cansancio." },
    { label: "No hacer nada productivo", hint: "Gran recuperación de bienestar.", effect: { health: 5, happiness: 6, stress: -9 }, outcome: "El descanso no produjo un número, pero sí una versión más entera de ti." }
  ]}
];

export const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];