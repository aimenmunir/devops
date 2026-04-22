const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb',
});

let messages = [
  { text: "My Roll number is fa23-bcs-027", time: "4/22/2026, 8:35:25 PM" },
  { text: "this is my devops project", time: "4/22/2026, 8:34:48 PM" },
  { text: "hi", time: "4/22/2026, 8:34:41 PM" }
];

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (text) {
    const newMessage = {
      text,
      time: new Date().toLocaleString()
    };
    messages.unshift(newMessage);
    res.status(201).json(newMessage);
  } else {
    res.status(400).json({ error: "Message text is required" });
  }
});

app.get('/api/status', async (req, res) => {
  try {
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
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
