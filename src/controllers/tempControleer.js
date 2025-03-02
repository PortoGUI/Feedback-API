const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const FEEDBACK_TYPES = {
  ISSUE: 'ISSUE',
  IDEA: 'IDEA',
  OTHER: 'OTHER'
}

function CreateTempController(databaseAccess) {
  async function checkIfApiKeyExists(req, res) {
    // OK
    const { apikey } = req.query
    if (!apikey) {
      res.status(400).send()
      return
    }
    const users = await databaseAccess.readAll('users')

    const apiKeyExists = users.map((user) => {
      return user.apiKey.includes(apikey)
    })

    if (apiKeyExists.includes(true)) {
      res.status(204).send()
      return
    }

    res.status(404).send()
  }

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

  async function createF(req, res) {
    // OK
    const { type, text, apiKey, fingerprint, device, page } = req.body

    if (!type) {
      res.status(400).json({ error: 'type is empty' })
    }
    if (!text) {
      res.status(400).json({ error: 'text is empty' })
    }
    if (!fingerprint) {
      res.status(400).json({ error: 'fingerprint is empty' })
    }
    if (!device) {
      res.status(400).json({ error: 'device is empty' })
    }
    if (!page) {
      res.status(400).json({ error: 'page is empty' })
    }
    if (!apiKey) {
      res.status(400).json({ error: 'apiKey is empty' })
    }

    if (!FEEDBACK_TYPES[String(type).toUpperCase()]) {
      res.status(422).json({ error: 'Unknown feedback type' })
      return
    }

    // @TODO: for this, I don't validate if apikey is valid.
    // Just for study purposes.

    const feedback = {
      text,
      fingerprint,
      id: uuidv4(),
      apiKey,
      type: String(type).toUpperCase(),
      device,
      page,
      createdAt: new Date().getTime()
    }

    const inserted = await databaseAccess.insert('feedbacks', feedback)
    if (inserted) {
      res.status(201).json(feedback)
      return
    }

    res.status(422).json({ error: 'feedbacks not created' })
  }

  async function getFeedbacks(req, res) {
    // OK
    const { type } = req.query
    let offset = req.query.offset ? Number(req.query.offset) : 0
    let limit = req.query.limit ? Number(req.query.limit) : 5

    let [user, feedbacks] = await Promise.all([
      databaseAccess.readOneById('users', req.auth.id),
      databaseAccess.readAll('feedbacks')
    ])

    if (!user) {
      res.status(401).json({ error: 'Unauthorized', id: req.auth.id })
      return
    }

    feedbacks = feedbacks.filter((feedbacks) => {
      return user.apiKey.includes(feedbacks.apiKey)
    })

    if (type) {
      feedbacks = feedbacks.filter((feedbacks) => {
        return feedbacks.type === String(type).toUpperCase()
      })
    }

    const total = feedbacks.length

    if (limit > 10) {
      limit = 5
    }
    if (offset > limit) {
      offset = limit
    }

    feedbacks = feedbacks.slice(offset, feedbacks.length).slice(0, limit)

    res.status(200).json({ results: feedbacks || [], pagination: { offset, limit, total } })
  }

  async function getSummary(req, res) {
    // OK
    const { type } = req.query
    let [user, feedbacks] = await Promise.all([
      databaseAccess.readOneById('users', req.auth.id),
      databaseAccess.readAll('feedbacks')
    ])

    const verifyData = await databaseAccess.readAll('users')

    if (!user) {
      res.status(401).json({ error: 'Unauthorized', id: req.auth.id, verifyData })
    }

    feedbacks = feedbacks.filter((feedbacks) => {
      return user.apiKey.includes(feedbacks.apiKey)
    })

    if (type) {
      feedbacks = feedbacks.filter((feedbacks) => {
        return feedbacks.type === String(type).toUpperCase()
      })
    }

    let all = 0
    let issue = 0
    let idea = 0
    let other = 0

    feedbacks.forEach((feedbacks) => {
      all++

      if (feedbacks.type === 'ISSUE') {
        issue++
      }
      if (feedbacks.type === 'IDEA') {
        idea++
      }
      if (feedbacks.type === 'OTHER') {
        other++
      }
    })

    res.status(200).json({ all, issue, idea, other })
  }

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
    checkIfApiKeyExists,
    login,
    create,
    createF,
    getFeedbacks,
    getSummary,
    getLoggerUser,
    generateApiKey
  }
}

module.exports = CreateTempController
