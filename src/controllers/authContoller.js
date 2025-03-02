const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

function CreateAuthController(databaseAccess) {
  async function login(req, res) {
    // OK
    const { email, password } = req.body
    const user = await databaseAccess.readOneByEmail('users', email)

    if (!user) {
      return res.status(404).json({ error: 'Not found' })
    }

    const canLogin = user.email === email && user.password === password

    if (!canLogin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.SECRET_KEY || 'yek_terces',
      { expiresIn: '4h' }
    )

    return res.status(200).json({ token })
  }

  async function create(req, res) {
    // OK
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

    const verifyData = await databaseAccess.readAll('users')

    if (inserted) {
      res.status(201).json({ verifyData })
      return
    }

    res.status(422).json({ error: 'User not created' })
  }

  return { create, login }
}

module.exports = CreateAuthController
