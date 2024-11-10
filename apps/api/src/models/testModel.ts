// models/Test.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true }
});

const TestSchema = new mongoose.Schema({
  testTitle: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
});

module.exports = mongoose.model('Test', TestSchema);
