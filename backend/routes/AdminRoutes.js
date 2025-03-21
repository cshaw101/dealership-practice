const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Admin: Login Route (without JWT or bcrypt)
router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Fetch user from Supabase Auth
    const { data: userData, error: authError } = await supabase.auth.api.getUserByEmail(email);
    
    if (authError || !userData) {
      return res.status(401).json({ error: "Invalid email." });
    }

    // Check if the user exists in the custom users table
    const { data: userInDB, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userData.id)
      .single();

    // If user does not exist in the custom users table, insert them
    if (dbError || !userInDB) {
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, auth_id: userData.id, role: 'employee' }]);

      if (error) {
        return res.status(500).json({ error: "Failed to insert user into database" });
      }
    }

    // Return success response after login
    res.json({ message: "Login successful", user: userData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create User Route
router.post('/create-user', async (req, res) => {
  const { email, role = 'employee' } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Insert the user into the "users" table with a default role
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, role }]);

    if (error) {
      return res.status(500).json({ error: "Failed to create user." });
    }

    res.json({ message: "User created successfully", user: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;