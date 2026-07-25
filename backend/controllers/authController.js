/**
 * @file: authController.js
 * @description: Business logic for user registration, login, fetching the 
 * current authenticated user, and updating a user's profile.
 */
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Signs a JWT containing the user's id, used to authenticate
 * future requests via the Authorization header.
 */
const signToken = (id) => 
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });

/**
 * Registers a new user: validates input, checks for an existing account
 * with the same email, creates the user, and returns it with a signed JWT.
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, emial and password are required" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password mus tbe at least 6 characters" });
        }
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists)
            return res.status(400).json({ message: "Email already registered" });
        
        const user = await User.create({ 
            name,
            email: email.toLowerCase(),
            password,
            avatar: name.charAt(0).toUpperCase(),
        });
        const token = signToken(user._id);
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

/**
 * Logs in an existing user: validates credentials against the stored
 * hash and returns the user with a signed JWT on success.
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ messgae: "Email and password required" });
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = signToken(user._id);
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Returns teh currently authenticated user, as 
 * attached to req.user by the protect middleware.
 */
export const me = async (req, res) => {
    res.json({ user: req.user });
};

/**
 * Updates the authenticated user's editable profile fields (name an
 * morning motivation preference); regenerates the avatar initial when
 * the name changes.
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, morningMotivation } = req.body;
        const user = await User.findById(req.user._id);
        if (name !== undefined) {
            user.name = name;
            user.avatar = name.charAt(0).toUpperCase();
        }
        if (morningMotivation !== undefined)
            user.morningMotivation = morningMotivation;
        await user.save();
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};