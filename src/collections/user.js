const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const UserSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
