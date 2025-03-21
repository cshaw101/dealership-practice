const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase credentials
const SUPABASE_URL = 'https://pbfeehevtkmdlopdbkek.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZmVlaGV2dGttZGxvcGRia2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MzAyMjAsImV4cCI6MjA1ODAwNjIyMH0.L327f3DXczNGTCljmAOAVTI8pOXz38Cc9lo2Wze98vY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase; // Use CommonJS syntax for export