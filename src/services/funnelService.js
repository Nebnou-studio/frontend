/**
 * Funnel API (slots + booking).
 *
 * - If VITE_API_URL is set (e.g. http://localhost:5000/api) the real backend is used:
 *     GET  /slots?date=YYYY-MM-DD       -> { slots: [{ start_at, label }] }
 *     GET  /slots/days?from=&to=        -> { days: ['YYYY-MM-DD', ...] }   (optional, see below)
 *     POST /bookings                    -> { meeting: { start_at } }  | 409 when the slot is taken
 * - If VITE_API_URL is empty, a MOCK is used so the whole funnel works without a backend:
 *   Sunday to Thursday, 09:00-17:00, 30-minute slots, a few slots already "taken".
 *
 * /slots/days is optional: if the backend does not have it, every day of the booking
 * window stays selectable and an empty day simply shows "no slots".
 */

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const USE_MOCK = !API_URL;
export const BOOKING_WINDOW_DAYS = 14;

const MIN_LEAD_HOURS = 2;
const ALGIERS_OFFSET_MS = 60 * 60 * 1000; // Africa/Algiers is UTC+1, no daylight saving


// Small wrapper around fetch: JSON in and out, 15 s timeout, errors carry the HTTP status
const request = async (path, { method = 'GET', params, body } = {}) => {
  const url = new URL(`${API_URL}${path}`, window.location.origin); // works with absolute and relative API urls
  if (params) Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      const error = new Error(`HTTP ${res.status}`);
      error.status = res.status;
      throw error;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- Date helpers (all dates are 'YYYY-MM-DD' calendar days in Algiers time) ---------- */

export const pad = (n) => String(n).padStart(2, '0');

const toDateString = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export const algiersToday = () => toDateString(new Date(Date.now() + ALGIERS_OFFSET_MS));

export const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return toDateString(new Date(Date.UTC(y, m - 1, d + n)));
};

/* ---------- Mock data ---------- */

const mockSlots = (date) => {
  const [y, m, d] = date.split('-').map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
  if (weekday === 5 || weekday === 6) return []; // Friday and Saturday: weekend in Algeria

  const earliest = Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000;
  const slots = [];
  for (let minutes = 9 * 60; minutes + 30 <= 17 * 60; minutes += 30) {
    const startUtc = Date.UTC(y, m - 1, d, 0, minutes) - ALGIERS_OFFSET_MS;
    const taken = (d + minutes / 30) % 4 === 0; // fake "already booked" slots
    if (startUtc < earliest || taken) continue;
    slots.push({
      start_at: new Date(startUtc).toISOString(),
      label: `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`,
    });
  }
  return slots;
};

/* ---------- Public functions ---------- */

// Days (in the window) that still have at least one free slot. Returns null if unknown.
export const getAvailableDays = async (from, to) => {
  if (USE_MOCK) {
    const days = [];
    for (let day = from; day <= to; day = addDays(day, 1)) {
      if (mockSlots(day).length) days.push(day);
    }
    return days;
  }
  try {
    const data = await request('/slots/days', { params: { from, to } });
    return data.days;
  } catch {
    return null;
  }
};

export const getSlots = async (date) => {
  if (USE_MOCK) {
    await wait(350);
    return mockSlots(date);
  }
  const data = await request('/slots', { params: { date } });
  return data.slots;
};

// payload: { name, phone, email, answers, start_at, locale }
export const createBooking = async (payload) => {
  if (USE_MOCK) {
    await wait(700);
    return { meeting: { start_at: payload.start_at } };
  }
  try {
    return await request('/bookings', { method: 'POST', body: payload });
  } catch (err) {
    if (err.status === 409) {
      const taken = new Error('SLOT_TAKEN');
      taken.code = 'SLOT_TAKEN';
      throw taken;
    }
    throw err;
  }
};