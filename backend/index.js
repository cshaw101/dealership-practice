// Import required libraries
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const cors = require('cors'); // Add the cors import here

// Initialize Express app
const app = express();
const port = 5001;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors()); // Add this line here

// Supabase client setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// GET all cars
app.get('/api/cars', async (req, res) => {
    try {
      console.log('Fetching cars from Supabase...'); // Debugging
      const { data, error } = await supabase.from('cars').select('*');
  
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }
  
      console.log('Fetched cars:', data); // Debugging
      res.json(data);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/testdb', async (req, res) => {
    try {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error('Database test error:', err);
      res.status(500).json({ error: err.message });
    }
  });
  

// POST a new car
app.post('/api/cars', async (req, res) => {
  const { model, price, description, image_url } = req.body;

  if (!model || !price || !description || !image_url) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('cars')
      .insert([
        {
          model,
          price,
          description,
          image_url,
        },
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Car added successfully', car: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
