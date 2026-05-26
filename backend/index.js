const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fintrack_secret_token_key_12345';

app.use(cors());
app.use(express.json());

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Access token invalid or expired' });
    }
    req.user = user;
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register User
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email.toLowerCase(), hashedPassword]
    );
    const user = result.rows[0];

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error registering user' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error logging in' });
  }
});

// Get Profile details
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching profile details' });
  }
});

// ==========================================
// TRANSACTIONS ROUTES (SECURED)
// ==========================================

// Get all user transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching transactions' });
  }
});

// Add a user transaction
app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { name, category, type, amount, date } = req.body;
  const user_id = req.user.userId;

  try {
    const queryText = date
      ? 'INSERT INTO transactions (user_id, name, category, type, amount, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
      : 'INSERT INTO transactions (user_id, name, category, type, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const queryParams = date
      ? [user_id, name, category, type, amount, date]
      : [user_id, name, category, type, amount];

    const result = await db.query(queryText, queryParams);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding transaction' });
  }
});

// Update user transaction
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, category, type, amount, date } = req.body;
  const user_id = req.user.userId;

  try {
    const queryText = date
      ? 'UPDATE transactions SET name = $1, category = $2, type = $3, amount = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *'
      : 'UPDATE transactions SET name = $1, category = $2, type = $3, amount = $4 WHERE id = $5 AND user_id = $6 RETURNING *';
    const queryParams = date
      ? [name, category, type, amount, date, id, user_id]
      : [name, category, type, amount, id, user_id];

    const result = await db.query(queryText, queryParams);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating transaction' });
  }
});

// Delete user transaction
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    const result = await db.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }
    res.json({ message: 'Transaction deleted successfully', transaction: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting transaction' });
  }
});

// Delete all user transactions (Reset)
app.delete('/api/transactions', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  try {
    await db.query('DELETE FROM transactions WHERE user_id = $1', [user_id]);
    res.json({ message: 'All transactions cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error resetting database' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
