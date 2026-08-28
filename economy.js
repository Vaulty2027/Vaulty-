import { getState } from './state.js';
import { difficulties, lifestyleProfiles, marketItems, investmentTypes } from './data.js';

export function calculateIncome() {
  const s = getState();
  if (!s) return { total: 0 };
  const salary = s.job ? s.job.salary : 0;
  const networkIncome = hasPerk("vale", 55) ? 45 : 0;
  const passive = calculatePassiveIncome();
  return { salary, side: s.sideIncome + networkIncome, passive, total: salary + s.sideIncome + networkIncome + passive };
}

export function calculateExpenses() {
  const s = getState();
  if (!s) return { total: 0 };
  const lifestyle = lifestyleProfiles[s.lifestyleKey] || lifestyleProfiles.equilibrado;
  const food = s.job?.id === "cashier" ? 225 : 255;
  const transport = s.inventory.includes("bike") ? 48 : s.inventory.includes("car") ? 170 : 125;
  const baseEssentials = (food + transport + 145) * (s.expenseMod || lifestyle.expenseMod);
  
  // Aplicar inflación acumulada
  const inflationMultiplier = 1 + s.inflationRate;
  const essentials = Math.round(baseEssentials * inflationMultiplier);
  
  const upkeep = marketItems.filter(item => s.inventory.includes(item.id)).reduce((sum, item) => sum + (item.upkeep || 0), 0);
  const debtMinimum = s.debt > 0 ? Math.min(480, Math.max(25, Math.round(s.debt * .014))) : 0;
  const friendshipHelp = hasPerk("luna", 55) ? 45 : 0;
  const total = Math.max(0, Math.round(s.rent + essentials + upkeep + debtMinimum - friendshipHelp));
  return { rent: s.rent, essentials, upkeep, debtMinimum, friendshipHelp, total };
}

export function calculatePassiveIncome() {
  const s = getState();
  if (!s) return 0;
  return Math.round(s.investments.reduce((sum, inv) => {
    const rates = { savings: .0015, bonds: .0025, stocks: .002, business: .011, crypto: 0, realestate: .006 };
    return sum + inv.value * (rates[inv.type] || 0);
  }, 0));
}

export function calculateNetWorth() {
  const s = getState();
  if (!s) return 0;
  return Math.round(s.cash + s.savings + portfolioValue() + s.assets.reduce((sum, a) => sum + a.value, 0) - s.debt);
}

export function portfolioValue() {
  const s = getState();
  return s ? Math.round(s.investments.reduce((sum, item) => sum + item.value, 0)) : 0;
}

export function updateInvestments() {
  const s = getState();
  if (!s.investments.length) return "Aún no tienes inversiones expuestas al mercado.";
  let totalChange = 0;
  
  s.investments.forEach(inv => {
    const type = investmentTypes.find(t => t.id === inv.type);
    if (!type) return;
    let rate = random(type.range[0], type.range[1]);
    
    // Aplicar modificadores globales
    if (s.economicModifiers.cryptoBoost && inv.type === "crypto") rate += s.economicModifiers.cryptoBoost;
    if (s.economicModifiers.marketCrash) rate -= s.economicModifiers.marketCrash;
    
    if (inv.type === "business" && hasPerk("camila", 60)) rate += .012;
    const change = Math.round(inv.value * rate);
    inv.value = Math.max(0, inv.value + change);
    totalChange += change;
  });
  
  return `${totalChange >= 0 ? "Tu cartera creció" : "Tu cartera retrocedió"} ${money(Math.abs(totalChange))} este mes.`;
}

export function applyInflation() {
  const s = getState();
  const diff = difficulties[s.difficultyKey];
  s.inflationRate += diff.inflation;
  // Los modificadores globales se reinician cada mes
  s.economicModifiers = {};
}

export function hasPerk(id, threshold) {
  const s = getState();
  const r = s?.relationships?.[id];
  return !!r?.unlocked && r.closeness >= threshold && r.trust >= Math.max(35, threshold - 10);
}

export function isUnlocked(id) {
  const s = getState();
  return !!s?.relationships?.[id]?.unlocked;
}

export function unlockedPeople() {
  const s = getState();
  return s ? Object.keys(s.relationships).filter(id => s.relationships[id]?.unlocked) : [];
}

// Utilidades
export function money(value) { const n = Math.round(Number(value) || 0); return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`; }
export function signedMoney(value) { const n = Math.round(Number(value) || 0); return `${n >= 0 ? "+" : "-"}$${Math.abs(n).toLocaleString("en-US")}`; }
export function clamp(v, min, max) { return Math.max(min, Math.min(max, Number(v) || 0)); }
export function random(min, max) { return min + Math.random() * (max - min); }