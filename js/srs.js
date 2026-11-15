// Moteur de répétition espacée (variante simplifiée de SM-2, façon Anki).
// Un "état" de carte : { easeFactor, interval (jours), repetitions, dueDate (ISO), lastReviewed (ISO) }

export const RATINGS = ["again", "hard", "good", "easy"];

export function freshState() {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: todayISO(),
    lastReviewed: null,
  };
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateISO, days) {
  const d = new Date(dateISO + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Applique une note de révision et retourne le nouvel état (ne mute pas l'entrée).
export function schedule(state, rating) {
  const s = { ...state };
  const now = new Date().toISOString();

  if (rating === "again") {
    s.repetitions = 0;
    s.interval = 0;
    s.easeFactor = Math.max(1.3, s.easeFactor - 0.2);
    s.dueDate = todayISO();
  } else {
    s.repetitions += 1;
    if (rating === "hard") {
      s.easeFactor = Math.max(1.3, s.easeFactor - 0.15);
      s.interval = s.repetitions === 1 ? 1 : Math.max(1, Math.round(s.interval * 1.2));
    } else if (rating === "good") {
      if (s.repetitions === 1) s.interval = 1;
      else if (s.repetitions === 2) s.interval = 6;
      else s.interval = Math.round(s.interval * s.easeFactor);
    } else if (rating === "easy") {
      s.easeFactor = s.easeFactor + 0.15;
      s.interval = s.repetitions === 1 ? 4 : Math.round(s.interval * s.easeFactor * 1.3);
    }
    s.dueDate = addDays(todayISO(), s.interval);
  }

  s.lastReviewed = now;
  return s;
}

// Une carte est "due" si sa date d'échéance est aujourd'hui ou passée, ou si elle n'a jamais été révisée.
export function isDue(state) {
  if (!state) return true;
  return state.dueDate <= todayISO();
}

// Étiquette de maîtrise utilisée pour les stats / la couleur de progression.
export function masteryLevel(state) {
  if (!state || state.repetitions === 0) return "nouvelle";
  if (state.interval < 6) return "apprentissage";
  if (state.interval < 21) return "en cours";
  return "maitrisee";
}
