const { Schema, model } = require('mongoose');
const { data } = require('react-router-dom');

const todoSchema = Schema({
  title: { type: String, requred: true },
  priority: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, // Automatically stores creation time
});

const todoText = model('todos', todoSchema);

module.exports = todoText;
