const express = require('express');
const db = require('../db');
const { todos } = require('../db/schema');
const { eq } = require('drizzle-orm');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, req.user.userId));

    res.json(userTodos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    await db.insert(todos).values({
      content,
      userId: req.user.userId,
    });

    res.status(201).json({ message: 'Todo created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    await db
      .update(todos)
      .set({ completed })
      .where(eq(todos.id, parseInt(id)));

    res.json({ message: 'Todo updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.delete(todos).where(eq(todos.id, parseInt(id)));
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;