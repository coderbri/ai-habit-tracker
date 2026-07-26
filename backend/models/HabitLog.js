/**
 * @file: models/HabitLog.js
 * @description: Mongoose schema for recording daily habit completions.
 */

import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        habitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Habit",
            required: true,
            index: true,
        },
        // Stored as "YYYY-MM-DD" to avoid timezone offset issues during range queries
        completedDate: { type: String, required: true },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

// Prevents duplicate completions for the same habit on the same calendar day per user
habitLogSchema.index(
    { userId: 1, habitId: 1, completedDate: 1},
    { unique: true }
);

const HabitLog = mongoose.model("HabitLog", habitLogSchema);
export default HabitLog;