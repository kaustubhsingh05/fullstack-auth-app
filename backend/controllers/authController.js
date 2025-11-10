import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const setAuthCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie("jwt");
  return res.json({ message: "Logged out" });
};

// Save / update business card for the logged-in user
export const saveCard = async (req, res) => {
  try {
    const {
      fullName, title, company, phone, email, website,
      linkedIn, github, twitter, address, theme, color
    } = req.body;

    if (!fullName) return res.status(400).json({ message: "fullName is required" });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { card: { fullName, title, company, phone, email, website, linkedIn, github, twitter, address, theme, color } },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Card saved", user: updated });
  } catch (err) {
    console.error("Save card error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("card");
    return res.json({ card: user?.card || null });
  } catch (err) {
    console.error("Get card error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
