// Import required libraries
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const cors = require("cors");
const adminRoutes = require('../backend/routes/AdminRoutes.js')

// Initialize Express app
const app = express();
const port = 5001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/admin', adminRoutes);

// Enable CORS for all origins
app.use(cors());

// Supabase client setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Admin Login Endpoint (No JWT or Bcrypt)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Fetch user from Supabase
  const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();

  if (error || !user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // If credentials match, return user info (no token generation)
  res.json({
    message: "Login successful",
    user: { email: user.email, id: user.id, role: user.role }
  });
});

// Admin: Add Employee
app.post("/api/admin/create-user", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    console.log("Inserting user into Supabase...");
    
    // Insert user into the database
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password, role: "employee" }])
      .single();  // Ensures we get a single row back

    // If there's an error during insert
    if (error) {
      console.error("Error inserting user:", error.message);
      return res.status(500).json({ error: "Failed to add employee" });
    }

    // If the insert is successful, try fetching the inserted user
    console.log("User inserted, now fetching the data...");
    const { data: insertedUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError.message);
      return res.status(500).json({ error: "Failed to fetch user data" });
    }

    // Return the inserted user
    res.json({ message: "Employee added successfully", user: insertedUser });

  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// GET all cars
app.get("/api/cars", async (req, res) => {
  try {
    console.log("Fetching cars from Supabase...");
    const { data, error } = await supabase.from("cars").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Fetched cars:", data);
    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Test database connection
app.get("/testdb", async (req, res) => {
  try {
    const { data, error } = await supabase.from("cars").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Database test error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST a new car
app.post("/api/cars", async (req, res) => {
  const { make, model, price, year, description, image_url } = req.body;

  if (!make || !model || !price || !year || !description || !image_url) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Log the request data for debugging
    console.log("Received data:", { make, model, price, year, description, image_url });

    const { data, error } = await supabase.from("cars").insert([
      {
        make,
        model,
        price,
        year,
        description,
        image_url,
      },
    ]);

    // Log the raw response from Supabase
    console.log("Supabase Insert Response (Raw):", { data, error });

    // Handle possible errors
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    // Check if no data is returned after the insert
    if (!data || data.length === 0) {
      console.error("No data returned from Supabase insert");
      return res.status(500).json({ error: "Car insertion successful, but no data returned" });
    }

    // Log the inserted car data
    console.log("Inserted car data:", data);

    res.status(201).json({ message: "Car added successfully", car: data[0] });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});