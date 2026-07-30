/**
 * @file: controllers/logController.js
 * @description: Controller actions for logging habit completions, heatmaps, and streak statistics.
 */
import HabitLog from "../models/HabitLog.js";
import Habit from "../models/Habit.js";
import {
    todayKey,
    last90Days,
    lastNDays,
    calcStreak
} from "../utils/dateHelpers.js";

/**
 * Mark a habit complete for a specified date (defaults to today).
 * Idempotent upsert operation preventing duplicate entries.
 * 
 * extract habit id and date from the request body. if date is not provided, set today by default 
 * start by verifying that habit exists and belongs to the current user as security check, to prevent
 * users from marking completions on habits they don't own.
 * if habit isn't found, return 404, then use .findOneAndUpdate() with upsert to create a clean pattern
 * for if a log for this habit and date exists, don't error out and instead return the existing one
 * if doesn't exist, create it. the set on insert operator only sets fields when an insert actually happens,
 * not on update. the result is item potent, calling markComplete multiple times for the same habit on the same day
 * is completely safe.
 */
export const markComplete = async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const completedDate = date || todayKey();
        
        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user._id,
        });
        if (!habit) return res.status(404).json({ message: "Habit not found" });
        
        const log = await HabitLog.findOneAndUpdate(
            { userId: req.user._id, habitId, completedDate },
            { $setOnInsert: { userId: req.user._id, habitId, completedDate } },
            { upsert: true, new: true }
        );
        
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Unmark a completion log entry for a specified habit and date.
 */
export const unmarkComplete = async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const completedDate = date || todayKey();
        
        await HabitLog.findOneAndDelete({
            userId: req.user._id,
            habitId,
            completedDate,
        });
        
        res.json({ message: "Unmarked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetch all completion logs for the authenticated user for today.
 * returns all logs for current user where completed dates equals today's key
 * the dashboard uses this to know which habits are already checked off today
 */
export const getToday = async (req, res) => {
    try {
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: todayKey(),
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetch completion logs within a specified date range (?start=YYYY-MM-DD&end=YYYY-MM-DD).
 * takes start and end query parameters and returns logs in that range.
 * the weekly grid and the comparison charts on the insights page use this.
 */
export const getRange = async (req, res) => {
    try {
        const { start, end } = req.query;
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: start, $lte: end },
        });
        
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Generates a 90-day activity heatmap dataset across all active user habits.
 * 90-day GitHub-styled heat map.
 * aggregate completion counts per day across all the user's habits.
 * initialize every day in the range with zero, then count up the actual completions.
 * the result is an array of date and count objects ready for the frontend.
 */
export const getHeatmap = async (req, res) => {
    try {
        const days = last90Days();
        
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: days[0], $lte: days[days.length - 1] },
        });
        
        const counts = {};
        for (const d of days) counts[d] = 0;
        for (const l of logs) counts[l.completedDate] = (counts[l.completedDate] || 0) + 1;
        
        const data = days.map((d) => ({ date: d, count: counts[d] || 0 }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetch detailed metrics for a single habit (streaks, completion rate, monthly totals).
 * get stats for a single habit's deep dive.
 * fetch the habit, then all its logs sorted newest first, calculate streaks using dateHelpers,
 * compute the overall completion rate based on days since the habit was created, and break down 
 * completions by month, all in a JSON response
 */
export const getHabitStats = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.habitId,
            userId: req.user._id,
        });
        if (!habit) return res.status(404).json({ message: "Habit not found" });
        
        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId: habit._id,
        }).sort({ completedDate: -1 });
        
        const dateKeys = logs.map((l) => l.completedDate);
        const { current, longest } = calcStreak(dateKeys);
        
        // Calculate historical completion rate
        const createdKey = habit.createdAt.toISOString().slice(0, 10);
        const today = todayKey();
        const start = new Date(createdKey);
        const end = new Date(today);
        
        const totalDays = 
            Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))) + 1;
        const completionRate = Math.round((logs.length / totalDays) * 100);
        
        // Monthly breakdown (last 6 months)
        const monthly = {};
        for (const l of logs) {
            const m = l.completedDate.slice(0, 7);
            monthly[m] = (monthly[m] || 0) + 1;
        }
        
        res.json({
            habit,
            totalCompletions: logs.length,
            currentStreak: current,
            longestStreak: longest,
            completionRate,
            monthly
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fetch summary stats (30-day activity & streaks) across all non-archived user habits.
 * powers stats page. for each non-archived habit, compute completions in the last 30 days, 
 * current streak, and longest streak.
 * returns an array of per-habit summaries
 */
export const getAllStats = async (req, res) => {
    try {
        const habits = await Habit.find({
            userId: req.user._id,
            isArchived: false,
        });
        
        const days = lastNDays(30);
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: days[0], $lte: days[days.length - 1] },
        });
        
        const perHabit = habits.map((h) => {
            const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
            const keys = hLogs.map((l) => l.completedDate).sort().reverse();
            const { current, longest } = calcStreak(keys);
            
            return {
                habitId: h._id,
                name: h.name,
                icon: h.icon,
                color: h.color,
                category: h.category,
                completions30d: hLogs.length,
                currentStreak: current,
                longestStreak: longest,
            };
        });
        
        res.json({ perHabit, days });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};