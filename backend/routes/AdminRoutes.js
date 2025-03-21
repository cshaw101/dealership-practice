const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const { authMiddleware, adminMiddleware } = require('../../backend/routes/middleware/AuthMiddleware'); // Import middleware

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const router = express.Router();

// Admin: Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Since we're removing bcrypt, we assume the admin is valid here
    if (data.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized as admin" });
    }

    res.json({ message: "Login successful", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create Employee (simplified, no role validation)
router.post('/create-employee', async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required." });
  }

  try {
    // Insert user with the provided email and role (no password handling for now)
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, role }]);

    if (error) {
      return res.status(500).json({ error: "Failed to create employee" });
    }

    res.json({ message: "Employee created successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;