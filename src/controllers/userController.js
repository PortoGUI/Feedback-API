const { v4: uuidv4 } = require('uuid')

function CreateUserController(databaseAccess) {
  async function getLoggerUser(req, res) {
    // OK
    const id = req.auth.id
    const user = await databaseAccess.readOneById('users', id)

    if (!user) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    const userResponse = {
      ...user,
      apiKey: user.apiKey[user.apiKey.length - 1]
    }

    delete userResponse.password
    res.status(200).json(userResponse)
  }

  async function generateApiKey(req, res) {
    // OK
    const apiKey = uuidv4()
    const id = req.auth.id
    const user = await databaseAccess.readOneById('users', id)
    const updated = await databaseAccess.update('users', id, {
      apiKey: [...user.apiKey, apiKey]
    })
    if (updated) {
      res.status(202).json({ apiKey })
      return
    }
    res.status(422).json({ error: 'User not updated' })
  }

  return {
    generateApiKey,
    getLoggerUser
  }
}

module.exports = CreateUserController
