function CreateApiKeyController(databaseAccess) {
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

  return {
    checkIfApiKeyExists
  }
}

module.exports = CreateApiKeyController
