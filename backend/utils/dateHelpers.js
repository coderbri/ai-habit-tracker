/**
 * @file: utils/dateHelpers.js
 * @description: Date formatting and streak calculation utilities for habit tracking.
 */
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

/** Converts a Date object or string into a standard "YYY-MM-DD" key. */
export const toDateKey = (date) => format(date, "yyyy-MM-dd");

/** Returns today's date formatted as "YYYY-MM-DD". */
export const todayKey = () => toDateKey(new Date());

/** Returns an array of "YYYY-MM-DD" date keys covering the last 90 days up to today. */
export const last90Days = () => {
    const end = new Date();
    const start = subDays(end, 89);
    return eachDayOfInterval({ start, end }).map(toDateKey);
};

/** Returns an array of "YYYY-MM-DD" date keys for the current week starting on Monday. */
export const currentWeekKeys = () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartOn: 1 });
    const end = endOfWeek(now, { weekStartOn: 1 });
    return eachDayOfInterval({ start, end }).map(toDateKey);
};

/** Returns an array of "YYYY-MM-DD" date keys covering the last N days up to today. */
export const lastNDays = (n) => {
    const end = new Date();
    const start = subDays(end, n - 1);
    return eachDayOfInterval({ start, end }).map(toDateKey);
};

/** 
 * Calculates current and longest completion streaks from a list of completion dates. 
 * @param {string[]} sortedDateKeys – Array of "YYYY-MM-DD" keys, sorted descending (newest first).
 * @returns {{ current: nummber, longest: number }}
 */
export const calcStreak = (sortedDateKeys) => {
    if (!sortedDateKeys.length) return { current: 0, longest: 0 };
    const set = new Set(sortedDateKeys);
    
    const today = todayKey();
    const yesterday = toDateKey(subDays(new Date(), 1));
    
    // Current streak: broken (0) if neither today nor yesterday is logged.
    // Otherwise, count backward from today, or from yesterday if today's not logged yet.
    let current = 0;
    let cursor = new Date();
    
    if (!set.has(today) && !set.has(yesterday)) {
        current = 0;
    } else {
        if (!set.has(today)) cursor = subDays(cursor, 1);
        while (set.has(toDateKey(cursor))) {
            current += 1;
            cursor = subDays(cursor, 1);
        }
    }
    
    // Longest streak: sort dates by ascending (oldest -> newest), extending the run 
    // when consecutive by checking if its been 1d exactly after the previous. If so,
    // increment counter, otherwise, reset to 1, tracking the max run seen.
    const sortedAsc = [...sortedDateKeys].sort();
    let longest = 0;
    let run = 0;
    let prev = null;
    
    for (const k of sortedAsc) {
        if (prev) {
            const d = new Date(k);
            const p = new Date(prev);
            const diff = Math.round((d - p) / (1000 * 60 * 60 * 24));
            if (diff === 1) run += 1;
            else run = 1;
        } else {
            run = 1;
        }
        if (run > longest) longest = run;
        prev = k;
    }
    
    return { current, longest };
};