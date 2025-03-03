const User = require('../collections/user')
const Feedback = require('../collections/feedback')

function createService() {
  async function update(col, id, data) {
    const Model = col === 'users' ? User : Feedback
    const result = await Model.findOneAndUpdate({ id }, data, { new: true })

    return !!result
  }

  async function readAll(col) {
    const Model = col === 'users' ? User : Feedback
    return await Model.find().sort({ createdAt: -1 })
  }

  async function insert(col, data) {
    const Model = col === 'users' ? User : Feedback
    const newItem = new Model(data)
    await newItem.save()

    return true
  }

  async function readOneById(col, id) {
    const Model = col === 'users' ? User : Feedback
    return await Model.findOne({ id })
  }

  async function readOneByEmail(col, email) {
    if (col !== 'users') return null

    return await User.findOne({ email })
  }

  return {
    update,
    insert,
    readAll,
    readOneById,
    readOneByEmail
  }
}

module.exports = createService
