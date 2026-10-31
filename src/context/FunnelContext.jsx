import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'nebnou-funnel';

const EMPTY_ANSWERS = {
  activity: '',
  activity_other: '',
  problem: '',
  tried_before: null,
  tried_details: '',
};

const INITIAL = { videoWatched: false, answers: EMPTY_ANSWERS, booking: null };

const load = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const saved = JSON.parse(raw);
    return { ...INITIAL, ...saved, answers: { ...EMPTY_ANSWERS, ...(saved.answers || {}) } };
  } catch {
    return INITIAL;
  }
};

// True when the three questions have been answered properly
export const isAnswersComplete = (a) =>
  Boolean(a.activity) &&
  (a.activity !== 'other' || a.activity_other.trim().length > 1) &&
  a.problem.trim().length >= 10 &&
  typeof a.tried_before === 'boolean';

const FunnelContext = createContext(null);

export const FunnelProvider = ({ children }) => {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage can be unavailable (private mode): the funnel still works in memory */
    }
  }, [state]);

  const markVideoWatched = useCallback(() => {
    setState((s) => (s.videoWatched ? s : { ...s, videoWatched: true }));
  }, []);

  const updateAnswers = useCallback((patch) => {
    setState((s) => ({ ...s, answers: { ...s.answers, ...patch } }));
  }, []);

  const setBooking = useCallback((booking) => {
    setState((s) => ({ ...s, booking }));
  }, []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(INITIAL);
  }, []);

  const value = useMemo(
    () => ({ ...state, markVideoWatched, updateAnswers, setBooking, reset }),
    [state, markVideoWatched, updateAnswers, setBooking, reset]
  );

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
};

export const useFunnel = () => {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error('useFunnel must be used inside <FunnelProvider>');
  return ctx;
};