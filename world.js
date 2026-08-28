import { getState, addHistory } from './state.js';
import { people } from './data.js';
import { isUnlocked, changeRelationship } from './engine.js';
import { toast } from './ui.js';

// El mundo evoluciona cada mes aunque el jugador no interactúe
export function updateWorld() {
  const s = getState();
  updateNpcs();
  driftRelationships();
  triggerGlobalEvent();
}

function updateNpcs() {
  const s = getState();
  Object.keys(s.relationships).forEach(id => {
    const npc = s.relationships[id];
    if (!npc.unlocked) return;
    
    // Rutina económica del NPC
    let npcDelta = npc.income - (people[id].baseExpenses || 500);
    npc.cash += npcDelta;
    
    // Eventos aleatorios de vida para NPCs
    if (Math.random() < 0.15) {
      const roll = Math.random();
      if (roll < 0.3) { // Ascenso
        npc.income = Math.round(npc.income * 1.15);
        npc.mood = Math.min(100, npc.mood + 10);
        addHistory("Mundo", `${people[id].name} consiguió un ascenso en su trabajo.`);
      } else if (roll < 0.6) { // Problema económico
        npc.cash -= 200;
        npc.mood = Math.max(0, npc.mood - 15);
        if (npc.cash < 0) {
          addHistory("Mundo", `${people[id].name} tuvo una emergencia financiera.`);
          // Si es Diego y tiene confianza, puede pedirte ayuda
          if (id === 'diego' && npc.trust > 40 && !s.storyFlags.helpedDiego) {
            s.storyFlags.diegoNeedsHelp = true; // Esto activará una decisión futura
          }
        }
      } else { // Evento social
        npc.mood = Math.min(100, npc.mood + 5);
      }
    }
    
    // El ánimo del NPC afecta la relación si no interactúas
    if (npc.mood < 30 && (s.month - npc.lastInteraction) >= 2) {
      changeRelationship(id, -1, -1);
    }
  });
}

function driftRelationships() {
  const s = getState();
  Object.keys(s.relationships).forEach(id => {
    const r = s.relationships[id];
    if (r.unlocked && (s.month - r.lastInteraction) >= 3) {
      r.closeness = Math.max(0, r.closeness - 2);
    }
  });
}

function triggerGlobalEvent() {
  const s = getState();
  if (Math.random() < 0.2) { // 20% de chance de evento global
    const events = [
      { text: "Alza en el mercado tecnológico. Las acciones suben.", apply: () => s.economicModifiers.cryptoBoost = 0.15 },
      { text: "Recesión económica temporal. Se reducen ofertas laborales.", apply: () => s.economicModifiers.offerReduction = 0.5 },
      { text: "Ola de inflación inesperada. Los gastos aumentan este mes.", apply: () => s.inflationRate += 0.03 },
      { text: "Crisis inmobiliaria. Los fondos inmobiliarios caen.", apply: () => s.economicModifiers.marketCrash = 0.05 }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    event.apply();
    addHistory("Evento Global", event.text);
    toast(`Mundo: ${event.text}`, "warn");
  }
}

// Motor de consecuencias a largo plazo
export function processConsequences() {
  const s = getState();
  if (!s.consequences) s.consequences = [];
  
  s.consequences = s.consequences.filter(cons => {
    if (s.month >= cons.triggerMonth) {
      resolveConsequence(cons);
      return false;
    }
    return true;
  });
}

function resolveConsequence(cons) {
  const s = getState();
  if (cons.type === 'startup_result') {
    const success = Math.random() < 0.65;
    if (success) {
      const profit = Math.round(cons.data.invested * 1.5);
      s.cash += profit;
      const asset = s.assets.find(a => a.id === 'startupShare');
      if (asset) asset.value = Math.round(asset.value * 1.5);
      addHistory("Consecuencia", `Tu inversión con Camila maduró. Recibiste ${money(profit)} en dividendos y el valor de tu parte aumentó.`);
      toast(`Consecuencia a medio plazo: Inversión exitosa +${money(profit)}.`);
    } else {
      const asset = s.assets.find(a => a.id === 'startupShare');
      if (asset) asset.value = Math.round(asset.value * 0.3);
      addHistory("Consecuencia", `El emprendimiento de Camila tuvo problemas. El valor de tu participación cayó.`);
      toast(`Consecuencia a medio plazo: Inversión en pérdida.`, "bad");
    }
  }
}