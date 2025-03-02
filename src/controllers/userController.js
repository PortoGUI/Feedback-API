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

  async function create(req, res) {
    const { email, password, name } = req.body

    if (!email) {
      res.status(400).json({ error: 'email is empty' })
      return
    }
    if (!password) {
      res.status(400).json({ error: 'password is empty' })
      return
    }
    if (!name) {
      res.status(400).json({ error: 'name is empty' })
      return
    }

    const user = {
      id: uuidv4(),
      name,
      email,
      password,
      apiKey: [uuidv4()],
      createdAt: new Date().getTime()
    }

    const inserted = await databaseAccess.insert('users', user)
    if (inserted) {
      res.status(201).json(user)
      return
    }

    res.status(422).json({ error: 'User not created' })
  }

  return {
    create,
    generateApiKey,
    getLoggerUser
  }
}

module.exports = CreateUserController
