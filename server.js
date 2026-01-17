const express = require('express');
const { createClient } = require('@libsql/client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Turso client
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Serve static files
app.use(express.static('public'));

// API endpoint to get all agents
app.get('/api/agents', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM tasklet_agents ORDER BY last_activity DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Tasklet Dashboard running on port ${PORT}`);
});
