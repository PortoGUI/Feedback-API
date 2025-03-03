const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const FeedbackSchema = new mongoose.Schema({
  text: { type: String, required: true },
  fingerprint: { type: String, required: true },
  id: { type: String, default: uuidv4 },
  apiKey: { type: String, required: true },
  type: { type: String, enum: ['ISSUE', 'IDEA', 'OTHER'], default: 'OTHER' },
  device: { type: String, required: true },
  page: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Feedback', FeedbackSchema)
