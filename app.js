import { getState, setState, createNewLife, loadGame, saveGame, resetGame, addHistory } from './state.js';
import * as engine from './engine.js';
import * as ui from './ui.js';
import { difficulties, aspirations, CAMPAIGN_MONTHS } from './data.js';

const $ = (id) => document.getElementById(id);

function init() {
  // Listeners
  $("startBtn").addEventListener("click", () => showScreen("creator"));
  $("continueBtn").addEventListener("click", () => {
    const state = loadGame();
    if (state) { showScreen("game"); ui.renderAll(); }
  });
  $("backToStartBtn").addEventListener("click", () => showScreen("start"));
  
  $("creatorForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: $("playerName").value.trim() || "Alex",
      age: parseInt($("playerAge").value) || 22,
      difficultyKey: $("difficultySelect").value,
      educationKey: $("educationSelect").value,
      lifestyleKey: $("lifestyleSelect").value,
      originKey: $("originSelect").value,
      aspirationKey: $("aspirationSelect").value
    };
    createNewLife(data);
    engine.queueDecision();
    showScreen("game");
    ui.renderAll();
    ui.toast("Tu historia ha comenzado. El mundo ya está evolucionando.");
  });

  $("advanceMonthBtn").addEventListener("click", () => {
    const result = engine.advanceMonth();
    if (result) {
      if (result.ended) {
        showScreen("result");
      } else {
        ui.renderAll();
        // Mostrar resumen del mes
      }
    }
  });

  $("resetBtn").addEventListener("click", () => {
    if (confirm("¿Empezar una vida nueva?")) {
      resetGame();
      showScreen("start");
    }
  });

  // Delegación de eventos para botones dinámicos
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || btn.disabled) return;
    
    if (btn.dataset.choice !== undefined) {
      engine.chooseDecision(Number(btn.dataset.choice));
      ui.renderAll();
    } else if (btn.dataset.action) {
      engine.useLifeAction(btn.dataset.action);
      ui.renderAll();
    }
    // ... otros handlers
  });

  // Cargar estado inicial
  updateContinueButton();
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  $(`${name}Screen`).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateContinueButton() {
  $("continueBtn").disabled = !localStorage.getItem("vidaDeAhorrosSaveV3");
}

document.addEventListener("DOMContentLoaded", init);