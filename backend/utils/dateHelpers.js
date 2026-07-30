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
 * Calculates current and longest completion streaks. 
 * @param {string[]} sortedDateKeys – Array of "YYYY-MM-DD" keys sorted descending (newest first).
 * @returns {{ current: nummber, longest: number }}
 */
export const calcStreak = (sortedDateKeys) => {
    // sortedDateKeys newest, first, unique
    // takes in an array of date keys – newest first – and returns current an longest streak
    if (!sortedDateKeys.length) return { current: 0, longest: 0 };
    const set = new Set(sortedDateKeys);
    
    const today = todayKey();
    const yesterday = toDateKey(subDays(new Date(), 1));
    
    // Calculate current active streak
    // for current streak, if today nor yesterday are in the set, the streak is broken
    // return is 0
    // if today is in the set, count backward from today
    // if today isn't in the set but yesterday is, the streak isn't broken yet because the user hasn't checked in
    // so count backwards from yesterday, incrementing by 1 as long as the previous date is still in the set
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
    
    // Calculate historical longest streak
    // for longest streak, sort dates by ascending, then iterate through.
    // for each date, check if its exactly one day after the previous. 
    // if so increment the run counter, otherwise, reset to 1
    // track the maximum runs across the entire history
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