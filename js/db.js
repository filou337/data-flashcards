// Persistance locale (localStorage) : état SRS par carte + stats globales (streak, historique).
import { freshState, todayISO } from "./srs.js";

const STORAGE_KEY = "flashcards-data-v1";

function defaultData() {
  return {
    version: 1,
    cardStates: {},   // { [cardId]: srsState }
    stats: {
      streak: 0,
      lastStudyDate: null,
      totalReviews: 0,
      reviewsToday: 0,
      reviewsTodayDate: null,
      history: {},     // { [dateISO]: nbReviews }
    },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return { ...defaultData(), ...parsed, stats: { ...defaultData().stats, ...(parsed.stats || {}) } };
  } catch {
    return defaultData();
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = load();

export function getCardState(cardId) {
  return data.cardStates[cardId] || null;
}

export function getOrCreateCardState(cardId) {
  if (!data.cardStates[cardId]) {
    data.cardStates[cardId] = freshState();
    save(data);
  }
  return data.cardStates[cardId];
}

export function setCardState(cardId, state) {
  data.cardStates[cardId] = state;
  save(data);
}

export function recordReview(cardId, newState) {
  setCardState(cardId, newState);

  const today = todayISO();
  if (data.stats.reviewsTodayDate !== today) {
    data.stats.reviewsTodayDate = today;
    data.stats.reviewsToday = 0;
  }
  data.stats.reviewsToday += 1;
  data.stats.totalReviews += 1;
  data.stats.history[today] = (data.stats.history[today] || 0) + 1;

  if (data.stats.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    data.stats.streak = data.stats.lastStudyDate === yesterday ? data.stats.streak + 1 : 1;
    data.stats.lastStudyDate = today;
  }
  save(data);
}

export function getStats() {
  return data.stats;
}

export function getAllCardStates() {
  return data.cardStates;
}

export function exportData() {
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString) {
  const parsed = JSON.parse(jsonString);
  data = { ...defaultData(), ...parsed, stats: { ...defaultData().stats, ...(parsed.stats || {}) } };
  save(data);
}

export function resetProgress() {
  data = defaultData();
  save(data);
}
