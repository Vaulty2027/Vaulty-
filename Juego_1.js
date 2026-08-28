const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });

const W = canvas.width;
const H = canvas.height;
const GROUND_Y = H - 66;
const GRAVITY = 0.62;
const FRICTION = 0.84;
const TOTAL_LEVELS = 10;
const MAX_PARTICLES = 150;
const VIEW_PADDING = 140;

let keys = {};
let levelIndex = 1;
let level;
let theme;
let coins = [];
let stars = [];
let particles = [];
let bgDecor = [];
let worldDecor = [];
let pig;
let camX = 0;
let levelCoinsCollected = 0;
let totalCoins = 0;
let totalScore = 0;
let lives = 3;
let gameOver = false;
let paused = true;
let messageMode = "start";
let invincibleTimer = 0;
let screenShake = 0;
let transitionFlash = 0;
let tick = 0;
let audioContext = null;
let skyGradient = null;
let vignetteGradient = null;
let pigBodyGradient = null;
let coinBodyGradient = null;
let sunGlowGradient = null;
const hudCache = Object.create(null);
const LEVEL_THEMES = ["meadow", "desert", "castle", "jungle", "ice", "volcano", "candy", "starlight", "harbor", "workshop"];

const THEMES = {
  meadow: {
    name: "Valle Dulce",
    sky: ["#72c9ff", "#d8fbff"],
    sun: "#fff1a8",
    hill1: "#80d889",
    hill2: "#4aa65a",
    top: "#69d463",
    top2: "#39a84c",
    soil: "#9a6634",
    soil2: "#5f3519",
    edge: "#d8ff86",
    cloud: "rgba(255, 255, 255, .9)",
    flag: "#ff5c8c",
    propSet: ["flower", "flower", "bush", "tree", "mushroom"]
  },
  desert: {
    name: "Dunas Doradas",
    sky: ["#ff955d", "#ffe3a8"],
    sun: "#fff3b0",
    hill1: "#dfae58",
    hill2: "#b77a3f",
    top: "#f0c768",
    top2: "#c8913d",
    soil: "#c87a3d",
    soil2: "#82452a",
    edge: "#ffe19a",
    cloud: "rgba(255, 240, 208, .78)",
    flag: "#3fb7d6",
    propSet: ["cactus", "rock", "dryGrass", "cactus", "sign"]
  },
  castle: {
    name: "Castillo Lunar",
    sky: ["#22183e", "#634b96"],
    sun: "#f6efff",
    hill1: "#665198",
    hill2: "#352946",
    top: "#a996e8",
    top2: "#735db6",
    soil: "#534368",
    soil2: "#291f35",
    edge: "#d8ccff",
    cloud: "rgba(230, 218, 255, .55)",
    flag: "#ffd35c",
    propSet: ["torch", "ruin", "moonGrass", "tower", "crystal"]
  },
  jungle: {
    name: "Jungla Esmeralda",
    sky: ["#17896f", "#b9f6d5"],
    sun: "#f1ffb5",
    hill1: "#37b66e",
    hill2: "#176c50",
    top: "#42cf77",
    top2: "#1f9656",
    soil: "#744820",
    soil2: "#40250f",
    edge: "#a9ff73",
    cloud: "rgba(234, 255, 238, .82)",
    flag: "#ffcf56",
    propSet: ["leaf", "vine", "flower", "fern", "bigTree"]
  },
  ice: {
    name: "Glaciar Cristal",
    sky: ["#67d2f8", "#f7ffff"],
    sun: "#ffffff",
    hill1: "#bff7ff",
    hill2: "#75cde7",
    top: "#c7f6ff",
    top2: "#73d8ef",
    soil: "#74a8c7",
    soil2: "#416b91",
    edge: "#ffffff",
    cloud: "rgba(255, 255, 255, .92)",
    flag: "#9a6cff",
    propSet: ["iceCrystal", "snowBush", "snowman", "iceRock", "lantern"]
  },
  volcano: {
    name: "Volcan Brillante",
    sky: ["#462037", "#f06c45"],
    sun: "#ffd08a",
    hill1: "#7d2d2e",
    hill2: "#2d1a26",
    top: "#5f4152",
    top2: "#302031",
    soil: "#4b2b2f",
    soil2: "#1d131a",
    edge: "#ff9b45",
    cloud: "rgba(80, 55, 70, .62)",
    flag: "#ffe45c",
    propSet: ["emberRock", "smokeVent", "lavaCrack", "charPlant", "basalt"]
  },
  candy: {
    name: "Bosque Caramelo",
    sky: ["#ff9ed3", "#fff0b8"],
    sun: "#fff7b8",
    hill1: "#92e7d2",
    hill2: "#e97cb6",
    top: "#8ee6c7",
    top2: "#3fb79a",
    soil: "#b8697f",
    soil2: "#6d334f",
    edge: "#fff06a",
    cloud: "rgba(255, 255, 255, .88)",
    flag: "#7a5cff",
    propSet: ["lollipop", "gumdrop", "candyCane", "cookie", "sprinkleBush"]
  },
  starlight: {
    name: "Cielo Estrella",
    sky: ["#101b4d", "#4b65b7"],
    sun: "#fff8cf",
    hill1: "#6572c9",
    hill2: "#273062",
    top: "#8aa0ff",
    top2: "#5365c8",
    soil: "#3d467d",
    soil2: "#1c244f",
    edge: "#f8f0a7",
    cloud: "rgba(236, 241, 255, .62)",
    flag: "#7ce7b2",
    propSet: ["starLamp", "moonRock", "cometGrass", "tinyPlanet", "glowMushroom"]
  },
  harbor: {
    name: "Puerto de las Nubes",
    sky: ["#2667a5", "#9de7f2"],
    sun: "#fff3b0",
    hill1: "#5ab7c6",
    hill2: "#227a92",
    top: "#5cc9bd",
    top2: "#248e88",
    soil: "#6c4b46",
    soil2: "#382932",
    edge: "#d7fff0",
    cloud: "rgba(239, 252, 255, .76)",
    flag: "#ffcf56",
    propSet: ["coral", "shell", "dock", "buoy", "seaweed"]
  },
  workshop: {
    name: "Taller de Juguetes",
    sky: ["#523d96", "#d08cbd"],
    sun: "#fff0a8",
    hill1: "#9e70c3",
    hill2: "#553a82",
    top: "#f1b95d",
    top2: "#ce8039",
    soil: "#8d5a5c",
    soil2: "#402e52",
    edge: "#fff0a8",
    cloud: "rgba(255, 231, 250, .68)",
    flag: "#7ce7b2",
    propSet: ["block", "spring", "toyTrain", "gearProp", "balloon"]
  }
};

const ENEMY_SPECS = {
  fox: { w: 52, h: 34, fly: false },
  scorpion: { w: 56, h: 30, fly: false },
  bat: { w: 62, h: 38, fly: true },
  frog: { w: 48, h: 34, fly: false },
  penguin: { w: 44, h: 44, fly: false },
  bee: { w: 50, h: 32, fly: true },
  crab: { w: 54, h: 32, fly: false },
  mole: { w: 48, h: 32, fly: false },
  firebug: { w: 50, h: 36, fly: false },
  cupcake: { w: 46, h: 42, fly: false },
  robot: { w: 48, h: 42, fly: false },
  owl: { w: 58, h: 42, fly: true, behavior: "swoop" },
  slime: { w: 48, h: 30, fly: false, behavior: "hop" },
  turtle: { w: 56, h: 38, fly: false, behavior: "charge" }
};

const OBSTACLE_SPECS = {
  thorn: { w: 36, h: 38 },
  cactus: { w: 34, h: 52 },
  spike: { w: 34, h: 40 },
  crystal: { w: 34, h: 46 },
  fire: { w: 36, h: 46 },
  candySpike: { w: 38, h: 48 },
  gear: { w: 36, h: 36 }
};

document.addEventListener("keydown", (e) => {
  if ((e.code === "Escape" || e.code === "KeyP") && !e.repeat) {
    e.preventDefault();
    togglePause();
    return;
  }

  keys[e.code] = true;

  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

bindHoldButton("leftBtn", "ArrowLeft");
bindHoldButton("rightBtn", "ArrowRight");
bindHoldButton("jumpBtn", "Space");

document.getElementById("pauseBtn").addEventListener("click", togglePause);

function bindHoldButton(id, code) {
  const button = document.getElementById(id);
  if (!button) return;

  const set = (pressed, event) => {
    event.preventDefault();
    keys[code] = pressed;
  };

  button.addEventListener("pointerdown", (event) => set(true, event));
  button.addEventListener("pointerup", (event) => set(false, event));
  button.addEventListener("pointerleave", (event) => set(false, event));
  button.addEventListener("pointercancel", (event) => set(false, event));
}

function buildLevel(n) {
  const g = GROUND_Y;

  const data = [
    {
      theme: "meadow",
      width: 3200,
      speed: 1.45,
      platforms: [
        [0, g, 560, 90], [650, g, 320, 90], [1050, g - 90, 150, 24], [1280, g, 360, 90],
        [1500, g - 120, 150, 24], [1760, g, 260, 90], [2120, g - 85, 160, 24],
        [2360, g, 260, 90], [2700, g, 500, 90]
      ],
      movers: [[1980, g - 150, 145, 24, "x", 75, 0.032, 0]],
      hazards: [[310, "thorn"], [735, "thorn"], [1340, "thorn"], [1810, "thorn"], [2410, "thorn"], [2870, "thorn"]],
      enemies: [[820, 700, 965, "fox"], [1455, 1340, 1610, "bee", g - 154], [2460, 2360, 2605, "mole"]],
      stars: [[1540, g - 165], [2050, g - 200]],
      goal: 3060
    },
    {
      theme: "desert",
      width: 3520,
      speed: 1.9,
      platforms: [
        [0, g, 430, 90], [500, g - 80, 160, 24], [720, g, 280, 90], [1090, g - 70, 175, 24],
        [1340, g, 240, 90], [1680, g - 130, 150, 24], [1900, g, 280, 90],
        [2240, g - 85, 160, 24], [2490, g, 270, 90], [2860, g - 75, 150, 24], [3100, g, 420, 90]
      ],
      movers: [[1470, g - 180, 140, 24, "y", 58, 0.028, 1.5]],
      hazards: [[260, "cactus"], [770, "cactus"], [1395, "cactus"], [1950, "cactus"], [2540, "cactus"], [3180, "cactus"], [3330, "cactus"]],
      enemies: [[780, 720, 985, "scorpion"], [1960, 1900, 2170, "scorpion"], [2525, 2490, 2735, "crab"]],
      stars: [[1525, g - 218], [2900, g - 120]],
      goal: 3380
    },
    {
      theme: "castle",
      width: 3740,
      speed: 2.15,
      platforms: [
        [0, g, 380, 90], [450, g - 70, 140, 24], [670, g - 145, 140, 24], [890, g - 70, 140, 24],
        [1100, g, 240, 90], [1430, g - 80, 150, 24], [1660, g - 150, 150, 24],
        [1900, g - 80, 150, 24], [2160, g, 250, 90], [2500, g - 90, 160, 24],
        [2760, g - 165, 160, 24], [3030, g - 90, 160, 24], [3260, g, 480, 90]
      ],
      movers: [[1320, g - 145, 130, 24, "x", 90, 0.027, 0.6]],
      hazards: [[1145, "spike"], [2200, "spike"], [3310, "spike"], [3480, "spike"], [3615, "spike"]],
      enemies: [[1180, 1110, 1330, "bat", g - 165], [2200, 2160, 2400, "mole"], [3330, 3260, 3540, "bat", g - 150]],
      stars: [[700, g - 190], [2795, g - 215]],
      goal: 3600
    },
    {
      theme: "jungle",
      width: 4020,
      speed: 2.25,
      platforms: [
        [0, g, 430, 90], [510, g - 75, 150, 24], [735, g - 145, 150, 24], [970, g, 280, 90],
        [1330, g - 95, 180, 24], [1600, g, 260, 90], [1950, g - 125, 170, 24],
        [2225, g, 245, 90], [2570, g - 70, 160, 24], [2820, g - 150, 170, 24],
        [3140, g, 270, 90], [3510, g, 510, 90]
      ],
      movers: [[2440, g - 160, 145, 24, "y", 52, 0.032, 2.2]],
      hazards: [[280, "thorn"], [1015, "thorn"], [1680, "thorn"], [2260, "thorn"], [3210, "thorn"], [3630, "thorn"]],
      enemies: [[1030, 970, 1230, "frog"], [1670, 1600, 1850, "frog"], [2290, 2225, 2460, "bee", g - 138], [3580, 3510, 3860, "frog"]],
      stars: [[760, g - 188], [2860, g - 205]],
      goal: 3880
    },
    {
      theme: "ice",
      width: 4260,
      speed: 2.45,
      platforms: [
        [0, g, 400, 90], [480, g - 82, 160, 24], [720, g, 230, 90], [1040, g - 135, 150, 24],
        [1290, g, 230, 90], [1620, g - 70, 165, 24], [1880, g - 155, 165, 24],
        [2160, g, 250, 90], [2510, g - 90, 165, 24], [2780, g, 230, 90],
        [3100, g - 145, 175, 24], [3420, g, 250, 90], [3780, g, 480, 90]
      ],
      movers: [[2920, g - 185, 145, 24, "x", 85, 0.03, 1.3]],
      hazards: [[765, "crystal"], [1330, "crystal"], [2200, "crystal"], [2825, "crystal"], [3480, "crystal"], [3900, "crystal"]],
      enemies: [[760, 720, 945, "penguin"], [1340, 1290, 1510, "penguin"], [2205, 2160, 2400, "penguin"], [3490, 3420, 3660, "penguin"], [3920, 3780, 4140, "bat", g - 145]],
      stars: [[1080, g - 178], [3140, g - 190]],
      goal: 4110
    },
    {
      theme: "volcano",
      width: 4520,
      speed: 2.65,
      platforms: [
        [0, g, 360, 90], [440, g - 70, 150, 24], [670, g, 230, 90], [990, g - 125, 150, 24],
        [1230, g - 55, 150, 24], [1480, g, 240, 90], [1800, g - 110, 160, 24],
        [2070, g, 230, 90], [2400, g - 80, 165, 24], [2660, g - 155, 165, 24],
        [2960, g, 245, 90], [3310, g - 110, 170, 24], [3600, g, 255, 90], [4000, g, 520, 90]
      ],
      movers: [[2190, g - 170, 145, 24, "y", 60, 0.035, 0.2], [3820, g - 145, 145, 24, "x", 82, 0.032, 1.8]],
      hazards: [[700, "fire"], [1530, "fire"], [2110, "fire"], [3010, "fire"], [3650, "fire"], [4130, "fire"], [4300, "fire"]],
      enemies: [[700, 670, 895, "firebug"], [1520, 1480, 1705, "firebug"], [2110, 2070, 2295, "firebug"], [3650, 3600, 3850, "crab"], [4140, 4000, 4390, "firebug"]],
      stars: [[1015, g - 170], [2700, g - 210], [3860, g - 195]],
      goal: 4380
    },
    {
      theme: "candy",
      width: 4700,
      speed: 2.8,
      platforms: [
        [0, g, 390, 90], [480, g - 85, 155, 24], [720, g - 155, 155, 24], [980, g, 250, 90],
        [1320, g - 80, 170, 24], [1580, g, 240, 90], [1900, g - 135, 160, 24],
        [2160, g - 65, 160, 24], [2420, g, 245, 90], [2750, g - 90, 170, 24],
        [3050, g - 160, 170, 24], [3370, g, 260, 90], [3730, g - 100, 175, 24],
        [4040, g, 660, 90]
      ],
      movers: [[2510, g - 145, 150, 24, "y", 52, 0.034, 1.5], [3890, g - 160, 150, 24, "x", 90, 0.03, 0.7]],
      hazards: [[1020, "candySpike"], [1630, "candySpike"], [2470, "candySpike"], [3415, "candySpike"], [4120, "candySpike"], [4380, "candySpike"]],
      enemies: [[1020, 980, 1220, "cupcake"], [1630, 1580, 1810, "cupcake"], [2470, 2420, 2640, "bee", g - 130], [3420, 3370, 3630, "cupcake"], [4150, 4040, 4480, "crab"]],
      stars: [[735, g - 205], [3090, g - 215], [3920, g - 210]],
      goal: 4560
    },
    {
      theme: "starlight",
      width: 4920,
      speed: 3,
      platforms: [
        [0, g, 360, 90], [450, g - 90, 150, 24], [690, g - 165, 150, 24], [960, g - 90, 150, 24],
        [1220, g, 235, 90], [1540, g - 125, 160, 24], [1810, g, 230, 90],
        [2140, g - 75, 165, 24], [2420, g - 155, 165, 24], [2740, g, 245, 90],
        [3100, g - 110, 170, 24], [3390, g - 180, 170, 24], [3700, g - 95, 170, 24],
        [4000, g, 270, 90], [4380, g, 540, 90]
      ],
      movers: [[1410, g - 185, 145, 24, "x", 95, 0.034, 0], [2900, g - 175, 145, 24, "y", 62, 0.032, 1.1], [4210, g - 160, 150, 24, "x", 90, 0.036, 2.2]],
      hazards: [[1260, "gear"], [1845, "gear"], [2785, "gear"], [4050, "gear"], [4520, "gear"], [4690, "gear"]],
      enemies: [[1260, 1220, 1450, "robot"], [1840, 1810, 2030, "robot"], [2790, 2740, 2970, "bat", g - 150], [4050, 4000, 4260, "robot"], [4540, 4380, 4810, "bee", g - 145]],
      stars: [[720, g - 220], [2440, g - 210], [3420, g - 235], [4240, g - 215]],
      goal: 4780
    },
    {
      theme: "harbor",
      width: 5220,
      speed: 3.15,
      platforms: [
        [0, g, 390, 90], [475, g - 80, 160, 24], [720, g, 230, 90], [1040, g - 145, 155, 24],
        [1285, g, 245, 90], [1620, g - 75, 165, 24], [1890, g - 165, 160, 24],
        [2170, g, 245, 90], [2520, g - 100, 170, 24], [2810, g, 245, 90],
        [3150, g - 155, 170, 24], [3440, g - 70, 165, 24], [3700, g, 260, 90],
        [4050, g - 125, 180, 24], [4340, g, 260, 90], [4710, g, 510, 90]
      ],
      movers: [[1410, g - 155, 145, 24, "x", 85, 0.035, 0.5], [2300, g - 175, 150, 24, "y", 65, 0.033, 1.8], [3920, g - 150, 145, 24, "x", 92, 0.036, 2.4]],
      hazards: [[770, "thorn"], [1325, "thorn"], [2220, "thorn"], [2860, "thorn"], [3760, "thorn"], [4430, "thorn"], [4880, "thorn"]],
      enemies: [[750, 720, 935, "turtle"], [1310, 1285, 1510, "slime"], [1950, 1880, 2070, "owl", g - 205], [2820, 2810, 3030, "turtle"], [3780, 3700, 3940, "slime"], [4440, 4340, 4580, "owl", g - 190], [4800, 4710, 5080, "turtle"]],
      stars: [[1075, g - 198], [1930, g - 220], [3180, g - 210], [4100, g - 190]],
      goal: 5060
    },
    {
      theme: "workshop",
      width: 5520,
      speed: 3.4,
      platforms: [
        [0, g, 360, 90], [450, g - 95, 155, 24], [690, g - 175, 155, 24], [960, g - 85, 155, 24],
        [1220, g, 235, 90], [1540, g - 135, 165, 24], [1820, g, 230, 90],
        [2140, g - 75, 170, 24], [2420, g - 165, 170, 24], [2735, g, 240, 90],
        [3070, g - 115, 175, 24], [3370, g - 190, 175, 24], [3680, g - 90, 175, 24],
        [3980, g, 260, 90], [4340, g - 125, 180, 24], [4640, g, 250, 90], [4990, g, 530, 90]
      ],
      movers: [[1090, g - 175, 145, 24, "x", 92, 0.037, 0.1], [1990, g - 155, 145, 24, "y", 68, 0.036, 1.5], [2860, g - 175, 150, 24, "x", 98, 0.039, 2.3], [4510, g - 155, 150, 24, "y", 66, 0.037, 0.8]],
      hazards: [[1260, "gear"], [1860, "gear"], [2780, "gear"], [4040, "gear"], [4710, "gear"], [5140, "gear"], [5310, "gear"]],
      enemies: [[1260, 1220, 1440, "robot"], [1880, 1820, 2030, "slime"], [2460, 2410, 2610, "owl", g - 205], [2790, 2735, 2960, "turtle"], [4040, 3980, 4220, "robot"], [4400, 4330, 4530, "slime"], [4720, 4640, 4870, "owl", g - 195], [5150, 4990, 5410, "turtle"]],
      stars: [[720, g - 230], [2460, g - 225], [3410, g - 245], [4380, g - 200], [5030, g - 190]],
      goal: 5350
    }
  ][n - 1];

  let platformId = 0;
  const platforms = data.platforms.map((p) => makePlatform(p, platformId++));
  const movingPlatforms = data.movers.map((p) => makePlatform(p, platformId++));

  const obstacles = data.hazards.map(([x, type, customY]) => {
    const spec = OBSTACLE_SPECS[type] || OBSTACLE_SPECS.spike;
    return {
      x,
      y: customY ?? g - spec.h,
      w: spec.w,
      h: spec.h,
      type
    };
  });

  const enemies = data.enemies.map((raw, i) => {
    const [, , , type] = raw;
    const spec = ENEMY_SPECS[type] || ENEMY_SPECS.fox;
    const y = raw[4] ?? (spec.fly ? g - 145 : g - spec.h);

    return {
      x: raw[0],
      y,
      homeY: y,
      w: spec.w,
      h: spec.h,
      dir: i % 2 ? -1 : 1,
      range: [raw[1], raw[2]],
      speed: data.speed + i * 0.13,
      type,
      alive: true,
      phase: i * 1.7 + n,
      squash: 0,
      behavior: spec.behavior || "patrol",
      alert: 0
    };
  });

  const coinLayout = [];

  platforms.concat(movingPlatforms).forEach((p, i) => {
    const count = Math.max(1, Math.min(5, Math.floor(p.w / 115)));
    for (let c = 1; c <= count; c++) {
      const x = p.x + (p.w / (count + 1)) * c;
      const arc = Math.sin((c / (count + 1)) * Math.PI) * 18;
      coinLayout.push({ x, y: p.y - 42 - arc });
    }

    if (i % 3 === 1) {
      coinLayout.push({ x: p.x + p.w / 2, y: p.y - 88 });
    }
  });

  return {
    theme: data.theme,
    width: data.width,
    platforms: platforms.concat(movingPlatforms),
    obstacles,
    enemies,
    stars: data.stars.map(([x, y]) => ({ x, y, w: 30, h: 30, collected: false })),
    coinLayout,
    goal: {
      x: data.goal,
      y: g - 158,
      w: 50,
      h: 158
    }
  };
}

function makePlatform(raw, id) {
  const [x, y, w, h, axis, amp, speed, phase] = raw;

  return {
    id,
    x,
    y,
    baseX: x,
    baseY: y,
    prevX: x,
    prevY: y,
    w,
    h,
    move: axis ? { axis, amp, speed, phase } : null
  };
}

function loadLevel(n) {
  level = buildLevel(n);
  theme = THEMES[level.theme];
  cacheLevelPaints();
  coins = level.coinLayout.map((c, i) => ({
    ...c,
    homeX: c.x,
    homeY: c.y,
    collected: false,
    r: 11,
    bob: i * 0.7
  }));
  stars = level.stars.map((s) => ({ ...s }));
  particles = [];
  invincibleTimer = 0;
  levelCoinsCollected = 0;
  transitionFlash = 16;
  buildDecor();

  document.getElementById("coinTotal").textContent = coins.length;
  document.getElementById("levelCount").textContent = `${levelIndex} / ${TOTAL_LEVELS}`;
  showLevelBanner();
  updateHUD();
  updateDots();
}

function cacheLevelPaints() {
  skyGradient = ctx.createLinearGradient(0, 0, 0, H);
  skyGradient.addColorStop(0, theme.sky[0]);
  skyGradient.addColorStop(1, theme.sky[1]);

  if (!vignetteGradient) {
    vignetteGradient = ctx.createRadialGradient(W / 2, H / 2, H / 2.3, W / 2, H / 2, H / 1.02);
    vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
    vignetteGradient.addColorStop(1, "rgba(0,0,0,.25)");
  }

  if (!pigBodyGradient) {
    pigBodyGradient = ctx.createRadialGradient(-11, -11, 3, -2, 4, 32);
    pigBodyGradient.addColorStop(0, "#fff0f3");
    pigBodyGradient.addColorStop(.48, "#ffb4c6");
    pigBodyGradient.addColorStop(1, "#dc6f8d");
  }

  if (!coinBodyGradient) {
    coinBodyGradient = ctx.createRadialGradient(-4, -6, 1, 0, 0, 11);
    coinBodyGradient.addColorStop(0, "#fff8c9");
    coinBodyGradient.addColorStop(0.28, "#ffe27a");
    coinBodyGradient.addColorStop(0.72, "#efad2f");
    coinBodyGradient.addColorStop(1, "#c77a14");
  }

  const sunX = theme === THEMES.meadow || theme === THEMES.ice ? W - 105 : 118;
  const sunY = theme === THEMES.castle || theme === THEMES.starlight ? 78 : 82;
  const sunR = theme === THEMES.castle || theme === THEMES.starlight ? 42 : 38;
  sunGlowGradient = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, sunR * 2.2);
  sunGlowGradient.addColorStop(0, theme.sun);
  sunGlowGradient.addColorStop(1, "rgba(255,255,255,0)");

  for (const p of level.platforms) {
    p.bodyGradient = ctx.createLinearGradient(0, p.y + 14, 0, p.y + p.h);
    p.bodyGradient.addColorStop(0, theme.soil);
    p.bodyGradient.addColorStop(1, theme.soil2);
    p.topGradient = ctx.createLinearGradient(0, p.y, 0, p.y + 18);
    p.topGradient.addColorStop(0, theme.edge);
    p.topGradient.addColorStop(.35, theme.top);
    p.topGradient.addColorStop(1, theme.top2);
  }
}

function initGame(showIntro = true) {
  levelIndex = 1;
  levelCoinsCollected = 0;
  totalCoins = 0;
  totalScore = 0;
  lives = 3;
  gameOver = false;
  paused = true;
  messageMode = "start";
  camX = 0;
  screenShake = 0;
  transitionFlash = 0;
  pig = makePig();
  loadLevel(levelIndex);

  if (showIntro) showStartMenu();
  else resumeGame();
}

function makePig() {
  return {
    x: 50,
    y: GROUND_Y - 52,
    w: 52,
    h: 48,
    vx: 0,
    vy: 0,
    onGround: false,
    platformId: null,
    facing: 1,
    invulnerable: 0,
    jumpsUsed: 0,
    walkCycle: 0,
    squash: 0,
    blinkSeed: Math.random() * 100,
    _jumpLock: false
  };
}

function resetPig() {
  pig.x = 50;
  pig.y = GROUND_Y - pig.h;
  pig.vx = 0;
  pig.vy = 0;
  pig.onGround = false;
  pig.platformId = null;
  pig.jumpsUsed = 0;
  pig.squash = 0;
  camX = 0;
}

function nextLevel() {
  playSound("goal");
  levelIndex++;

  if (levelIndex > TOTAL_LEVELS) {
    endGame("win");
    return;
  }

  resetPig();
  loadLevel(levelIndex);
}

function showMessage({ mode, title, text = "", text2 = "", primaryLabel, secondaryLabel = "", showSecondary = false, showPicker = false }) {
  const message = document.getElementById("message");
  const picker = document.getElementById("levelPicker");

  paused = true;
  messageMode = mode;
  document.getElementById("msgTitle").textContent = title;
  document.getElementById("msgText").textContent = text;
  document.getElementById("msgText2").textContent = text2;
  document.getElementById("msgBtn").textContent = primaryLabel;
  document.getElementById("msgSecondaryBtn").textContent = secondaryLabel;
  document.getElementById("msgSecondaryBtn").hidden = !showSecondary;
  picker.hidden = !showPicker;
  message.style.display = "flex";
  message.classList.remove("visible");
  requestAnimationFrame(() => message.classList.add("visible"));
}

function hideMessage() {
  const message = document.getElementById("message");
  message.classList.remove("visible");
  message.style.display = "none";
}

function showStartMenu() {
  showMessage({
    mode: "start",
    title: "Chanchito Aventura",
    text: "Diez mundos artesanales, doble salto y una aventura que empieza con un pequeño gruñido.",
    text2: "Usa las flechas o A / D para moverte.",
    primaryLabel: "Comenzar",
    secondaryLabel: "Elegir nivel",
    showSecondary: true
  });
}

function showPauseMenu() {
  showMessage({
    mode: "pause",
    title: "Pausa",
    text: `Nivel ${levelIndex}: ${theme.name}`,
    text2: "El chanchito está listo cuando tú lo estés.",
    primaryLabel: "Continuar",
    secondaryLabel: "Elegir nivel",
    showSecondary: true
  });
}

function openLevelSelect() {
  const fromStart = messageMode !== "pause";
  showMessage({
    mode: fromStart ? "select-start" : "select-pause",
    title: "Elige un mundo",
    text: "Cada mundo cambia el ritmo, las trampas y los rivales.",
    text2: "Puedes volver a cualquier nivel para practicar.",
    primaryLabel: "Volver",
    showPicker: true
  });
  renderLevelPicker();
}

function renderLevelPicker() {
  const picker = document.getElementById("levelPicker");
  picker.innerHTML = "";

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = i === levelIndex ? "current" : "";
    button.innerHTML = `<span>NIVEL ${i}</span>${THEMES[LEVEL_THEMES[i - 1]].name}`;
    button.addEventListener("click", () => startSelectedLevel(i));
    picker.appendChild(button);
  }
}

function startSelectedLevel(n) {
  levelIndex = n;
  levelCoinsCollected = 0;
  totalCoins = 0;
  totalScore = 0;
  lives = 3;
  gameOver = false;
  pig = makePig();
  camX = 0;
  loadLevel(levelIndex);
  resumeGame();
}

function resumeGame() {
  paused = false;
  messageMode = "playing";
  hideMessage();
  ensureAudio();
}

function togglePause() {
  if (gameOver || messageMode === "start" || messageMode.startsWith("select")) return;
  if (paused) resumeGame();
  else showPauseMenu();
}

function buildDecor() {
  const rand = mulberry32(levelIndex * 991 + 37);
  bgDecor = [];
  worldDecor = [];

  for (let i = 0; i < 24; i++) {
    bgDecor.push({
      x: rand() * level.width,
      y: 28 + rand() * 170,
      s: 0.55 + rand() * 1.25,
      spd: 0.08 + rand() * 0.22,
      kind: rand() > 0.72 ? "wisp" : "cloud"
    });
  }

  const widePlatforms = level.platforms.filter((p) => p.h > 50);

  for (let i = 0; i < 60; i++) {
    const p = widePlatforms[Math.floor(rand() * widePlatforms.length)];
    const type = theme.propSet[Math.floor(rand() * theme.propSet.length)];

    worldDecor.push({
      x: p.x + 22 + rand() * Math.max(1, p.w - 44),
      y: p.y,
      s: 0.7 + rand() * 0.7,
      type,
      phase: rand() * Math.PI * 2,
      back: rand() > 0.28
    });
  }
}

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function ensureAudio() {
  if (audioContext) {
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    return audioContext;
  }

  const AudioAPI = window.AudioContext || window.webkitAudioContext;
  if (!AudioAPI) return null;

  try {
    audioContext = new AudioAPI();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  } catch {
    audioContext = null;
  }

  return audioContext;
}

function playSound(kind) {
  const soundCtx = ensureAudio();
  if (!soundCtx || soundCtx.state !== "running") return;

  const sounds = {
    jump: { notes: [420], duration: 0.09, end: 670, type: "square", volume: 0.045 },
    coin: { notes: [860], duration: 0.07, end: 1200, type: "sine", volume: 0.035 },
    stomp: { notes: [160], duration: 0.12, end: 82, type: "triangle", volume: 0.06 },
    hurt: { notes: [180], duration: 0.24, end: 65, type: "sawtooth", volume: 0.045 },
    star: { notes: [520, 780], duration: 0.18, end: 1060, type: "sine", volume: 0.035 },
    goal: { notes: [523, 659, 784], duration: 0.18, end: 980, type: "triangle", volume: 0.04 },
    win: { notes: [523, 659, 784, 1047], duration: 0.34, end: 1250, type: "sine", volume: 0.035 }
  };
  const sound = sounds[kind];
  if (!sound) return;

  const now = soundCtx.currentTime;
  sound.notes.forEach((note, index) => {
    const oscillator = soundCtx.createOscillator();
    const gain = soundCtx.createGain();
    const start = now + index * 0.035;
    const end = start + sound.duration;

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(note, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, sound.end), end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(sound.volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain).connect(soundCtx.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  });
}

function showLevelBanner() {
  const banner = document.getElementById("levelBanner");
  banner.innerHTML = `NIVEL ${levelIndex}<small>${theme.name}</small>`;
  banner.classList.add("show");

  setTimeout(() => {
    banner.classList.remove("show");
  }, 1600);
}

function updateDots() {
  const el = document.getElementById("levelDots");
  el.innerHTML = "";

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (i < levelIndex) dot.classList.add("cleared");
    if (i === levelIndex) dot.classList.add("active");
    el.appendChild(dot);
  }
}

function updateHUD() {
  setHudText("coinCount", levelCoinsCollected);
  setHudText("scoreCount", totalScore);
  setHudText("livesIcons", "\u2665".repeat(Math.max(lives, 0)));
  setHudText("powerText", invincibleTimer > 0 ? `${Math.ceil(invincibleTimer / 60)}s` : "listo");
}

function setHudText(id, value) {
  const text = String(value);
  if (hudCache[id] === text) return;
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
  hudCache[id] = text;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function isWorldVisible(x, width = 0, padding = VIEW_PADDING) {
  return x + width >= camX - padding && x <= camX + W + padding;
}

function spawnParticles(x, y, color, count = 10, spread = 4, shape = "dot") {
  const available = Math.max(0, MAX_PARTICLES - particles.length);
  const amount = Math.min(count, available);

  for (let i = 0; i < amount; i++) {
    const size = 2.5 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * spread * 2,
      vy: -Math.random() * spread - 0.8,
      life: 26 + Math.random() * 22,
      maxLife: 44,
      color,
      size,
      gravity: 0.12 + Math.random() * 0.08,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.22,
      shape
    });
  }
}

function loseLife() {
  if (pig.invulnerable > 0 || invincibleTimer > 0) return;

  lives--;
  playSound("hurt");
  screenShake = 13;
  pig.squash = 0.32;
  spawnParticles(pig.x + pig.w / 2, pig.y + pig.h / 2, "#ff5c7a", 22, 5.5, "spark");
  updateHUD();

  if (lives <= 0) {
    endGame("lose");
  } else {
    resetPig();
    pig.invulnerable = 100;
  }
}

function endGame(result) {
  gameOver = true;

  if (result === "win") {
    playSound("win");
    showMessage({
      mode: "win",
      title: "¡Aventura completada!",
      text: `El chanchito conquistó los ${TOTAL_LEVELS} mundos.`,
      text2: `Puntaje total: ${totalScore} · Monedas totales: ${totalCoins}`,
      primaryLabel: "Jugar de nuevo"
    });
  } else {
    showMessage({
      mode: "lose",
      title: "Juego terminado",
      text: `Te quedaste sin vidas en el nivel ${levelIndex}.`,
      text2: `Puntaje total: ${totalScore} · Monedas totales: ${totalCoins}`,
      primaryLabel: "Jugar de nuevo",
      secondaryLabel: "Elegir nivel",
      showSecondary: true
    });
  }
}

function onMessageButton() {
  if (messageMode === "start" || messageMode === "pause") {
    resumeGame();
  } else if (messageMode === "select-start") {
    showStartMenu();
  } else if (messageMode === "select-pause") {
    showPauseMenu();
  } else {
    initGame(false);
  }
}

function onSecondaryButton() {
  if (messageMode === "lose" || messageMode === "win") openLevelSelect();
  else openLevelSelect();
}

window.onMessageButton = onMessageButton;
window.onSecondaryButton = onSecondaryButton;

function update() {
  if (gameOver || paused) return;

  tick++;
  updateMovingPlatforms();

  const left = keys.ArrowLeft || keys.KeyA;
  const right = keys.ArrowRight || keys.KeyD;

  if (left) {
    pig.vx -= 0.96;
    pig.facing = -1;
  }

  if (right) {
    pig.vx += 0.96;
    pig.facing = 1;
  }

  pig.vx *= FRICTION;

  if (Math.abs(pig.vx) > 7.4) {
    pig.vx = 7.4 * Math.sign(pig.vx);
  }

  if (Math.abs(pig.vx) > 0.25 && pig.onGround) {
    pig.walkCycle += Math.abs(pig.vx) * 0.21;

    if (tick % 9 === 0) {
      spawnParticles(pig.x + pig.w / 2 - pig.facing * 15, pig.y + pig.h - 4, "rgba(255,255,255,.55)", 2, 1.1, "dust");
    }
  }

  const jumpPressed = keys.Space || keys.ArrowUp || keys.KeyW;

  if (jumpPressed && !pig._jumpLock) {
      if (pig.onGround) {
      pig.vy = -13.7;
      pig.onGround = false;
      pig.platformId = null;
      pig.jumpsUsed = 1;
      pig.squash = 0.24;
        spawnParticles(pig.x + pig.w / 2, pig.y + pig.h, "#ffffff", 8, 1.9, "dust");
        playSound("jump");
    } else if (pig.jumpsUsed < 2) {
      pig.vy = -11.7;
      pig.jumpsUsed = 2;
      pig.squash = 0.18;
        spawnParticles(pig.x + pig.w / 2, pig.y + pig.h / 2, "#ffe08a", 14, 3, "spark");
        playSound("jump");
    }

    pig._jumpLock = true;
  }

  if (!jumpPressed) {
    pig._jumpLock = false;
  }

  const prevY = pig.y;
  const wasOnGround = pig.onGround;

  pig.vy += GRAVITY;
  if (pig.vy > 18.5) pig.vy = 18.5;

  pig.x += pig.vx;
  pig.y += pig.vy;
  pig.x = Math.max(0, Math.min(level.width - pig.w, pig.x));
  pig.onGround = false;
  pig.platformId = null;

  for (const p of level.platforms) {
    const insideX = pig.x + pig.w > p.x + 4 && pig.x < p.x + p.w - 4;
    const landing = pig.vy >= 0 &&
      prevY + pig.h <= p.y + 12 &&
      pig.y + pig.h >= p.y &&
      insideX;

    if (landing) {
      const impact = Math.abs(pig.vy);
      pig.y = p.y - pig.h;
      pig.vy = 0;
      pig.onGround = true;
      pig.platformId = p.id;
      pig.jumpsUsed = 0;

      if (!wasOnGround && impact > 4) {
        pig.squash = Math.min(0.28, impact / 45);
        spawnParticles(pig.x + pig.w / 2, pig.y + pig.h, "rgba(255,255,255,.6)", 7, 1.6, "dust");
      }
    }
  }

  if (pig.y > H + 90) {
    loseLife();
  }

  for (const o of level.obstacles) {
    if (rectsOverlap(pig, o)) {
      if (invincibleTimer <= 0) {
        loseLife();
      } else {
        screenShake = Math.max(screenShake, 4);
        spawnParticles(o.x + o.w / 2, o.y + o.h / 2, theme.edge, 5, 2.2, "spark");
      }
      break;
    }
  }

  updateEnemies(prevY);
  updateCollectibles();
  updateParticles();

  if (pig.invulnerable > 0) pig.invulnerable--;
  if (invincibleTimer > 0) invincibleTimer--;
  if (screenShake > 0) screenShake *= 0.88;
  if (transitionFlash > 0) transitionFlash--;
  if (pig.squash > 0.01) pig.squash *= 0.84;
  else pig.squash = 0;

  if (rectsOverlap(pig, level.goal)) {
    spawnParticles(level.goal.x + 20, level.goal.y + 30, theme.flag, 30, 6, "confetti");
    nextLevel();
  }

  camX = pig.x - W / 2 + pig.w / 2;
  camX = Math.max(0, Math.min(level.width - W, camX));
  updateHUD();
}

function updateMovingPlatforms() {
  for (const p of level.platforms) {
    p.prevX = p.x;
    p.prevY = p.y;

    if (!p.move) continue;

    const wave = Math.sin(tick * p.move.speed + p.move.phase) * p.move.amp;
    if (p.move.axis === "x") p.x = p.baseX + wave;
    if (p.move.axis === "y") p.y = p.baseY + wave;

    if (pig.onGround && pig.platformId === p.id) {
      pig.x += p.x - p.prevX;
      pig.y += p.y - p.prevY;
    }
  }
}

function updateEnemies(prevPigY) {
  const pigCenterX = pig.x + pig.w / 2;
  const pigCenterY = pig.y + pig.h / 2;

  for (const e of level.enemies) {
    if (!e.alive) continue;

    const spec = ENEMY_SPECS[e.type] || ENEMY_SPECS.fox;
    const enemyCenterX = e.x + e.w / 2;
    const canDetect = Math.abs(pigCenterX - enemyCenterX) < (e.behavior === "swoop" ? 350 : 245) &&
      Math.abs(pigCenterY - (e.y + e.h / 2)) < 165;
    e.alert = Math.max(0, Math.min(1, e.alert + (canDetect ? 0.08 : -0.035)));

    let moveSpeed = e.speed;
    if ((e.behavior === "charge" || e.type === "robot") && canDetect) {
      e.dir = Math.sign(pigCenterX - enemyCenterX) || e.dir;
      moveSpeed *= e.behavior === "charge" ? 1.72 : 1.35;
    }

    e.x += e.dir * moveSpeed;
    if (e.x < e.range[0] || e.x > e.range[1]) {
      e.dir *= -1;
      e.x = Math.max(e.range[0], Math.min(e.range[1], e.x));
    }

    if (spec.fly) {
      if (e.behavior === "swoop") {
        const driftY = e.homeY + Math.sin(tick * 0.065 + e.phase) * 15;
        const targetY = canDetect ? Math.max(e.homeY - 70, Math.min(e.homeY + 38, pig.y - 34)) : driftY;
        e.y += (targetY - e.y) * 0.06;
      } else {
        e.y = e.homeY + Math.sin(tick * 0.055 + e.phase) * 13;
      }
    } else if (e.type === "frog") {
      e.y = e.homeY - Math.max(0, Math.sin(tick * 0.07 + e.phase)) * 13;
    } else if (e.behavior === "hop") {
      e.y = e.homeY - Math.max(0, Math.sin(tick * 0.11 + e.phase)) * 19;
    } else if (e.type === "penguin" || e.type === "cupcake") {
      e.y = e.homeY + Math.sin(tick * 0.12 + e.phase) * 1.6;
    }

    if (rectsOverlap(pig, e)) {
      const stomped = pig.vy > 0 && prevPigY + pig.h <= e.y + 13;

      if (invincibleTimer > 0 || stomped) {
        e.alive = false;
        pig.vy = -9.5;
        pig.jumpsUsed = Math.min(pig.jumpsUsed, 1);
        totalScore += 60;
        playSound("stomp");
        screenShake = Math.max(screenShake, 5);
        spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#ffd35c", 20, 4.5, "spark");
      } else {
        loseLife();
      }
    }
  }
}

function updateCollectibles() {
  for (const c of coins) {
    if (c.collected) continue;

    c.bob += 0.08;
    const y = c.y + Math.sin(c.bob) * 4;
    const px = pig.x + pig.w / 2;
    const py = pig.y + pig.h / 2;
    const dx = px - c.x;
    const dy = py - y;
    const distance = Math.hypot(dx, dy);

    if (distance < 95) {
      c.x += dx * 0.035;
      c.y += dy * 0.02;
    }

    if (distance < c.r + 24) {
      c.collected = true;
      levelCoinsCollected++;
      totalCoins++;
      totalScore += 10;
      playSound("coin");
      spawnParticles(c.x, y, "#ffd35c", 12, 3, "spark");
    }
  }

  for (const s of stars) {
    if (!s.collected && rectsOverlap(pig, s)) {
      s.collected = true;
      invincibleTimer = 420;
      totalScore += 40;
      playSound("star");
      screenShake = Math.max(screenShake, 5);
      spawnParticles(s.x + 15, s.y + 15, "#fff07a", 32, 5.5, "spark");
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rot += p.spin;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawSky() {
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, W, H);

  const sunX = level.theme === "meadow" || level.theme === "ice" ? W - 105 : 118;
  const sunY = level.theme === "castle" || level.theme === "starlight" ? 78 : 82;
  const sunR = level.theme === "castle" || level.theme === "starlight" ? 42 : 38;

  ctx.fillStyle = sunGlowGradient;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = theme.sun;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  drawAtmosphereDetails();
  drawHillLayer(theme.hill1, 302, 74, 0.12, 260);
  drawHillLayer(theme.hill2, 342, 96, 0.2, 310);

  for (const d of bgDecor) {
    const x = wrapX(d.x - camX * d.spd, -130, W + 130);
    if (d.kind === "wisp" && (level.theme === "volcano" || level.theme === "castle" || level.theme === "starlight")) {
      drawWisp(x, d.y, d.s);
    } else {
      drawCloud(x, d.y, d.s);
    }
  }
}

function drawAtmosphereDetails() {
  if (level.theme === "castle" || level.theme === "starlight") {
    ctx.fillStyle = "rgba(255,255,255,.85)";
    for (let i = 0; i < 70; i++) {
      const x = (i * 87 + camX * 0.04) % W;
      const y = (i * 47) % 255;
      ctx.globalAlpha = 0.28 + 0.48 * Math.abs(Math.sin(i + tick * 0.018));
      ctx.fillRect(x, y, i % 5 === 0 ? 3 : 2, i % 5 === 0 ? 3 : 2);
    }
    ctx.globalAlpha = 1;
  }

  if (level.theme === "ice") {
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.beginPath();
    for (let i = 0; i < 55; i++) {
      const x = (i * 93 + tick * 0.6 + camX * 0.08) % W;
      const y = (i * 41 + tick * 0.45) % H;
      ctx.moveTo(x + 1.2 + (i % 3), y);
      ctx.arc(x, y, 1.2 + (i % 3), 0, Math.PI * 2);
    }
    ctx.fill();
  }

  if (level.theme === "volcano") {
    ctx.fillStyle = "rgba(255, 103, 58, .46)";
    for (let i = 0; i < 42; i += 2) {
      const x = (i * 71 - tick * 0.5 + camX * 0.05) % W;
      const y = 120 + ((i * 37 - tick * 0.85) % 260);
      ctx.fillRect(x, y, 3, 3);
    }
    ctx.fillStyle = "rgba(255, 210, 92, .55)";
    for (let i = 1; i < 42; i += 2) {
      const x = (i * 71 - tick * 0.5 + camX * 0.05) % W;
      const y = 120 + ((i * 37 - tick * 0.85) % 260);
      ctx.fillRect(x, y, 3, 3);
    }
  }

  if (level.theme === "jungle") {
    ctx.strokeStyle = "rgba(16, 92, 64, .24)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const x = (i * 120 - camX * 0.13) % (W + 140);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 20, 55, x - 18, 110, x + 10, 170);
      ctx.stroke();
    }
  }
}

function drawHillLayer(color, baseY, height, speed, width) {
  const offset = -((camX * speed) % width);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-width + offset, H);

  for (let x = -width + offset; x < W + width; x += width) {
    ctx.quadraticCurveTo(x + width * 0.25, baseY - height, x + width * 0.5, baseY);
    ctx.quadraticCurveTo(x + width * 0.75, baseY + height * 0.42, x + width, baseY);
  }

  ctx.lineTo(W + width, H);
  ctx.closePath();
  ctx.fill();
}

function wrapX(x, min, max) {
  const span = max - min;
  while (x < min) x += span;
  while (x > max) x -= span;
  return x;
}

function drawCloud(x, y, s) {
  ctx.fillStyle = theme.cloud;
  ctx.beginPath();
  ctx.ellipse(x, y, 30 * s, 17 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 27 * s, y + 6 * s, 22 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 25 * s, y + 8 * s, 20 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 4 * s, y - 9 * s, 18 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawWisp(x, y, s) {
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = theme.cloud;
  ctx.lineWidth = 8 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y);
  ctx.bezierCurveTo(x - 14 * s, y - 20 * s, x + 12 * s, y + 18 * s, x + 35 * s, y - 3 * s);
  ctx.stroke();
  ctx.restore();
}

function drawPlatform(p) {
  if (p.move) {
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = theme.edge;
    roundedRect(p.x - 3, p.y - 3, p.w + 6, p.h + 6, 8);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = p.bodyGradient;
  roundedRect(p.x, p.y + 12, p.w, p.h - 10, 5);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = p.y + 25; y < p.y + p.h - 2; y += 17) {
    ctx.moveTo(p.x + 5, y);
    ctx.lineTo(p.x + p.w - 5, y + Math.sin((y + p.x) * 0.05) * 2);
  }
  ctx.stroke();

  ctx.fillStyle = theme.top;
  roundedRect(p.x - 2, p.y, p.w + 4, 18, 7);
  ctx.fill();

  ctx.fillStyle = p.topGradient;
  roundedRect(p.x - 2, p.y, p.w + 4, 18, 7);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,.22)";
  for (let x = p.x + 12; x < p.x + p.w - 12; x += 36) {
    ctx.fillRect(x, p.y + 4, 16, 3);
  }
}

function drawObstacle(o) {
  ctx.save();
  ctx.translate(o.x + o.w / 2, o.y + o.h);

  if (o.type === "cactus") {
    ctx.fillStyle = "#2f9a65";
    roundedRect(-7, -45, 14, 45, 7);
    ctx.fill();
    roundedRect(-18, -31, 10, 22, 5);
    ctx.fill();
    roundedRect(8, -38, 10, 24, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.34)";
    ctx.fillRect(-3, -38, 2, 28);
  } else if (o.type === "crystal") {
    ctx.fillStyle = "#dffaff";
    ctx.strokeStyle = "#69bddc";
    ctx.lineWidth = 2;
    crystalPath(-9, -1, 19, 44);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.fillRect(-2, -32, 3, 20);
  } else if (o.type === "fire") {
    const flame = Math.sin(tick * 0.15 + o.x) * 4;
    ctx.fillStyle = "#ff6b35";
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.quadraticCurveTo(-10, -28, -3, -20 - flame);
    ctx.quadraticCurveTo(2, -45, 12, -16);
    ctx.quadraticCurveTo(19, -5, 15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffd35c";
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.quadraticCurveTo(0, -26, 7, -2);
    ctx.closePath();
    ctx.fill();
  } else if (o.type === "candySpike") {
    ctx.fillStyle = "#fff06a";
    ctx.strokeStyle = "#ee4388c6";
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 12 - 5, 0);
      ctx.lineTo(i * 12, -42);
      ctx.lineTo(i * 12 + 8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (o.type === "gear") {
    ctx.fillStyle = "#ccd7ff";
    ctx.strokeStyle = "#4357a6";
    ctx.lineWidth = 2;
    ctx.rotate(tick * 0.02);
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(10, -3, 8, 6);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#263061";
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = o.type === "thorn" ? "#276d4d" : "#aab0bd";
    ctx.strokeStyle = "rgba(0,0,0,.2)";
    ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 11 - 6, 0);
      ctx.lineTo(i * 11, -37);
      ctx.lineTo(i * 11 + 7, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

function crystalPath(x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x + w * 0.48, y - h);
  ctx.lineTo(x + w, y - h * 0.48);
  ctx.lineTo(x + w * 0.76, y);
  ctx.lineTo(x + w * 0.18, y);
  ctx.lineTo(x, y - h * 0.45);
  ctx.closePath();
}

function drawEnemy(e) {
  const bob = Math.sin(tick * 0.12 + e.phase) * 1.8;

  ctx.save();
  ctx.translate(e.x + e.w / 2, e.y + e.h / 2 + bob);
  ctx.scale(e.dir, 1);

  ctx.fillStyle = "rgba(0,0,0,.18)";
  ctx.beginPath();
  ctx.ellipse(0, e.h / 2 - 1, e.w * 0.34, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (e.alert > 0.08) {
    ctx.strokeStyle = `rgba(255, 240, 122, ${e.alert * .62})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(e.w, e.h) * .48 + e.alert * 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (e.type === "fox") drawFox();
  else if (e.type === "scorpion") drawScorpion();
  else if (e.type === "bat") drawBat();
  else if (e.type === "frog") drawFrog();
  else if (e.type === "penguin") drawPenguin();
  else if (e.type === "bee") drawBee();
  else if (e.type === "crab") drawCrab();
  else if (e.type === "mole") drawMole();
  else if (e.type === "firebug") drawFirebug();
  else if (e.type === "cupcake") drawCupcake();
  else if (e.type === "owl") drawOwl(e.alert);
  else if (e.type === "slime") drawSlime();
  else if (e.type === "turtle") drawTurtle(e.alert);
  else drawRobot();

  ctx.restore();
}

function drawFox() {
  const leg = Math.sin(tick * 0.2) * 3;
  ctx.fillStyle = "#c95f26";
  ctx.beginPath();
  ctx.ellipse(-3, 2, 21, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8752e";
  ctx.beginPath();
  ctx.moveTo(4, -5);
  ctx.lineTo(25, -10);
  ctx.lineTo(22, 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff2d9";
  ctx.beginPath();
  ctx.moveTo(20, -2);
  ctx.lineTo(29, -5);
  ctx.lineTo(22, 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#b2471d";
  ctx.beginPath();
  ctx.moveTo(-21, 1);
  ctx.quadraticCurveTo(-36, -17, -45, 4);
  ctx.quadraticCurveTo(-35, 12, -22, 8);
  ctx.fill();
  ctx.fillStyle = "#fff2d9";
  ctx.beginPath();
  ctx.moveTo(-42, 4);
  ctx.quadraticCurveTo(-36, -1, -31, 6);
  ctx.fill();
  ctx.fillStyle = "#5d271a";
  ctx.fillRect(-12, 12 + leg, 6, 8);
  ctx.fillRect(6, 12 - leg, 6, 8);
  drawSingleEye(13, -5);
}

function drawScorpion() {
  ctx.strokeStyle = "#6b2f0f";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 7, 5);
    ctx.lineTo(i * 7 - 9, 14);
    ctx.stroke();
  }
  ctx.fillStyle = "#9b4d18";
  ctx.beginPath();
  ctx.ellipse(-4, 2, 23, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c86f2a";
  ctx.beginPath();
  ctx.ellipse(17, 1, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6b2f0f";
  ctx.beginPath();
  ctx.moveTo(-20, -1);
  ctx.quadraticCurveTo(-30, -28, -8, -26);
  ctx.stroke();
  ctx.fillStyle = "#6b2f0f";
  ctx.beginPath();
  ctx.moveTo(-7, -29);
  ctx.lineTo(3, -24);
  ctx.lineTo(-6, -20);
  ctx.fill();
  drawSingleEye(20, -3);
}

function drawBat() {
  const flap = Math.sin(tick * 0.24) * 12;
  ctx.fillStyle = "#33224f";
  ctx.beginPath();
  ctx.moveTo(-5, -3);
  ctx.lineTo(-31, -flap);
  ctx.lineTo(-18, 13);
  ctx.lineTo(-5, 6);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(5, -3);
  ctx.lineTo(31, -flap);
  ctx.lineTo(18, 13);
  ctx.lineTo(5, 6);
  ctx.fill();
  ctx.fillStyle = "#6d4aa0";
  ctx.beginPath();
  ctx.ellipse(0, 1, 14, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8f6dcc";
  ctx.beginPath();
  ctx.moveTo(-8, -11);
  ctx.lineTo(-2, -24);
  ctx.lineTo(3, -10);
  ctx.lineTo(9, -24);
  ctx.lineTo(10, -8);
  ctx.fill();
  drawSingleEye(5, -2);
}

function drawFrog() {
  const jump = Math.max(0, Math.sin(tick * 0.07)) * 4;
  ctx.fillStyle = "#09712f";
  ctx.beginPath();
  ctx.ellipse(0, 8 - jump, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(4, -3 - jump, 17, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(-4, -13 - jump, 5, 0, Math.PI * 2);
  ctx.arc(10, -13 - jump, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(-3, -13 - jump, 2, 0, Math.PI * 2);
  ctx.arc(11, -13 - jump, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#0f5c2f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-13, 13);
  ctx.lineTo(-24, 17);
  ctx.moveTo(11, 13);
  ctx.lineTo(24, 17);
  ctx.stroke();
}

function drawPenguin() {
  const waddle = Math.sin(tick * 0.18) * 0.12;
  ctx.rotate(waddle);
  ctx.fillStyle = "#101827";
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 21, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.ellipse(4, 6, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.moveTo(12, -4);
  ctx.lineTo(24, 0);
  ctx.lineTo(12, 5);
  ctx.fill();
  ctx.fillRect(-10, 18, 9, 4);
  ctx.fillRect(4, 18, 9, 4);
  ctx.strokeStyle = "#2a3550";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-13, 2);
  ctx.lineTo(-23, 10);
  ctx.stroke();
  drawSingleEye(6, -8);
}

function drawBee() {
  const wing = Math.sin(tick * 0.45) * 5;
  ctx.fillStyle = "rgba(255,255,255,.62)";
  ctx.beginPath();
  ctx.ellipse(-8, -14 + wing, 10, 15, -0.5, 0, Math.PI * 2);
  ctx.ellipse(8, -14 - wing, 10, 15, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd35c";
  ctx.beginPath();
  ctx.ellipse(0, 1, 22, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c2431";
  ctx.fillRect(-9, -11, 5, 22);
  ctx.fillRect(4, -11, 5, 22);
  ctx.beginPath();
  ctx.moveTo(-21, 0);
  ctx.lineTo(-31, -6);
  ctx.lineTo(-24, 6);
  ctx.fill();
  drawSingleEye(14, -4);
}

function drawCrab() {
  const claw = Math.sin(tick * 0.16) * 4;
  ctx.strokeStyle = "#8f2830";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-16, 3);
  ctx.lineTo(-28, -5 - claw);
  ctx.moveTo(16, 3);
  ctx.lineTo(28, -5 + claw);
  ctx.stroke();
  ctx.fillStyle = "#d94b4b";
  ctx.beginPath();
  ctx.ellipse(0, 5, 21, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff7676";
  ctx.beginPath();
  ctx.arc(-31, -8 - claw, 8, 0, Math.PI * 2);
  ctx.arc(31, -8 + claw, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(-6, -7, 4, 0, Math.PI * 2);
  ctx.arc(8, -7, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(-5, -7, 1.8, 0, Math.PI * 2);
  ctx.arc(9, -7, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawMole() {
  ctx.fillStyle = "#70452d";
  ctx.beginPath();
  ctx.ellipse(0, 6, 21, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9a6a48";
  ctx.beginPath();
  ctx.ellipse(9, -1, 15, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4b7a8";
  ctx.beginPath();
  ctx.ellipse(21, 0, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f1d0a0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-15, 10);
  ctx.lineTo(-26, 17);
  ctx.moveTo(2, 11);
  ctx.lineTo(-7, 18);
  ctx.stroke();
  drawSingleEye(10, -5);
}

function drawFirebug() {
  const flicker = Math.sin(tick * 0.22) * 3;
  ctx.fillStyle = "#3a1f27";
  ctx.beginPath();
  ctx.ellipse(0, 5, 21, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff7a35";
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.quadraticCurveTo(-4, -28 - flicker, 4, -7);
  ctx.quadraticCurveTo(11, -28 + flicker, 17, 0);
  ctx.fill();
  ctx.fillStyle = "#ffd35c";
  ctx.beginPath();
  ctx.moveTo(-2, 2);
  ctx.quadraticCurveTo(5, -16, 9, 3);
  ctx.fill();
  drawSingleEye(10, -2);
}

function drawCupcake() {
  ctx.fillStyle = "#7a4a65";
  roundedRect(-16, 3, 32, 20, 5);
  ctx.fill();
  ctx.fillStyle = "#ffdee9";
  ctx.beginPath();
  ctx.ellipse(0, -2, 20, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(-8, -10, 10, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(8, -10, 10, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff4f7d";
  ctx.beginPath();
  ctx.arc(0, -21, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd35c";
  ctx.fillRect(-8, 7, 3, 9);
  ctx.fillRect(0, 7, 3, 9);
  ctx.fillRect(8, 7, 3, 9);
  drawSingleEye(8, -3);
}

function drawRobot() {
  const blink = Math.sin(tick * 0.1) > 0.88;
  ctx.fillStyle = "#9fb3ff";
  roundedRect(-18, -16, 36, 31, 5);
  ctx.fill();
  ctx.fillStyle = "#4152a6";
  roundedRect(-13, -8, 26, 12, 3);
  ctx.fill();
  ctx.fillStyle = blink ? "#ffd35c" : "#7ce7b2";
  ctx.fillRect(-8, -5, 5, 6);
  ctx.fillRect(4, -5, 5, 6);
  ctx.strokeStyle = "#5262bd";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(0, -26);
  ctx.stroke();
  ctx.fillStyle = "#ffd35c";
  ctx.beginPath();
  ctx.arc(0, -28, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6f7fe2";
  ctx.fillRect(-12, 15, 7, 8);
  ctx.fillRect(5, 15, 7, 8);
}

function drawOwl(alert) {
  const flap = Math.sin(tick * .35) * 11;
  ctx.fillStyle = "#3a315c";
  ctx.beginPath();
  ctx.moveTo(-5, -3); ctx.lineTo(-34, 6 + flap); ctx.lineTo(-20, 19); ctx.lineTo(-3, 8); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(5, -3); ctx.lineTo(34, 6 - flap); ctx.lineTo(20, 19); ctx.lineTo(3, 8); ctx.fill();
  ctx.fillStyle = "#8671bb";
  ctx.beginPath();
  ctx.ellipse(0, 2, 17, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f6e9c8";
  ctx.beginPath();
  ctx.arc(-7, -6, 8, 0, Math.PI * 2); ctx.arc(7, -6, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = alert > .45 ? "#ff765f" : "#25233f";
  ctx.beginPath();
  ctx.arc(-7, -6, 2.6, 0, Math.PI * 2); ctx.arc(7, -6, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd35c";
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(6, 6); ctx.lineTo(0, 9); ctx.closePath(); ctx.fill();
}

function drawSlime() {
  const squash = .88 + Math.max(0, Math.sin(tick * .11)) * .18;
  ctx.save();
  ctx.scale(1 / squash, squash);
  ctx.fillStyle = "#67d7c6";
  ctx.beginPath();
  ctx.arc(0, 2, 18, Math.PI, 0);
  ctx.lineTo(18, 13); ctx.quadraticCurveTo(0, 20, -18, 13); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.beginPath(); ctx.arc(-7, -5, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#26314f";
  ctx.beginPath(); ctx.arc(-6, 3, 2.4, 0, Math.PI * 2); ctx.arc(7, 3, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawTurtle(alert) {
  const leg = Math.sin(tick * .16) * 3;
  ctx.fillStyle = "#2d815b";
  ctx.fillRect(-21, 11 + leg, 10, 8); ctx.fillRect(9, 11 - leg, 10, 8);
  ctx.beginPath(); ctx.ellipse(19, 2, 11, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#7acb61";
  ctx.beginPath(); ctx.ellipse(-3, 3, 22, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#44794c";
  ctx.beginPath(); ctx.ellipse(-5, 2, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#dff8b5";
  ctx.beginPath(); ctx.arc(22, -1, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = alert > .5 ? "#ff765f" : "#1f2937";
  ctx.beginPath(); ctx.arc(23, -2, 1.6, 0, Math.PI * 2); ctx.fill();
}

function drawSingleEye(x, y) {
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(x, y, 2.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x + 0.8, y - 0.8, 0.9, 0, Math.PI * 2);
  ctx.fill();
}

function drawCoin(c) {
  const y = c.y + Math.sin(c.bob) * 4;
  const spin = Math.abs(Math.cos(c.bob * 1.15)) * 0.48 + 0.52;

  ctx.save();
  ctx.translate(c.x, y);
  ctx.scale(spin, 1);

  ctx.fillStyle = "#a85f12";
  ctx.beginPath();
  ctx.arc(1.5, 1.5, c.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = coinBodyGradient;
  ctx.strokeStyle = "#8a500b";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.arc(0, 0, c.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,248,193,.9)";
  ctx.lineWidth = 1.35;
  ctx.beginPath();
  ctx.arc(0, 0, c.r - 3.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#9b5a0c";
  ctx.font = "900 13px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", 0, .5);

  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.beginPath();
  ctx.ellipse(-4, -6, 2.1, 3.4, -.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStar(s) {
  if (s.collected) return;

  ctx.save();
  ctx.translate(s.x + 15, s.y + 15 + Math.sin(tick * 0.08) * 5);
  ctx.rotate(tick * 0.035);

  ctx.shadowColor = "#fff07a";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fff07a";
  ctx.strokeStyle = "#c98a12";
  ctx.lineWidth = 2;
  starPath(0, 0, 15, 7, 5);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function starPath(x, y, outer, inner, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = Math.PI / points * i - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawGoal(g) {
  ctx.fillStyle = "#c7ccd8";
  roundedRect(g.x, g.y, 7, g.h, 3);
  ctx.fill();

  ctx.fillStyle = "#8a93a9";
  ctx.fillRect(g.x + 2, g.y + g.h - 12, 18, 12);

  const wave = Math.sin(tick * 0.08) * 5;
  ctx.fillStyle = theme.flag;
  ctx.beginPath();
  ctx.moveTo(g.x + 7, g.y + 8);
  ctx.bezierCurveTo(g.x + 34 + wave, g.y + 2, g.x + 42 - wave, g.y + 30, g.x + 72 + wave, g.y + 24);
  ctx.lineTo(g.x + 70, g.y + 58);
  ctx.bezierCurveTo(g.x + 42, g.y + 64, g.x + 33, g.y + 36, g.x + 7, g.y + 43);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff7e8";
  starPath(g.x + 34, g.y + 28, 10, 4, 5);
  ctx.fill();
}

function drawPigClassic(p) {
  if (p.invulnerable > 0 && Math.floor(p.invulnerable / 5) % 2 === 0) return;

  const centerX = p.x + p.w / 2;
  const centerY = p.y + p.h / 2;
  const stride = p.onGround ? Math.sin(p.walkCycle) : 0;
  const bounce = p.onGround ? Math.sin(p.walkCycle * 0.5) * 1.2 : -2;
  const squashX = 1 + p.squash * 0.35;
  const squashY = 1 - p.squash * 0.24;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.2)";
  ctx.beginPath();
  ctx.ellipse(centerX, p.y + p.h + 2, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY + bounce);
  ctx.scale(p.facing * squashX, squashY);

  if (invincibleTimer > 0) {
    ctx.shadowColor = "#fff07a";
    ctx.shadowBlur = 22 + Math.sin(tick * 0.22) * 8;
    ctx.save();
    ctx.rotate(tick * 0.06);
    ctx.strokeStyle = "rgba(255, 240, 122, .72)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 34, 25, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = "#b95770";
  ctx.fillRect(-18, 14 + stride * 2.4, 8, 11);
  ctx.fillRect(8, 14 - stride * 2.4, 8, 11);
  ctx.fillStyle = "#743544";
  ctx.fillRect(-19, 23 + stride * 2.4, 10, 4);
  ctx.fillRect(7, 23 - stride * 2.4, 10, 4);

  ctx.strokeStyle = "#e66f8b";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-24, 1);
  ctx.bezierCurveTo(-38, -6, -33, 12, -24, 7);
  ctx.stroke();

  const body = ctx.createRadialGradient(-9, -9, 4, 0, 2, 31);
  body.addColorStop(0, "#ffe7ed");
  body.addColorStop(0.55, "#ffafc2");
  body.addColorStop(1, "#e77491");

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(-5, 3, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(122,59,70,.25)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffd1dc";
  ctx.beginPath();
  ctx.ellipse(11, -6, 17, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ee829d";
  ctx.beginPath();
  ctx.ellipse(3, -20, 7, 10, -0.45, 0, Math.PI * 2);
  ctx.ellipse(20, -19, 7, 10, 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffd9e2";
  ctx.beginPath();
  ctx.ellipse(4, -20, 3, 6, -0.45, 0, Math.PI * 2);
  ctx.ellipse(19, -19, 3, 6, 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f08aa0";
  ctx.beginPath();
  ctx.ellipse(24, 0, 10, 7.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#743544";
  ctx.beginPath();
  ctx.ellipse(27, -1, 1.8, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(21, -1, 1.8, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,92,140,.28)";
  ctx.beginPath();
  ctx.arc(12, 4, 4, 0, Math.PI * 2);
  ctx.fill();

  const blink = Math.sin((tick + p.blinkSeed) * 0.08) > 0.965;
  ctx.strokeStyle = "#1f2937";
  ctx.fillStyle = "#1f2937";

  if (blink) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, -8);
    ctx.lineTo(20, -8);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(17, -9, 2.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(18, -10, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#7ce7b2";
  ctx.beginPath();
  ctx.moveTo(-8, -12);
  ctx.lineTo(3, -8);
  ctx.lineTo(-4, -3);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawPig(p) {
  if (p.invulnerable > 0 && Math.floor(p.invulnerable / 5) % 2 === 0) return;

  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  const stride = p.onGround ? Math.sin(p.walkCycle) : 0;
  const bounce = p.onGround ? Math.sin(p.walkCycle * .5) * 1.4 : -2.5;
  const sx = 1 + p.squash * .35;
  const sy = 1 - p.squash * .24;

  ctx.save();
  ctx.fillStyle = "rgba(32, 23, 43, .22)";
  ctx.beginPath();
  ctx.ellipse(cx, p.y + p.h + 2, 25, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy + bounce);
  ctx.scale(p.facing * sx, sy);
  if (!p.onGround) ctx.rotate(Math.max(-.13, Math.min(.13, p.vx * .018)));

  if (invincibleTimer > 0) {
    ctx.save();
    ctx.rotate(tick * .06);
    ctx.strokeStyle = "rgba(255, 240, 122, .76)";
    ctx.shadowColor = "#fff07a";
    ctx.shadowBlur = 20 + Math.sin(tick * .22) * 8;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 35, 26, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Mochila, cola y botas: una silueta reconocible al correr.
  ctx.fillStyle = "#8c4a39";
  roundedRect(-25, -3, 12, 22, 5);
  ctx.fill();
  ctx.fillStyle = "#ffcc58";
  ctx.fillRect(-22, 2, 7, 3);
  ctx.strokeStyle = "#d97090";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-25, 2);
  ctx.bezierCurveTo(-39, -6, -37, 13, -27, 8);
  ctx.bezierCurveTo(-22, 5, -27, 1, -30, 5);
  ctx.stroke();

  ctx.fillStyle = "#d97090";
  roundedRect(-18, 14 + stride * 2.7, 10, 12, 5);
  ctx.fill();
  roundedRect(8, 14 - stride * 2.7, 10, 12, 5);
  ctx.fill();
  ctx.fillStyle = "#613746";
  roundedRect(-20, 23 + stride * 2.7, 13, 5, 3);
  ctx.fill();
  roundedRect(7, 23 - stride * 2.7, 13, 5, 3);
  ctx.fill();

  ctx.fillStyle = pigBodyGradient;
  ctx.beginPath();
  ctx.ellipse(-5, 3, 25, 18.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(111,48,70,.3)";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,235,240,.72)";
  ctx.beginPath();
  ctx.ellipse(-7, 8, 12, 8, .25, 0, Math.PI * 2);
  ctx.fill();

  // Pañuelo que se mueve al caminar.
  const scarfWave = Math.sin(tick * .18) * 2;
  ctx.fillStyle = "#54c7af";
  ctx.beginPath();
  ctx.moveTo(-1, -9);
  ctx.lineTo(-21, -11 + scarfWave);
  ctx.lineTo(-15, -2 + scarfWave);
  ctx.lineTo(2, -3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2b8f7e";
  ctx.fillRect(-3, -11, 13, 6);

  // Cabeza, orejas, ojos y hocico con luces y contornos suaves.
  ctx.fillStyle = "#ffd5df";
  ctx.beginPath();
  ctx.ellipse(11, -7, 18, 16.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(111,48,70,.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#ed839f";
  ctx.beginPath();
  ctx.ellipse(4, -21, 7.5, 10, -.48, 0, Math.PI * 2);
  ctx.ellipse(20, -21, 7.5, 10, .48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffcad7";
  ctx.beginPath();
  ctx.ellipse(4, -21, 3.3, 6.2, -.48, 0, Math.PI * 2);
  ctx.ellipse(20, -21, 3.3, 6.2, .48, 0, Math.PI * 2);
  ctx.fill();

  const blink = Math.sin((tick + p.blinkSeed) * .08) > .965;
  ctx.fillStyle = "#263044";
  if (blink) {
    ctx.strokeStyle = "#263044";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(12, -10); ctx.lineTo(18, -10);
    ctx.moveTo(22, -10); ctx.lineTo(25, -10);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(15, -10, 3.15, 0, Math.PI * 2);
    ctx.arc(24, -9, 2.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(16, -11, 1.15, 0, Math.PI * 2);
    ctx.arc(24.6, -9.8, .8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#f28ba5";
  ctx.beginPath();
  ctx.ellipse(27, 1.5, 11, 8.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(126,58,77,.26)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#75394a";
  ctx.beginPath();
  ctx.ellipse(23.5, .4, 1.8, 2.2, 0, 0, Math.PI * 2);
  ctx.ellipse(30, .4, 1.8, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8b4557";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(18, 2, 6, .2, 1.05);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,88,136,.28)";
  ctx.beginPath();
  ctx.arc(9, 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    if (!isWorldVisible(p.x, 0, 45) || p.y < -35 || p.y > H + 35) continue;
    ctx.save();
    ctx.globalAlpha = Math.max(p.life / p.maxLife, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;

    if (p.shape === "spark") {
      starPath(0, 0, p.size, p.size * 0.42, 4);
      ctx.fill();
    } else if (p.shape === "confetti") {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size * 1.2, p.size * 0.7);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.globalAlpha = 1;
}

function drawWorldDecor(backLayer) {
  for (const d of worldDecor) {
    if (d.back !== backLayer) continue;
    const x = d.x;
    if (x < camX - 120 || x > camX + W + 120) continue;
    drawProp(d);
  }
}

function drawProp(d) {
  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.scale(d.s, d.s);

  const sway = Math.sin(tick * 0.04 + d.phase) * 2;

  if (["flower", "moonGrass", "cometGrass"].includes(d.type)) {
    ctx.strokeStyle = d.type === "moonGrass" ? "#b9a8ff" : d.type === "cometGrass" ? "#f8f0a7" : "#307e47";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(sway, -12, sway * 0.6, -22);
    ctx.stroke();
    ctx.fillStyle = d.type === "moonGrass" ? "#d8ccff" : d.type === "cometGrass" ? "#7ce7b2" : "#ff8db0";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.ellipse(Math.cos(i) * 5 + sway, -24 + Math.sin(i) * 5, 4, 3, i, 0, Math.PI * 2);
    }
    ctx.fill();
  } else if (d.type === "tree" || d.type === "bigTree") {
    ctx.fillStyle = "#76512b";
    ctx.fillRect(-5, -45, 10, 45);
    ctx.fillStyle = d.type === "bigTree" ? "#136c48" : "#48b85b";
    ctx.beginPath();
    ctx.ellipse(0, -55, 24, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(-16, -42, 18, 15, 0, 0, Math.PI * 2);
    ctx.ellipse(16, -42, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (d.type === "bush" || d.type === "sprinkleBush" || d.type === "snowBush") {
    ctx.fillStyle = d.type === "snowBush" ? "#e9fbff" : d.type === "sprinkleBush" ? "#79dcbf" : "#3fae56";
    ctx.beginPath();
    ctx.ellipse(-10, -8, 14, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -11, 18, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(20, -7, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    if (d.type === "sprinkleBush") {
      ctx.fillStyle = "#fff06a";
      ctx.fillRect(-4, -17, 3, 6);
      ctx.fillStyle = "#ff5c8c";
      ctx.fillRect(12, -12, 3, 6);
    }
  } else if (d.type === "cactus") {
    ctx.fillStyle = "#2f9a65";
    roundedRect(-5, -38, 10, 38, 5);
    ctx.fill();
    roundedRect(-16, -29, 9, 20, 5);
    ctx.fill();
    roundedRect(7, -32, 9, 22, 5);
    ctx.fill();
  } else if (d.type === "rock" || d.type === "iceRock" || d.type === "moonRock") {
    ctx.fillStyle = d.type === "iceRock" ? "#dffaff" : d.type === "moonRock" ? "#b7c1ff" : "#9a6f4c";
    ctx.beginPath();
    ctx.ellipse(0, -8, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (d.type === "dryGrass" || d.type === "charPlant") {
    ctx.strokeStyle = d.type === "charPlant" ? "#24202a" : "#9f7436";
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 4, 0);
      ctx.lineTo(i * 5 + sway, -18 - Math.abs(i) * 3);
      ctx.stroke();
    }
  } else if (d.type === "sign") {
    ctx.fillStyle = "#7b4b28";
    ctx.fillRect(-2, -28, 4, 28);
    ctx.fillStyle = "#b7773e";
    roundedRect(-18, -42, 36, 16, 3);
    ctx.fill();
  } else if (d.type === "torch" || d.type === "lantern" || d.type === "starLamp") {
    ctx.fillStyle = "#4b3b55";
    ctx.fillRect(-3, -34, 6, 34);
    ctx.fillStyle = d.type === "starLamp" ? "#7ce7b2" : "#ffd35c";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    if (d.type === "starLamp") starPath(0, -42, 10, 4, 5);
    else {
      ctx.beginPath();
      ctx.arc(0, -40, 8, 0, Math.PI * 2);
    }
    ctx.fill();
  } else if (d.type === "ruin" || d.type === "tower" || d.type === "basalt") {
    ctx.fillStyle = d.type === "basalt" ? "#2a2530" : "#6f6384";
    roundedRect(-12, -42, 24, 42, 3);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.16)";
    ctx.fillRect(-8, -32, 5, 7);
    ctx.fillRect(4, -20, 5, 7);
  } else if (d.type === "crystal" || d.type === "iceCrystal") {
    ctx.fillStyle = d.type === "iceCrystal" ? "#dffaff" : "#c3b6ff";
    crystalPath(-9, 0, 18, 36);
    ctx.fill();
  } else if (d.type === "leaf" || d.type === "fern" || d.type === "vine") {
    ctx.fillStyle = "#1f9656";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 5 - 8, -8 - i * 5, 10, 4, -0.7 + sway * 0.03, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (d.type === "mushroom" || d.type === "glowMushroom") {
    ctx.fillStyle = d.type === "glowMushroom" ? "#7ce7b2" : "#ff5c8c";
    ctx.beginPath();
    ctx.ellipse(0, -18, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff7e8";
    ctx.fillRect(-5, -18, 10, 18);
  } else if (d.type === "emberRock" || d.type === "lavaCrack" || d.type === "smokeVent") {
    ctx.fillStyle = "#2a2028";
    ctx.beginPath();
    ctx.ellipse(0, -7, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ff9b45";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.lineTo(-2, -12);
    ctx.lineTo(8, -8);
    ctx.stroke();
  } else if (d.type === "lollipop" || d.type === "candyCane") {
    ctx.fillStyle = "#fff7e8";
    ctx.fillRect(-2, -34, 4, 34);
    ctx.fillStyle = d.type === "lollipop" ? "#ff5c8c" : "#fff06a";
    ctx.beginPath();
    ctx.arc(0, -43, d.type === "lollipop" ? 14 : 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff7e8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -43, 7, 0, Math.PI * 1.6);
    ctx.stroke();
  } else if (d.type === "gumdrop" || d.type === "cookie" || d.type === "tinyPlanet") {
    ctx.fillStyle = d.type === "tinyPlanet" ? "#8aa0ff" : d.type === "cookie" ? "#b86943" : "#7ce7b2";
    ctx.beginPath();
    ctx.ellipse(0, -10, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    if (d.type === "tinyPlanet") {
      ctx.strokeStyle = "#fff7e8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, -10, 22, 6, -0.25, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (d.type === "coral" || d.type === "seaweed") {
    ctx.strokeStyle = d.type === "coral" ? "#ff8db0" : "#187c70";
    ctx.lineWidth = d.type === "coral" ? 5 : 3;
    ctx.lineCap = "round";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 7, 0);
      ctx.quadraticCurveTo(i * 9 + sway, -16, i * 12 - sway, -29 - Math.abs(i) * 4);
      ctx.stroke();
    }
  } else if (d.type === "shell" || d.type === "buoy") {
    ctx.fillStyle = d.type === "shell" ? "#fff0cf" : "#ff765f";
    ctx.beginPath();
    ctx.arc(0, d.type === "shell" ? -8 : -20, d.type === "shell" ? 13 : 10, Math.PI, 0);
    ctx.fill();
    if (d.type === "buoy") {
      ctx.fillStyle = "#fff7e8";
      ctx.fillRect(-10, -22, 20, 5);
    }
  } else if (d.type === "dock") {
    ctx.fillStyle = "#8b5a3a";
    ctx.fillRect(-20, -12, 40, 12);
    ctx.fillRect(-14, -28, 5, 18);
    ctx.fillRect(9, -28, 5, 18);
  } else if (d.type === "block" || d.type === "toyTrain") {
    ctx.fillStyle = d.type === "block" ? "#ffcc59" : "#e65367";
    roundedRect(-16, -27, 32, 27, 4);
    ctx.fill();
    if (d.type === "toyTrain") {
      ctx.fillStyle = "#ffedb0";
      ctx.fillRect(-8, -39, 14, 13);
      ctx.fillStyle = "#3b356f";
      ctx.beginPath(); ctx.arc(-9, 1, 5, 0, Math.PI * 2); ctx.arc(9, 1, 5, 0, Math.PI * 2); ctx.fill();
    }
  } else if (d.type === "spring" || d.type === "gearProp") {
    ctx.strokeStyle = d.type === "spring" ? "#e6eaff" : "#9fb3ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const x = i % 2 ? 8 : -8;
      if (i === 0) ctx.moveTo(x, -5);
      else ctx.lineTo(x, -5 - i * 6);
    }
    ctx.stroke();
  } else if (d.type === "balloon") {
    ctx.fillStyle = "#7ce7b2";
    ctx.beginPath(); ctx.ellipse(0, -28, 11, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff7e8";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(sway, 0); ctx.stroke();
  }

  ctx.restore();
}

function roundedRect(x, y, w, h, r) {
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function draw() {
  ctx.save();

  if (screenShake > 0.4) {
    ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
  }

  drawSky();

  ctx.save();
  ctx.translate(-camX, 0);

  drawWorldDecor(true);
  level.platforms.forEach((p) => {
    if (isWorldVisible(p.x, p.w)) drawPlatform(p);
  });
  level.obstacles.forEach((o) => {
    if (isWorldVisible(o.x, o.w)) drawObstacle(o);
  });

  level.enemies.forEach((e) => {
    if (e.alive && isWorldVisible(e.x, e.w)) drawEnemy(e);
  });

  coins.forEach((c) => {
    if (!c.collected && isWorldVisible(c.x, c.r * 2)) drawCoin(c);
  });

  stars.forEach((s) => {
    if (isWorldVisible(s.x, s.w)) drawStar(s);
  });
  if (isWorldVisible(level.goal.x, level.goal.w)) drawGoal(level.goal);
  drawWorldDecor(false);
  drawPig(pig);
  drawParticles();

  ctx.restore();

  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, W, H);

  if (invincibleTimer > 0) {
    ctx.fillStyle = `rgba(255, 240, 122, ${0.05 + Math.sin(tick * 0.15) * 0.02})`;
    ctx.fillRect(0, 0, W, H);
  }

  if (transitionFlash > 0) {
    ctx.fillStyle = `rgba(255, 247, 232, ${transitionFlash / 150})`;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

initGame();
loop();