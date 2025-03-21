const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../src/api/supabase.js"); // Correct the import to use require

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Fetch user from Supabase
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Ensure only admins can log in
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

module.exports = router;