const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const adminRoutes = require("./routes/AdminRoutes.js");
const { authMiddleware, adminMiddleware, validateLoginData } = require("./routes/middleware/AuthMiddleware.js");
const winston = require("winston");

const app = express();
const port = 5001;

// Set up logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

app.use(express.json());
app.use("/admin", adminRoutes);
app.use(cors());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// Login Endpoint
app.post("/api/auth/login", validateLoginData, async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      logger.error(`Auth Error: ${authError?.message}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authData.user.id)
      .single();

    if (error || !user) {
      logger.error(`Database Error: ${error?.message}`);
      return res.status(401).json({ error: "User not found in database" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      user: { email: user.email, id: user.id, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Create User Endpoint
app.post("/api/admin/create-user", async (req, res, next) => {
  const { email, password, role = "employee" } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const validRoles = ["admin", "employee"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'employee'" });
  }

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      logger.error(`Supabase Auth Error: ${signUpError?.message}`);
      return res.status(500).json({ error: "Failed to create user in Supabase Auth", details: signUpError.message });
    }

    const userId = signUpData?.user?.id;

    if (!userId) {
      return res.status(500).json({ error: "Failed to retrieve user ID from Supabase Auth" });
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUserError && existingUserError.code !== "PGRST116") {
      logger.error(`Database Check Error: ${existingUserError?.message}`);
      return res.status(500).json({ error: "Failed to check existing user", details: existingUserError.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists in the database" });
    }

    const { data: dbData, error: dbError } = await supabase
      .from("users")
      .insert([{ email, auth_id: userId, role, password: password }])
      .select()
      .single();

    if (dbError) {
      logger.error(`Database Insert Error: ${dbError?.message}`);
      return res.status(500).json({ error: "Failed to insert user into database", details: dbError.message });
    }

    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(201).json({
      message: "User created successfully",
      user: { id: dbData.id, email: dbData.email, role: dbData.role },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Test Database Endpoint
app.get("/testdb", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("cars").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    logger.error(`Database Test Error: ${err.message}`);
    next(err); // Forward to the global error handler
  }
});

// Add Car Endpoint
app.post("/api/cars", async (req, res, next) => {
  const { make, model, price, year, description, image_url } = req.body;

  if (!make || !model || !price || !year || !description || !image_url) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const { data, error } = await supabase
      .from("cars")
      .insert([{ make, model, price, year, description, image_url }])
      .select()
      .single();

    if (error) {
      logger.error(`Supabase Error: ${error?.message}`);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Car added successfully", car: data });
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  logger.info(`Backend server is running on http://localhost:${port}`);
});