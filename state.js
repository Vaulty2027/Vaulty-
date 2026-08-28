import { SAVE_KEY, difficulties, educationProfiles, lifestyleProfiles, originProfiles, aspirations, people } from './data.js';

let state = null;

export const getState = () => state;
export const setState = (s) => state = s;
export const $ = (id) => document.getElementById(id);

export function createNewLife(data) {
  const education = educationProfiles[data.educationKey];
  const lifestyle = lifestyleProfiles[data.lifestyleKey];
  const origin = originProfiles[data.originKey];
  const difficulty = difficulties[data.difficultyKey];

  state = {
    version: 3, name: data.name, age: data.age, startingAge: data.age, month: 1, year: 1,
    difficultyKey: data.difficultyKey, educationKey: data.educationKey, lifestyleKey: data.lifestyleKey, originKey: data.originKey, aspirationKey: data.aspirationKey,
    inflationRate: 0, economicModifiers: {},
    cash: Math.max(120, (education.cash + lifestyle.cash + origin.cash) * difficulty.cashMod), savings: 0,
    debt: education.debt + origin.debt, rent: origin.rent, sideIncome: origin.sideIncome,
    job: null, energy: 3, expenseMod: lifestyle.expenseMod,
    stats: {
      health: 76, happiness: Math.max(0, Math.min(100, 61 + lifestyle.happiness + origin.happiness)),
      stress: Math.max(0, Math.min(100, 25 + lifestyle.stress + origin.stress)), education: education.education,
      skill: education.skill, reputation: education.reputation + lifestyle.reputation,
      social: Math.max(0, Math.min(100, 48 + origin.social))
    },
    inventory: [], assets: [], investments: [], activeGoals: [], goalsDone: [], achievements: [],
    history: [], decisionHistory: [], usedDecisions: [], pendingDecision: null,
    monthActions: [], consequences: [], storyFlags: {},
    autoSaveRate: data.lifestyleKey === "ahorrador" ? 20 : data.lifestyleKey === "gastador" ? 5 : 10,
    extraDebtPayment: education.debt + origin.debt > 0 ? 50 : 0,
    freePlay: false, endingSeen: false, lastMonthDelta: 0,
    relationships: createRelationships(data.originKey)
  };
  
  // Inicializa el estado de la IA para NPCs
  Object.keys(people).forEach(id => {
    state.relationships[id].cash = people[id].baseIncome * 2;
    state.relationships[id].income = people[id].baseIncome;
    state.relationships[id].mood = 70;
  });

  if (state.debt >= 1000) state.storyFlags.hadBigDebt = true;
  return state;
}

function createRelationships(originKey) {
  const base = {
    luna: { unlocked: true, closeness: originKey === "nuevo" ? 32 : 25, trust: 22, lastInteraction: 0 },
    diego: { unlocked: true, closeness: originKey === "familia" ? 42 : 30, trust: originKey === "familia" ? 40 : 32, lastInteraction: 0 },
    mateo: { unlocked: false, closeness: 12, trust: 10, lastInteraction: 0 },
    sofia: { unlocked: false, closeness: 10, trust: 14, lastInteraction: 0 },
    vale: { unlocked: false, closeness: 12, trust: 10, lastInteraction: 0 },
    camila: { unlocked: false, closeness: 10, trust: 8, lastInteraction: 0 }
  };
  return base;
}

export function saveGame() {
  if (!state) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    state = JSON.parse(raw);
    return state;
  } catch (e) {
    console.error("Error cargando:", e);
    return null;
  }
}

export function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  state = null;
}

export function addHistory(type, text) {
  if (!state) return;
  state.history.unshift({ month: state.month, type, text });
  state.history = state.history.slice(0, 100);
}