/**
 * @file: models/Habit.js
 * @description: Mongoose schema for habit trackign definitions and configuration.
 */
import mongoose from "mongoose";

// array of categories for an enum constraint on schema
const CATEGORIES = [
    "Health",
    "Fitness",
    "Learning",
    "Mindfulness",
    "Productivity",
    "Social",
    "Finance",
    "Creative",
    "Other",
];

const habitSchema = new mongoose.Schema(
    {
        userId: {   // Referes to user who owns this habit
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: { type: String, required: true, trim: true },     // Habit name (always required)
        description: { type: String, default: "", trim: true }, // Defaults to empty string ("")
        category: {
            type: String,
            enum: CATEGORIES,
            default: "Other"
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly"],
            default: "daily",
        },
        targetDays: { type: Number, default: 7, min: 1, max: 7},
        color: { type: String, default: "#6366f1" },
        icon: { type: String, default: "🎯" },
        isArchived: { type: Boolean, default: false },  // Soft-delete flag to hide from main views
        order: { type: Number, default: 0 },            // Position index for manual drag-and-drop reordering
    },
    { timestamps: true }
);

export const HABIT_CATEGORIES = CATEGORIES;
export default mongoose.model("Habit", habitSchema);