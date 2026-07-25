/**
 * @file: User.js
 * @description: Mongoose schema and model for application users, including
 * password hashing, password comparison, and safe JSON serialization.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, minlength: 6 },
        avatar: { type: String, default: "" },
        morningMotivation: { type: Boolean, default: false },
    },
    { timestamps: true }
);

/**
 * Pre-save middleware hook to automatically hash passwords – only when its 
 * a new or changed password – before saving a user document to the database.
 */
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method used during login to compare an incoming plain-text 
 * password against the hash stored on this user document.
 * @param {string} plain – The plain-text password from the login request.
 * @returns {Promise<Boolean>} True if the passwords match, false otherwise.
 */
userSchema.methods.matchPassword = function (plain) {
    return bcrypt.compare(plain, this.password)
};

/**
 * Ensures the password is never sent to the client by accident, even if 
 * someone forgots to filter the user object before responding.
 */
userSchema.methods.toJSON = function () {
    const object = this.toObject();
    delete object.password;
    return object;
}

const User = mongoose.model("User", userSchema)
export default User;