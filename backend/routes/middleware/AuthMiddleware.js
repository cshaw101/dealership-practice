const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Storing decoded user data in the request object
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
    console.log("User Role:", req.user?.role); // Log the role to confirm it's "admin"
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    next();
  };

  // validationMiddleware.js

const validateLoginData = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
  
    // Simple email format validation
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
  
    next(); // Continue to the next middleware/route handler
  };

  const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }
  
    // Validate token (e.g., using Supabase or JWT)
    const { data, error } = supabase.auth.api.getUser(token);
    if (error || !data) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
  
    req.user = data; // Store user info in request object
    next(); // Continue to the next middleware/route handler
  };
  
  

module.exports = { authMiddleware, adminMiddleware, validateLoginData, isAuthenticated };