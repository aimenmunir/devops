const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Database connection mock/setup
// In a real app, you would pass these via environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
});

// Backend API Endpoint
app.get('/api/status', async (req, res) => {
  try {
    // Attempting a simple query just to show DB connection logic
    // We wrap it in a try-catch so the app doesn't crash if DB is not available
    let dbStatus = "Not connected";
    if (process.env.DATABASE_URL) {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      dbStatus = `Connected at ${result.rows[0].now}`;
      client.release();
    }
    res.json({
      status: "success",
      message: "API is running correctly!",
      dbStatus: dbStatus,
      env: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", message: "Database connection failed", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
