import { getState, addHistory } from './state.js';
import { goalTemplates } from './data.js';
import * as economy from './economy.js';
import { toast } from './ui.js';

export function updateDynamicGoals() {
  const s = getState();
  if (s.activeGoals.length >= 4) return;
  
  const possibleGoals = goalTemplates.filter(g => {
    const weight = g.weight(s, economy);
    return weight > 0 && !s.activeGoals.find(ag => ag.id === g.id) && !s.goalsDone.includes(g.id);
  });
  
  if (possibleGoals.length > 0) {
    // Selecciona aleatoriamente basado en el peso
    const selected = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
    s.activeGoals.push({
      id: selected.id,
      title: selected.title,
      desc: selected.desc,
      reward: selected.reward
    });
    addHistory("Meta", `Nueva meta disponible: ${selected.title}`);
    toast(`Nueva meta dinámica: ${selected.title}`);
  }
}

export function checkGoals() {
  const s = getState();
  s.activeGoals = s.activeGoals.filter(goal => {
    const template = goalTemplates.find(g => g.id === goal.id);
    if (template && template.check(s, economy)) {
      s.cash += goal.reward;
      addHistory("Meta", `${goal.title} completada. Premio: ${economy.money(goal.reward)}.`);
      toast(`Meta completada: ${goal.title} · +${economy.money(goal.reward)}`);
      s.goalsDone.push(goal.id);
      return false; // Remover de activas
    }
    return true; // Mantener activa
  });
}