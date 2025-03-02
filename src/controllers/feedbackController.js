const { v4: uuidv4 } = require('uuid')

const FEEDBACK_TYPES = {
  ISSUE: 'ISSUE',
  IDEA: 'IDEA',
  OTHER: 'OTHER'
}

function CreateFeedbackController(databaseAccess) {
  async function create(req, res) {
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
      res.status(401).json({ error: 'Unauthorized', test: process.env.SECRET_KEY, test2: 'yek_terces' })
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

    if (!user) {
      res.status(401).json({ error: 'Unauthorized', test: process.env.SECRET_KEY, test2: databaseAccess.readAll('users'), test3: req })
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

  return {
    create,
    getFeedbacks,
    getSummary
  }
}

module.exports = CreateFeedbackController
